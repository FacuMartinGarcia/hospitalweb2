const db = require('../models');
const { TipoTerapia } = db;

const tiposTerapiasController = {
  listar: async (req, res) => {
    try {
      const terapias = await TipoTerapia.findAll({
        attributes: ['idtipoterapia', 'denominacionterapia'],
        order: [['denominacionterapia', 'ASC']]
      });

      res.json(terapias);
      
    } catch (error) {
      console.error('Error al obtener tipos de terapias:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener tipos de terapias: ' + error.message
      });
    }
  },

  buscarPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const terapia = await TipoTerapia.findByPk(id, {
        attributes: ['idtipoterapia', 'denominacionterapia']
      });

      if (!terapia) {
        return res.status(404).json({
          success: false,
          error: 'Tipo de terapia no encontrado'
        });
      }

      res.json({
        success: true,
        data: terapia
      });
    } catch (error) {
      console.error('Error al buscar tipo de terapia:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

module.exports = tiposTerapiasController;