class Cobertura {
    constructor(idCobertura, denominacion) {
        this.idCobertura = idCobertura;
        this.denominacion = denominacion;
    }
}

let coberturas = [
    new Cobertura(1, "Sin Datos"),
    new Cobertura(2, "Swiss Medical"),
    new Cobertura(3, "Galeno"),
    new Cobertura(4, "Medife"),
    new Cobertura(5, "OSDE"),
    new Cobertura(6, "DOSEP"),
];

module.exports = { Cobertura, coberturas };