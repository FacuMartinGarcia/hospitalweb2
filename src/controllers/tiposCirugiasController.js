const db = require('../models');
const { TipoCirugia } = db;

const tiposCirugiasController = {
  listar: async (req, res) => {
    try {
      const cirugias = await TipoCirugia.findAll({
        attributes: ['idtipocirugia', 'denominacioncirugia'],
        order: [['denominacioncirugia', 'ASC']]
      });

      res.json(cirugias);
    } catch (error) {
      console.error('Error al obtener tipos de cirugias:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener tipos de cirugias: ' + error.message
      });
    }
  },

  buscarPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const cirugia = await TipoCirugia.findByPk(id, {
        attributes: ['idtipocirugia', 'denominacioncirugia']
      });

      if (!cirugia) {
        return res.status(404).json({
          success: false,
          error: 'Tipo de Cirugia no encontrada'
        });
      }

      res.json({
        success: true,
        estudio
      });
    } catch (error) {
      console.error('Error al buscar tipo de cirugia:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

module.exports = tiposCirugiasController;
