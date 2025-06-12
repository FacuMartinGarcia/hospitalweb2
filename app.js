//require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const sequelize = require('./config/db');
const { obtenerPacientes } = require('./src/controllers/pacientesController');

// Importar rutas
const atencionMedicaRoutes = require('./src/routes/atencionMedicaRoutes');
const coberturasRoutes = require('./src/routes/coberturasRoutes');
const diagnosticosRoutes = require('./src/routes/diagnosticosRoutes');
const enfermerosRoutes = require('./src/routes/enfermerosRoutes');
const especialidadesRoutes = require('./src/routes/especialidadesRoutes');
const estudiosRoutes = require('./src/routes/estudiosRoutes');
const infraestructuraRoutes = require('./src/routes/infraestructuraRoutes');
const internacionesRoutes = require('./src/routes/internacionesRoutes');
const medicosRoutes = require('./src/routes/medicosRoutes');
const medicamentosRoutes = require('./src/routes/medicamentosRoutes');
const origenesRoutes = require('./src/routes/origenesRoutes');
const pacientesRoutes = require('./src/routes/pacientesRoutes');
const tiposAnestesiasRoutes = require ('./src/routes/tiposAnestesiasRoutes');
const tiposCirugiasRoutes = require('./src/routes/tiposCirugiasRoutes');
const tiposTerapiasRoutes = require('./src/routes/tiposTerapiasRoutes');
const unidadesRoutes = require('./src/routes/unidadesRoutes');
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
app.use('/api/atencionmedica', atencionMedicaRoutes);
app.use('/api/coberturas', coberturasRoutes);
app.use('/api/enfermeros', enfermerosRoutes);
app.use('/api/especialidades', especialidadesRoutes);
app.use('/api/estudios', estudiosRoutes);
app.use('/api/diagnosticos', diagnosticosRoutes);
app.use('/api/infraestructura', infraestructuraRoutes);
app.use('/api/internaciones', internacionesRoutes);
app.use('/api/medicos', medicosRoutes);
app.use('/api/medicamentos', medicamentosRoutes);
app.use('/api/origenes', origenesRoutes);
app.use('/api/pacientes', pacientesRoutes);
app.use('/api/tiposanestesias', tiposAnestesiasRoutes)
app.use('/api/tiposcirugias', tiposCirugiasRoutes);
app.use('/api/tiposterapias', tiposTerapiasRoutes);
app.use('/api/unidades', unidadesRoutes);
app.use('/api/usuarios', usuariosRoutes);

// Vista HTML desde infraestructura
app.use('/infraestructura', infraestructuraRoutes);


// Rutas de login
app.use('/login', loginRoutes);

// Configuración de vistas
app.set('view engine', 'pug');
app.set('views', './views');

// Rutas para vistas
app.get('/', (req, res) => {
  res.render('layout');
  //res.render('index');
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

app.get('/atencionmedica', (req, res) => {
  res.render('atencionmedica');
});

app.get('/atencionenfermeria', (req, res) => {
  res.render('atencionenfermeria');
});
app.get('/listarcamasocupadas', (req, res) => {
  res.render('listarcamasocupadas');   
})

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
/*
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
*/
  
sequelize.sync()
.then(() => {
  console.log('Base de datos sincronizada correctamente');

  // Solo iniciar el servidor si no se está usando como módulo
  if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  }
})
.catch((err) => {
  console.error('No se pudo conectar a la base de datos.');
  console.error('Detalles:', err.message);
});

module.exports = app; // Exportar para Vercel

