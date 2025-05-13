const express = require('express');
const path = require('path');
const session = require('express-session');
const sequelize = require('./config/db');

// Importar rutas
const coberturasRouter = require('./src/routes/coberturasRoutes');
const enfermerosRouter = require('./src/routes/enfermerosRoutes');
const especialidadesRouter = require('./src/routes/especialidadesRoutes');
const medicosRouter = require('./src/routes/medicosRoutes');
const pacientesRouter = require('./src/routes/pacientesRoutes');
const usuariosRoutes = require('./src/routes/usuariosRoutes');
const loginRoutes = require('./src/routes/loginRoutes');

// Crear instancia de Express
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de sesión
app.use(session({
  secret: 'clave-secreta',
  resave: false,
  saveUninitialized: true
}));

// Rutas de API
app.use('/api/pacientes', pacientesRouter);
app.use('/api/coberturas', coberturasRouter);
app.use('/api/especialidades', especialidadesRouter);
app.use('/api/enfermeros', enfermerosRouter);
app.use('/api/medicos', medicosRouter);
app.use('/api/usuarios', usuariosRoutes);

// Rutas de login
app.use('/login', loginRoutes);

// Configuración de vistas
app.set('view engine', 'pug');
app.set('views', './views');

// Rutas para vistas
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/layout', (req, res) => {
  res.render('layout');
});

app.get('/pacientes', (req, res) => {
  res.render('pacientes');
});

app.get('/enfermeros', (req, res) => {
  res.render('enfermeros');
});

// Sincronización de la base de datos y arranque del servidor
sequelize.sync()
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
