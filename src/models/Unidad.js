const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Unidad = sequelize.define('Unidad', {
  idunidad: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  denominacion: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  }
}, {
  tableName: 'infra_unidades',
  timestamps: false,
  paranoid: false,
});

Unidad.associate = (models) => {
  Unidad.hasMany(models.Habitacion, {
    foreignKey: 'idunidad',
    as: 'habitaciones'
  });
};

module.exports = Unidad;