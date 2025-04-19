class Especialidad {
    constructor(idEspecialidad, denominacionEspecialidad) {
        this.idEspecialidad = idEspecialidad;
        this.denominacionEspecialidad = denominacionEspecialidad;
    }
}

let especialidades = [
    new Especialidad(1, "Anestesiología"),
    new Especialidad(2, "Alergología"),
    new Especialidad(3, "Angiología"),
    new Especialidad(4, "Cardiología"),
    new Especialidad(5, "Cirugía General"),
    new Especialidad(6, "Cirugía Plástica y Estética"),
    new Especialidad(7, "Cirugía Vascular"),
    new Especialidad(8, "Dermatología"),
    new Especialidad(9, "Endocrinología"),
    new Especialidad(10, "Gastroenterología"),
    new Especialidad(11, "Ginecología y Obstetricia"),
    new Especialidad(12, "Hematología"),
    new Especialidad(13, "Infectología"),
    new Especialidad(14, "Medicina Interna"),
    new Especialidad(15, "Medicina de Urgencias"),
    new Especialidad(16, "Medicina Familiar y General"),
    new Especialidad(17, "Medicina Laboral"),
    new Especialidad(18, "Medicina Preventiva y Salud Pública"),
    new Especialidad(19, "Nefrología"),
    new Especialidad(20, "Neumonología"),
    new Especialidad(21, "Neurología"),
    new Especialidad(22, "Nutrición"),
    new Especialidad(23, "Odontología"),
    new Especialidad(24, "Oncología"),
    new Especialidad(25, "Oftalmología"),
    new Especialidad(26, "Otorrinolaringología"),
    new Especialidad(27, "Pediatría"),
    new Especialidad(28, "Psiquiatría"),
    new Especialidad(29, "Reumatología"),
    new Especialidad(30, "Traumatología y Ortopedia"),
    new Especialidad(31, "Urología"),
    new Especialidad(32, "Radiología"),
    new Especialidad(33, "Tocoginecología"),
    new Especialidad(34, "Fisiatría"),
    new Especialidad(35, "Medicina Física y Rehabilitación"),
    new Especialidad(36, "Flebología"),
    new Especialidad(37, "Gerontología"),
    new Especialidad(38, "Psicología"),
    new Especialidad(39, "Bioquímica Clínica")
];

module.exports = { Especialidad, especialidades };
