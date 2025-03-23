const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../config/jwt');
const validator = require('validator');

// Serviço de registro de usuários
exports.register = async (
  user_type,
  name,
  last_name,
  email,
  password,
  reset_password
) => {
  // Validação de formato de email
  if (!validator.isEmail(email)) {
    throw new Error('Formato de email inválido');
  }

  // Validação de tamanho da senha
  if (password.length < 8) {
    throw new Error('Senha deve ter no mínimo 8 caracteres');
  }

  // Verificação de email existente
  const existingUser = await User.findOne({
    where: {
      email: email,
    },
  });

  // Validação de duplicidade
  if (existingUser) {
    throw new Error('Este email já está registrado');
  }

  // Criptografia da senha
  const password_hash = await bcrypt.hash(password, 10);

  // Criação do usuário
  const user = await User.create({
    user_type,
    name,
    last_name,
    email,
    password_hash,
    reset_password,
  });
  // Retorno do usuário criado
  return {
    name: user.name,
    email: user.email,
  };
};

// Serviço de autenticação de usuários
exports.login = async (email, password) => {
  // Busca o usuário pelo email no banco de dados
  const user = await User.findOne({ where: { email } });

  // Verifica se o user existe
  if (!user) {
    throw new Error('Credenciais invalidas');
  }

  // Compara a senha fornecida com o hash armazenado
  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  // Validação da senha
  if (!isPasswordValid) {
    throw new Error('Credenciais inválidas');
  }

  // Geração do token JWT
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
  // Retorno do token e status de reset de senha
  return { token, reset_password: user.reset_password };
};
