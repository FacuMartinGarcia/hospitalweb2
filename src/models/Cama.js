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
    allowNull: false  
  },
  higienizada: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'infra_camas',
  timestamps: false,
  paranoid: false,
  indexes: [
    {
      unique: true,
      fields: ['idhabitacion', 'numerocama']
    }
  ]
});

Cama.associate = (models) => {
  Cama.belongsTo(models.Habitacion, {
    foreignKey: 'idhabitacion',
    as: 'habitacion'
  });
  
Cama.hasMany(models.InternacionCama, {
    foreignKey: 'idcama',
    as: 'internaciones'
  });
};

module.exports = Cama;