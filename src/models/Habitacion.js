const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Habitacion = sequelize.define('Habitacion', {
  idhabitacion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  idala: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'infra_alas',
      key: 'idala'
    }
  },
  idunidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'infra_unidades',
      key: 'idunidad'
    }
  },
  nombrehabitacion: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  capacidad: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'infra_habitaciones',
  timestamps: false,
  paranoid: false,
});

Habitacion.associate = (models) => {
  Habitacion.belongsTo(models.Ala, {
    foreignKey: 'idala',
    as: 'ala'
  });
  
  Habitacion.belongsTo(models.Unidad, {
    foreignKey: 'idunidad',
    as: 'unidad'
  });
  
  Habitacion.hasMany(models.Cama, {
    foreignKey: 'idhabitacion',
    as: 'camas'
  });
};

module.exports = Habitacion;