const express = require('express');
const router = express.Router();
const medicosController = require('../controllers/medicosController');


router.get('/:matricula', medicosController.buscarPorMatricula);
router.get('/:id', medicosController.buscarPorId);
router.post('/:id/reactivar', medicosController.reactivar); 
router.post('/', medicosController.crearMedico);
router.get('/', medicosController.listarMedicos);
router.put('/:matricula', medicosController.actualizarMedico);
router.delete('/:id', medicosController.eliminar);

module.exports = router;