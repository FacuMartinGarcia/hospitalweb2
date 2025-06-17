const db = require('../models');
const { ClasificacionTerapeutica } = db;

const clasificacionTerapeuticaController = {
  listar: async (req, res) => {
    console.log('Ruta GET /api/clasificaciones activada');
    try {
      const clasificaciones = await ClasificacionTerapeutica.findAll({
        order: [['denominacion', 'ASC']]
      });
      res.json(clasificaciones);
    } catch (error) {
      console.error('Error al listar clasificaciones:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  buscarPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const clasificacion = await ClasificacionTerapeutica.findByPk(id);
      if (!clasificacion) {
        return res.status(404).json({ success: false, error: 'Clasificación no encontrada' });
      }
      res.json(clasificacion);
    } catch (error) {
      console.error('Error al buscar clasificación:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  crear: async (req, res) => {
    try {
      const { denominacion } = req.body;
      if (!denominacion) {
        return res.status(400).json({ success: false, error: 'Denominación es requerida' });
      }
      const existe = await ClasificacionTerapeutica.findOne({ where: { denominacion } });
      if (existe) {
        return res.status(400).json({ success: false, error: 'Denominación ya existe' });
      }
      const nuevaClasificacion = await ClasificacionTerapeutica.create({ denominacion });
      res.status(201).json({ success: true, clasificacion: nuevaClasificacion });
    } catch (error) {
      console.error('Error al crear clasificación:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  actualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const { denominacion } = req.body;

      const clasificacion = await ClasificacionTerapeutica.findByPk(id);
      if (!clasificacion) {
        return res.status(404).json({ success: false, error: 'Clasificación no encontrada' });
      }

      if (!denominacion) {
        return res.status(400).json({ success: false, error: 'Denominación es requerida' });
      }

      const existe = await ClasificacionTerapeutica.findOne({
        where: { denominacion, idclasificacionterapeutica: { [db.Sequelize.Op.ne]: id } }
      });

      if (existe) {
        return res.status(400).json({ success: false, error: 'Denominación ya existe' });
      }

      clasificacion.denominacion = denominacion;
      await clasificacion.save();

      res.json({ success: true, clasificacion });
    } catch (error) {
      console.error('Error al actualizar clasificación:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  eliminar: async (req, res) => {
    try {
      const { id } = req.params;
      const clasificacion = await ClasificacionTerapeutica.findByPk(id);
      if (!clasificacion) {
        return res.status(404).json({ success: false, error: 'Clasificación no encontrada' });
      }

      const medicamentosAsociados = await clasificacion.countMedicamentos();
      if (medicamentosAsociados > 0) {
        return res.status(400).json({ success: false, error: 'No se puede eliminar, tiene medicamentos asociados' });
      }

      await clasificacion.destroy();
      res.json({ success: true, message: 'Clasificación eliminada correctamente' });
    } catch (error) {
      console.error('Error al eliminar clasificación:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = clasificacionTerapeuticaController;
