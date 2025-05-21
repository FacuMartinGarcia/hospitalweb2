const Cobertura = require('./Cobertura');
const Paciente = require('./Paciente');
const Medico = require('./Medico');
const Especialidad = require('./Especialidad');
const Internacion = require('./Internacion');
const Origen = require('./Origen');
const Diagnostico = require('./Diagnostico');
const Ala = require('./Ala');
const Unidad = require('./Unidad');
const Habitacion = require('./Habitacion');
const Cama = require('./Cama');
const InternacionCama = require('./InternacionCama');


Cobertura.associate({ Paciente });
Paciente.associate({ Cobertura });
Medico.associate({ Especialidad });
Especialidad.associate({ Medico }); 
Internacion.associate({ Paciente, Medico, Origen, Diagnostico, InternacionCama });
Origen.associate({ Internacion });
Diagnostico.associate({ Internacion });
Ala.associate({ Habitacion });
Unidad.associate({ Habitacion });
Habitacion.associate({ Ala, Unidad, Cama });
Cama.associate({ Habitacion, InternacionCama });
InternacionCama.associate({ Internacion, Cama });



// Exportar los modelos
module.exports = {
  Cobertura,
  Paciente,
  Medico,
  Especialidad,
  Diagnostico,
  Internacion,
  Origen,
  Ala,
  Unidad,
  Habitacion,
  Cama,
  InternacionCama
};
