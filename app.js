const express = require('express');
const path = require('path');
const app = express();

const pacientesRouter = require('./src/routes/pacientesRoutes');
const coberturasRouter = require('./src/routes/coberturasRoutes');
const medicosRouter = require('./src/routes/medicosRoutes');
const especialidadesRouter = require('./src/routes/especialidadesRoutes');
const enfermerosRouter = require('./src/routes/enfermerosRoutes');
const turnosRouter = require('./src/routes/turnosRoutes');
const sequelize = require('./config/db');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Rutas API
app.use('/api/pacientes', (req, res, next) => {
  console.log("¡Ruta /api/pacientes activada!");
  next();
}, pacientesRouter);

app.use('/api/coberturas', coberturasRouter);
app.use('/api/medicos', medicosRouter);
app.use('/api/especialidades', especialidadesRouter);
app.use('/api/enfermeros', enfermerosRouter);
app.use('/api/turnos', turnosRouter);

// Configuración de vistas
app.set('view engine', 'pug');
app.set('views', './views');

// Rutas para vistas
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/pacientes', (req, res) => {
  res.render('pacientes'); 
});

app.get('/persona', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/html/persona.html'));
});

// Sincronización de BD y arranque del servidor
sequelize.sync({ alter: true }) 
  .then(() => {
    console.log('Base de datos sincronizada correctamente');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error al sincronizar la base de datos:', err);
  });

