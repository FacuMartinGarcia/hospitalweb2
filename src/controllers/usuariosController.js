const db = require('../models'); 
const { Usuario } = db;



const usuariosController = {
  listar: async (req, res) => {
    try {
      const usuarios = await Usuario.findAll({
        attributes: ['idusuario', 'aliasusuario', 'apellidonombres'],
        order: [['apellidonombres', 'ASC']]
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
        attributes: ['idusuario', 'aliasusuario', 'apellidonombres']
      });

      if (!usuario) {
        return res.status(404).json({ 
          success: false,
          error: 'Usuario no encontrado' 
        });
      }

      res.json({
        success: true,
        usuario
      });
    } catch (error) {
      console.error('Error al buscar usuario:', error);
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  },

  crear: async (req, res) => {
    try {
      const { aliasusuario, apellidonombres, pass } = req.body;

      if (!aliasusuario || !apellidonombres || !pass) {
        return res.status(400).json({
          success: false,
          error: 'Todos los campos son requeridos'
        });
      }

      const nuevoUsuario = await Usuario.create({ aliasusuario, apellidonombres, pass });

      res.status(201).json({
        success: true,
        usuario: {
          idusuario: nuevoUsuario.idusuario,
          aliasusuario: nuevoUsuario.aliasusuario,
          apellidonombres: nuevoUsuario.apellidonombres
        }
      });
    } catch (error) {
      console.error('Error al crear usuario:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  actualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const { aliasusuario, apellidonombres, pass } = req.body;

      const usuario = await Usuario.findByPk(id);

      if (!usuario) {
        return res.status(404).json({
          success: false,
          error: 'Usuario no encontrado'
        });
      }

      if (!aliasusuario || !apellidonombres || !pass) {
        return res.status(400).json({
          success: false,
          error: 'Todos los campos son requeridos'
        });
      }

      usuario.aliasusuario = aliasusuario;
      usuario.apellidonombres = apellidonombres;
      usuario.pass = pass;

      await usuario.save();

      res.json({
        success: true,
        usuario: {
          idusuario: usuario.idusuario,
          aliasusuario: usuario.aliasusuario,
          apellidonombres: usuario.apellidonombres
        }
      });
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  eliminar: async (req, res) => {
    try {
      const { id } = req.params;

      const usuario = await Usuario.findByPk(id);

      if (!usuario) {
        return res.status(404).json({
          success: false,
          error: 'Usuario no encontrado'
        });
      }

      await usuario.destroy();

      res.json({
        success: true,
        message: 'Usuario eliminado correctamente'
      });
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

   mostrarFormularioLogin: (req, res) => {
    res.render('index', { error: null });
  },

procesarLogin: async (req, res) => {
  const { usuario, password } = req.body;

  try {
    const usuarioEncontrado = await Usuario.findOne({
      where: { aliasusuario: usuario }
    });

    if (!usuarioEncontrado || usuarioEncontrado.pass !== password) {
      return res.render('index', {
        error: 'Usuario o contraseña incorrectos'
      });
    }

    if (usuarioEncontrado) {
      req.session.usuario = {
        id: usuarioEncontrado.idusuario,
        nombre: usuarioEncontrado.apellidonombres,
        alias: usuarioEncontrado.aliasusuario
      };
      console.log(req.session.usuario);
      return res.redirect('/layout');
    }
  } catch (error) {
    console.error('Error en login:', error);
    res.render('index', {
      error: 'Ocurrió un error en el servidor'
    });
  }
},

  logout: (req, res) => {
    req.session.destroy(() => {
      res.redirect('/login');
    });
  }
};

module.exports = usuariosController;
