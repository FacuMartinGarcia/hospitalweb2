class Internacion {
    constructor(idInternacion, idPaciente, origen, idMedico, fechaInternacion, horaInternacion, motivo, fechaAlta) {
        this.idInternacion = idInternacion;
        this.idPaciente = idPaciente;
        this.idOrigen = idOrigen;
        this.idMedico = idMedico;
        this.fechaInternacion = fechaInternacion;
        this.horaInternacion = horaInternacion;
        this.motivo = motivo;
        this.fechaAlta = fechaAlta;
    }
}
module.exports = Internacion;

