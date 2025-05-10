const express = require('express');
const router = express.Router();
const enfermeroController = require('../controllers/enfermeroController');

router.get('/:matricula', enfermeroController.buscarPorMatricula);
router.post('/', enfermeroController.crearEnfermero);
router.get('/', enfermeroController.listarEnfermeros);
router.put('/:matricula', enfermeroController.actualizarEnfermero);
router.delete('/:matricula', enfermeroController.eliminarEnfermero);
router.post('/reactivar/:matricula', enfermeroController.reactivarEnfermero);

module.exports = router;
