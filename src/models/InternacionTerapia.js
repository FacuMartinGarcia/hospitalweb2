const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const InternacionTerapia = sequelize.define('InternacionTerapia', {
  idinterterapias: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
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
  fechaterapia: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  idtipoterapia: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'tipoterapias',
      key: 'idtipoterapia'
    }
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'internacion_terapias',
  timestamps: true,
  paranoid: false
});

InternacionTerapia.associate = (models) => {
  InternacionTerapia.belongsTo(models.Internacion, {
    foreignKey: 'idinternacion',
    as: 'internacion'
  });
  InternacionTerapia.belongsTo(models.Medico, {
    foreignKey: 'idmedico',
    as: 'medico'
  });
  InternacionTerapia.belongsTo(models.TipoTerapia, {
    foreignKey: 'idtipoterapia',
    as: 'tipoterapia'
  });
};

module.exports = InternacionTerapia;
