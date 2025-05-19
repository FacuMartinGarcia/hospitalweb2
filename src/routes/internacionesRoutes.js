const express = require('express');
const router = express.Router();
const internacionesController = require('../controllers/internacionesController');

router.get('/paciente/:idpaciente/activas', internacionesController.existeInternacionActiva);
router.get('/paciente/:idpaciente', internacionesController.obtenerPorPaciente);
router.post('/', internacionesController.crear);
router.get('/:id', internacionesController.buscarPorId);
router.put('/:id', internacionesController.actualizar);
router.delete('/:id', internacionesController.cancelarAdmision);

module.exports = router;
 