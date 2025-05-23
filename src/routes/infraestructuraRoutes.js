const express = require('express');
const router = express.Router();
const infraestructuraController = require('../controllers/infraestructuraController');

router.get('/habitaciones-compatibles', infraestructuraController.obtenerHabitacionesCompatibles);
router.get('/camas-paciente/', infraestructuraController.listarCamasPorPacienteInternacion);
router.get('/camas-ocupadas', infraestructuraController.listarCamasOcupadasView);

module.exports = router;