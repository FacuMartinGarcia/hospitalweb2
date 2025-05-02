const { leerJSON, guardarJSON } = require('../utils/dataUtils');

const enfermerosController = {
  listar: async (req, res) => {
    try {
      const enfermeros = await leerJSON('enfermerosDetalles.json');
      res.json(enfermeros);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  buscarPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const enfermeros = await leerJSON('enfermerosDetalles.json');
      const enfermero = enfermeros.find(m => m.idPersona == id);
      if (!enfermero) {
        return res.status(404).json({ error: 'Médico no encontrado' });
      }
      res.json(enfermero);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = enfermerosController;
