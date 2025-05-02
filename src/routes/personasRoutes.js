const express = require('express');
const router = express.Router();
const personasController = require('../controllers/personasController');

router.post('/', personasController.crearPersona);
router.get('/buscar/:documento', personasController.buscarPorDocumento);

module.exports = router;