const { leerJSON, guardarJSON } = require('../utils/dataUtils');



const pacientesController = {
  crearPaciente: async (req, res) => {
    try {
      const { datosPaciente } = req.body;

      if (!datosPaciente) {
        return res.status(400).json({ error: 'Faltan parámetros requeridos' });
      }

      const pacientes = await leerJSON('pacientes.json');
      
      datosPaciente.documento = parseInt(datosPaciente.documento); 

      console.log("Entré por nueva paciente");
      
      if (isNaN(datosPaciente.documento)) {  
        return res.status(400).json({ error: 'El documento debe ser un número' });
      } 

      const yaExiste = pacientes.find(p => p.documento === datosPaciente.documento);

      if (yaExiste) {
        return res.status(400).json({ error: 'Ya existe un paciente con este documento' });
      }

      datosPacientes.id = Date.now(); // ID único
      personas.push(datosPersona);

      await guardarJSON('pacientes.json', pacientes);


      res.status(201).json({
        paciente: datosPaciente,
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
      const pacientes = await leerJSON('pacientes.json');
      console.log("Contenido de pacientes.json:", pacientes);
      console.log("Tipo del documento recibido:", typeof documento);

      //const persona = personas.find(p => p.documento.toString() === documento.toString());
           
      const documentoNumero = parseInt(documento);
      const paciente = pacientes.find(p => p.documento === documentoNumero);
      
      console.log("Paciente encontrado:", paciente);
      if (!paciente) {
        return res.status(404).json({ error: 'paciente no encontrada' });
      }
      
      res.json({
        paciente
      });
  
    } catch (error) {
      console.log('Error en buscarPorDocumento:', error);
      res.status(500).json({ error: error.message });
    }
  }
};  

module.exports = pacientesController;
