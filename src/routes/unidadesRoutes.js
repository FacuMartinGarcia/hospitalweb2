const express = require('express');
const router = express.Router();
const unidadController = require('../controllers/infraUnidadesController');

router.get('/', unidadController.listar);

module.exports = router;