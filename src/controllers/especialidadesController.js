const Especialidad = require('../models/Especialidad');

const especialidadController = {
  listar: async (req, res) => {
    try {

      const especialidades = await Especialidad.findAll({
        attributes: ['idespecialidad', 'denominacion'], 
        order: [['denominacion', 'ASC']] 
      });
      
      res.json(especialidades);
    } catch (error) {
      console.error('Error al obtener especialidades:', error);
      res.status(500).json({ 
        success: false,
        error: 'Error al obtener especialidades: ' + error.message 
      });
    }
  },
  
  buscarPorId: async (req, res) => {
    try {
      const { id } = req.params;
      
      const especialidad = await Especialidad.findByPk(id, {
        attributes: ['idespecialidad', 'denominacion'] 
      });
      
      if (!especialidad) {
        return res.status(404).json({ 
          success: false,
          error: 'Especialidad no encontrada' 
        });
      }
      
      res.json({
        success: true,
        especialidad
      });
    } catch (error) {
      console.error('Error al buscar especialidad:', error);
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
      
      const nuevaEspecialidad = await Especialidad.create({
        denominacion
      });
      
      res.status(201).json({
        success: true,
        especialidad: {
          idespecialidad: nuevaEspecialidad.idespecialidad,
          denominacion: nuevaEspecialidad.denominacion
        }
      });
    } catch (error) {
      console.error('Error al crear especialidad:', error);
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
      

      const especialidad = await Especialidad.findByPk(id);
      
      if (!especialidad) {
        return res.status(404).json({
          success: false,
          error: 'Especialidad no encontrada'
        });
      }
      
      if (!denominacion) {
        return res.status(400).json({
          success: false,
          error: 'La denominación es requerida'
        });
      }
      
      especialidad.denominacion = denominacion;
      await especialidad.save();
      
      res.json({
        success: true,
        especialidad: {
          idespecialidad: especialidad.idespecialidad,
          denominacion: especialidad.denominacion
        }
      });
    } catch (error) {
      console.error('Error al actualizar especialidad:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  eliminar: async (req, res) => {
    try {
      const { id } = req.params;
      
      const especialidad = await Especialidad.findByPk(id);
      
      if (!especialidad) {
        return res.status(404).json({
          success: false,
          error: 'Especialidad no encontrada'
        });
      }
      
      await especialidad.destroy();
      
      res.json({
        success: true,
        message: 'Especialidad eliminada correctamente'
      });
    } catch (error) {
      console.error('Error al eliminar especialidad:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

module.exports = especialidadController;
