const { leerJSON, guardarJSON } = require('../utils/dataUtils');

const medicosController = {
  listar: async (req, res) => {
    try {
      const medicos = await leerJSON('medicosDetalles.json');
      res.json(medicos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  buscarPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const medicos = await leerJSON('medicosDetalles.json');
      const medico = medicos.find(m => m.idPersona == id);
      if (!medico) {
        return res.status(404).json({ error: 'Médico no encontrado' });
      }
      res.json(medico);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = medicosController;
