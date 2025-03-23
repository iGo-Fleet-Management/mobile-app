const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const TokenBlacklist = sequelize.define(
  'TokenBlacklist',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true, // Garante que cada token só é armazenado uma vez
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: { msg: 'A data de expiração é obrigatória' },
        isDate: { msg: 'Formato de data inválido' },
        isValidDate(value) {
          if (new Date(value) < new Date()) {
            throw new Error('Data de expiração deve ser no futuro');
          }
        },
      },
    },
  },
  {
    tableName: 'token_blacklist',
    timestamps: false,
    underscored: true, // Para usar snake_case nos nomes dos campos
  }
);

module.exports = TokenBlacklist;
