const express = require('express');
const path = require('path');
const app = express();
const personasRouter = require('./src/routes/personasRoutes');

const pacientesRouter = require('./src/routes/pacientesRoutes');
const coberturasRouter = require('./src/routes/coberturasRoutes');

const medicosRouter = require('./src/routes/medicosRoutes');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/personas', personasRouter);

app.use('/api/pacientes', pacientesRouter);
app.use('/api/coberturas', coberturasRouter);

app.use('/api/medicos', medicosRouter);




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