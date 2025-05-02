class Paciente {
    constructor(idPaciente, apellidoNombres, documento, fechaNacimiento, sexo, direccion, telefono, email, idCobertura, contactoEmergencia, fechaFallecimiento, actaDefuncion) {
      this.idPaciente = idPaciente;
      this.apellidoNombres = apellidoNombres;
      this.documento = documento;
      this.fechaNacimiento = fechaNacimiento;
      this.sexo = sexo;
      this.direccion = direccion;
      this.telefono = telefono;
      this.email = email;
      this.idCobertura = idCobertura;
      this.contactoEmergencia = contactoEmergencia;
      this.fechaFallecimiento = fechaFallecimiento;
      this.actaDefuncion = actaDefuncion;
    }
  }
 
module.exports = Paciente;
