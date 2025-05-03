const express = require('express');
const router = express.Router();
const pacientesController = require('../controllers/pacientesController');

router.get('/:documento', pacientesController.buscarPorDocumento);
router.post('/crear', pacientesController.crearPaciente); 
router.post('/', pacientesController.guardarPaciente); 
router.put('/:documento', pacientesController.actualizarPaciente);

module.exports = router;
