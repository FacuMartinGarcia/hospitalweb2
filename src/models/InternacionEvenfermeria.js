const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const InternacionEvenfermeria = sequelize.define('InternacionEvenfermeria', {
  idinterevaluacioenfermeria: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idinternacion: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  idenfermero: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fechaevaluacion: {
    type: DataTypes.DATEONLY
  },
  parterial: {
    type: DataTypes.STRING(20)
  },
  fcardiaca: {
    type: DataTypes.STRING(20)
  },
  frespiratoria: {
    type: DataTypes.STRING(20)
  },
  tcorporal: {
    type: DataTypes.STRING(20)
  },
  saturacion: {
    type: DataTypes.STRING(20)
  },
  observacionesee: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'internacion_evenfermeria',
  paranoid: true,
  timestamps: true
});

InternacionEvenfermeria.associate = (models) => {
  InternacionEvenfermeria.belongsTo(models.Internacion, {
    foreignKey: 'idinternacion',
    as: 'internacion'
  });
  
  InternacionEvenfermeria.belongsTo(models.Enfermero, {
    foreignKey: 'idenfermero',
    as: 'enfermero'
  });
};

module.exports = InternacionEvenfermeria;