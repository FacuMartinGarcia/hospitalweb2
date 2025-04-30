const express = require('express');
const router = express.Router();
const coberturasController = require('../controllers/coberturasController');

router.get('/', coberturasController.listar);

module.exports = router;
