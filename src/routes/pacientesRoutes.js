const express = require('express');
const router = express.Router();
const pacientesController = require('../controllers/pacientesController');

router.get('/', pacientesController.listar);
router.get('/:id', pacientesController.buscarPorId);
router.post('/', pacientesController.crear);

module.exports = router;
