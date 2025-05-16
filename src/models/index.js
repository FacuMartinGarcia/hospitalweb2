const Cobertura = require('./Cobertura');
const Paciente = require('./Paciente');
const Medico = require('./Medico');
const Especialidad = require('./Especialidad');
const Internacion = require('./Internacion');
const Origen = require('./Origen');
const Diagnostico = require('./Diagnostico');

Cobertura.associate({ Paciente });
Paciente.associate({ Cobertura });
Medico.associate({ Especialidad });
Especialidad.associate({ Medico }); 
Internacion.associate({ Paciente, Medico, Origen, Diagnostico });
Origen.associate({ Internacion });
Diagnostico.associate({ Internacion });


// Exportar los modelos
module.exports = {
  Cobertura,
  Paciente,
  Medico,
  Especialidad,
  Diagnostico,
  Internacion,
  Origen
};
