const Paciente = require('../models/Paciente');

const pacientesController = {
  buscarPorDocumento: async (req, res) => {
    try {
      const documento = parseInt(req.params.documento);
      const paciente = await Paciente.findOne({ where: { documento } });

      if (!paciente) {
        return res.status(404).json({ success: false, error: 'Paciente no encontrado' });
      }

      return res.status(200).json({ success: true, paciente });

    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
  }
};
module.exports = pacientesController;