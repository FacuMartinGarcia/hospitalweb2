const Cobertura = require('./Cobertura');
const Paciente = require('./Paciente');
const Medico = require('./Medico');
const Especialidad = require('./Especialidad');
const Internacion = require('./Internacion');
const Origen = require('./Origen');


Cobertura.associate({ Paciente });
Paciente.associate({ Cobertura });
Medico.associate({ Especialidad });
Especialidad.associate({ Medico }); 
Internacion.associate({ Paciente, Medico, Origen });
Origen.associate({ Internacion });


// Exportar los modelos
module.exports = {
  Cobertura,
  Paciente,
  Medico,
  Especialidad
};
