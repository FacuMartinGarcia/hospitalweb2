const express = require('express');
const router = express.Router();
const infraestructuraController = require('../controllers/infraestructuraController');


// Rutas API que devuelven JSON
router.get('/habitaciones-compatibles', infraestructuraController.obtenerHabitacionesCompatibles);
router.get('/camas-paciente', infraestructuraController.listarCamasPorPacienteInternacion);

// Ruta que devuelve vista HTML
router.get('/camas-ocupadas', infraestructuraController.listarCamasOcupadasView);

module.exports = router;
