const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Stop = sequelize.define(
  'Stop',
  {
    stop_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'User', // Tabela users
        key: 'user_id',
      },
    },
    address_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Address', // Tabela address
        key: 'address_id',
      },
    },
    trip_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Trip', // Tabela trip
        key: 'trip_id',
      },
    },
    stop_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: 'stop', // Nome exato da tabela
    timestamps: false,
  }
);

// Associações com User, Address e Trip
Stop.associate = (models) => {
  Stop.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'user',
    onDelete: 'CASCADE',
  });
  Stop.belongsTo(models.Address, {
    foreignKey: 'address_id',
    as: 'address',
    onDelete: 'CASCADE',
  });
  Stop.belongsTo(models.Trip, {
    foreignKey: 'trip_id',
    as: 'trip',
    onDelete: 'CASCADE',
  });
};

module.exports = Stop;
