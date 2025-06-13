const db = require('../models');
const { Rol } = db;

const rolesController = {

  listar: async (req, res) => {
    try {
      const roles = await Rol.findAll({
        attributes: ['idrol', 'nombre', 'descripcion'],
        order: [['nombre', 'ASC']]
      });

      res.json(roles);
    } catch (error) {
      console.error('Error al obtener roles:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Error al obtener roles: ' + error.message 
      });
    }
  },

  buscarPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const rol = await Rol.findByPk(id, {
        attributes: ['idrol', 'nombre', 'descripcion']
      });

      if (!rol) {
        return res.status(404).json({
          success: false,
          error: 'Rol no encontrado'
        });
      }

      res.json({ success: true, rol });
    } catch (error) {
      console.error('Error al buscar rol:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = rolesController;
