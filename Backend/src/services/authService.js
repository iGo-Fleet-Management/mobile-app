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
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    throw new Error('Invalid credentials');
  }
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
  return token;
};
