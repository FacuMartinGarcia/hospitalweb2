const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Cobertura = sequelize.define('Cobertura', {
  idcobertura: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  denominacion: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  }
}, {
  tableName: 'coberturas',
  timestamps: false, 
  paranoid: false,   
});


Cobertura.associate = function(models) {
  Cobertura.hasMany(models.Paciente, {
    foreignKey: 'idcobertura',
    as: 'pacientes' 
  });
};

module.exports = Cobertura;