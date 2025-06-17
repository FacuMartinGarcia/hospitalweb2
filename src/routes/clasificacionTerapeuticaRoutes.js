const express = require('express');
const router = express.Router();
const clasificacionTerapeuticaController = require('../controllers/clasificacionTerapeuticaController');

router.get('/', clasificacionTerapeuticaController.listar);
router.get('/:id', clasificacionTerapeuticaController.buscarPorId);
router.post('/', clasificacionTerapeuticaController.crear);
router.put('/:id', clasificacionTerapeuticaController.actualizar);
router.delete('/:id', clasificacionTerapeuticaController.eliminar);

module.exports = router;
