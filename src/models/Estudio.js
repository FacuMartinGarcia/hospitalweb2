const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Estudio = sequelize.define('Estudio', {
  idestudio: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  denominacion: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'estudios',
  timestamps: false
});

Estudio.associate = (models) => {
  Estudio.hasMany(models.InternacionEstudio, {
    foreignKey: 'idestudio',
    as: 'solicitudes'
  });
};

module.exports = Estudio;