const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Paciente = sequelize.define('Paciente', {
  idpaciente: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  apellidonombres: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  documento: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  fechanacimiento: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  sexo: {
    type: DataTypes.CHAR(1),
    allowNull: true
  },
  direccion: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  fecharegistro: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  idcobertura: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'coberturas',
      key: 'idcobertura'
    }
  },
  contactoemergencia: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  fechafallecimiento: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  actadefuncion: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    onUpdate: DataTypes.NOW
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'pacientes',
  timestamps: true, 
  paranoid: true, 
  underscored: false, // Usa camelCase en lugar de snake_case
  indexes: [
    {
      unique: true,
      fields: ['documento']
    },
    {
      fields: ['apellidonombres']
    }
  ]
});


  Paciente.associate = (models) => {
    Paciente.belongsTo(models.Cobertura, {
      foreignKey: 'idcobertura',
      as: 'cobertura'
    });
  };

module.exports = Paciente;
