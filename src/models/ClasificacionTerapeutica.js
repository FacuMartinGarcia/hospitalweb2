const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const ClasificacionTerapeutica = sequelize.define('ClasificacionTerapeutica', {
  idclasificacionterapeutica: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'idclasificacionterapeutica' 
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
  tableName: 'clasificacion_terapeutica',
  timestamps: false,
  indexes: [
    {
      name: 'idx_denominacion', 
      fields: ['denominacion']
    }
  ]
});


ClasificacionTerapeutica.associate = (models) => {
  ClasificacionTerapeutica.hasMany(models.Medicamento, {
    foreignKey: 'idclasificacionterapeutica',
    as: 'medicamentos'
  });
};

module.exports = ClasificacionTerapeutica;