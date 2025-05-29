require('dotenv').config(); 
const { Sequelize } = require('sequelize');

/*
const sequelize = new Sequelize('hospital', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

*/


const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: 'mysql',
    logging: false,
  }
);



module.exports = sequelize;

sequelize.authenticate()
  .then(() => console.log('✅ Conexión exitosa a Railway'))
  .catch(err => console.error('❌ Error de conexión:', err));
  