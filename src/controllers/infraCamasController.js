const db = require('../models');
const { Cama } = db;

const camaController = {

  listar: async (req, res) => {
    try {
      const camas = await Cama.findAll({
        attributes: ['idcama', 'idhabitacion', 'numerocama'],
        order: [['numerocama', 'ASC']],
        include: [
          { 
            association: 'habitacion',
            attributes: ['nombrehabitacion'],
            include: [
              {
                association: 'ala',
                attributes: ['denominacion']
              },
              {
                association: 'unidad',
                attributes: ['denominacion']
              }
            ]
          }
        ]
      });
      
      res.json(camas);
    } catch (error) {
      console.error('Error al obtener camas:', error);
      res.status(500).json({ 
        success: false,
        error: 'Error al obtener camas: ' + error.message 
      });
    }
  },
  
  buscarPorId: async (req, res) => {
    try {
      const { id } = req.params;
      
      const cama = await Cama.findByPk(id, {
        attributes: ['idcama', 'idhabitacion', 'numerocama'],
        include: [
          { 
            association: 'habitacion',
            attributes: ['nombrehabitacion'],
            include: [
              {
                association: 'ala',
                attributes: ['denominacion']
              },
              {
                association: 'unidad',
                attributes: ['denominacion']
              }
            ]
          }
        ]
      });
      
      if (!cama) {
        return res.status(404).json({ 
          success: false,
          error: 'Cama no encontrada' 
        });
      }
      
      res.json({
        success: true,
        cama
      });
    } catch (error) {
      console.error('Error al buscar cama:', error);
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  }
};

module.exports = camaController;