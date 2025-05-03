const { leerJSON, guardarJSON } = require('../utils/dataUtils');

const pacientesController = {
  crearPaciente: async (req, res) => {
    try {
      const { datosPaciente } = req.body;

      // Validaciones básicas
      if (!datosPaciente) {
        return res.status(400).json({ 
          success: false,
          error: 'Faltan parámetros requeridos' 
        });
      }
      /*
      // Campos obligatorios
      const camposRequeridos = ['documento', 'apellidoNombres', 'fechaNacimiento', 'sexo', 'idCobertura', 'contactoEmergencia'];
      const faltantes = camposRequeridos.filter(campo => !datosPaciente[campo]);
      
      if (faltantes.length > 0) {
        return res.status(400).json({
          success: false,
          error: `Faltan campos obligatorios: ${faltantes.join(', ')}`
        });
      }
      */
      const pacientes = await leerJSON('pacientes.json');
      
      // Validar documento
      datosPaciente.documento = parseInt(datosPaciente.documento);
      if (isNaN(datosPaciente.documento)) {
        return res.status(400).json({ 
          success: false,
          error: 'El documento debe ser un número válido' 
        });
      }

      // Verificar si ya existe
      const yaExiste = pacientes.some(p => p.documento === datosPaciente.documento);
      if (yaExiste) {
        return res.status(400).json({ 
          success: false,
          error: 'Ya existe un paciente con este documento' 
        });
      }

      // Crear nuevo paciente
      datosPaciente.id = Date.now();
      pacientes.push(datosPaciente);

      await guardarJSON('pacientes.json', pacientes);

      return res.status(201).json({
        success: true,
        paciente: datosPaciente,
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
      console.log('Método PUT recibido');
      console.log('documento param:', req.params.documento);
      console.log('body:', req.body);
      
      const { documento } = req.params;
      const { datosPaciente } = req.body;
  
      // Validaciones básicas
      if (!datosPaciente || !documento) {
        return res.status(400).json({ 
          success: false,
          error: 'Faltan datos requeridos' 
        });
      }
  
      const pacientes = await leerJSON('pacientes.json');
      const documentoNumero = parseInt(documento);
      
      if (isNaN(documentoNumero)) {
        return res.status(400).json({
          success: false,
          error: 'El documento debe ser un número válido'
        });
      }

      const index = pacientes.findIndex(p => p.documento === documentoNumero);
  
      if (index === -1) {
        return res.status(404).json({ 
          success: false,
          error: 'Paciente no encontrado' 
        });
      }
  
      // Actualizar datos manteniendo el ID original

      const pacienteActualizado = {
        ...pacientes[index],
        ...datosPaciente,
        idPaciente: pacientes[index].idPaciente, // Mantener el ID original
        documento: pacientes[index].documento  // No permitir cambiar el documento
      };
  
      pacientes[index] = pacienteActualizado;
      await guardarJSON('pacientes.json', pacientes);
      console.log('Paciente encontrado:', pacientes[index]);
      console.log('Paciente actualizado:', pacienteActualizado);
      
      console.log('Enviando respuesta al frontend');
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
  },
  // pacientesController.js
guardarPaciente: async (req, res) => {
  try {
    const { datosPaciente } = req.body;
    
    if (!datosPaciente) {
      return res.status(400).json({ error: 'Faltan datos del paciente' });
    }

    const pacientes = await leerJSON('pacientes.json');

    const documento = parseInt(datosPaciente.documento);
    
    // Buscar si ya existe
    const index = pacientes.findIndex(p => p.documento === documento);
    
    if (index >= 0) {
      // Actualizar existente
      pacientes[index] = { ...pacientes[index], ...datosPaciente };
    } else {
      // Crear nuevo
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
}
};  

module.exports = pacientesController;