const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const TipoCirugia = sequelize.define('TipoCirugia', {
  idtipocirugia: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  denominacioncirugia: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'tipocirugias',
  timestamps: false
});

TipoCirugia.associate = (models) => {
  TipoCirugia.hasMany(models.Cirugia, {
    foreignKey: 'idtipocirugia',
    as: 'cirugias'
  });
};

module.exports = TipoCirugia;