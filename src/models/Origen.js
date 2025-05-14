const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Origen = sequelize.define('Origen', {
    idorigen: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    denominacion: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
}, {
    tableName: 'origenes', 
    timestamps: false 
});

Origen.associate = (models) => {
    Origen.hasMany(models.Internacion, {
        foreignKey: 'idorigen',
        as: 'internacion'
    });
};

module.exports = Origen;