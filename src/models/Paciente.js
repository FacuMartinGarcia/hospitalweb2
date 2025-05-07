const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db'); 

const Paciente = sequelize.define('Paciente', {
  idPaciente: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  apellidoNombres: {
    type: DataTypes.STRING,
    allowNull: false
  },
  documento: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  fechaNacimiento: DataTypes.DATEONLY,
  sexo: DataTypes.STRING(1),
  direccion: DataTypes.STRING,
  telefono: DataTypes.STRING,
  email: DataTypes.STRING,
  idCobertura: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  contactoEmergencia: DataTypes.STRING,
  fechaFallecimiento: DataTypes.DATEONLY,
  actaDefuncion: DataTypes.STRING
}, {
  tableName: 'pacientes', 
  timestamps: false
});

module.exports = Paciente;
