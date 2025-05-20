const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Ala = sequelize.define('Ala', {
  idala: {
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
  tableName: 'infra_alas',
  timestamps: false,
  paranoid: false,
});

Ala.associate = (models) => {
  Ala.hasMany(models.Habitacion, {
    foreignKey: 'idala',
    as: 'habitaciones'
  });
};

module.exports = Ala;