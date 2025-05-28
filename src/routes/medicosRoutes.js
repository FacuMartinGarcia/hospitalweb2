const express = require('express');
const router = express.Router();
const medicosController = require('../controllers/medicosController');


router.get('/:matricula', medicosController.buscarPorMatricula);
router.get('/:id', medicosController.buscarPorId);
router.post('/', medicosController.crearMedico);
router.get('/', medicosController.listarMedicos);
router.put('/:matricula', medicosController.actualizarMedico);
router.put('/:matricula/reactivar', medicosController.reactivarMedico); 
router.delete('/:matricula', medicosController.eliminarMedico);

module.exports = router;