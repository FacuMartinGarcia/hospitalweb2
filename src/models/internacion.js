const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Internacion = sequelize.define('Internacion', {
  idinternacion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  idorigen: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'origenes',
      key: 'idorigen'
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
  idpaciente: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'pacientes',
      key: 'idpaciente'
    }
  },
  fechaingreso: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  horaingreso: {
    type: DataTypes.TIME,
    allowNull: false
  },
  motivo: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  estado: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  fechaalta: {
    type: DataTypes.DATEONLY,
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
  tableName: 'internacion',
  timestamps: true,
  paranoid: true,
  underscored: false
});

// Relaciones (associate)
Internacion.associate = (models) => {
  Internacion.belongsTo(models.Origen, {
    foreignKey: 'idorigen',
    as: 'origen'
  });

  Internacion.belongsTo(models.Medico, {
    foreignKey: 'idmedico',
    as: 'medico'
  });

  Internacion.belongsTo(models.Paciente, {
    foreignKey: 'idpaciente',
    as: 'paciente'
  });
};
Internacion.prototype.esActiva = function () {
  return this.fechaalta === null;
};

module.exports = Internacion;