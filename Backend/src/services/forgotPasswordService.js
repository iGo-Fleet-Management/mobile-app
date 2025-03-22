const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../config/jwt');
const validator = require('validator');

// Função para buscar usuário pelo email
exports.findUserByEmail = async (email) => {
  return await User.findOne({ where: { email } });
};

// Função para gerar token de recuperação de senha
exports.generatePasswordResetToken = async (email) => {
  const { v4: uuidv4 } = require('uuid');

  // Gera um identificador único para este token
  const tokenId = uuidv4();

  // Define quando o token expira (1 hora)
  const expiresIn = '1h';

  // Gera o token JWT
  const token = jwt.sign(
    {
      email,
      purpose: 'password-reset', // Propósito específico do token
      jti: tokenId, // JWT ID - identificador único
    },
    JWT_SECRET,
    { expiresIn }
  );

  console.log('Token para reset', token);

  return token;
};

// Função para redefinir senha usando token
exports.resetPasswordWithToken = async (token, newPassword) => {
  try {
    // Verifica e decodifica o token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Verifica se o token tem o propósito correto
    if (decoded.purpose !== 'password-reset') {
      throw new Error('Token inválido');
    }

    // Extrai o email do payload
    const { email } = decoded;

    // Busca o usuário pelo email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Validação da força da senha
    if (!validator.isStrongPassword(newPassword)) {
      throw new Error('Senha deve ter 8+ caracteres com números e símbolos');
    }

    // Gera hash da nova senha
    const password_hash = await bcrypt.hash(newPassword, 10);

    // Atualiza a senha do usuário
    await User.update(
      { password_hash, reset_password: false },
      { where: { user_id: user.user_id } }
    );

    return { success: true };
  } catch (error) {
    // Propaga o erro para ser tratado no controlador
    throw error;
  }
};
