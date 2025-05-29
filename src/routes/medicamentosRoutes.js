const express = require('express');
const router = express.Router();
const medicamentosController = require('../controllers/medicamentosController');

router.get('/', medicamentosController.listar);
router.get('/:id', medicamentosController.buscarPorId);

module.exports = router;
