
class Rol {
    constructor(idRol, nombreRol) {
      this.idRol = idRol;
      this.nombreRol = nombreRol;
    }
  }

  const roles = [
    new Rol(1, "Paciente"),
    new Rol(2, "Medico"),
    new Rol(3, "Enfermero"),
  ];
  
  module.exports = { Rol, roles };
