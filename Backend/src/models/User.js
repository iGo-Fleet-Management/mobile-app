const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define(
  'User',
  {
    user_id: {
      type: DataTypes.UUID, // Tipo UUID
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4, // Gera um UUID automaticamente
    },
    user_type: {
      type: DataTypes.STRING(30), // VARCHAR(30)
      allowNull: false,
      defaultValue: 'passageiro',
    },
    name: {
      type: DataTypes.STRING(40), // VARCHAR(40)
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING(200), // VARCHAR(200)
      allowNull: false,
    },
    cpf: {
      type: DataTypes.STRING(11), // VARCHAR(11)
      unique: true, // CPF deve ser único
    },
    birthdate: {
      type: DataTypes.DATEONLY, // DATE (apenas data, sem hora)
    },
    email: {
      type: DataTypes.STRING(255), // VARCHAR(255)
      allowNull: false,
      unique: true, // Email deve ser único
    },
    phone: {
      type: DataTypes.STRING(20), // VARCHAR(20)
    },
    reset_password: {
      type: DataTypes.BOOLEAN, // BOOLEAN
      defaultValue: false, // Valor padrão é FALSE
    },
    password_hash: {
      type: DataTypes.STRING(100), //VARCHAR(100)
      allowNull: false,
    },
  },
  {
    tableName: 'users', // Nome da tabela no banco de dados
    timestamps: false, // Desabilita os campos `createdAt` e `updatedAt`
  }
);

User.associate = (models) => {
  User.hasMany(models.Address, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
  });
};

module.exports = User;
