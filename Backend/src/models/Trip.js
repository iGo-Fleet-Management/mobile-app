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
      type: DataTypes.STRING(50),
    },
    trip_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: 'trip', // Nome da tabela no banco
    timestamps: false, // Remove campos automáticos
  }
);

// Associação com Stop
Trip.associate = (models) => {
  Trip.hasMany(models.Stop, {
    foreignKey: 'trip_id',
    as: 'stops',
    onDelete: 'CASCADE',
  });
};

module.exports = Trip;
