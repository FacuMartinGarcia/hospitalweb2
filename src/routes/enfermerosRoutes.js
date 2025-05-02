const express = require('express');
const router = express.Router();
const enfermerosController = require('../controllers/enfermerosController');

router.get('/', enfermerosController.listar);

module.exports = router;
