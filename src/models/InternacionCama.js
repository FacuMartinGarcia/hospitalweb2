const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const InternacionCama = sequelize.define('InternacionCama', {
  idintercama: {
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
  idcama: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'infra_camas',
      key: 'idcama'
    }
  },
  fechadesde: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  fechahasta: {
    type: DataTypes.DATEONLY,
    allowNull: true
  }
}, {
  tableName: 'internacion_cama',
  paranoid: true, 
  timestamps: true 
});

InternacionCama.associate = (models) => {
  InternacionCama.belongsTo(models.Internacion, {
    foreignKey: 'idinternacion',
    as: 'internacion'
  });
  
  InternacionCama.belongsTo(models.Cama, {
    foreignKey: 'idcama',
    as: 'cama'
  });
};

module.exports = InternacionCama;