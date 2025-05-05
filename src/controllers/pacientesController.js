const { leerJSON, guardarJSON } = require('../utils/dataUtils');

const pacientesController = {
  crearPaciente: async (req, res) => {
    try {
      const { datosPaciente } = req.body;

      if (!datosPaciente) {
        return res.status(400).json({ 
          success: false,
          error: 'Faltan parámetros requeridos' 
        });
      }
      if (!datosPaciente.documento) {
        return res.status(400).json({ 
          success: false,
          error: 'El documento es obligatorio' 
        });
      }

      if (!datosPaciente.apellidoNombres) {
        return res.status(400).json({ 
          success: false,
          error: 'El apellido y nombres son obligatorios' 
        });
      }

      if (!datosPaciente.idCobertura) {
        return res.status(400).json({ 
          success: false,
          error: 'Debe seleccionar una cobertura' 
        });
      }

      const documento = Number(datosPaciente.documento);
      if (isNaN(documento)) {
        return res.status(400).json({ 
          success: false,
          error: 'El documento debe ser un número válido' 
        });
      }

      if (documento.toString().length > 9) {
        return res.status(400).json({ 
          success: false,
          error: 'El documento no debe exceder los 9 dígitos' 
        });
      }


      if (datosPaciente.telefono && !/^\d{1,20}$/.test(datosPaciente.telefono)) {
        return res.status(400).json({ 
          success: false,
          error: 'El teléfono debe contener solo números (máx. 20 dígitos)' 
        });
      }

      if (datosPaciente.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datosPaciente.email)) {
        return res.status(400).json({ 
          success: false,
          error: 'El correo electrónico no tiene un formato válido' 
        });
      }
      if (datosPaciente.fechaNacimiento) {
        const fechaNac = new Date(datosPaciente.fechaNacimiento);
        const hoy = new Date();
        const hace150años = new Date(hoy.getFullYear() - 150, hoy.getMonth(), hoy.getDate());

        if (fechaNac > hoy) {
          return res.status(400).json({ 
            success: false,
            error: 'La fecha de nacimiento no puede ser futura' 
          });
        }

        if (fechaNac < hace150años) {
          return res.status(400).json({ 
            success: false,
            error: 'La fecha de nacimiento no puede ser mayor a 150 años atrás' 
          });
        }
      }

      if (datosPaciente.fechaFallecimiento) {
        const fechaFal = new Date(datosPaciente.fechaFallecimiento);
        const hoy = new Date();
        const hace30dias = new Date(hoy);
        hace30dias.setDate(hoy.getDate() - 30);

        if (fechaFal > hoy) {
          return res.status(400).json({ 
            success: false,
            error: 'La fecha de fallecimiento no puede ser futura' 
          });
        }

        if (fechaFal < hace30dias) {
          return res.status(400).json({ 
            success: false,
            error: 'La fecha de fallecimiento no puede ser anterior a 30 días' 
          });
        }
      }

      if (datosPaciente.contactoEmergencia && datosPaciente.contactoEmergencia.trim().length < 3) {
        return res.status(400).json({ 
          success: false,
          error: 'El contacto de emergencia debe tener al menos 3 caracteres' 
        });
      }

      const pacientes = await leerJSON('pacientes.json');
      const yaExiste = pacientes.some(p => p.documento === documento);
      if (yaExiste) {
        return res.status(400).json({ 
          success: false,
          error: 'Ya existe un paciente con este documento' 
        });
      }

      const nuevoPaciente = {
        ...datosPaciente,
        idPaciente: Date.now(),
        documento: documento
      };

      pacientes.push(nuevoPaciente);
      await guardarJSON('pacientes.json', pacientes);

      return res.status(201).json({
        success: true,
        paciente: nuevoPaciente,
        mensaje: 'Paciente registrado correctamente'
      });

    } catch (error) {
      console.error('Error en crearPaciente:', error);
      return res.status(500).json({ 
        success: false,
        error: 'Error interno del servidor' 
      });
    }
  },
actualizarPaciente: async (req, res) => {
    try {
      const { documento } = req.params;
      const { datosPaciente } = req.body;
  
      if (!datosPaciente || !documento) {
        return res.status(400).json({ 
          success: false,
          error: 'Faltan datos requeridos' 
        });
      }

      const documentoNumero = parseInt(documento);
      
      if (isNaN(documentoNumero)) {
        return res.status(400).json({
          success: false,
          error: 'El documento debe ser un número válido'
        });
      }

      if (!datosPaciente.apellidoNombres) {
        return res.status(400).json({ 
          success: false,
          error: 'El apellido y nombres son obligatorios' 
        });
      }

  
      if (!datosPaciente.idCobertura) {
        return res.status(400).json({ 
          success: false,
          error: 'Debe seleccionar una cobertura' 
        });
      }

      if (datosPaciente.telefono && !/^\d{1,20}$/.test(datosPaciente.telefono)) {
        return res.status(400).json({ 
          success: false,
          error: 'El teléfono debe contener solo números (máx. 20 dígitos)' 
        });
      }

      if (datosPaciente.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datosPaciente.email)) {
        return res.status(400).json({ 
          success: false,
          error: 'El correo electrónico no tiene un formato válido' 
        });
      }

      if (datosPaciente.fechaNacimiento) {
        const fechaNac = new Date(datosPaciente.fechaNacimiento);
        const hoy = new Date();
        const hace150años = new Date(hoy.getFullYear() - 150, hoy.getMonth(), hoy.getDate());

        if (fechaNac > hoy) {
          return res.status(400).json({ 
            success: false,
            error: 'La fecha de nacimiento no puede ser futura' 
          });
        }

        if (fechaNac < hace150años) {
          return res.status(400).json({ 
            success: false,
            error: 'La fecha de nacimiento no puede ser mayor a 150 años atrás' 
          });
        }
      }


      if (datosPaciente.fechaFallecimiento) {
        const fechaFal = new Date(datosPaciente.fechaFallecimiento);
        const hoy = new Date();
        const hace30dias = new Date(hoy);
        hace30dias.setDate(hoy.getDate() - 30);

        if (fechaFal > hoy) {
          return res.status(400).json({ 
            success: false,
            error: 'La fecha de fallecimiento no puede ser futura' 
          });
        }

        if (fechaFal < hace30dias) {
            return res.status(400).json({ 
              success: false,
              error: 'La fecha de fallecimiento no puede ser anterior a 30 días' 
            });
          }
      }

      if (datosPaciente.contactoEmergencia && datosPaciente.contactoEmergencia.trim().length < 3) {
        return res.status(400).json({ 
          success: false,
          error: 'El contacto de emergencia debe tener al menos 3 caracteres' 
        });
      }

      const pacientes = await leerJSON('pacientes.json');
      const index = pacientes.findIndex(p => p.documento === documentoNumero);
  
      if (index === -1) {
        return res.status(404).json({ 
          success: false,
          error: 'Paciente no encontrado' 
        });
      }

      const pacienteActualizado = {
        ...pacientes[index],
        ...datosPaciente,
        idPaciente: pacientes[index].idPaciente,
        documento: pacientes[index].documento   
      };
  
      pacientes[index] = pacienteActualizado;
      await guardarJSON('pacientes.json', pacientes);
      
      return res.status(200).json({
        success: true,
        paciente: pacienteActualizado,
        mensaje: 'Paciente actualizado correctamente'
      });

    } catch (error) {
      console.error('Error al actualizar paciente:', error);
      return res.status(500).json({ 
        success: false,
        error: 'Error interno del servidor' 
      });
    }
  },
guardarPaciente: async (req, res) => {
  try {
    const { datosPaciente } = req.body;
    
    if (!datosPaciente) {
      return res.status(400).json({ error: 'Faltan datos del paciente' });
    }

    const pacientes = await leerJSON('pacientes.json');

    const documento = parseInt(datosPaciente.documento);
    

    const index = pacientes.findIndex(p => p.documento === documento);
    
    if (index >= 0) {

      pacientes[index] = { ...pacientes[index], ...datosPaciente };

    } else {

      datosPaciente.id = Date.now();
      pacientes.push(datosPaciente);

    }

    await guardarJSON('pacientes.json', pacientes);
    
    return res.status(200).json({
      success: true,
      paciente: datosPaciente
    });

  } catch (error) {
    console.error('Error en guardarPaciente:', error);
    return res.status(500).json({ error: error.message });
  }
},
buscarPorDocumento: async (req, res) => {
  try {
    const { documento } = req.params;
    
    if (!documento) {
      return res.status(400).json({
        success: false,
        error: 'Debe proporcionar un documento'
      });
    }

    const documentoNumero = parseInt(documento);
    if (isNaN(documentoNumero)) {
      return res.status(400).json({
        success: false,
        error: 'El documento debe ser un número válido'
      });
    }

    const pacientes = await leerJSON('pacientes.json');
    
    const paciente = pacientes.find(p => p.documento === documentoNumero);
    
    if (!paciente) {
      return res.status(404).json({ 
        success: false,
        error: 'Paciente no encontrado' 
      });
    }
    
    return res.status(200).json({
      success: true,
      paciente
    });

  } catch (error) {
    console.error('Error en buscarPorDocumento:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Error interno del servidor' 
    });
  }
}
};  

module.exports = pacientesController;