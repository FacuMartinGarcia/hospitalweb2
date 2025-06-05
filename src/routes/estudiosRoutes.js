const express = require('express');
const router = express.Router();
const estudiosController = require('../controllers/estudiosController');

router.get('/', estudiosController.listar);
router.get('/:id', estudiosController.buscarPorId);

module.exports = router;
