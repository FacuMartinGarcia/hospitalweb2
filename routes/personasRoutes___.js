const express = require('express');
const router = express.Router();
const Persona = require('../models/Persona');
const PersonaRol = require('../models/PersonaRol');
const MedicoDetalles = require('../models/MedicoDetalles');
const EnfermeroDetalles = require('../models/EnfermeroDetalles');
const PacienteDetalles = require('../models/PacienteDetalles');

const personas = [];
const personaRoles = [];
const medicoDetalles = [];
const enfermeroDetalles = [];
const pacienteDetalles = [];

router.post('/', (req, res) => {
    try {
        const { tipoPersona, datosPersona, datosEspecificos } = req.body;
        

        if (!tipoPersona || !datosPersona || !datosEspecificos) {
            return res.status(400).json({ error: "Faltan parámetros requeridos" });
        }

        const existePersona = personas.some(p => p.documento === datosPersona.documento);
        if (existePersona) {
            return res.status(400).json({ error: "Ya existe una persona con este documento" });
        }

        const nuevaPersona = new Persona(
            datosPersona.apellidoNombres,
            datosPersona.documento,
            datosPersona.fechaNacimiento,
            datosPersona.sexo,
            datosPersona.direccion,
            datosPersona.telefono,
            datosPersona.email,
            datosPersona.fechaFallecimiento || null,
            datosPersona.actaDefuncion || null
        );
        
        personas.push(nuevaPersona);

        // aca le asignamos el ROL
        let idRol;
        switch(tipoPersona.toLowerCase()) {
            case "medico": idRol = 2; break;
            case "enfermero": idRol = 3; break;
            case "paciente": idRol = 1; break;
            default: return res.status(400).json({ error: "Tipo de persona no válido" });
        }
        
        const nuevoRol = new PersonaRol(nuevaPersona.idPersona, idRol);
        personaRoles.push(nuevoRol);
        
        // Detalles de cada ROL
        let detallesCreados;
        switch(tipoPersona.toLowerCase()) {
            case "medico":
                if (!datosEspecificos.idEspecialidad || !datosEspecificos.matricula) {
                    return res.status(400).json({ error: "Faltan datos específicos para médico" });
                }
                detallesCreados = new MedicoDetalles(
                    nuevaPersona.idPersona,
                    datosEspecificos.idEspecialidad,
                    datosEspecificos.matricula
                );
                medicoDetalles.push(detallesCreados);
                break;
                
            case "enfermero":
                if (!datosEspecificos.idTurno) {
                    return res.status(400).json({ error: "Falta el turno para enfermero" });
                }
                detallesCreados = new EnfermeroDetalles(
                    nuevaPersona.idPersona,
                    datosEspecificos.idTurno
                );
                enfermeroDetalles.push(detallesCreados);
                break;
                
            case "paciente":
                if (!datosEspecificos.cobertura) {
                    return res.status(400).json({ error: "Falta la cobertura para paciente" });
                }
                detallesCreados = new PacienteDetalles(
                    nuevaPersona.idPersona,
                    datosEspecificos.cobertura,
                    datosEspecificos.contactoEmergencia || ""
                );
                pacienteDetalles.push(detallesCreados);
                break;
        }
        
        res.status(201).json({
            persona: nuevaPersona,
            rol: nuevoRol,
            detalles: detallesCreados,
            tipo: tipoPersona.toLowerCase()
        });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
