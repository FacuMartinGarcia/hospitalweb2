const { leerJSON, guardarJSON } = require('../utils/dataUtils');

const pacientesController = {
  listar: async (req, res) => {
    try {
      const pacientes = await leerJSON('pacientesDetalles.json');
      res.json(pacientes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  buscarPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const pacientes = await leerJSON('pacientesDetalles.json');
      const paciente = pacientes.find(p => p.idPersona == id);
      if (!paciente) {
        return res.status(404).json({ error: 'Paciente no encontrado' });
      }
      res.json(paciente);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  crear: async (req, res) => {
    try {
      const nuevoPaciente = req.body;

      if (!nuevoPaciente || !nuevoPaciente.idPersona) {
        return res.status(400).json({ error: 'Faltan datos del paciente' });
      }

      const pacientes = await leerJSON('pacientesDetalles.json');
      const existe = pacientes.find(p => p.idPersona === nuevoPaciente.idPersona);

      if (existe) {
        return res.status(400).json({ error: 'El paciente ya existe' });
      }

      pacientes.push(nuevoPaciente);
      await guardarJSON('pacientesDetalles.json', pacientes);

      res.status(201).json(nuevoPaciente);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = pacientesController;
