const express = require('express');
const path = require('path');
const app = express();

const personasRouter = require('./src/routes/personasRoutes');
const rolesRouter = require('./src/routes/rolesRoutes');
const personasRolesRouter = require('./src/routes/personasRolesRoutes');

const pacientesRouter = require('./src/routes/pacientesRoutes');
const coberturasRouter = require('./src/routes/coberturasRoutes');

const medicosRouter = require('./src/routes/medicosRoutes');
const especialidadesRouter = require('./src/routes/especialidadesRoutes');

const enfermerosRouter = require('./src/routes/enfermerosRoutes');
const turnosRouter = require('./src/routes/turnosRoutes');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/api/personas', personasRouter);
app.use('/api/personas', (req, res, next) => {
  console.log("¡Ruta /api/personas activada!");
  next();
}, personasRouter);
app.use('/api/roles', rolesRouter);
app.use('/api/personasRoles', personasRolesRouter);

app.use('/api/pacientes', pacientesRouter);
app.use('/api/coberturas', coberturasRouter);

app.use('/api/medicos', medicosRouter);
app.use('/api/especialidades', especialidadesRouter);

app.use('/api/enfermeros', enfermerosRouter);
app.use('/api/turnos', turnosRouter);




app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/html/index.html'));
});

app.get('/persona', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/html/persona.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});