const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Cama = sequelize.define('Cama', {
  idcama: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  idhabitacion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'infra_habitaciones',
      key: 'idhabitacion'
    }
  },
  numerocama: {
    type: DataTypes.STRING(10),
    allowNull: true
  }
}, {
  tableName: 'infra_camas',
  timestamps: false,
  paranoid: false,
});

Cama.associate = (models) => {
  Cama.belongsTo(models.Habitacion, {
    foreignKey: 'idhabitacion',
    as: 'habitacion'
  });
};

module.exports = Cama;