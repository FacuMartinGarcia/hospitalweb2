const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const InternacionEvmedica = sequelize.define('InternacionEvmedica', {
  idinterevaluacionmedica: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idinternacion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'internacion',
      key: 'idinternacion'
    }
  },
  idmedico: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'medicos',
      key: 'idmedico'
    }
  },
  fechaevaluacion: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  iddiagnostico: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'diagnosticos',
      key: 'iddiagnostico'
    }
  },
  observacionesem: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'internacion_evmedica',
  timestamps: true
});

InternacionEvmedica.associate = (models) => {
  InternacionEvmedica.belongsTo(models.Internacion, {
    foreignKey: 'idinternacion',
    as: 'internacion'
  });
  InternacionEvmedica.belongsTo(models.Medico, {
    foreignKey: 'idmedico',
    as: 'medico'
  });
  InternacionEvmedica.belongsTo(models.Diagnostico, {
    foreignKey: 'iddiagnostico',
    as: 'diagnostico'
  });
};

module.exports = InternacionEvmedica;
