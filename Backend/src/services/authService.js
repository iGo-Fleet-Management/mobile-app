const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../config/jwt');

exports.register = async (user_type, name, last_name, email, password) => {
  const existingUser = await User.findOne({
    where: {
      email: email,
    },
  });

  if (existingUser) {
    throw new Error('Este email já está registrado');
  }

  const password_hash = await bcrypt.hash(password, 10);
  const user = await User.create({
    user_type,
    name,
    last_name,
    email,
    password_hash,
  });
  return user;
};

exports.login = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  console.log('Login - Usuário encontrado:', user ? 'Sim' : 'Não');
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    console.log('Login - ID do usuário:', user.user_id);
    throw new Error('Invalid credentials');
  }

  console.log('Dados do usuário para token:', {
    user_id: user.user_id,
    email: user.email,
  });

  if (!user.user_id) {
    throw new Error('User ID is undefined');
  }

  const token = jwt.sign({ user_id: user.user_id }, JWT_SECRET, {
    expiresIn: '1h',
  });
  console.log('Login - Token gerado:', token);
  return token;
};
