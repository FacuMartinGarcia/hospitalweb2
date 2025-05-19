const db = require('../models'); 
const { Medico, Especialidad } = db;

const medicosController = {
  listar: async (req, res) => {
    try {
      const medicos = await Medico.findAll({
        attributes: ['idmedico', 'apellidonombres', 'matricula', 'telefono', 'email', 'idespecialidad'],
        order: [['apellidonombres', 'ASC']],
        include: {
          association: 'especialidad',
          attributes: ['denominacion']
        }
      });

      res.json({
        success: true,
        medicos
      });
    } catch (error) {
      console.error('Error al obtener médicos:', error);
      res.status(500).json({ 
        success: false,
        error: 'Error al obtener médicos: ' + error.message 
      });
    }
  },

  buscarPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const medico = await Medico.findByPk(id, {
        attributes: ['idmedico', 'apellidonombres', 'matricula', 'telefono', 'email', 'idespecialidad'],
        include: {
          association: 'especialidad',
          attributes: ['idespecialidad', 'denominacion']
        }
      });

      if (!medico) {
        return res.status(404).json({ 
          success: false,
          error: 'Médico no encontrado' 
        });
      }

      res.json({
        success: true,
        medico
      });
    } catch (error) {
      console.error('Error al buscar médico:', error);
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  },

  crear: async (req, res) => {
    try {
      const { apellidonombres, matricula, telefono, email, idespecialidad } = req.body;

      if (!apellidonombres || !matricula) {
        return res.status(400).json({
          success: false,
          error: 'Apellido y nombres y matrícula son requeridos'
        });
      }

      const nuevoMedico = await Medico.create({ 
        apellidonombres, 
        matricula, 
        telefono, 
        email, 
        idespecialidad 
      });

      res.status(201).json({
        success: true,
        medico: {
          idmedico: nuevoMedico.idmedico,
          apellidonombres: nuevoMedico.apellidonombres,
          matricula: nuevoMedico.matricula,
          telefono: nuevoMedico.telefono,
          email: nuevoMedico.email,
          idespecialidad: nuevoMedico.idespecialidad
        }
      });
    } catch (error) {
      console.error('Error al crear médico:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  actualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const { apellidonombres, matricula, telefono, email, idespecialidad } = req.body;

      const medico = await Medico.findByPk(id);

      if (!medico) {
        return res.status(404).json({
          success: false,
          error: 'Médico no encontrado'
        });
      }

      if (!apellidonombres || !matricula) {
        return res.status(400).json({
          success: false,
          error: 'Apellido y nombres y matrícula son requeridos'
        });
      }

      medico.apellidonombres = apellidonombres;
      medico.matricula = matricula;
      medico.telefono = telefono || null;
      medico.email = email || null;
      medico.idespecialidad = idespecialidad || null;

      await medico.save();

      res.json({
        success: true,
        medico: {
          idmedico: medico.idmedico,
          apellidonombres: medico.apellidonombres,
          matricula: medico.matricula,
          telefono: medico.telefono,
          email: medico.email,
          idespecialidad: medico.idespecialidad
        }
      });
    } catch (error) {
      console.error('Error al actualizar médico:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  eliminar: async (req, res) => {
    try {
      const { id } = req.params;

      const medico = await Medico.findByPk(id);

      if (!medico) {
        return res.status(404).json({
          success: false,
          error: 'Médico no encontrado'
        });
      }

      await medico.destroy();

      res.json({
        success: true,
        message: 'Médico eliminado correctamente'
      });
    } catch (error) {
      console.error('Error al eliminar médico:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  reactivar: async (req, res) => {
    try {
      const { id } = req.params;

      const medico = await Medico.findOne({
        where: { idmedico: id },
        paranoid: false
      });

      if (!medico) {
        return res.status(404).json({
          success: false,
          error: 'Médico no encontrado'
        });
      }

      if (!medico.deletedAt) {
        return res.status(400).json({
          success: false,
          error: 'El médico no está eliminado'
        });
      }

      await medico.restore();

      res.json({
        success: true,
        message: 'Médico reactivado correctamente',
        medico: {
          idmedico: medico.idmedico,
          apellidonombres: medico.apellidonombres,
          matricula: medico.matricula,
          deletedAt: null
        }
      });
    } catch (error) {
      console.error('Error al reactivar médico:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  obtenerMedicos: async () => {
    try {
      const medicos = await Medico.findAll({
        include: [{
          model: Especialidad,
          as: 'especialidad',
          attributes: ['denominacion']
        }],
        attributes: [
          'apellidonombres',
          'matricula',
          'telefono',
          'email'
        ],
        order: [['apellidonombres', 'ASC']]
      });
      console.log("Listado de médicos:");
      console.log(medicos);
      return medicos;
    } catch (error) {
      console.error('Error al obtener médicos:', error);
      return [];
    }
  }
};

module.exports = medicosController;
