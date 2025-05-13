const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');  // Asumiendo que 'db' es tu archivo de configuración de Sequelize

const Especialidad = sequelize.define('Especialidad', {
  idespecialidad: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  denominacion: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'especialidades', 
  timestamps: false            
});

module.exports = Especialidad;
