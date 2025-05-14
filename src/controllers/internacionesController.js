const db = require('../models');
const { Internacion, Medico, Paciente, Origen } = db;

const internacionesController = {

  obtenerPorPaciente: async (req, res) => {
    try {
      const idpaciente = parseInt(req.params.idpaciente);
      const internaciones = await Internacion.findAll({
        where: { idpaciente },
        include: [
          { model: Medico, as: 'medico' },
          { model: Origen, as: 'origen' }
        ],
        order: [['fecha_ingreso', 'DESC']]
      });
      res.status(200).json({ success: true, internaciones });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error al obtener internaciones' });
    }
  },

  crear: async (req, res) => {
    try {
      const datos = req.body;
      const internacion = await Internacion.create(datos);
      res.status(201).json({ success: true, internacion });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error al registrar la internación' });
    }
  },


  buscarPorId: async (req, res) => {
    try {
      const idinternacion = parseInt(req.params.id);
      const internacion = await Internacion.findByPk(idinternacion, {
        include: [
          { model: Medico, as: 'medico' },
          { model: Paciente, as: 'paciente' },
          { model: Origen, as: 'origen' }
        ]
      });

      if (!internacion) {
        return res.status(404).json({ success: false, message: 'Internación no encontrada' });
      }

      res.status(200).json({ success: true, internacion });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error al buscar internación' });
    }
  },

  actualizar: async (req, res) => {
    try {
      const idinternacion = parseInt(req.params.id);
      const nuevosDatos = req.body;

      const internacion = await Internacion.findByPk(idinternacion);
      if (!internacion) {
        return res.status(404).json({ success: false, message: 'Internación no encontrada' });
      }

      await internacion.update(nuevosDatos);

      res.status(200).json({ success: true, internacion });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error al actualizar internación' });
    }
  }

};

module.exports = internacionesController;
