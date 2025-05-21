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
  iddiagnostico: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'diagnosticos',
      key: 'iddiagnostico'
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
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  fechaalta: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  idmedicoalta: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'medicos',
      key: 'idmedico'
    }
  },
  indicaciones: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'internacion',
  timestamps: true,
  paranoid: true
});

Internacion.associate = (models) => {
  Internacion.belongsTo(models.Origen, { foreignKey: 'idorigen', as: 'origen' });
  Internacion.belongsTo(models.Medico, { foreignKey: 'idmedico', as: 'medico' });
  Internacion.belongsTo(models.Medico, { foreignKey: 'idmedicoalta', as: 'medicoAlta' });
  Internacion.belongsTo(models.Paciente, { foreignKey: 'idpaciente', as: 'paciente' });
  Internacion.belongsTo(models.Diagnostico, { foreignKey: 'iddiagnostico', as: 'diagnostico' });
  Internacion.hasMany(models.InternacionCama, { foreignKey: 'idinternacion', as: 'internacionesCama' });
};

Internacion.prototype.esActiva = function () {
  return this.fechaalta === null;
};

module.exports = Internacion;
