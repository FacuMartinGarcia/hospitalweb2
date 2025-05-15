const express = require('express');
const router = express.Router();
const diagnosticosController = require('../controllers/diagnosticosController');    

router.get('/', diagnosticosController.listar);

module.exports = router;    
