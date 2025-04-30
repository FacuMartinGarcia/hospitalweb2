const { leerJSON, guardarJSON } = require('../utils/dataUtils');

const personasRolesController = {
  listar: async (req, res) => {
    try {
      const personasRoles = await leerJSON('personasRoles.json');
      res.json(personasRoles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  buscarPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const personasRoles = await leerJSON('personasRoles.json');
      const personaRol = personasRoles.find(m => m.idPersona == id);
      if (!personaRol) {
        return res.status(404).json({ error: 'Rol no encontrado' });
      }
      res.json(personaRol);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = personasRolesController;