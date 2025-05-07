const sequelize = require('./config/db.js');

sequelize.authenticate()
  .then(() => {
    console.log('Conexión a MySQL exitosa 🚀');
    process.exit();
  })
  .catch((err) => {
    console.error('Error de conexión a MySQL ❌:', err);
    process.exit(1);
  });