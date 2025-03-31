class Especialidad {
    constructor(idEspecialidad, nombre) {
        this.idEspecialidad = idEspecialidad;
        this.nombre = nombre;
    }
}

class Medico {
    constructor(idMedico, apellidoNombres, dni, telefono, email, idEspecialidad, matricula) {
        this.idMedico = idMedico;
        this.apellidoNombres = apellidoNombres.toUpperCase();
        this.dni = dni;
        this.telefono = telefono;
        this.email = email;
        this.idEspecialidad = idEspecialidad;
        this.matricula = matricula;
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

let medicos = [];


function validarDatos(form) {
    let dni = form.dni.value.trim();
    let apellidoNombres = form.apellidoNombres.value.trim().toUpperCase();
    let telefono = form.telefono.value.trim();
    let email = form.email.value.trim();
    let especialidad = form.idEspecialidad.value;
    let matricula = form.matricula.value.trim();

    if (!/^\d{1,9}$/.test(dni)) {
        mostrarMensaje('El DNI debe contener solo números y tener hasta 9 dígitos.', 0);
        return false;
    }

    if (apellidoNombres === "") {
        mostrarMensaje('El Apellido y Nombres es obligatorio.', 0);
        return false;
    }

    if (telefono.trim() !== "" && !/^\d{1,20}$/.test(telefono)) {
        mostrarMensaje('El Teléfono debe contener solo números', 0);
        return false;
    }

    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.trim() !== "" && !emailRegex.test(email)) {
        mostrarMensaje('El correo electrónico no tiene un formato válido.', 0);
        return false;
    }

    if (especialidades.find(e => e.idEspecialidad == especialidad) === undefined) {
        mostrarMensaje('Debe seleccionar una especialidad válida.', 0);
        return false;
    }

    if (!/^\d{1,8}$/.test(matricula)) {
        mostrarMensaje('La matrícula debe contener solo números y no más de 8 dígitos.', 0);
        return false;
    }

    let medicoExistente = medicos.find(m => m.matricula === matricula && m.dni !== dni);
    if (medicoExistente) {
        mostrarMensaje('Ya existe un médico registrado con esta matrícula.', 0);
        return false;
    }

    return true;
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formMedico");
    const selectEspecialidad = document.getElementById("idEspecialidad");

    especialidades.forEach(especialidad => {
        let option = document.createElement("option");
        option.value = especialidad.idEspecialidad;
        option.textContent = especialidad.nombre;
        selectEspecialidad.appendChild(option);
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        if (!validarDatos(form)) {
            return;
        }

        let dni = form.dni.value;
        let medicoExistente = consultarMedico(dni);
        
        if (medicoExistente) {
            medicoExistente.apellidoNombres = form.apellidoNombres.value;
            medicoExistente.telefono = form.telefono.value;
            medicoExistente.email = form.email.value;
            medicoExistente.idEspecialidad = form.idEspecialidad.value;
            medicoExistente.matricula = form.matricula.value;
            mostrarMensaje('Médico actualizado exitosamente.', 1);
        } else {
            let nuevoMedico = new Medico(
                medicos.length + 1,
                form.apellidoNombres.value,
                dni,
                form.telefono.value,
                form.email.value,
                form.idEspecialidad.value,
                form.matricula.value
            );
            medicos.push(nuevoMedico);
            mostrarMensaje('Médico registrado exitosamente.', 1);
        }

        form.reset();
        document.getElementById("dni").focus();
    });
});

function consultarMedico(dni) {
    return medicos.find(m => m.dni === dni) || null;
}

function mostrarMensaje(mensaje, tipo) {
    const mensajeBusqueda = document.getElementById("mensajes");
    mensajeBusqueda.textContent = mensaje;
    mensajeBusqueda.style.color = tipo === 0 ? "red" : "#007bff";
    mensajeBusqueda.style.backgroundColor = tipo === 0 ? "#f8d7da" : "#cce5ff";
    setTimeout(() => { mensajeBusqueda.textContent = ''; }, 3000);
}