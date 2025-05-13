const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Rol = sequelize.define('Rol', {
  idrol: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nombrerol: {
    type: DataTypes.STRING(50),
    allowNull: false
  }
}, {
  tableName: 'roles',
  timestamps: false 
});

module.exports = Rol;
