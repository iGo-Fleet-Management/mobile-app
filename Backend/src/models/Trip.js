const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Trip = sequelize.define(
  'Trip',
  {
    trip_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    trip_type: {
      type: DataTypes.ENUM('ida', 'volta'), // Melhor usar ENUM para validar
      allowNull: false,
    },
    trip_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    tableName: 'trip',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['trip_date', 'trip_type'], // Index composto para buscas
      },
    ],
  }
);

Trip.associate = (models) => {
  Trip.hasMany(models.Stop, {
    foreignKey: 'trip_id',
    as: 'stops',
    onDelete: 'CASCADE',
  });
};

module.exports = Trip;
