const express = require('express');
const router = express.Router();
const medicamentosController = require('../controllers/medicamentosController');

router.get('/', medicamentosController.listar);              
//router.get('/api', medicamentosController.listarPaginado);   
router.get('/paginado', medicamentosController.listarPaginado);
router.get('/:id', medicamentosController.buscarPorId);

router.post('/', medicamentosController.crear);           
router.put('/:id', medicamentosController.actualizar);    
router.delete('/:id', medicamentosController.eliminar);   

module.exports = router;