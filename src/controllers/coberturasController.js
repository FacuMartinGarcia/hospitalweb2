const Cobertura = require('../models/Cobertura');

const coberturasController = {
  listar: async (req, res) => {
    try {
      const coberturas = await Cobertura.findAll({
        attributes: ['idcobertura', 'denominacion'],
        order: [['denominacion', 'ASC']]
      });
      
      res.json(coberturas);
    } catch (error) {
      console.error('Error al obtener coberturas:', error);
      res.status(500).json({ 
        success: false,
        error: 'Error al obtener coberturas: ' + error.message 
      });
    }
  },
  
  buscarPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const cobertura = await Cobertura.findByPk(id, {
        attributes: ['idcobertura', 'denominacion']
      });
      
      if (!cobertura) {
        return res.status(404).json({ 
          success: false,
          error: 'Cobertura no encontrada' 
        });
      }
      
      res.json({
        success: true,
        cobertura
      });
    } catch (error) {
      console.error('Error al buscar cobertura:', error);
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
      
      const nuevaCobertura = await Cobertura.create({ denominacion });
      
      res.status(201).json({
        success: true,
        cobertura: {
          idcobertura: nuevaCobertura.idcobertura,
          denominacion: nuevaCobertura.denominacion
        }
      });
    } catch (error) {
      console.error('Error al crear cobertura:', error);
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
      
      const cobertura = await Cobertura.findByPk(id);
      
      if (!cobertura) {
        return res.status(404).json({
          success: false,
          error: 'Cobertura no encontrada'
        });
      }
      
      if (!denominacion) {
        return res.status(400).json({
          success: false,
          error: 'La denominación es requerida'
        });
      }
      
      cobertura.denominacion = denominacion;
      await cobertura.save();
      
      res.json({
        success: true,
        cobertura: {
          idcobertura: cobertura.idcobertura,
          denominacion: cobertura.denominacion
        }
      });
    } catch (error) {
      console.error('Error al actualizar cobertura:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  eliminar: async (req, res) => {
    try {
      const { id } = req.params;
      
      const cobertura = await Cobertura.findByPk(id);
      
      if (!cobertura) {
        return res.status(404).json({
          success: false,
          error: 'Cobertura no encontrada'
        });
      }
      
      await cobertura.destroy();
      
      res.json({
        success: true,
        message: 'Cobertura eliminada correctamente'
      });
    } catch (error) {
      console.error('Error al eliminar cobertura:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

module.exports = coberturasController;