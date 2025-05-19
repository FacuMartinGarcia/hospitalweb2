const db = require('../models');
const { Internacion, Medico, Paciente, Origen, Diagnostico } = db;

const internacionesController = {


  obtenerPorPaciente: async (req, res) => {
    try {
      const idpaciente = parseInt(req.params.idpaciente);
      const internaciones = await Internacion.findAll({
        where: { idpaciente },
        include: [
          { model: Medico, as: 'medico' },
          { model: Origen, as: 'origen' },
          { model: Diagnostico, as: 'diagnostico' }
        ],
        order: [['fechaingreso', 'DESC']]  
      });
      res.status(200).json({ success: true, internaciones });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error al obtener internaciones' });
    }
  },
  existeInternacionActiva: async (req, res) => {
    try {
      const idpaciente = parseInt(req.params.idpaciente);
      const internacionActiva = await Internacion.findOne({
        where: {
          idpaciente,
          fechaalta: null
        },
        include: [
          { model: Medico, as: 'medico' },
          { model: Origen, as: 'origen' },
          { model: Diagnostico, as: 'diagnostico' }
        ],
        order: [['fechaingreso', 'DESC']]
      });

      if (internacionActiva) {
        res.status(200).json({ success: true, activa: true, internacion: internacionActiva });
      } else {
        res.status(200).json({ success: true, activa: false });
        console.log('No hay internaciones activas');
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error al verificar internación activa' });
    }
  },

  cancelarAdmision: async (req, res) => {
      try {
          const idinternacion = parseInt(req.params.id);

          const internacion = await Internacion.findByPk(idinternacion);
          if (!internacion) {
              return res.status(404).json({ 
                  success: false, 
                  message: 'Internación no encontrada' 
              });
          }

          await internacion.destroy();

          res.status(200).json({ 
              success: true, 
              message: 'Internación cancelada exitosamente' 
          });

      } catch (error) {
          console.error(error);
          res.status(500).json({ 
              success: false, 
              message: 'Error al cancelar la internación',
              error: error.message 
          });
      }
  },
  
  crear: async (req, res) => {
    try {
      const {
        idpaciente,
        idorigen,
        idmedico,
        iddiagnostico,
        fechaingreso,
        horaingreso,
        observaciones
      } = req.body;

      if (!idpaciente || !idorigen || !idmedico || !iddiagnostico || !fechaingreso || !horaingreso) {
        return res.status(400).json({ 
          success: false, 
          message: "Todos los campos son obligatorios." 
        });
      }

      if (typeof idpaciente !== 'number' || isNaN(idpaciente)) {
        return res.status(400).json({ success: false, message: "ID de paciente inválido." });
      }

      const internacionActiva = await Internacion.findOne({
        where: {
          idpaciente,
          fechaalta: null
        }
      });

      if (internacionActiva) {
        return res.status(400).json({
          success: false,
          message: "El paciente ya tiene una internación activa."
        });
      }

      const internacion = await Internacion.create({
        idpaciente,
        idorigen,
        idmedico,
        iddiagnostico,
        fechaingreso,
        horaingreso,
        observaciones
      });


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
          { model: Origen, as: 'origen' },
          { model: Diagnostico, as: 'diagnostico' }
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
