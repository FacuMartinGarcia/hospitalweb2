const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Medico = require('./medico');
const Origen = require('./origen');
const Paciente = require('./paciente');

const Internacion = sequelize.define('Internacion', {
  idinternacion: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  idorigen: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  idmedico: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  idpaciente: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fechaingreso: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  horaingreso: {
    type: DataTypes.TIME,
    allowNull: false
  },
  motivo: {
    type: DataTypes.TEXT
  },
  estado: {
    type: DataTypes.STRING(50)
  },
  fechaalta: {
    type: DataTypes.DATEONLY
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  deletedAt: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'internacion',
  paranoid: true, 
  timestamps: true,
  updatedAt: 'updatedAt',
  createdAt: 'createdAt',
  deletedAt: 'deletedAt'
});

Internacion.belongsTo(Medico, { foreignKey: 'idmedico', as: 'medico' });
Internacion.belongsTo(Origen, { foreignKey: 'idorigen', as: 'origen' });
Internacion.belongsTo(Paciente, { foreignKey: 'idpaciente', as: 'paciente' });

Internacion.prototype.esActiva = function () {
  return this.fechaalta === null;
};

module.exports = Internacion;
