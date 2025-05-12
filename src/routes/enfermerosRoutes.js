const express = require('express');
const router = express.Router();
const enfermerosController = require('../controllers/enfermerosController');

router.put('/:matricula/reactivar', enfermerosController.reactivarEnfermero);
router.get('/:matricula', enfermerosController.buscarPorMatricula);
router.post('/', enfermerosController.crearEnfermero);
router.get('/', enfermerosController.listarEnfermeros);
router.put('/:matricula', enfermerosController.actualizarEnfermero);
router.delete('/:matricula', enfermerosController.eliminarEnfermero);


module.exports = router;
