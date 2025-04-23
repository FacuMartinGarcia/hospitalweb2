const express = require('express');
const path = require('path');
const app = express();
const personasRouter = require('./src/routes/personasRoute');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/personas', personasRouter);


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