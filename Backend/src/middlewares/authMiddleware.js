// authMiddleware.js (atualizado)
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { isTokenRevoked } = require('../services/authService');
const { JWT_SECRET } = require('../config/jwt');

exports.authenticate = async (req, res, next) => {
  try {
    // Verificação básica do header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        code: 'MISSING_TOKEN',
        message: 'Token de autenticação não fornecido ou formato inválido',
      });
    }

    const token = authHeader.split(' ')[1];

    // Verificação de token revogado
    let isRevoked;
    try {
      isRevoked = await isTokenRevoked(token);
    } catch (revokeError) {
      console.error('Erro ao verificar token revogado:', revokeError);
      throw new Error('Erro na verificação do token');
    }

    if (isRevoked) {
      return res.status(401).json({
        code: 'TOKEN_REVOKED',
        message: 'Este token foi invalidado',
      });
    }

    // Decodificação do token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (jwtError) {
      console.error('Erro na verificação do JWT:', jwtError.message);
      throw jwtError; // Será capturado no bloco catch externo
    }

    // Busca do usuário
    const user = await User.findByPk(decoded.user_id);
    if (!user) {
      return res.status(404).json({
        code: 'USER_NOT_FOUND',
        message: 'Usuário não encontrado',
      });
    }

    // Verificação de reset de senha
    if (
      decoded.reset_password &&
      !req.originalUrl.includes('/api/auth/reset-password')
    ) {
      return res.status(403).json({
        code: 'PASSWORD_RESET_REQUIRED',
        message: 'Necessário redefinir sua senha',
      });
    }

    req.user = {
      user_id: user.user_id,
      email: user.email,
      user_type: user.user_type,
      reset_password: decoded.reset_password,
    };

    next();
  } catch (error) {
    console.error('Erro geral de autenticação:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });

    const response = {
      code: 'SERVER_ERROR',
      message: 'Erro interno no servidor',
    };

    if (process.env.NODE_ENV === 'development') {
      response.debug = {
        error: error.message,
        stack: error.stack,
      };
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        code: 'INVALID_TOKEN',
        message: 'Token inválido',
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        code: 'TOKEN_EXPIRED',
        message: 'Token expirado',
      });
    }

    res.status(500).json(response);
  }
};
