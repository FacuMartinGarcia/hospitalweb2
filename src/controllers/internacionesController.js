const db = require('../models');
const { Op } = require('sequelize');
const { Internacion, Medico, Paciente, Origen, Diagnostico } = db;

const internacionesController = {
  obtenerPorPaciente: async (req, res) => {
    try {
      const idpaciente = parseInt(req.params.idpaciente);
      const internaciones = await Internacion.findAll({
        where: { idpaciente },
        include: [
          { model: Medico, as: 'medico' },
          { model: Medico, as: 'medicoAlta' },
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
          { model: Medico, as: 'medicoAlta' },
          { model: Origen, as: 'origen' },
          { model: Diagnostico, as: 'diagnostico' }
        ],
        order: [['fechaingreso', 'DESC']]
      });

      if (internacionActiva) {
        res.status(200).json({ success: true, activa: true, internacion: internacionActiva });
      } else {
        res.status(200).json({ success: true, activa: false });
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
        return res.status(404).json({ success: false, message: 'Internación no encontrada' });
      }

      await internacion.destroy();
      res.status(200).json({ success: true, message: 'Internación cancelada exitosamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error al cancelar la internación' });
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
        observaciones,
        idmedicoalta,
        indicaciones
      } = req.body;

      if (!idpaciente || !idorigen || !idmedico || !iddiagnostico || !fechaingreso || !horaingreso) {
        return res.status(400).json({ success: false, message: "Todos los campos obligatorios deben completarse." });
      }

      const internacionActiva = await Internacion.findOne({
        where: { idpaciente, fechaalta: null }
      });

      if (internacionActiva) {
        return res.status(400).json({ success: false, message: "El paciente ya tiene una internación activa." });
      }

      const internacion = await Internacion.create({
        idpaciente,
        idorigen,
        idmedico,
        iddiagnostico,
        fechaingreso,
        horaingreso,
        observaciones,
        idmedicoalta: idmedicoalta || null,
        indicaciones: indicaciones || null
      });

      res.status(201).json({ success: true, internacion });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error al registrar la internación' });
    }
  },

  async asignarCama(req, res) {
    try {
      let idinternacion = req.params.id; 
      let { idcama } = req.body;

      if (!idinternacion || !idcama) {
        return res.status(400).json({
          success: false,
          message: 'Faltan datos para la asignación'
        });
      }

      let cama = await db.Cama.findByPk(idcama);
      if (!cama) {
        return res.status(404).json({ 
          success: false, 
          message: 'Cama no encontrada' 
        });
      }

      // Verificar que la cama no este ocupada
      let camaOcupada = await db.InternacionCama.findOne({
        where: {
          idcama,
          fechahasta: null
        }
      });

      if (camaOcupada) {
        return res.status(400).json({ 
          success: false, 
          message: 'La cama ya está ocupada' 
        });
      }

      // tenemos que ver que no tenga otra cana asignada
      let camaAnterior = await db.InternacionCama.findOne({
        where: {
          idinternacion,
          fechahasta: null
        }
      });

      const ahora = new Date();

      if (camaAnterior) {
        if (ahora < camaAnterior.fechadesde) {
          return res.status(400).json({
            success: false,
            message: 'La fecha de asignación no puede ser anterior a la asignación actual.'
          });
        }

        // Liberar la cama anterior  y le ponemos en la fecha hasta, la fecha desde de ahora
        camaAnterior.fechahasta = ahora;
        await camaAnterior.save();
      }

      let nuevaAsignacion = await db.InternacionCama.create({
        idinternacion,
        idcama,
        fechadesde: ahora
      });

      await db.Cama.update(
        { higienizada: false },
        { where: { idcama } }
      );

      return res.json({ 
        success: true, 
        data: nuevaAsignacion,
        message: 'Cama asignada correctamente'
      });

    } catch (error) {
      console.error('Error en asignarCama:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error al asignar cama',
        error: error.message 
      });
    }
  },

async anularUltimaAsignacionCama(req, res) {

  try {

    const idinternacion = req.params.id;
    const historial = await db.InternacionCama.findAll({
      where: { idinternacion },
      order: [['fechadesde', 'DESC']],
      include: [{ model: db.Cama, as: 'cama' }]
    });


    if (!historial || historial.length === 0) {
      const mensaje = 'No hay asignaciones de cama registradas.';
      console.log(mensaje);
      return res.status(404).json({ success: false, message: mensaje });
    }

    const ultima = historial[0];

    // Verificar que no hayan pasado 2 o más días desde la asignación
    const hoy = new Date();
    const fechaAsignacion = new Date(ultima.fechadesde);

    hoy.setHours(0, 0, 0, 0);
    fechaAsignacion.setHours(0, 0, 0, 0);

    const diferenciaMilisegundos = hoy - fechaAsignacion;
    const diferenciaDias = diferenciaMilisegundos / (1000 * 60 * 60 * 24);

    if (diferenciaDias >= 2) {
      const mensaje = 'Solo se puede anular una asignación si no han pasado más de 2 días.';
      console.log(mensaje);
      return res.status(400).json({ success: false, message: mensaje });
    }

    if (historial.length === 1) {
      console.log("Única asignación, se elimina sin reactivar otra.");
      await ultima.destroy();
      return res.json({
        success: true,
        message: 'Única asignación anulada correctamente.'
      });
    }

    const anterior = historial[1];

    if (!anterior) {
      const mensaje = 'No se encontró la asignación anterior.';
      console.log(mensaje);
      return res.status(500).json({ success: false, message: mensaje });
    }

    console.log("Verificando si la cama anterior fue usada por otro paciente...");

    const fueOcupada = await db.InternacionCama.findOne({
      where: {
        idcama: anterior.idcama,
        idinternacion: { [Op.ne]: idinternacion },
        fechadesde: {
          [Op.gt]: anterior.fechahasta || anterior.fechadesde
        }
      }
    });

    if (fueOcupada) {
      const mensaje = 'La cama anterior fue asignada a otro paciente después de la internación. No se puede reactivar.';
      console.log(mensaje);
      return res.status(400).json({ success: false, message: mensaje });
    }

    // Todo OK: anular última asignación y reactivar anterior
    console.log("Anulando última asignación y reactivando la anterior...");
    await ultima.destroy();

    anterior.fechahasta = null;
    await anterior.save();

    return res.json({
      success: true,
      message: 'Asignación actual anulada y se reactivó la anterior.',
      data: { reactivada: anterior }
    });

  } catch (error) {
    console.error('Error en anularUltimaAsignacionCama:', error);
    return res.status(500).json({
      success: false,
      message: 'Error inesperado al intentar anular la asignación.',
      error: error.message
    });
  }
},


  async liberarCama(req, res) {
      try {
          let { idintercama } = req.params;

          let asignacion = await db.InternacionCama.findByPk(idintercama);
          
          if (!asignacion) {
              return res.status(404).json({ 
                  success: false,
                  message: 'Asignación no encontrada' 
              });
          }

          if (asignacion.fechahasta) {
              return res.status(400).json({ 
                  success: false,
                  message: 'Esta cama ya fue liberada anteriormente' 
              });
          }

          asignacion.fechahasta = new Date();
          await asignacion.save();

          await db.Cama.update(
              { higienizada: false },
              { where: { idcama: asignacion.idcama } }
          );

          return res.json({ 
              success: true,
              message: 'Cama liberada exitosamente',
              data: asignacion
          });

      } catch (error) {
          console.error('Error en liberarCama:', error);
          return res.status(500).json({ 
              success: false, 
              message: 'Error al liberar cama',
              error: error.message 
          });
      }
  },

  async obtenerCamasPorInternacion(req, res) {
      try {
          let { idinternacion } = req.params;

          let camas = await db.InternacionCama.findAll({
              where: { idinternacion },
              include: [
                  {
                      model: db.Cama,
                      as: 'cama',
                      include: [
                          {
                              model: db.Habitacion,
                              as: 'habitacion',
                              include: [
                                  {
                                      model: db.Ala,
                                      as: 'ala'
                                  }
                              ]
                          }
                      ]
                  }
              ],
              order: [['fechadesde', 'DESC']]
          });

          return res.json({ 
              success: true, 
              data: camas 
          });

      } catch (error) {
          console.error('Error en obtenerCamasPorInternacion:', error);
          return res.status(500).json({ 
              success: false, 
              message: 'Error al obtener camas',
              error: error.message 
          });
      }
  },
  buscarPorId: async (req, res) => {
    try {
      const idinternacion = parseInt(req.params.id);
      const internacion = await Internacion.findByPk(idinternacion, {
        include: [
          { model: Medico, as: 'medico' },
          { model: Medico, as: 'medicoAlta' },
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

      await internacion.update({
        ...nuevosDatos,
        idmedicoalta: nuevosDatos.idmedicoalta || null,
        indicaciones: nuevosDatos.indicaciones || null
      });

      res.status(200).json({ success: true, internacion });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error al actualizar internación' });
    }
  }
};

module.exports = internacionesController;
