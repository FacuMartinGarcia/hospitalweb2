const { leerJSON } = require('../utils/dataUtils');

const coberturasController = {
  listar: async (req, res) => {
    try {
      const coberturas = await leerJSON('coberturas.json');
      res.json(coberturas);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener coberturas: ' + error.message });
    }
  },
  
  buscarPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const coberturas = await leerJSON('coberturas.json');
      const cobertura = coberturas.find(m => m.idPersona == id);
      if (!cobertura) {
        return res.status(404).json({ error: 'Cobertura no encontrada' });
      }
      res.json(cobertura);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};


module.exports = coberturasController;