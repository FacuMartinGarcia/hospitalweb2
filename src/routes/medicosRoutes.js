const express = require('express');
const router = express.Router();
const medicosController = require('../controllers/medicosController');

router.get('/', medicosController.listar);
router.get('/:id', medicosController.buscarPorId);

module.exports = router;
