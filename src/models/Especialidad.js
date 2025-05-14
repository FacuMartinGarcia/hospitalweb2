const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');  

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

Especialidad.associate = (models) => {
  Especialidad.hasMany(models.Medico, { 
    foreignKey: 'idespecialidad',
    as: 'especialidad'});
};

module.exports = Especialidad;
