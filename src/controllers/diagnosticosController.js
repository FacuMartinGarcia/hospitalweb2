const db = require('../models');
const { Diagnostico } = db;

const diagnosticosController = {
  listar: async (req, res) => {
    try {
      const diagnosticos = await Diagnostico.findAll({
        attributes: ['iddiagnostico', 'codigo', 'descripcion'],
        order: [['descripcion', 'ASC']]
      });

      res.json(diagnosticos);
    } catch (error) {
      console.error('Error al obtener diagnósticos:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener diagnósticos: ' + error.message
      });
    }
  },

  buscarPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const diagnostico = await Diagnostico.findByPk(id, {
        attributes: ['iddiagnostico', 'codigo', 'descripcion', 'categoria', 'categoriamayor']
      });

      if (!diagnostico) {
        return res.status(404).json({
          success: false,
          error: 'Diagnóstico no encontrado'
        });
      }

      res.json({
        success: true,
        diagnostico
      });
    } catch (error) {
      console.error('Error al buscar diagnóstico:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

module.exports = diagnosticosController;
