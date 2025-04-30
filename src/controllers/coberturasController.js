const { leerJSON } = require('../utils/dataUtils');

const coberturasController = {
  listar: async (req, res) => {
    try {
      const coberturas = await leerJSON('coberturas.json');
      console.log("Coberturas: " + coberturas);
      res.json(coberturas);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener coberturas: ' + error.message });
    }
  }
};


module.exports = coberturasController;