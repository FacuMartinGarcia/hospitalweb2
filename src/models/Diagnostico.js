// models/diagnostico.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Diagnostico = sequelize.define('Diagnostico', {
  iddiagnostico: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  codigo: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  descripcion: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  categoria: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  categoriamayor: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  tableName: 'diagnosticos',
  timestamps: false,
  indexes: [
    {
      fields: ['codigo']
    }
  ]
});

Diagnostico.associate = (models) => {
  Diagnostico.hasMany(models.Internacion, {
    foreignKey: 'iddiagnostico',
    as: 'internacion'
  });
};

module.exports = Diagnostico;
