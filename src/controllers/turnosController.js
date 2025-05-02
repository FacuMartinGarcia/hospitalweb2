const { leerJSON } = require('../utils/dataUtils');

const turnosController = {
  listar: async (req, res) => {
    try {
      const turnos = await leerJSON('turnos.json');
      res.json(turnos);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener turnos: ' + error.message });
    }
  },

  buscarPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const turnos = await leerJSON('turnos.json');
      const turno = turnos.find(m => m.idTurno == id);
      if (!turno) {
        return res.status(404).json({ error: 'Turno no encontrado' });
      }
      res.json(turno);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};


module.exports = turnosController;