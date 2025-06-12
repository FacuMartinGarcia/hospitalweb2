const db = require('../models'); 
const { InternacionEvmedica, InternacionMedicamento, InternacionEstudio, InternacionCirugia, InternacionTerapia,  Estudio,
    Medicamento, Medico, TipoCirugia, TipoAnestesia, TipoTerapia, Internacion} = db;
   
//const { Op } = require('sequelize');
const { transformarFechaArgentina, obtenerFechaArgentina } = require('../utils/fecha');


const atencionMedicaController = {
  registrarMedicamento: async (req, res) => {
    const { idinternacion, idmedico, idmedicamento, fechaprescripcion, cantidad, observacionesme } = req.body;
    
    try {

      if (!idinternacion || !idmedico || !idmedicamento || cantidad === undefined) {
        return res.status(400).json({ success: false, message: 'Faltan campos obligatorios.' });
      }

      const cantidadInt = parseInt(cantidad);
      if (isNaN(cantidadInt) || cantidadInt < 0) {
        return res.status(400).json({ success: false, message: 'La cantidad debe ser un número mayor o igual a 0.' });
      }

      const medico = await Medico.findByPk(idmedico);
      if (!medico) {
        return res.status(404).json({ success: false, message: 'Médico no encontrado.' });
      }

      const medicamento = await Medicamento.findByPk(idmedicamento);
      if (!medicamento) {
        return res.status(404).json({ success: false, message: 'Medicamento no encontrado.' });
      }

      const nuevo = await InternacionMedicamento.create({
        idinternacion,
        idmedico,
        idmedicamento,
        fechaprescripcion: new Date(),
        cantidad: cantidadInt,
        observacionesme: observacionesme ? observacionesme.toUpperCase() : null
      });

      return res.json({ success: true, data: nuevo });

    } catch (error) {
      console.error('Error al registrar medicamento:', error);
      return res.status(500).json({ success: false, message: 'Error interno: ' + error.message });
    }
  },

  registrarEstudio: async (req, res) => {
    const { idinternacion, idmedico, fechaestudio, idestudio, observacioneses } = req.body;
    
    try {

      if (!idinternacion || !idmedico || !idestudio == undefined) {
        return res.status(400).json({ success: false, message: 'Faltan campos obligatorios.' });
      }

      const medico = await Medico.findByPk(idmedico);
      if (!medico) {
        return res.status(404).json({ success: false, message: 'Médico no encontrado.' });
      }

      const estudio = await Estudio.findByPk(idestudio);
      if (!estudio) {
        return res.status(404).json({ success: false, message: 'Estudio no encontrado.' });
      }

      const nuevo = await InternacionEstudio.create({
        idinternacion,
        idmedico,
        idestudio,
        fechaestudio: new Date(),
        observacioneses: observacioneses ? observacioneses.toUpperCase() : null
      });

      return res.json({ success: true, data: nuevo });

    } catch (error) {
      console.error('Error al registrar estudio:', error);
      return res.status(500).json({ success: false, message: 'Error interno: ' + error.message });
    }
  },

  registrarCirugia: async (req, res) => {
    const { idinternacion, idmedico, fechacirugia, idtipocirugia, idtipoanestesia, observaciones } = req.body;
    
    try {

      if (!idinternacion || !idmedico || !idtipocirugia == undefined || !idtipoanestesia == undefined ) {
        return res.status(400).json({ success: false, message: 'Faltan campos obligatorios.' });
      }

      const medico = await Medico.findByPk(idmedico);
      if (!medico) {
        return res.status(404).json({ success: false, message: 'Médico no encontrado.' });
      }

      const cirugia = await TipoCirugia.findByPk(idtipocirugia);
      if (!cirugia) {
        return res.status(404).json({ success: false, message: 'Tipo de Cirugia no encontrado.' });
      }

      const nuevo = await InternacionCirugia.create({
        idinternacion,
        idmedico,
        idtipocirugia,
        idtipoanestesia,
        fechacirugia: new Date(),
        observaciones: observaciones ? observaciones.toUpperCase() : null
      });

      return res.json({ success: true, data: nuevo });

    } catch (error) {
      console.error('Error al registrar cirugia:', error);
      return res.status(500).json({ success: false, message: 'Error interno: ' + error.message });
    }
  },

  registrarTerapia: async (req, res) => {
    const { idinternacion, idmedico, fechaterapia, idtipoterapia, observaciones } = req.body;
    
    try {

      if (!idinternacion || !idmedico || !idtipoterapia == undefined) {
        return res.status(400).json({ success: false, message: 'Faltan campos obligatorios.' });
      }

      const medico = await Medico.findByPk(idmedico);
      if (!medico) {
        return res.status(404).json({ success: false, message: 'Médico no encontrado.' });
      }

      const tipoTerapia = await TipoTerapia.findByPk(idtipoterapia);
      if (!tipoTerapia) {
        return res.status(404).json({ success: false, message: 'Tipo de terapia no encontrado.' });
      }

      const nuevo = await InternacionTerapia.create({
        idinternacion,
        idmedico,
        idtipoterapia,
        fechaterapia,
        observaciones: observaciones ? observaciones.toUpperCase() : null
      });

      return res.json({ success: true, data: nuevo });

    } catch (error) {
      console.error('Error al registrar terapia:', error);
      return res.status(500).json({ success: false, message: 'Error interno: ' + error.message });
    }
  },


  listarMedicamentosPorInternacion: async (req, res) => {

    const { idinternacion } = req.params;

    try {
      if (!idinternacion) {
        return res.status(400).json({ success: false, message: 'Falta el id de internación.' });
      }

      const medicamentos = await InternacionMedicamento.findAll({
        where: { idinternacion },
        include: [
          { model: Medicamento, as: 'medicamento', attributes: ['idmedicamento', 'nombremedicamento', 'presentacion'] },
          { model: Medico, as: 'medico', attributes: ['idmedico', 'apellidonombres'] }
        ],
        order: [['idintermedicamentos', 'DESC']]
      });

      const resultado = medicamentos.map(m => ({
          id: m.id,
          idinternacion: m.idinternacion,
          cantidad: m.cantidad,
          observacionesme: m.observacionesme || '',
          fechaprescripcion: m.fechaprescripcion,
          medico: m.medico.apellidonombres,
          medicamento: m.medicamento,
          presentacion: m.medicamento.presentacion
      }));


      return res.json({ success: true, data: resultado });

    } catch (error) {
      console.error('Error al listar medicamentos:', error);
      return res.status(500).json({ success: false, message: 'Error interno: ' + error.message });
    }
  },

  listarEstudiosPorInternacion: async (req, res) => {

    const { idinternacion } = req.params;

    try {
      if (!idinternacion) {
        return res.status(400).json({ success: false, message: 'Falta el id de internación.' });
      }

      const estudios = await InternacionEstudio.findAll({
        where: { idinternacion },
        include: [
          { model: Estudio, as: 'estudio', attributes: ['idestudio', 'denominacion'] },
          { model: Medico, as: 'medico', attributes: ['idmedico', 'apellidonombres'] }
        ],
        order: [['idinterestudios', 'DESC']]
      });

      const resultado = estudios.map(e => ({
          id: e.idinterestudios,
          idinternacion: e.idinternacion,
          observacioneses: e.observacioneses || '',
          fechaestudio: e.fechaestudio,
          medico: e.medico.apellidonombres,
          estudio: e.estudio.denominacion
      }));

      return res.json({ success: true, data: resultado });

    } catch (error) {
      console.error('Error al listar estudios:', error);
      return res.status(500).json({ success: false, message: 'Error interno: ' + error.message });
    }
  },

  listarCirugiasPorInternacion: async (req, res) => {
    const { idinternacion } = req.params;

    try {
      if (!idinternacion) {
        return res.status(400).json({ success: false, message: 'Falta el id de internación.' });
      }

      const cirugias = await InternacionCirugia.findAll({
        where: { idinternacion },
        include: [
          { 
            model: TipoCirugia, 
            as: 'tipocirugia', 
            attributes: ['idtipocirugia', 'denominacioncirugia'] 
          },
          { 
            model: Medico, 
            as: 'medico', 
            attributes: ['idmedico', 'apellidonombres'] 
          },
          { 
            model: TipoAnestesia, 
            as: 'tipoanestesia',
            attributes: ['idtipoanestesia', 'denominacionanestesia'] 
          }
        ],
        order: [['idintercirugias', 'DESC']]
      });

      const resultado = cirugias.map(e => ({
        id: e.idintercirugias, 
        idinternacion: e.idinternacion,
        fechacirugia: e.fechacirugia,
        medico: e.medico.apellidonombres,
        cirugia: e.tipocirugia.denominacioncirugia, 
        anestesia: e.tipoanestesia.denominacionanestesia,
        observaciones: e.observaciones || ''
      }));

      return res.json({ success: true, data: resultado });

    } catch (error) {
      console.error('Error al listar cirugias:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error interno: ' + error.message 
      });
    }
  },

  listarTerapiasPorInternacion: async (req, res) => {

    const { idinternacion } = req.params;

    try {
      if (!idinternacion) {
        return res.status(400).json({ success: false, message: 'Falta el id de internación.' });
      }

      const terapias = await InternacionTerapia.findAll({
        where: { idinternacion },
        include: [
          { model: TipoTerapia, as: 'tipoterapia', attributes: ['idtipoterapia', 'denominacionterapia'] },
          { model: Medico, as: 'medico', attributes: ['idmedico', 'apellidonombres'] }
        ],
        order: [['idinterterapias', 'DESC']]
      });

      const resultado = terapias.map(e => ({
          id: e.idinterestudios,
          idinternacion: e.idinternacion,
          fechaterapia: e.fechaterapia,
          medico: e.medico.apellidonombres,
          terapia: e.tipoterapia.denominacionterapia,
          observaciones: e.observaciones || ''
        }));

      return res.json({ success: true, data: resultado });

    } catch (error) {
      console.error('Error al listar terapias:', error);
      return res.status(500).json({ success: false, message: 'Error interno: ' + error.message });
    }
  },

  eliminarMedicamento: async (req, res) => {
    const { id } = req.params;

    try {
      const registro = await InternacionMedicamento.findByPk(id);
      if (!registro) {
        return res.status(404).json({ success: false, message: 'Registro no encontrado.' });
      }

      await registro.destroy();
      return res.json({ success: true, message: 'Medicamento eliminado correctamente.' });
    } catch (error) {
      console.error('Error al eliminar medicamento:', error);
      return res.status(500).json({ success: false, message: 'Error interno: ' + error.message });
    }
  }

  };

module.exports = atencionMedicaController;