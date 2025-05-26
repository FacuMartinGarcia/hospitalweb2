const sequelize = require('../../config/db');
const { QueryTypes } = require('sequelize');

const infraestructuraController = {// Método 1: Obtener hab
  obtenerHabitacionesCompatibles: async (req, res) => {

    const { idunidad, sexo } = req.query;

    if (!idunidad || !sexo) {
      return res.status(400).json({ success: false, message: 'Faltan parámetros: idunidad y sexo' });
    }

    if (sexo !== 'M' && sexo !== 'F') {
      return res.status(400).json({ success: false, message: 'Sexo inválido. Debe ser M o F.' });
    }

    const idunidadNum = parseInt(idunidad, 10);

    try {
      const habitaciones = await sequelize.query(`
        SELECT DISTINCT
          c.idcama,
          c.numerocama,
          h.nombrehabitacion,
          a.denominacion
        FROM infra_camas c
        JOIN infra_habitaciones h ON c.idhabitacion = h.idhabitacion
        JOIN infra_alas a ON h.idala = a.idala
        LEFT JOIN internacion_cama ic ON c.idcama = ic.idcama AND ic.fechahasta IS NULL
        LEFT JOIN internacion i ON ic.idinternacion = i.idinternacion
        LEFT JOIN pacientes p ON i.idpaciente = p.idpaciente
        WHERE h.idunidad = :idunidadNum
          AND (
            ic.idinternacion IS NULL
          )
          AND NOT EXISTS (
            SELECT 1
            FROM infra_camas c2
            JOIN internacion_cama ic2 ON c2.idcama = ic2.idcama AND ic2.fechahasta IS NULL
            JOIN internacion i2 ON ic2.idinternacion = i2.idinternacion
            JOIN pacientes p2 ON i2.idpaciente = p2.idpaciente
            WHERE c2.idhabitacion = h.idhabitacion
              AND p2.sexo != :sexo
          )
        ORDER BY h.nombrehabitacion, c.numerocama;
      `, {
        replacements: { idunidadNum, sexo },
        type: QueryTypes.SELECT
      });

      res.json({ success: true, habitaciones });

    } catch (error) {
      console.error('Error en obtenerHabitacionesCompatibles:', error.message);
      console.error('Stack:', error.stack);
      res.status(500).json({ success: false, message: 'Error al obtener habitaciones compatibles' });
    }
  },

  listarCamasOcupadasView: async (req, res) => {
    try {
      const camasRaw = await sequelize.query(`
        SELECT 
          u.denominacion AS unidad, 
          a.denominacion AS ala, 
          h.nombrehabitacion AS habitacion, 
          c.numerocama AS cama, 
          p.documento AS documento_paciente, 
          p.apellidonombres AS apellidonombres_paciente, 
          p.sexo AS sexo_paciente, 
          i.idinternacion, 
          ic.fechadesde 
        FROM infra_camas c 
        JOIN infra_habitaciones h ON c.idhabitacion = h.idhabitacion 
        JOIN infra_alas a ON h.idala = a.idala 
        JOIN infra_unidades u ON h.idunidad = u.idunidad 
        LEFT JOIN internacion_cama ic ON ic.idcama = c.idcama AND ic.deletedAt IS NULL AND ic.fechahasta IS NULL 
        LEFT JOIN internacion i ON ic.idinternacion = i.idinternacion AND i.deletedAt IS NULL 
        LEFT JOIN pacientes p ON i.idpaciente = p.idpaciente 
        ORDER BY u.denominacion, a.denominacion, h.nombrehabitacion, c.numerocama;
      `, {
        type: QueryTypes.SELECT
      });

      const camas = camasRaw.map(cama => ({
        unidad: cama.unidad || null,
        ala: cama.ala || null,
        habitacion: cama.habitacion || null,
        cama: cama.cama || null,
        documento_paciente: cama.documento_paciente || null,
        apellidonombres_paciente: cama.apellidonombres_paciente || null,
        sexo_paciente: cama.sexo_paciente || null,
        idinternacion: cama.idinternacion || null,
        fechadesde: cama.fechadesde ? new Date(cama.fechadesde).toLocaleString('es-AR') : null
      }));

      res.render('listarCamasOcupadas', { camas });

    } catch (error) {
      console.error('Error en listarCamasOcupadasView:', error.message);
      res.status(500).send('Error al obtener camas');
    }
  },
 listarCamasPorPacienteInternacion: async (req, res) => {
    const { idinternacion } = req.query;

    if (!idinternacion) {
      return res.status(400).json({ success: false, message: 'Faltan numero de internacion' });
    }

    try {
      const camas = await sequelize.query(`
        SELECT 
            u.denominacion AS unidad,
            ic.fechadesde,
            c.numerocama AS cama,
            h.nombrehabitacion AS habitacion,
            a.denominacion AS ala
        FROM internacion_cama ic
        JOIN infra_camas c ON ic.idcama = c.idcama
        JOIN infra_habitaciones h ON c.idhabitacion = h.idhabitacion
        JOIN infra_unidades u ON h.idunidad = u.idunidad
        JOIN infra_alas a ON h.idala = a.idala
        JOIN internacion i ON ic.idinternacion = i.idinternacion
        WHERE 
            i.idinternacion = :idinternacion 
            AND ic.deletedAt IS NULL
        ORDER BY ic.fechadesde;
      `, {
        replacements: {
          idinternacion: parseInt(idinternacion, 10),
        },
        type: QueryTypes.SELECT
      });

      res.json({ success: true, camas });

    } catch (error) {
      console.error('Error en listarCamasPorPacienteInternacion:', error.message);
      console.error('Stack:', error.stack);
      res.status(500).json({ success: false, message: 'Error al obtener las camas del paciente' });
    }
  }
};  

  module.exports = infraestructuraController;
