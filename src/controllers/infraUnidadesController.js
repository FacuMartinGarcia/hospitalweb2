const db = require('../models');
const { Unidad } = db;

const unidadController = {
  listar: async (req, res) => {
    try {
      const unidades = await Unidad.findAll({
        attributes: ['idunidad', 'denominacion'],
        order: [['denominacion', 'ASC']]
      });

      res.json({
        success: true,
        unidades: unidades
      });
      
    } catch (error) {
      console.error('Error al obtener unidades:', error);
      res.status(500).json({ 
        success: false,
        error: 'Error al obtener unidades: ' + error.message 
      });
    }
  },
  
  
  buscarPorId: async (req, res) => {
    try {
      const { id } = req.params;
      
      const unidad = await Unidad.findByPk(id, {
        attributes: ['idunidad', 'denominacion']
      });
      
      if (!unidad) {
        return res.status(404).json({ 
          success: false,
          error: 'Unidad no encontrada' 
        });
      }
      
      res.json({
        success: true,
        unidad
      });
    } catch (error) {
      console.error('Error al buscar unidad:', error);
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  }
};

module.exports = unidadController;