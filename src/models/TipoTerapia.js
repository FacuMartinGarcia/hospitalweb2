const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const TipoTerapia = sequelize.define('TipoTerapia', {
  idtipoterapia: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  denominacionterapia: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'tipoterapias',
  timestamps: false
});

TipoTerapia.associate = (models) => {
  TipoTerapia.hasMany(models.InternacionTerapia, { foreignKey: 'idtipoterapia' });
};

module.exports = TipoTerapia;
