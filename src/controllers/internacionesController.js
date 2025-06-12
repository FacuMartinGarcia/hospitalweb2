const db = require('../models');
const { Op } = require('sequelize');
const { Internacion, Medico, Paciente, Origen, Cama, Habitacion, Ala, Unidad,
  Diagnostico, InternacionCama, InternacionCirugia, InternacionEstudio, 
  InternacionEvenfermeria, InternacionEvmedica, InternacionMedicamento, 
  InternacionTerapia } = db;

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
  cancelarInternacionControlada: async (req, res) => {
    try {
      const idinternacion = parseInt(req.params.id);
      const internacion = await Internacion.findByPk(idinternacion);
  
      if (!internacion) {
        return res.status(404).json({ success: false, message: 'Internación no encontrada' });
      }
  
      // Verificar existencia de registros relacionados con etiquetas legibles
      const relaciones = [
        { modelo: InternacionCama, nombre: 'internacion_cama', etiqueta: 'Asignación de cama' },
        { modelo: InternacionCirugia, nombre: 'internacion_cirugias', etiqueta: 'Cirugía registrada' },
        { modelo: InternacionEstudio, nombre: 'internacion_estudios', etiqueta: 'Estudio realizado' },
        { modelo: InternacionEvenfermeria, nombre: 'internacion_evenfermeria', etiqueta: 'Evolucione de enfermería' },
        { modelo: InternacionEvmedica, nombre: 'internacion_evmedica', etiqueta: 'Evolucione médica' },
        { modelo: InternacionMedicamento, nombre: 'internacion_medicamentos', etiqueta: 'Medicamento administrado' },
        { modelo: InternacionTerapia, nombre: 'internacion_terapias', etiqueta: 'Terapia registrada' }
      ];
  
      const relacionadas = [];
  
      for (const rel of relaciones) {
        const count = await rel.modelo.count({ where: { idinternacion } });
        if (count > 0) {
          relacionadas.push(rel.etiqueta); 
        }
      }
  
      if (relacionadas.length > 0) {
        return res.status(400).json({
          success: false,
          message: `No se puede eliminar la internación. El paciente tiene información relacionada a la internación: ${relacionadas.join(', ')}.`
        });
      }
  
      // No hay registros relacionados, se puede eliminar
      await internacion.destroy();
      return res.status(200).json({ success: true, message: 'Internación eliminada exitosamente' });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Error al cancelar la internación' });
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

      let cama = await Cama.findByPk(idcama);
      if (!cama) {
        return res.status(404).json({ 
          success: false, 
          message: 'Cama no encontrada' 
        });
      }


      let camaOcupada = await InternacionCama.findOne({
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
      let camaAnterior = await InternacionCama.findOne({
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

      let nuevaAsignacion = await InternacionCama.create({
        idinternacion,
        idcama,
        fechadesde: ahora
      });

      await Cama.update(
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

          let camas = await InternacionCama.findAll({
              where: { idinternacion },
              include: [
                  {
                      model: Cama,
                      as: 'cama',
                      include: [
                          {
                              model: Habitacion,
                              as: 'habitacion',
                              include: [
                                  {
                                      model: Ala,
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

  verificarEstadoCamaPaciente: async (req, res) => {
    try {
      const idpaciente = parseInt(req.params.idpaciente);

      const internacionActiva = await Internacion.findOne({
        where: {
          idpaciente,
          fechaalta: null
        }
      });

      if (!internacionActiva) {
        return res.status(200).json({
          success: true,
          estaInternado: false,
          tieneCama: false,
          message: 'El paciente no tiene una internación activa'
        });
      }

      const camaAsignada = await InternacionCama.findOne({
        where: {
          idinternacion: internacionActiva.idinternacion,
          fechahasta: null
        },
        include: [{
          model: Cama,
          as: 'cama',
          attributes: ['idcama', 'numerocama'],
          include: [{
            model: Habitacion,
            as: 'habitacion',
            attributes: ['nombrehabitacion'],
            include: [
              {
                model: Ala,
                as: 'ala',
                attributes: ['denominacion']
              },
              {
                model: Unidad,
                as: 'unidad',
                attributes: ['denominacion']
              }
            ]
          }]
        }]
      });

      if (!camaAsignada) {
        return res.status(200).json({
          success: true,
          estaInternado: true,
          tieneCama: false,
          message: 'El paciente está internado pero no tiene cama asignada actualmente'
        });
      }

      const cama = camaAsignada.cama;
      const habitacion = cama.habitacion;
      const ala = habitacion.ala;
      const unidad = habitacion.unidad;

      return res.status(200).json({
        success: true,
        estaInternado: true,
        tieneCama: true,
        camaAsignada: {
          unidad: unidad.denominacion,
          ala: ala.denominacion,
          habitacion: habitacion.nombrehabitacion,
          cama: cama.numerocama
        }
      });

    } catch (error) {
      console.error('Error en verificarEstadoCamaPaciente:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al verificar el estado de cama del paciente',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
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
