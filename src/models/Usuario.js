const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Usuario = sequelize.define('Usuario', {
  idusuario: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  aliasusuario: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  apellidonombres: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  pass: {
    type: DataTypes.STRING(255),
    allowNull: false
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
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'usuarios',
  paranoid: true 
});

module.exports = Usuario;
