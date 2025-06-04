const express = require('express');
const router = express.Router();
const atencionMedicaController = require('../controllers/atencionMedicaController');

router.post('/medicamentos', atencionMedicaController.registrarMedicamento);
router.get('/medicamentos/:idinternacion', atencionMedicaController.listarMedicamentosPorInternacion);

module.exports = router;
