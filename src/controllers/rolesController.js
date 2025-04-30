const { leerJSON, guardarJSON } = require('../utils/dataUtils');

const rolesController = {
  listar: async (req, res) => {
    try {
      const roles = await leerJSON('roles.json');
      res.json(roles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  buscarPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const roles = await leerJSON('roles.json');
      const rol = roles.find(m => m.idRol == id);
      if (!rol) {
        return res.status(404).json({ error: 'Rol no encontrado' });
      }
      res.json(rol);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = rolesController;