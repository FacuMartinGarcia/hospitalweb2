const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const InternacionEstudio = sequelize.define('InternacionEstudio', {
  idinterestudios: {
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
  idestudio: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'estudios',
      key: 'idestudio'
    }
  },
  fechaestudio: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  observacioneses: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'internacion_estudios',
  timestamps: true
});

InternacionEstudio.associate = (models) => {
  InternacionEstudio.belongsTo(models.Internacion, {
    foreignKey: 'idinternacion',
    as: 'internacion'
  });
  InternacionEstudio.belongsTo(models.Medico, {
    foreignKey: 'idmedico',
    as: 'medico'
  });
  InternacionEstudio.belongsTo(models.Estudio, {
    foreignKey: 'idestudio',
    as: 'estudio'
  });
};

module.exports = InternacionEstudio;
