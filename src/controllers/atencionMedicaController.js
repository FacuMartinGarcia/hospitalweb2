const db = require('../models'); 
const { InternacionEvmedica, InternacionMedicamento, InternacionTerapia, InternacionCirugia, InternacionEstudio, Estudio,
    Medicamento, Medico, TipoCirugia, TipoTerapia, Internacion} = db;
   
const { Op } = require('sequelize');
const { transformarFechaArgentina, obtenerFechaArgentina } = require('../utils/fecha');


const atencionMedicaController = {
  registrarMedicamento: async (req, res) => {
    const { idinternacion, idmedico, idmedicamento, cantidad, observacionesme } = req.body;

    console.log("Registrar medicamento:", req.body);
    
    
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
        fechaprescripcion: obtenerFechaArgentina(),
        cantidad: cantidadInt,
        observacionesme: observacionesme ? observacionesme.toUpperCase() : null
      });

      return res.json({ success: true, data: nuevo });

    } catch (error) {
      console.error('Error al registrar medicamento:', error);
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
        order: [['fechaprescripcion', 'DESC']]
      });

      const resultado = medicamentos.map(m => ({
          id: m.id,
          idinternacion: m.idinternacion,
          cantidad: m.cantidad,
          observacionesme: m.observacionesme,
          fechaprescripcion: transformarFechaArgentina(m.fechaprescripcion),
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