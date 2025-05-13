const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const UsuarioRol = sequelize.define('UsuarioRol', {
  idusuariosroles: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  idusuario: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  idrol: {
    type: DataTypes.INTEGER,
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
  tableName: 'usuariosroles',
  paranoid: true 
});

module.exports = UsuarioRol;
