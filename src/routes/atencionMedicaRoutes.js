const express = require('express');
const router = express.Router();
const atencionMedicaController = require('../controllers/atencionMedicaController');


//del apartado prescripcion de medicamentos
router.post('/medicamentos', atencionMedicaController.registrarMedicamento);
router.get('/medicamentos/:idinternacion', atencionMedicaController.listarMedicamentosPorInternacion);
router.delete('/medicamentos/:id', atencionMedicaController.eliminarMedicamento);



module.exports = router;
