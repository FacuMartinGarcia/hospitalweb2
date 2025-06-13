const express = require('express');
const router = express.Router();
const tiposAnestesiasController = require('../controllers/tiposAnestesiasController');


router.get('/', tiposAnestesiasController.listar);

module.exports = router;