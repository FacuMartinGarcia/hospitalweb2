const db = require('../models');
const { TipoAnestesia } = db;

const tiposAnestesiaController = {
  listar: async (req, res) => {
    console.log('estoy aqui');
    try {
      const anestesias = await TipoAnestesia.findAll({
        attributes: ['idtipoanestesia', 'denominacionanestesia'],
        order: [['denominacionanestesia', 'ASC']]
      });

      res.json(anestesias);
      
    } catch (error) {
      console.error('Error al obtener tipos de anestesia:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener tipos de anestesia: ' + error.message
      });
    }
  },

  buscarPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const anestesia = await TipoAnestesia.findByPk(id, {
        attributes: ['idtipoanestesia', 'denominacionanestesia']
      });

      if (!anestesia) {
        return res.status(404).json({
          success: false,
          error: 'Tipo de anestesia no encontrado'
        });
      }

      res.json({
        success: true,
        data: anestesia
      });
    } catch (error) {
      console.error('Error al buscar tipo de anestesia:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

module.exports = tiposAnestesiaController;