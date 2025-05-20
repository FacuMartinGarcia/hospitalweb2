const db = require('../models');
const { Ala } = db;

const alaController = {
  listar: async (req, res) => {
    try {
      const alas = await Ala.findAll({
        attributes: ['idala', 'denominacion'],
        order: [['denominacion', 'ASC']]
      });
      
      res.json(alas);
    } catch (error) {
      console.error('Error al obtener alas:', error);
      res.status(500).json({ 
        success: false,
        error: 'Error al obtener alas: ' + error.message 
      });
    }
  },
  
  buscarPorId: async (req, res) => {
    try {
      const { id } = req.params;
      
      const ala = await Ala.findByPk(id, {
        attributes: ['idala', 'denominacion']
      });
      
      if (!ala) {
        return res.status(404).json({ 
          success: false,
          error: 'Ala no encontrada' 
        });
      }
      
      res.json({
        success: true,
        ala
      });
    } catch (error) {
      console.error('Error al buscar ala:', error);
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  }
};

module.exports = alaController;