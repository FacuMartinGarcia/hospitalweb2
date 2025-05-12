const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Medico = sequelize.define('Medico', {
  idmedico: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  apellidomombres: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  matricula: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  idespecialidad: {
    type: DataTypes.INTEGER,
    references: {
      model: 'especialidades',
      key: 'idespecialidad'
    }
  }
}, {
  tableName: 'medicos',
  timestamps: true,
  paranoid: true, // habilita soft delete usando deletedAt
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt'
});

module.exports = Medico;
