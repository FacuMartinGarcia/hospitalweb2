const { Op } = require('sequelize');
const db = require('../models'); 
const { Usuario, Rol } = db;

const usuariosController = {
  listar: async (req, res) => {
    try {
      const usuarios = await Usuario.findAll({
        include: [{ model: Rol, as: 'rol', attributes: ['nombre'] }],
        attributes: ['idusuario', 'nombre', 'usuario', 'idrol',  'matricula', 'activo'],
        order: [['nombre', 'ASC']]
      });

      res.json(usuarios);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(500).json({ 
        success: false,
        error: 'Error al obtener usuarios: ' + error.message 
      });
    }
  },

  buscarPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const usuario = await Usuario.findByPk(id, {
        include: [{ model: Rol, as: 'rol', attributes: ['nombre'] }],
        attributes: ['idusuario', 'nombre', 'usuario', 'idrol',  'matricula', 'activo']
      });

      if (!usuario) {
        return res.status(404).json({ 
          success: false,
          error: 'Usuario no encontrado' 
        });
      }

      res.json({ success: true, usuario });
    } catch (error) {
      console.error('Error al buscar usuario:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  crear: async (req, res) => {
    try {
      const { nombre, usuario, password, idrol, matricula, activo } = req.body;

      if (!nombre || !usuario || !password || !idrol) {
        return res.status(400).json({
          success: false,
          error: 'Faltan campos requeridos'
        });
      }

      const usuarioExistente = await Usuario.findOne({
        where: {
          usuario: { [Op.like]: `%${usuario}%` } 
        }
      });

      if (usuarioExistente) {
        return res.status(400).json({
          success: false,
          error: 'El alias ingresado, ya existe. Elegí otro.'
        });
      }

      const nuevoUsuario = await Usuario.create({ nombre, usuario, password, idrol, matricula, activo });

      res.status(201).json({ success: true, usuario: nuevoUsuario });
    } catch (error) {
      console.error('Error al crear usuario:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  actualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, usuario, password, idrol, matricula, activo } = req.body;

      const user = await Usuario.findByPk(id);
      if (!user) {
        return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
      }

      const usuarioExistente = await Usuario.findOne({
        where: {
          usuario: { [Op.like]: `%${usuario}%` } 
        }
      });

      if (usuarioExistente) {
        return res.status(400).json({
          success: false,
          error: 'El alias ingresado, ya existe. Elegí otro.'
        });
      }
            
      Object.assign(user, { nombre, usuario, password, idrol, matricula, activo });
      await user.save();

      res.json({ success: true, usuario: user });
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  eliminar: async (req, res) => {
    try {
      const { id } = req.params;
      const usuario = await Usuario.findByPk(id);

      if (!usuario) {
        return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
      }

      await usuario.destroy();

      res.json({ success: true, message: 'Usuario eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  verificarAlias: async (req, res) => {
    const { alias } = req.query;

    if (!alias || alias.trim() === "") {
      return res.status(400).json({ existe: false, error: "Alias requerido" });
    }

    try {
      const usuarioExistente = await Usuario.findOne({
        where: {
          usuario: {
            [Op.like]: `%${alias}%`
          }
        }
      });

      if (usuarioExistente) {
        return res.json({ existe: true, alias: usuarioExistente.usuario });
      } else {
        return res.json({ existe: false });
      }
    } catch (error) {
      console.error("Error al verificar alias:", error);
      return res.status(500).json({ existe: false, error: "Error interno del servidor" });
    }
  },

  mostrarFormularioLogin: (req, res) => {
    res.render('index', { error: null });
  },

  procesarLogin: async (req, res) => {
    const { usuario, password } = req.body;

    try {
      const usuarioEncontrado = await Usuario.findOne({ where: { usuario } });

      if (!usuarioEncontrado || usuarioEncontrado.password !== password) {
        return res.render('index', { error: 'Usuario o contraseña incorrectos' });
      }

      req.session.usuario = {
        id: usuarioEncontrado.idusuario,
        nombre: usuarioEncontrado.nombre,
        alias: usuarioEncontrado.usuario,
        rol: usuarioEncontrado.idrol
      };
      res.redirect('/layout');
    } catch (error) {
      console.error('Error en login:', error);
      res.render('index', { error: 'Error del servidor' });
    }
  },

  logout: (req, res) => {
    req.session.destroy(() => {
      res.redirect('/login');
    });
  }
};

module.exports = usuariosController;
