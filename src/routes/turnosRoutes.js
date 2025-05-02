const express = require('express');
const router = express.Router();
const turnosController = require('../controllers/turnosController');

router.get('/', turnosController.listar);

module.exports = router;
