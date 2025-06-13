const express = require('express');
const router = express.Router();
const rolesController = require('../controllers/rolesController');


router.get('/', rolesController.listar);
router.get('/:id', rolesController.buscarPorId);

module.exports = router;
