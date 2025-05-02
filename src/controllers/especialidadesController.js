const { leerJSON } = require('../utils/dataUtils');

const especialidadesController = {
  listar: async (req, res) => {
    try {
      const especialidades = await leerJSON('especialidades.json');
      console.log("Especialidades: " + especialidades);
      res.json(especialidades);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener especialidades: ' + error.message });
    }
  },
  
  buscarPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const especialidades = await leerJSON('especialidades.json');
      const especialidad = especialidades.find(e => e.idEspecialidad == id);
      if (!especialidad) {
        return res.status(404).json({ error: 'Especialidad no encontrada' });
      }
      res.json(especialidad);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};


module.exports = especialidadesController;