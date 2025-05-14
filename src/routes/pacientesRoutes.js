const express = require('express');
const router = express.Router();
const pacientesController = require('../controllers/pacientesController');


router.get('/pacienteslistado', async (req, res) => {
  console.log("Ruta /pacienteslistado llamada");  // Verificar si la ruta se alcanza
  try {
    const pacientes = await obtenerPacientes();
    console.log("Pacientes obtenidos:", pacientes);
    res.render('pacienteslistado', { pacientes });
  } catch (error) {
    console.error('Error al obtener pacientes:', error);
    res.status(500).send('Error al obtener pacientes');
  }
});

router.get('/', pacientesController.listarPacientes);
router.get('/:documento', pacientesController.buscarPorDocumento);
router.post('/', pacientesController.crearPaciente);
router.put('/:documento', pacientesController.actualizarPaciente);
router.delete('/:documento', pacientesController.eliminarPaciente);
router.post('/:documento/reactivar', pacientesController.reactivarPaciente);



module.exports = router;
