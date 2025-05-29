const db = require('../models');
const { Medicamento, ClasificacionTerapeutica } = db;

const medicamentosController = {
  listar: async (req, res) => {
    try {
      const medicamentos = await Medicamento.findAll({
        attributes: ['idmedicamento', 'nombremedicamento', 'presentacion', 'idclasificacionterapeutica'],
        include: {
          model: ClasificacionTerapeutica,
          as: 'clasificacionTerapeutica',
          attributes: ['idclasificacionterapeutica', 'denominacion']
        },
        order: [['nombremedicamento', 'ASC']]
      });

      res.json(medicamentos);
    } catch (error) {
      console.error('Error al obtener medicamentos:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener medicamentos: ' + error.message
      });
    }
  },

  buscarPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const medicamento = await Medicamento.findByPk(id, {
        attributes: ['idmedicamento', 'nombremedicamento', 'presentacion', 'idclasificacionterapeutica'],
        include: {
          model: ClasificacionTerapeutica,
          as: 'clasificacionTerapeutica',
          attributes: ['idclasificacionterapeutica', 'nombre']
        }
      });

      if (!medicamento) {
        return res.status(404).json({
          success: false,
          error: 'Medicamento no encontrado'
        });
      }

      res.json({
        success: true,
        medicamento
      });
    } catch (error) {
      console.error('Error al buscar medicamento:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

module.exports = medicamentosController;
