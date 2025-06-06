const express = require('express');
const router = express.Router();
const atencionMedicaController = require('../controllers/atencionMedicaController');

router.post('/medicamentos', atencionMedicaController.registrarMedicamento);
router.get('/medicamentos/:idinternacion', atencionMedicaController.listarMedicamentosPorInternacion);
router.delete('/medicamentos/:id', atencionMedicaController.eliminarMedicamento);
router.post('/estudios', atencionMedicaController.registrarEstudio);


module.exports = router;
