const { Op } = require('sequelize');
const db = require('../models'); 
const { Paciente, Cobertura } = db;

const pacientesController = {
  buscarPorDocumento: async (req, res) => {
    try {
      const documento = parseInt(req.params.documento);

      const paciente = await Paciente.findOne({
        where: { documento },
        include: {
          model: Cobertura,
          as: 'cobertura', 
          attributes: ['idcobertura', 'denominacion'] 
        }
      });

      if (!paciente) {
        return res.status(404).json({ success: false, error: 'Paciente no encontrado' });
      }

      return res.status(200).json({ success: true, paciente });

    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
  },
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

      if (!datosPaciente.apellidonombres) {
        return res.status(400).json({ 
          success: false,
          error: 'El apellido y nombres son obligatorios' 
        });
      }

      if (!datosPaciente.idcobertura) {
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
      if (datosPaciente.fechanacimiento) {
        const fechaNac = new Date(datosPaciente.fechanacimiento);
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

      if (datosPaciente.fechafallecimiento) {
        const fechaFal = new Date(datosPaciente.fechafallecimiento);
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

      if (
        datosPaciente.contactoemergencia &&
        (datosPaciente.contactoemergencia.length < 3 || datosPaciente.contactoemergencia.length > 50)
      ) {
        return res.status(400).json({ 
          success: false,
          error: 'El contacto de emergencia debe tener entre 3 y 50 caracteres'
        });
      }


      const existente = await Paciente.findOne({ where: { documento } });
      if (existente) {
        return res.status(400).json({ success: false, error: 'Ya existe un paciente con este documento' });
      }
  
      const nuevo = await Paciente.create(datosPaciente);
  
      return res.status(201).json({
        success: true,
        paciente: nuevo,
        mensaje: 'Paciente registrado correctamente'
      });
  
    } catch (error) {
      console.error('Error en crearPaciente:', error);
      return res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
  },

  listarPacientes: async (req, res) => {
    try {
      const { page = 1, limit = 10, search = '' } = req.query;

      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);

      if (isNaN(pageNum) || isNaN(limitNum) || pageNum <= 0 || limitNum <= 0) {
        return res.status(400).json({ success: false, error: 'Parámetros de paginación inválidos' });
      }

      const offset = (pageNum - 1) * limitNum;

      const whereClause = {};
      if (search.trim()) {
        whereClause[Op.or] = [
          { apellidonombres: { [Op.like]: `%${search.trim()}%` } },
          { documento: { [Op.like]: `%${search.trim()}%` } }
        ];
      }

      const { count, rows } = await Paciente.findAndCountAll({
        where: whereClause,
        limit: limitNum,
        offset: offset,
        order: [['apellidonombres', 'ASC']],
        attributes: [
          'idpaciente', 
          'apellidonombres', 
          'documento', 
          'fechanacimiento',
          'sexo',
          'telefono',
          'email'
        ]
      });

      return res.status(200).json({
        success: true,
        pacientes: rows,
        total: count,
        totalPages: Math.ceil(count / limitNum),
        currentPage: pageNum
      });

    } catch (error) {
      console.error('Error al listar pacientes:', error);
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

      if (!datosPaciente) {
        return res.status(400).json({ 
          success: false,
          error: 'Faltan parámetros requeridos' 
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
      if (datosPaciente.fechanacimiento) {
        const fechaNac = new Date(datosPaciente.fechanacimiento);
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

      if (datosPaciente.fechafallecimiento) {
        const fechaFal = new Date(datosPaciente.fechafallecimiento);
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

        if (
          datosPaciente.contactoemergencia &&
          (datosPaciente.contactoemergencia.length < 3 || datosPaciente.contactoemergencia.length > 50)
        ) {
          return res.status(400).json({ 
            success: false,
            error: 'El contacto de emergencia debe tener entre 3 y 50 caracteres'
          });
        }


      const paciente = await Paciente.findOne({ where: { documento } });
      if (!paciente) {
        return res.status(404).json({ 
          success: false, 
          error: 'Paciente no encontrado' 
        });
      }

      const camposActualizables = [
        'apellidonombres',
        'fechanacimiento',
        'sexo',
        'direccion',
        'telefono',
        'email',
        'idcobertura',
        'contactoemergencia',
        'fechafallecimiento',
        'actadefuncion'
      ];

      camposActualizables.forEach(campo => {
        if (datosPaciente[campo] !== undefined) {
          paciente[campo] = datosPaciente[campo];
        }
      });

      await paciente.save();

      return res.status(200).json({
        success: true,
        paciente,
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

  eliminarPaciente: async (req, res) => {
    try {
      const { documento } = req.params;

      const paciente = await Paciente.findOne({ where: { documento } });
      if (!paciente) {
        return res.status(404).json({ 
          success: false, 
          error: 'Paciente no encontrado' 
        });
      }

      await paciente.destroy();

      return res.status(200).json({
        success: true,
        mensaje: 'Paciente eliminado correctamente'
      });

    } catch (error) {
      console.error('Error al eliminar paciente:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Error interno del servidor' 
      });
    }
  },
 obtenerPacientes: async () => {
  try {
    const pacientes = await Paciente.findAll({
      include: [{
        model: Cobertura,
        as: 'cobertura',
        attributes: ['denominacion']  
      }],
      attributes: [
        'apellidonombres',
        'documento',
        'fechanacimiento',
      ],
      order: [['apellidonombres', 'ASC']]
    });
    console.log("listado de pacientes");
    console.log(pacientes);
    return pacientes;
  } catch (error) {
    console.error('Error al obtener pacientes:', error);
    return [];
  }
}

};

module.exports = pacientesController;