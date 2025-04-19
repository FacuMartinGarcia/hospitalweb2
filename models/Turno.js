class Turno {
    constructor(idTurno, denominacionTurno) {
        this.idTurno = idTurno;
        this.denominacionTurno = denominacionTurno; 
    }
}

let turnos = [
    new Turno(1, "Mañana"),
    new Turno(2, "Tarde"),
    new Turno(3, "Noche")
];

module.exports = { Turno, turnos }