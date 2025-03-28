const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/jwt');
const UserRepository = require('../repositories/userRepository');
const TokenBlacklistRepository = require('../repositories/tokenBlacklistRepository');

exports.register = async (userData) => {
  // Verificar email existente usando repositório
  const existingUser = await UserRepository.findByEmail(userData.email);
  if (existingUser) {
    throw new Error('Email already registered');
  }

  // Criptografar senha
  const password_hash = await bcrypt.hash(userData.password, 10);

  // Criar usuário via repositório
  return UserRepository.create({
    ...userData,
    password_hash,
  });
};

// Versão atualizada do login
exports.login = async (email, password) => {
  // Busca o usuário via repositório
  const user = await UserRepository.findByEmail(email, {
    attributes: ['user_id', 'user_type', 'reset_password', 'password_hash'],
  });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Comparação de senha
  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  // Geração do token
  const token = jwt.sign(
    {
      user_id: user.user_id,
      user_type: user.user_type,
      reset_password: user.reset_password,
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  return {
    token,
    reset_password: user.reset_password,
  };
};

// Versão atualizada do logout
exports.logout = async (token) => {
  if (!token) {
    throw new Error('Token not provided');
  }

  const decoded = jwt.decode(token);
  if (!decoded?.exp) {
    throw new Error('Invalid token format');
  }

  try {
    await TokenBlacklistRepository.create({
      token,
      expires_at: new Date(decoded.exp * 1000),
    });

    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    throw new Error('Logout failed');
  }
};

// Versão atualizada da verificação de token
exports.isTokenRevoked = async (token) => {
  try {
    const blacklistedToken = await TokenBlacklistRepository.findByToken(token);
    return !!blacklistedToken;
  } catch (error) {
    console.error('Erro crítico na verificação:', {
      error: error.message,
      stack: error.stack,
      token: token,
    });
    throw new Error('Falha na verificação do token');
  }
};

// Versão atualizada da limpeza de tokens
exports.cleanupExpiredTokens = async () => {
  try {
    const result = await TokenBlacklistRepository.deleteExpiredTokens();
    //console.log(`Cleaned tokens: ${result}`);
    return result;
  } catch (error) {
    console.error('Token cleanup error:', error);
    throw new Error('Token cleanup failed');
  }
};
