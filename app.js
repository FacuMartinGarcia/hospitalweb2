const express = require('express');
const path = require('path');
const app = express();

// Middlewares
app.use(express.static(path.join(__dirname, 'public'))); // Sirve archivos estáticos
app.use(express.urlencoded({ extended: true })); // Para formularios
app.use(express.json()); // Para JSON

// API Routes
const personasRouter = require('./routes/personasRoutes');
app.use('/api/personas', personasRouter);

/*
// Rutas estaticas para los HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/personas', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'personas.html'));
});


*/
app.listen(3000, function () {
    console.log('App de ejemplo escuchando en puerto 3000!');
});

/*
app.post('/productos', (req, res) => {
    console.log(req.body);
    const { nombre, cantidad, precio } = req.body;
    //const nuevoProducto = { nombre, cantidad, precio };
    fs.writeFile('productos.json', JSON.stringify({nombre,cantidad,precio}), (err) => {
        if (err) {
            console.error('Error al guardar el archivo:', err);
            return res.status(500).send('Error al guardar el archivo.');
        }

        console.log('El archivo ha sido guardado!');
        res.status(201).send('Producto guardado correctamente.');
    });
});
*/

/*
app.post('/productos', (req, res) => {
    const { nombre, cantidad, precio } = req.body;
    const nuevoProducto = { nombre, cantidad, precio };

    // Leer productos actuales
    fs.readFile(path, 'utf8', (err, data) => {
        let productos = [];

        if (!err && data) {
            try {
                productos = JSON.parse(data);
            } catch (e) {
                console.error('Error al parsear JSON:', e);
            }
        }

        productos.push(nuevoProducto); // Agregar nuevo producto

        fs.writeFile(path, JSON.stringify(productos, null, 2), (err) => {
            if (err) {
                console.error('Error al guardar:', err);
                return res.status(500).send('Error al guardar el producto');
            }

            console.log('Producto guardado');
            res.status(201).send('Producto guardado correctamente');
        });

    });
});
// Ruta con parámetro
app.get('/persona/:name', (req, res) => {
    res.send(`<h2>Hola ${req.params.name}</h2>`);
});
//Productos 
app.get('/productos', (req, res) => {
    res.sendFile(__dirname + '/productos.html');
});

const path = 'productos.json';
*/
