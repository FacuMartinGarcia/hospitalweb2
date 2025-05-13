const express = require('express');
const router = express.Router();
const especialidadesController = require('../controllers/especialidadesController');

router.get('/', especialidadesController.listar);
router.get('/:id', especialidadesController.buscarPorId);
router.post('/', especialidadesController.crear);
router.put('/:id', especialidadesController.actualizar);
router.delete('/:id', especialidadesController.eliminar);

module.exports = router;
