const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../config/jwt');
const validator = require('validator');

exports.register = async (
  user_type,
  name,
  last_name,
  email,
  password,
  reset_password
) => {
  // 1. Validação de formato e senha
  if (!validator.isEmail(email)) {
    throw new Error('Formato de email inválido');
  }

  if (password.length < 8) {
    throw new Error('Senha deve ter no mínimo 8 caracteres');
  }
  // 2. Verificação de email existente
  const existingUser = await User.findOne({
    where: {
      email: email,
    },
  });
  // 3. Validação de duplicidade
  if (existingUser) {
    throw new Error('Este email já está registrado');
  }
  // 4. Criptografia da senha
  const password_hash = await bcrypt.hash(password, 10);
  // 5. Criação do usuário
  const user = await User.create({
    user_type,
    name,
    last_name,
    email,
    password_hash,
    reset_password,
  });
  // 6. Retorno do usuário criado
  return {
    name: user.name,
    email: user.email,
  };
};

exports.login = async (email, password) => {
  // 1. Busca o usuário pelo email no banco de dados
  const user = await User.findOne({ where: { email } });
  // 2. Verifica se o user existe
  if (!user) {
    throw new Error('Usuário não encontrado');
  }
  // 3. Compara a senha fornecida com o hash armazenado
  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  // 4. Validação da senha
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  // 5. Geração do token JWT
  const token = jwt.sign(
    {
      user_id: user.user_id,
      user_type: user.user_type,
      reset_password: user.reset_password,
    },
    JWT_SECRET,
    {
      expiresIn: '1h',
    }
  );
  // 6. Retorno do token
  return { token, reset_password: user.reset_password };
};

exports.resetPassword = async (email, currentPassword, newPassword) => {
  // Validação inicial de inputs
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

  // Verificação de senha
  const isPasswordValid = await bcrypt.compare(
    currentPassword,
    user.password_hash
  );

  if (!isPasswordValid) {
    throw new Error('Credenciais inválidas');
  }

  // Geração de novo hash
  const password_hash = await bcrypt.hash(newPassword, 10);

  // Atualização no banco
  await User.update(
    {
      password_hash: password_hash,
      reset_password: false,
    },
    { where: { user_id: user.user_id } }
  );

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

  return {
    success: true,
    code: 'PASSWORD_UPDATED',
    message: 'Senha atualizada com sucesso',
    token: newToken,
  };
};
