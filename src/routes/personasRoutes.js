const express = require('express');
const router = express.Router();
const personasController = require('../controllers/personasController');


router.get('/:documento', personasController.buscarPorDocumento);

router.post('/asignar-rol', personasController.asignarRol);
router.post('/', personasController.crearPersona);

router.put('/actualizar', personasController.actualizarPersona);

router.delete('/eliminar-rol', personasController.eliminarRol);



module.exports = router;