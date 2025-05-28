const db = require('../models'); 
const { Medico, Especialidad } = db;
const { Op } = require('sequelize');

const medicosController = {
  validarMatricula: (matricula) => {
      const result = {
          isValid: true,
          error: null
      };
      
      if (!matricula || typeof matricula !== 'string') {
          result.isValid = false;
          result.error = 'La matrícula es requerida';
          return result;
      }
      
      matricula = matricula.trim();
      
      if (matricula.length < 3 || matricula.length > 6) {
          result.isValid = false;
          result.error = 'La matrícula debe tener entre 3 y 6 caracteres';
          return result;
      }
      
      if (!/^[a-zA-Z0-9]+$/.test(matricula)) {
          result.isValid = false;
          result.error = 'La matrícula solo debe contener letras y números (sin espacios ni símbolos)';
          return result;
      }
      
      return result;
  },

  validarMedico: function(data, esActualizacion = false) {

    const errores = [];

    if (!data.apellidonombres || data.apellidonombres.trim() === '') {
      errores.push('El Apellido y Nombres es obligatorio.');
    } else if (!/^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]+$/.test(data.apellidonombres)) {
      errores.push('El Apellido y Nombres solo debe contener letras y espacios.');
    }

    if (!esActualizacion) {
      if (!data.matricula || data.matricula.trim() === '') {
        errores.push('La matrícula es obligatoria.');
      } else if (!this.validarMatricula(data.matricula)) {
        errores.push('La matrícula no tiene un formato válido.');
      }
    }

    if (data.telefono && !/^\d{1,20}$/.test(data.telefono)) {
      errores.push('El teléfono debe contener solo números (máx. 20 dígitos).');
    }

    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errores.push('El correo electrónico no tiene un formato válido.');
    }

    if (!data.idespecialidad) {
      errores.push('Debe seleccionar una especialidad.');
    }

    return errores;
  },

  buscarPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const medico = await Medico.findByPk(id, {
        attributes: ['idmedico', 'apellidonombres', 'matricula', 'telefono', 'email', 'idespecialidad'],
        paranoid: false,
        include: {
          model: Especialidad,
          as: 'especialidad',
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
        error: 'Error interno del servidor' 
      });
    }
  },

  buscarPorMatricula: async (req, res) => {
    try {
      const { matricula } = req.params;
      const medico = await Medico.findOne({
        where: { matricula },
        paranoid: false,
        include: {
          model: Especialidad,
          as: 'especialidad', 
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
        error: 'Error interno del servidor' 
      });
    }
  },

  crearMedico: async (req, res) => {
    try {
      const { apellidonombres, matricula, telefono, email, idespecialidad } = req.body;

      const errores = medicosController.validarMedico(req.body);
      if (errores.length > 0) {
        return res.status(400).json({
          success: false,
          errors: errores
        });
      }
      const medicoExistente = await Medico.findOne({ 
        where: { matricula } 
      });
      
      if (medicoExistente) {
        return res.status(400).json({
          success: false,
          error: 'La matrícula ya está en uso'
        });
      }

      const nuevoMedico = await Medico.create({ 
        apellidonombres: apellidonombres.trim(),
        matricula: matricula.trim(),
        telefono: telefono ? telefono.trim() : null,
        email: email ? email.trim() : null,
        idespecialidad
      });

      res.status(201).json({
        success: true,
        medico: nuevoMedico
      });
      
    } catch (error) {
      console.error('Error al crear médico:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  },

  actualizarMedico: async (req, res) => {
    try {
      const { matricula } = req.params;
      const datosActualizados = req.body;

      const errores = medicosController.validarMedico(datosActualizados, true);
      if (errores.length > 0) {
        return res.status(400).json({
          success: false,
          errors: errores
        });
      }

      const medico = await Medico.findOne({ where: { matricula } });
      if (!medico) {
        return res.status(404).json({
          success: false,
          error: 'Médico no encontrado'
        });
      }

      await medico.update({
        apellidonombres: datosActualizados.apellidonombres.trim(),
        telefono: datosActualizados.telefono ? datosActualizados.telefono.trim() : null,
        email: datosActualizados.email ? datosActualizados.email.trim() : null,
        idespecialidad: datosActualizados.idespecialidad
      });

      res.json({
        success: true,
        medico
      });
      
    } catch (error) {
      console.error('Error al actualizar médico:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  },

  listarMedicos: async (req, res) => {
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
        error: 'Error al obtener médicos' 
      });
    }
  },

  eliminarMedico: async (req, res) => {
    try {
      const { matricula } = req.params;
      const medico = await Medico.findOne({ where: { matricula } });

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
        error: 'Error interno del servidor'
      });
    }
  },

  reactivarMedico: async (req, res) => {
    try {
      const { matricula} = req.params;
      const medico = await Medico.findOne({
        where: { matricula },
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
          matricula: medico.matricula
        }
      });
    } catch (error) {
      console.error('Error al reactivar médico:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
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
          'idmedico',
          'apellidonombres',
          'matricula',
          'telefono',
          'email'
        ],
        order: [['apellidonombres', 'ASC']]
      });
      return medicos;
    } catch (error) {
      console.error('Error al obtener médicos:', error);
      return [];
    }
  }
};

module.exports = medicosController;