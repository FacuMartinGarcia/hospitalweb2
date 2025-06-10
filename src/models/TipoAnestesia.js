const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const TipoAnestesia = sequelize.define('TipoAnestesia', {
  idtipoanestesia: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  denominacionanestesia: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'tipoanestesias',
  timestamps: false 
});

TipoAnestesia.associate = (models) => {
  TipoAnestesia.hasMany(models.InternacionCirugia, {
    foreignKey: 'idtipoanestesia',
    as: 'cirugias'
  });
};

module.exports = TipoAnestesia;