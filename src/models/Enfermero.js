
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Enfermero = sequelize.define('Enfermero', {
  idenfermero: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  apellidonombres: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  matricula: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'enfermeros',
  timestamps: true,
  paranoid: true, 
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt',
  indexes: [
    {
      unique: true,
      fields: ['matricula'],
      name: 'idx_matricula',
    },
    {
      fields: ['apellidonombres'],
      name: 'idx_apellidonombres',
    },
  ],
});

Enfermero.associate = (models) => {
  Enfermero.hasMany(models.InternacionEvenfermeria, { foreignKey: 'idenfermero' });
}

module.exports = Enfermero;
