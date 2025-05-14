const Cobertura = require('./Cobertura');
const Paciente = require('./Paciente');
const Medico = require('./Medico');
const Especialidad = require('./Especialidad');
const Internacion = require('./Internacion'); 




Cobertura.associate({ Paciente });
Paciente.associate({ Cobertura });
Medico.associate({ Especialidad });
Especialidad.associate({ Medico }); 

module.exports = {
  Cobertura,
  Paciente,
  Medico,
  Especialidad
};
