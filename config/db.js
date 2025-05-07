const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('hospital', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;