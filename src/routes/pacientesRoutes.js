const express = require('express');
const router = express.Router();
const pacientesController = require('../controllers/pacientesController');


router.get('/pacienteslistado', async (req, res) => {
  const pacientes = await obtenerPacientes();
  res.render('pacienteslistado', { pacientes });
});

router.get('/', pacientesController.listarPacientes);
router.get('/:documento', pacientesController.buscarPorDocumento);
router.post('/', pacientesController.crearPaciente);
router.put('/:documento', pacientesController.actualizarPaciente);
router.delete('/:documento', pacientesController.eliminarPaciente);
router.post('/:documento/reactivar', pacientesController.reactivarPaciente);



module.exports = router;
