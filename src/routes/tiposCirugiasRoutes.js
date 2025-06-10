const express = require('express');
const router = express.Router();
const tiposCirugiasController = require('../controllers/tiposCirugiasController');

router.get('/', tiposCirugiasController.listar);

module.exports = router;
