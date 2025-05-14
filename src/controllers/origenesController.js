const Origen = require('../models/origen');

const origenesController = {
  listar: async (req, res) => {
    try {
      const origenes = await Origen.findAll({
        attributes: ['idorigen', 'denominacion'],
        order: [['denominacion', 'ASC']]
      });
      
      res.json({
        success: true,
        origenes
      });
    } catch (error) {
      console.error('Error al obtener orígenes:', error);
      res.status(500).json({ 
        success: false,
        error: 'Error al obtener orígenes: ' + error.message 
      });
    }
  },
  
  buscarPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const origen = await Origen.findByPk(id, {
        attributes: ['idorigen', 'denominacion']
      });
      
      if (!origen) {
        return res.status(404).json({ 
          success: false,
          error: 'Origen no encontrado' 
        });
      }
      
      res.json({
        success: true,
        origen
      });
    } catch (error) {
      console.error('Error al buscar origen:', error);
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  },

  crear: async (req, res) => {
    try {
      const { denominacion } = req.body;
      
      if (!denominacion) {
        return res.status(400).json({
          success: false,
          error: 'La denominación es requerida'
        });
      }
      
      const nuevoOrigen = await Origen.create({ denominacion });
      
      res.status(201).json({
        success: true,
        origen: {
          idorigen: nuevoOrigen.idorigen,
          denominacion: nuevoOrigen.denominacion
        }
      });
    } catch (error) {
      console.error('Error al crear origen:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  actualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const { denominacion } = req.body;
      
      const origen = await Origen.findByPk(id);
      
      if (!origen) {
        return res.status(404).json({
          success: false,
          error: 'Origen no encontrado'
        });
      }
      
      if (!denominacion) {
        return res.status(400).json({
          success: false,
          error: 'La denominación es requerida'
        });
      }
      
      origen.denominacion = denominacion;
      await origen.save();
      
      res.json({
        success: true,
        origen: {
          idorigen: origen.idorigen,
          denominacion: origen.denominacion
        }
      });
    } catch (error) {
      console.error('Error al actualizar origen:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  eliminar: async (req, res) => {
    try {
      const { id } = req.params;
      
      const origen = await Origen.findByPk(id);
      
      if (!origen) {
        return res.status(404).json({
          success: false,
          error: 'Origen no encontrado'
        });
      }
      
      await origen.destroy();
      
      res.json({
        success: true,
        message: 'Origen eliminado correctamente'
      });
    } catch (error) {
      console.error('Error al eliminar origen:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

module.exports = origenesController;