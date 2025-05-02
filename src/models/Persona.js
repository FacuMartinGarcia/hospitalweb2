class Persona {
    constructor(idPersona, apellidoNombres, documento, fechaNacimiento, sexo, direccion, telefono, email, fechaFallecimiento, actaDefuncion) {
      this.idPersona = idPersona;
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