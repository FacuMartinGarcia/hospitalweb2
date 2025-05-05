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

      const pacientes = await leerJSON('pacientes.json');
      datosPaciente.documento = Number(datosPaciente.documento);

      if (isNaN(datosPaciente.documento)) {
        return res.status(400).json({ 
          success: false,
          error: 'El documento debe ser un número válido' 
        });
      }

      const yaExiste = pacientes.some(p => p.documento === datosPaciente.documento);
      if (yaExiste) {
        return res.status(400).json({ 
          success: false,
          error: 'Ya existe un paciente con este documento' 
        });
      }

      datosPaciente.idPaciente = Date.now();
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

      const pacienteActualizado = {
        ...pacientes[index],
        ...datosPaciente,
        idPaciente: pacientes[index].idPaciente, 
        documento: pacientes[index].documento  
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