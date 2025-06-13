const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Rol = sequelize.define('Rol', {
  idrol: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'idrol'
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'roles',
  timestamps: false
});

Rol.associate = (models) => {
  Rol.hasMany(models.Usuario, {
    foreignKey: 'idrol',
    as: 'usuarios'
  });
};

module.exports = Rol;
