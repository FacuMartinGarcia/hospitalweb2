const express = require('express');
const router = express.Router();
const personasRolesController = require('../controllers/personasRolesController');

router.get('/', personasRolesController.listar);
router.get('/:id', personasRolesController.buscarPorId);

module.exports = router;
