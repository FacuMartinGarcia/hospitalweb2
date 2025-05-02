const express = require('express');
const router = express.Router();
const pacientesController = require('../controllers/pacientesController');

router.get('/:documento', pacientesController.buscarPorDocumento);
router.post('/', pacientesController.crearPaciente);

module.exports = router;
