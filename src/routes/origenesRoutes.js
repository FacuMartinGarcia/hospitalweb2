const express = require('express');
const router = express.Router();
const origenesController = require('../controllers/origenesController');

router.get('/', origenesController.listar);
router.get('/:id', origenesController.buscarPorId);
router.post('/', origenesController.crear);
router.put('/:id', origenesController.actualizar);
router.delete('/:id', origenesController.eliminar);

module.exports = router;