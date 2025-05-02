const { leerJSON, guardarJSON } = require('../utils/dataUtils');



const personasController = {
  
  crearPersona: async (req, res) => {
    try {
      const { tipoPersona, datosPersona, datosEspecificos } = req.body;

      if (!tipoPersona || !datosPersona || !datosEspecificos) {
        return res.status(400).json({ error: 'Faltan parámetros requeridos' });
      }

      const personas = await leerJSON('personas.json');
      
      datosPersona.documento = parseInt(datosPersona.documento); 

      console.log("Entré por nueva persona");
      
      if (isNaN(datosPersona.documento)) {  
        return res.status(400).json({ error: 'El documento debe ser un número' });
      } 

      const yaExiste = personas.find(p => p.documento === datosPersona.documento);

      if (yaExiste) {
        return res.status(400).json({ error: 'Ya existe una persona con este documento' });
      }

      datosPersona.id = Date.now(); // ID único
      personas.push(datosPersona);
      await guardarJSON('personas.json', personas);

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

      console.log(req.url);
      
      const { documento } = req.params;

      console.log("documento que llega al controller" + documento);

      const personas = await leerJSON('personas.json');

      console.log("Contenido de personas.json:", personas);
      console.log("Tipo del documento recibido:", typeof documento);

      //const persona = personas.find(p => p.documento.toString() === documento.toString());
           
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
  },

  asignarRol: async (req, res) => {
    try {
      const { idPersona, tipoPersona, datosEspecificos } = req.body;
  
      if (!idPersona || !tipoPersona || !datosEspecificos) {
        return res.status(400).json({ error: 'Faltan datos necesarios' });
      }
  
      const personasRol = await leerJSON('personasRol.json');
  
      const idRol = tipoPersona.toLowerCase() === 'paciente' ? 1 :
                    tipoPersona.toLowerCase() === 'medico' ? 2 :
                    tipoPersona.toLowerCase() === 'enfermero' ? 3 : null;
  
      if (!idRol) {
        return res.status(400).json({ error: 'Rol inválido' });
      }
  
      const yaTieneRol = personasRol.some(pr => pr.idPersona === idPersona && pr.idRol === idRol);
      if (yaTieneRol) {
        return res.status(400).json({ error: 'La persona ya tiene este rol' });
      }
  
      personasRol.push({ idPersona, idRol, ...datosEspecificos });
      await guardarJSON('personasRol.json', personasRol);
  
      return res.status(200).json({ mensaje: 'Rol asignado correctamente' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al asignar rol' });
    }
  },
  
  eliminarRol: async (req, res) => {
    try {
      const { idPersona, idRol } = req.body;
  
      if (!idPersona || !idRol) {
        return res.status(400).json({ error: 'Faltan parámetros' });
      }
  
      let personasRol = await leerJSON('personasRol.json');
      const cantidadAntes = personasRol.length;
      personasRol = personasRol.filter(pr => !(pr.idPersona === idPersona && pr.idRol === idRol));
  
      if (personasRol.length === cantidadAntes) {
        return res.status(404).json({ error: 'El rol no se encontró para esa persona' });
      }
  
      await guardarJSON('personasRol.json', personasRol);
      return res.status(200).json({ mensaje: 'Rol eliminado correctamente' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al eliminar rol' });
    }
  },

  actualizarPersona: async (req, res) => {
    try {
      const { tipoPersona, datosPersona, datosEspecificos } = req.body;
  
      if (!tipoPersona || !datosPersona || !datosEspecificos) {
        return res.status(400).json({ error: 'Faltan parámetros requeridos' });
      }
  
      const personas = await leerJSON('personas.json');
      console.log(datosPersona.documento);
      console.log(typeof datosPersona.documento);

      const index = personas.findIndex(p => p.documento === parseInt(datosPersona.documento));
  
      if (index === -1) {
        return res.status(404).json({ error: 'Persona no encontrada' });
      }
  
      datosPersona.id = personas[index].id;
      personas[index] = datosPersona;
      await guardarJSON('personas.json', personas);
  
      const detallesActualizados = { idPersona: datosPersona.id, ...datosEspecificos };
  
      if (tipoPersona.toLowerCase() === 'medico') {
        const medicos = await leerJSON('medicosDetalles.json');
        const i = medicos.findIndex(d => d.idPersona === datosPersona.id);
        if (i !== -1) medicos[i] = detallesActualizados;
        else medicos.push(detallesActualizados);
        await guardarJSON('medicosDetalles.json', medicos);
      } else if (tipoPersona.toLowerCase() === 'enfermero') {
        const enfermeros = await leerJSON('enfermerosDetalles.json');
        const i = enfermeros.findIndex(d => d.idPersona === datosPersona.id);
        if (i !== -1) enfermeros[i] = detallesActualizados;
        else enfermeros.push(detallesActualizados);
        await guardarJSON('enfermerosDetalles.json', enfermeros);
      } else if (tipoPersona.toLowerCase() === 'paciente') {
        const pacientes = await leerJSON('pacientesDetalles.json');
        const i = pacientes.findIndex(d => d.idPersona === datosPersona.id);
        if (i !== -1) pacientes[i] = detallesActualizados;
        else pacientes.push(detallesActualizados);
        await guardarJSON('pacientesDetalles.json', pacientes);
      }
  
      res.status(200).json({
        mensaje: 'Persona actualizada correctamente',
        persona: datosPersona,
        detalles: detallesActualizados
      });
    } catch (error) {
      console.error('Error al actualizar persona:', error);
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
