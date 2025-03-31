const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Address = sequelize.define(
  'Address',
  {
    address_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    address_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    cep: {
      type: DataTypes.STRING(8),
      allowNull: false,
    },
    street: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    complement: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    neighbourhood: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users', // Nome da tabela no banco
        key: 'user_id',
      },
    },
  },
  {
    tableName: 'address', // Nome exato da tabela no banco
    timestamps: false, // Remove campos createdAt/updatedAt
  }
);

// Associação com User
Address.associate = (models) => {
  Address.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'user',
    onDelete: 'CASCADE', // Reflete o ON DELETE CASCADE do SQL
  });
  Address.hasMany(models.Stop, {
    foreignKey: 'address_id',
    as: 'stops',
    onDelete: 'CASCADE',
  });
};

module.exports = Address;
