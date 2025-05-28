const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const InternacionMedicamento = sequelize.define('InternacionMedicamento', {
  idintermedicamentos: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idinternacion: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  idmedico: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  idmedicamento: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fechaprescripcion: {
    type: DataTypes.DATEONLY
  },
  cantidad: {
    type: DataTypes.INTEGER
  },
  observacionesme: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'internacion_medicamentos',
  paranoid: true,
  timestamps: true
});

InternacionMedicamento.associate = (models) => {
  InternacionMedicamento.belongsTo(models.Internacion, {
    foreignKey: 'idinternacion',
    as: 'internacion'
  });
  
  InternacionMedicamento.belongsTo(models.Medico, {
    foreignKey: 'idmedico',
    as: 'medico'
  });
  
  InternacionMedicamento.belongsTo(models.Medicamento, {
    foreignKey: 'idmedicamento',
    as: 'medicamento'
  });
};

module.exports = InternacionMedicamento;