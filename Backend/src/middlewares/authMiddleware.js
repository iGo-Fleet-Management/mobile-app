const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../config/jwt');

// Middleware de autenticação JWT
exports.authenticate = async (req, res, next) => {
  try {
    // Obter o token do cabeçalho Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        code: 'MISSING_TOKEN',
        message: 'Token de autenticação não fornecido ou formato inválido',
      });
    }

    // Extrai o token do cabeçalho
    const token = authHeader.split(' ')[1];

    // Verificar e decodificar o token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Encontrar o usuário no banco de dados
    const user = await User.findByPk(decoded.user_id);
    if (!user) {
      return res.status(404).json({
        code: 'USER_NOT_FOUND',
        message: 'Usuário não encontrado',
      });
    }

    // Verifica se a senha precisa ser resetada
    if (
      decoded.reset_password &&
      !req.originalUrl.includes('/reset-password')
    ) {
      return res.status(403).json({
        code: 'PASSWORD_RESET_REQUIRED',
        message: 'Necessário redefinir sua senha',
      });
    }

    // Adicionar o usuário à requisição para uso em outros middlewares
    req.user = {
      user_id: user.user_id,
      email: user.email,
      user_type: user.user_type,
      reset_password: decoded.reset_password,
    };

    // Passa para o próximo middleware/controller
    next();
  } catch (error) {
    // Tratamento específico para erros de JWT
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

    // 10. Erro genérico para casos inesperados
    res.status(500).json({
      code: 'SERVER_ERROR',
      message: 'Erro interno no servidor',
    });
  }
};
