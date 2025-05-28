const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const InternacionCirugia = sequelize.define('InternacionCirugia', {
  idintercirugias: {
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
  idtipocirugia: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'tipocirugias',
      key: 'idtipocirugia'
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
  fechacirugia: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'internacion_cirugias',
  timestamps: true
});

InternacionCirugia.associate = (models) => {
  InternacionCirugia.belongsTo(models.Internacion, {
    foreignKey: 'idinternacion',
    as: 'internacion'
  });
  InternacionCirugia.belongsTo(models.Medico, {
    foreignKey: 'idmedico',
    as: 'medico'
  });
  InternacionCirugia.belongsTo(models.TipoCirugia, {
    foreignKey: 'idtipocirugia',
    as: 'tipocirugia'
  });
};

module.exports = InternacionCirugia;
