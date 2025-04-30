class Persona {
    static ultimoId = 0;
    constructor(apellidoNombres, documento, fechaNacimiento, sexo, direccion, telefono, email, fechaFallecimiento, actaDefuncion) {
      this.idPersona = ++Persona.ultimoId;
      this.apellidoNombres = apellidoNombres;
      this.documento = documento;
      this.fechaNacimiento = fechaNacimiento;
      this.sexo = sexo;
      this.direccion = direccion;
      this.telefono = telefono;
      this.email = email;
      this.fechaFallecimiento = fechaFallecimiento;
      this.actaDefuncion = actaDefuncion;
    }
  }
 
module.exports = Persona;

console.log("persona cargada");