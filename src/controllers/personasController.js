const Persona = require('../models/Persona');
const PersonaRol = require('../models/PersonaRol');
const MedicoDetalles = require('../models/MedicoDetalles');
const EnfermeroDetalles = require('../models/EnfermeroDetalles');
const PacienteDetalles = require('../models/PacienteDetalles');

const personasController = {
  crearPersona: async (req, res) => {
    try {
      const { tipoPersona, datosPersona, datosEspecificos } = req.body;
      
      // Validaciones básicas
      if (!tipoPersona || !datosPersona || !datosEspecificos) {
        return res.status(400).json({ error: 'Faltan parámetros requeridos' });
      }

      // Verificar si la persona ya existe
      const personaExistente = await Persona.findOne({ documento: datosPersona.documento });
      
      if (personaExistente) {
        return res.status(400).json({ error: 'Ya existe una persona con este documento' });
      }

      // Crear nueva persona
      const nuevaPersona = new Persona(datosPersona);
      await nuevaPersona.save();

      // Asignar rol según el tipo
      let idRol;
      switch(tipoPersona.toLowerCase()) {
        case 'medico': idRol = 2; break;
        case 'enfermero': idRol = 3; break;
        case 'paciente': idRol = 1; break;
        default: 
          await Persona.deleteOne({ _id: nuevaPersona._id });
          return res.status(400).json({ error: 'Tipo de persona no válido' });
      }

      const nuevoRol = new PersonaRol({
        idPersona: nuevaPersona._id,
        idRol
      });
      await nuevoRol.save();

      // Crear detalles específicos
      let detalles;
      switch(tipoPersona.toLowerCase()) {
        case 'medico':
          detalles = new MedicoDetalles({
            idPersona: nuevaPersona._id,
            idEspecialidad: datosEspecificos.idEspecialidad,
            matricula: datosEspecificos.matricula
          });
          break;
        case 'enfermero':
          detalles = new EnfermeroDetalles({
            idPersona: nuevaPersona._id,
            turno: datosEspecificos.turno
          });
          break;
        case 'paciente':
          detalles = new PacienteDetalles({
            idPersona: nuevaPersona._id,
            cobertura: datosEspecificos.cobertura,
            contactoEmergencia: datosEspecificos.contactoEmergencia
          });
          break;
      }

      await detalles.save();

      res.status(201).json({
        persona: nuevaPersona,
        rol: nuevoRol,
        detalles
      });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  buscarPorDocumento: async (req, res) => {
    try {
      const { documento } = req.params;
      
      const persona = await Persona.findOne({ documento });
      if (!persona) {
        return res.status(404).json({ error: 'Persona no encontrada' });
      }

      
      const roles = await PersonaRol.find({ idPersona: persona._id });
      
      let detalles = null;
      const tieneRolMedico = roles.some(r => r.idRol === 2);
      const tieneRolEnfermero = roles.some(r => r.idRol === 3);
      const tieneRolPaciente = roles.some(r => r.idRol === 1);

      if (tieneRolMedico) {
        detalles = await MedicoDetalles.findOne({ idPersona: persona._id });
      } else if (tieneRolEnfermero) {
        detalles = await EnfermeroDetalles.findOne({ idPersona: persona._id });
      } else if (tieneRolPaciente) {
        detalles = await PacienteDetalles.findOne({ idPersona: persona._id });
      }

      res.json({
        persona,
        roles,
        detalles
      });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = personasController;