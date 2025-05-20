const db = require('../models');
const { Habitacion } = db;

const habitacionController = {
  listar: async (req, res) => {
    try {
      const habitaciones = await Habitacion.findAll({
        attributes: ['idhabitacion', 'idala', 'idunidad', 'nombrehabitacion', 'capacidad'],
        order: [['nombrehabitacion', 'ASC']],
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
      });
      
      res.json(habitaciones);
    } catch (error) {
      console.error('Error al obtener habitaciones:', error);
      res.status(500).json({ 
        success: false,
        error: 'Error al obtener habitaciones: ' + error.message 
      });
    }
  },
  
  buscarPorId: async (req, res) => {
    try {
      const { id } = req.params;
      
      const habitacion = await Habitacion.findByPk(id, {
        attributes: ['idhabitacion', 'idala', 'idunidad', 'nombrehabitacion', 'capacidad'],
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
      });
      
      if (!habitacion) {
        return res.status(404).json({ 
          success: false,
          error: 'Habitación no encontrada' 
        });
      }
      
      res.json({
        success: true,
        habitacion
      });
    } catch (error) {
      console.error('Error al buscar habitación:', error);
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  }
};

module.exports = habitacionController;