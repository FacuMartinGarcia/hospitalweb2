const express = require('express');
const router = express.Router();
const pacientesController = require('../controllers/pacientesController');

router.get('/', pacientesController.listarPacientes);
router.get('/:documento', pacientesController.buscarPorDocumento);
router.post('/', pacientesController.crearPaciente);
router.put('/:documento', pacientesController.actualizarPaciente);
router.delete('/:documento', pacientesController.eliminarPaciente);
router.post('/:documento/reactivar', pacientesController.reactivarPaciente);

module.exports = router;
