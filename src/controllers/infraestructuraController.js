const sequelize = require('../../config/db');
const { QueryTypes } = require('sequelize');

const obtenerHabitacionesCompatibles = async (req, res) => {
  const { idunidad, sexo } = req.query;

  if (!idunidad || !sexo) {
    return res.status(400).json({ success: false, message: 'Faltan parámetros: idunidad y sexo' });
  }
  console.log('Ruta absoluta de db:', require.resolve('../../config/db'));
  if (!sequelize) {
    return res.status(500).json({ 
      success: false, 
      message: 'Error de conexión con la base de datos' 
    });
  }

  
  try {
    const habitaciones = await sequelize.query(`
      SELECT DISTINCT
        h.idhabitacion,
        h.nombrehabitacion
      FROM infra_habitaciones h
      JOIN infra_camas c ON c.idhabitacion = h.idhabitacion
      LEFT JOIN internacion_cama ic ON c.idcama = ic.idcama AND ic.fechahasta IS NULL
      LEFT JOIN internacion i ON ic.idinternacion = i.idinternacion
      LEFT JOIN pacientes p ON i.idpaciente = p.idpaciente
      WHERE h.idunidad = :idunidad
        AND c.idcama NOT IN (
          SELECT idcama
          FROM internacion_cama
          WHERE fechahasta IS NULL AND idcama IS NOT NULL
        )
        AND h.idhabitacion IN (
          SELECT h2.idhabitacion
          FROM infra_habitaciones h2
          JOIN infra_camas c2 ON c2.idhabitacion = h2.idhabitacion
          JOIN internacion_cama ic2 ON c2.idcama = ic2.idcama AND ic2.fechahasta IS NULL
          JOIN internacion i2 ON ic2.idinternacion = i2.idinternacion
          JOIN pacientes p2 ON i2.idpaciente = p2.idpaciente
          WHERE p2.sexo = :sexo AND h2.idunidad = :idunidad
          GROUP BY h2.idhabitacion
        )
      ORDER BY h.nombrehabitacion
    `, {
      replacements: { idunidad, sexo },
      type: QueryTypes.SELECT
    });

    res.json({ success: true, habitaciones });

  } catch (error) {
    console.error('Error en obtenerHabitacionesCompatibles:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ success: false, message: 'Error al obtener habitaciones compatibles' });
  }
};

module.exports = {
  obtenerHabitacionesCompatibles,
};
