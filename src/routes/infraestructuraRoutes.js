const express = require('express');
const router = express.Router();
const infraestructuraController = require('../controllers/infraestructuraController');

router.get('/habitaciones-compatibles', infraestructuraController.obtenerHabitacionesCompatibles);

module.exports = router;