const express = require('express');
const router = express.Router();
const tiposTerapiasController = require('../controllers/tiposTerapiasController');


router.get('/', tiposTerapiasController.listar);

module.exports = router;