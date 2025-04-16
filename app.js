// 1. Instalación de Express
const express = require('express');
const fs = require('fs');
const app = express();


app.use(express.static('public'));  
app.use(express.urlencoded({ extended: true })); // Para poder recibir datos de formularios 
app.use(express.json()); // Para poder recibir datos en formato JSON

app.get('/', function (req, res) {
    res.send('Hola mundo desde Express');
})

// Ruta con parámetro
app.get('/persona/:name', (req, res) => {
    res.send(`<h2>Hola ${req.params.name}</h2>`);
});
//Productos 
app.get('/productos', (req, res) => {
    res.sendFile(__dirname + '/productos.html');
});

const path = 'productos.json';
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









// Ruta con query string
app.get('/index', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
// Ruta con query string

//enrutamiento
app.get('/pacientes', function (req, res) {
    res.send('Hola pacientes desde Express');
})
/*
app.get('/', function (req, res) {
    res.send('Hola mundo');
});/*/



app.listen(3000, function () {
    console.log('App de ejemplo escuchando en puerto 3000!');
});
