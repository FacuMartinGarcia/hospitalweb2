const express = require('express');
const router = express.Router();
const tiposAnestesiaController = require('../controllers/tiposAnestesiaController');


router.get('/', tiposAnestesiaController.listar);

module.exports = router;