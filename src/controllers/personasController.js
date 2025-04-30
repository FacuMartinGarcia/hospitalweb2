//const fs = require('fs').promises;
//const path = require('path');
const { leerJSON, guardarJSON } = require('../utils/dataUtils');

const personasController = {
  crearPersona: async (req, res) => {
    try {
      const { tipoPersona, datosPersona, datosEspecificos } = req.body;

      if (!tipoPersona || !datosPersona || !datosEspecificos) {
        return res.status(400).json({ error: 'Faltan parámetros requeridos' });
      }

      const personas = await leerJSON('personas');
      console.log(personas);

      
      const yaExiste = personas.find(p => p.documento === datosPersona.documento);

      if (yaExiste) {
        return res.status(400).json({ error: 'Ya existe una persona con este documento' });
      }

      datosPersona.id = Date.now(); // ID único
      personas.push(datosPersona);
      await guardarJSON('personas', personas);

      const personaRol = {
        idPersona: datosPersona.id,
        idRol:
          tipoPersona.toLowerCase() === 'paciente' ? 1 :
          tipoPersona.toLowerCase() === 'medico' ? 2 :
          tipoPersona.toLowerCase() === 'enfermero' ? 3 : null
      };

      if (!personaRol.idRol) {
        return res.status(400).json({ error: 'Tipo de persona no válido' });
      }

      const roles = await leerJSON('personasRoles.json');
      roles.push(personaRol);
      await guardarJSON('personasRoles.json', roles);

      let detalles = { idPersona: datosPersona.id, ...datosEspecificos };

      if (tipoPersona === 'medico') {
        const medicos = await leerJSON('medicosDetalles.json');
        medicos.push(detalles);
        await guardarJSON('medicosDetalles.json', medicos);
      } else if (tipoPersona === 'enfermero') {
        const enfermeros = await leerJSON('enfermerosDetalles.json');
        enfermeros.push(detalles);
        await guardarJSON('enfermerosDetalles.json', enfermeros);
      } else if (tipoPersona === 'paciente') {
        const pacientes = await leerJSON('pacientesDetalles.json');
        pacientes.push(detalles);
        await guardarJSON('pacientesDetalles.json', pacientes);
      }

      res.status(201).json({
        persona: datosPersona,
        rol: personaRol,
        detalles
      });

    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  },

  buscarPorDocumento: async (req, res) => {
    try {
      const { documento } = req.params;
      console.log("documento que llega al controller" + documento);
      const personas = await leerJSON('personas.json');
      console.log("Contenido de personas.json:", personas);
      const coberturas = await leerJSON('coberturas.json');  
      console.log("Contenido de coberturas.json:", coberturas);
      
      console.log("Tipo del documento recibido:", typeof documento);
      const documentoNumero = parseInt(documento);
      const persona = personas.find(p => p.documento === documentoNumero);

      console.log("Persona encontrada:", persona);
      if (!persona) {
        return res.status(404).json({ error: 'Persona no encontrada' });
      }
  
      const roles = await leerJSON('personasRoles.json');
      const rolesPersona = roles.filter(r => r.idPersona === persona.id);
      console.log("Roles de la persona:", rolesPersona);

      
      let detalles = null;
      for (const rol of rolesPersona) {
        let archivoDetalles = '';
        if (rol.idRol === 1) archivoDetalles = 'pacienteDetalles.json';
        else if (rol.idRol === 2) archivoDetalles = 'medicoDetalles.json';
        else if (rol.idRol === 3) archivoDetalles = 'enfermeroDetalle.json';
        if (archivoDetalles) {
          const detallesAll = await leerJSON(archivoDetalles);
          detalles = detallesAll.find(d => d.idPersona === persona.id);
          break;
        }
      }
  
      res.json({
        persona,
        roles: rolesPersona,
        detalles
      });
  
    } catch (error) {
      console.log('Error en buscarPorDocumento:', error);
      res.status(500).json({ error: error.message });
    }
  }
};

/*
  buscarPorDocumento: async (req, res) => {
    try {
      const { documento } = req.params;
      const personas = await leerJSON('personas');
      const persona = personas.find(p => p.documento.toString() === documento.toString());

      if (!persona) {
        return res.status(404).json({ error: 'Persona no encontrada' });
      }

      const roles = await leerJSON('personasRoles');
      const rolPersona = roles.filter(r => r.idPersona === persona.id);

      let detalles = null;
      const esMedico = rolPersona.some(r => r.idRol === 2);
      const esEnfermero = rolPersona.some(r => r.idRol === 3);
      const esPaciente = rolPersona.some(r => r.idRol === 1);

      if (esMedico) {
        const medicos = await leerJSON('medicosDetalles');
        detalles = medicos.find(d => d.idPersona === persona.id);
      } else if (esEnfermero) {
        const enfermeros = await leerJSON('enfermerosDetalles');
        detalles = enfermeros.find(d => d.idPersona === persona.id);
      } else if (esPaciente) {
        const pacientes = await leerJSON('pacientesDetalles');
        detalles = pacientes.find(d => d.idPersona === persona.id);
      }

      res.json({ persona, roles: rolPersona, detalles });

    } catch (error) {
      console.error('Error en buscarPorDocumento:', error);
      res.status(500).json({ error: error.message });
    }
  }/
  */

module.exports = personasController;
