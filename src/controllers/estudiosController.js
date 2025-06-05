const db = require('../models');
const { Estudio } = db;

const estudiosController = {
  listar: async (req, res) => {
    try {
      const estudios = await Estudio.findAll({
        attributes: ['idestudio', 'denominacion'],
        order: [['denominacion', 'ASC']]
      });

      res.json(estudios);
    } catch (error) {
      console.error('Error al obtener estudios:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener estudios: ' + error.message
      });
    }
  },

  buscarPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const estudio = await Estudio.findByPk(id, {
        attributes: ['idestudio', 'denominacion']
      });

      if (!estudio) {
        return res.status(404).json({
          success: false,
          error: 'Estudio no encontrado'
        });
      }

      res.json({
        success: true,
        estudio
      });
    } catch (error) {
      console.error('Error al buscar estudio:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

module.exports = estudiosController;
