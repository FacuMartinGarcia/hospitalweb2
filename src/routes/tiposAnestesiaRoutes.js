const express = require('express');
const router = express.Router();
const tipoAnestesiaController = require('../controllers/tipoanestesiaController');


router.get('/', tipoAnestesiaController.listar);

module.exports = router;