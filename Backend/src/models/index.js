const { Sequelize } = require('sequelize');
const sequelize = require('../config/db');

// Importar modelos
const User = require('./User');
const Address = require('./Address');
const TokenBlacklist = require('./TokenBlacklist');
// Criar objeto de modelos
const models = {
  User,
  Address,
  TokenBlacklist,
  sequelize,
  Sequelize,
};

// Configurar associações
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = models;
