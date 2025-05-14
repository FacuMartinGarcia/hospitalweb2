const express = require('express');
const router = express.Router();
const medicosController = require('../controllers/medicosController');

router.post('/:id/reactivar', medicosController.reactivar); 
router.post('/', medicosController.crear);
router.get('/:id', medicosController.buscarPorId);
router.get('/', medicosController.listar);
router.put('/:id', medicosController.actualizar);
router.delete('/:id', medicosController.eliminar);

module.exports = router;