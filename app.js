const express = require('express');
const path = require('path');
const session = require('express-session');
const sequelize = require('./config/db');
const { obtenerPacientes } = require('./src/controllers/pacientesController');

// Importar rutas
const coberturasRoutes = require('./src/routes/coberturasRoutes');
const diagnosticosRoutes = require('./src/routes/diagnosticosRoutes');
const enfermerosRoutes = require('./src/routes/enfermerosRoutes');
const especialidadesRoutes = require('./src/routes/especialidadesRoutes');
const internacionesRoutes = require('./src/routes/internacionesRoutes');
const medicosRoutes = require('./src/routes/medicosRoutes');
const origenesRoutes = require('./src/routes/origenesRoutes');
const pacientesRoutes = require('./src/routes/pacientesRoutes');
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
app.use('/api/coberturas', coberturasRoutes);
app.use('/api/enfermeros', enfermerosRoutes);
app.use('/api/especialidades', especialidadesRoutes);
app.use('/api/diagnosticos', diagnosticosRoutes);
app.use('/api/internaciones', internacionesRoutes);
app.use('/api/medicos', medicosRoutes);
app.use('/api/origenes', origenesRoutes);
app.use('/api/pacientes', pacientesRoutes);
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

app.get('/medicos', (req, res) => {
  res.render('medicos');
});

app.get('/enfermeros', (req, res) => {
  res.render('enfermeros');
});

app.get('/internacion', (req, res) => {
  res.render('internacion');
});

//  Vista de listado de pacientes
app.get('/pacienteslistado', async (req, res) => {
  try {
    const pacientes = await obtenerPacientes();
    res.render('pacienteslistado', { pacientes });
  } catch (error) {
    console.error('Error al renderizar pacienteslistado:', error);
    res.status(500).send('Error al cargar la vista de pacientes');
  }
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
    console.error('No se pudo conectar a la base de datos.');
    console.error('Detalles:', err.message);
  });
