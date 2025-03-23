const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../config/jwt');
const validator = require('validator');

// Função para buscar usuário pelo email
exports.findUserByEmail = async (email) => {
  return await User.findOne({ where: { email } });
};

// Gerar código aleatório de 6 dígitos
const generateResetCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Ex: "123456"
};

// Função para gerar token de recuperação de senha
exports.generatePasswordResetToken = async (email) => {
  // Verifica se o usuário existe
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error('Usuário não encontrado'); // Erro específico para controle interno
  }

  const resetCode = generateResetCode();

  // Gera o token JWT
  const token = jwt.sign(
    {
      email,
      code: resetCode,
      purpose: 'password-reset',
    },
    JWT_SECRET,
    { expiresIn: '10m' } // Código válido por 10 minutos
  );

  return { resetCode, token };
};

// Função para redefinir senha usando token
exports.resetPasswordWithToken = async (token, userCode, newPassword) => {
  try {
    // Verifica e decodifica o token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Verifica se o token tem o propósito correto
    if (decoded.purpose !== 'password-reset') {
      throw new Error('Token inválido');
    }

    // Verifica se o código está propósito correto
    if (decoded.code !== userCode) {
      throw new Error('Código inválido');
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

// Serviço de reset de senha no primeiro login
exports.resetPasswordFirstLogin = async (
  email,
  currentPassword,
  newPassword
) => {
  // Validação de campos obrigatórios
  if (!email || !currentPassword || !newPassword) {
    throw new Error('Todos os campos são obrigatórios');
  }

  // Validação da força da senha antes de operações de banco
  if (!validator.isStrongPassword(newPassword)) {
    throw new Error('Senha deve ter 8+ caracteres com números e símbolos');
  }

  // Verificação se senhas são iguais
  if (currentPassword === newPassword) {
    throw new Error('A nova senha não pode ser igual a atual');
  }

  // Busca de usuário
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new Error('Credenciais inválidas');
  }

  // Verificação de senha atual
  const isPasswordValid = await bcrypt.compare(
    currentPassword,
    user.password_hash
  );
  if (!isPasswordValid) {
    throw new Error('Credenciais inválidas');
  }

  // Geração de hash da nova senha
  const password_hash = await bcrypt.hash(newPassword, 10);

  // Atualização no banco
  await User.update(
    {
      password_hash: password_hash,
      reset_password: false,
    },
    { where: { user_id: user.user_id } }
  );

  // Geração de novo token sem status de reset de senha
  const newToken = jwt.sign(
    {
      user_id: user.user_id,
      user_type: user.user_type,
    },
    JWT_SECRET,
    {
      expiresIn: '1h',
    }
  );

  // Retorno de sucesso
  return {
    success: true,
    code: 'PASSWORD_UPDATED',
    message: 'Senha atualizada com sucesso',
    token: newToken,
  };
};
