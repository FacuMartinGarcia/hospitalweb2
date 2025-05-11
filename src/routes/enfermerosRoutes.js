const express = require('express');
const router = express.Router();
const enfermerosController = require('../controllers/enfermerosController');

router.get('/:matricula', enfermerosController.buscarPorMatricula);
router.post('/', enfermerosController.crearEnfermero);
router.get('/', enfermerosController.listarEnfermeros);
router.put('/:matricula', enfermerosController.actualizarEnfermero);
router.delete('/:matricula', enfermerosController.eliminarEnfermero);
router.post('/reactivar/:matricula', enfermerosController.reactivarEnfermero);

module.exports = router;
