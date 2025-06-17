const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');


router.get('/verificar-alias', usuariosController.verificarAlias);
router.get('/', usuariosController.listar);
router.get('/:id', usuariosController.buscarPorId);
router.post('/', usuariosController.crear);
router.put('/:id', usuariosController.actualizar);
router.delete('/:id', usuariosController.eliminar);




module.exports = router;
