class Paciente {
    constructor(idPaciente, apellidoNombres, dni, fechaNacimiento, sexo, direccion, telefono, email, fechaRegistro, idCobertura, contactoEmergencia) {
        this.idPaciente = idPaciente;
        this.apellidoNombres = apellidoNombres.toUpperCase(); 
        this.dni = dni;
        this.fechaNacimiento = fechaNacimiento;
        this.sexo = sexo;
        this.direccion = direccion;
        this.telefono = telefono;
        this.email = email;
        this.fechaRegistro = fechaRegistro;
        this.idCobertura = idCobertura;
        this.contactoEmergencia = contactoEmergencia;
    }
}

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

let pacientes = [];


function validarDatos(form) {

    let dni = form.dni.value.trim();
    let apellidoNombres = form.apellidoNombres.value.trim().toUpperCase();
    let fechaNacimiento = form.fechaNacimiento.value;
    let telefono = form.telefono.value.trim();
    let email = form.email.value.trim();
    let cobertura = form.idCobertura.value;


    if (dni === "" || dni === "0" || isNaN(dni) || !/^\d{1,9}$/.test(dni)) {
        mostrarMensaje('El DNI debe contener solo números y tener hasta 9 dígitos.',0);
        inputDni.focus();
        return false;
    }
    
    if (apellidoNombres === "") {
        mostrarMensaje('El Apellido y Nombres es obligatorio.',0);
        return false;
    }

    if (telefono.trim() !== "" && !/^\d{1,20}$/.test(telefono)) {
        mostrarMensaje('El Teléfono debe contener solo números',0);
        return false;
    }

    let fechaNac = new Date(fechaNacimiento);
    let hoy = new Date();
    let hace150años = new Date();
    hace150años.setFullYear(hoy.getFullYear() - 150);

    if (fechaNac < hace150años || fechaNac > hoy) {
        mostrarMensaje('La fecha de nacimiento no puede ser mayor a 150 años atrás ni estar en el futuro.',0);
        return false;
    }

    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.trim() !== "" && !emailRegex.test(email)) {
        mostrarMensaje('El correo electrónico no tiene un formato válido.', 0);
        return false;
    }

    if (coberturas.find(c => c.idCobertura == cobertura) === undefined) {
        mostrarMensaje('Debe seleccionar una cobertura válida.', 0);
        return false;
    }

    return true;
}

document.addEventListener("DOMContentLoaded", () => {
    
    const form = document.getElementById("formPaciente");
    const inputDni = document.getElementById("dni");
    const selectCobertura = document.getElementById("idCobertura");
    const btnBuscar = document.getElementById("btnBuscar");
    const mensajeBusqueda = document.getElementById("mensajeBusqueda");

    coberturas.forEach(cobertura => {
        let option = document.createElement("option");
        option.value = cobertura.idCobertura;
        option.textContent = cobertura.denominacion;
        selectCobertura.appendChild(option);
    });

    btnBuscar.addEventListener("click", () => {
        if (btnBuscar.textContent === "Nueva Búsqueda") {
            // Habilita el campo DNI y limpia los campos
            inputDni.value = "";
            inputDni.disabled = false;
            limpiarCampos();
            btnBuscar.textContent = "Buscar";
            mensajeBusqueda.textContent = "";
            inputDni.focus();
            return;
        }

        let paciente = consultarPaciente(inputDni.value);

        if (paciente) {
            form.apellidoNombres.value = paciente.apellidoNombres;
            form.fechaNacimiento.value = paciente.fechaNacimiento;
            form.sexo.value = paciente.sexo;
            form.direccion.value = paciente.direccion;
            form.telefono.value = paciente.telefono;
            form.email.value = paciente.email;
            form.idCobertura.value = paciente.idCobertura;
            form.contactoEmergencia.value = paciente.contactoEmergencia;
            mensajeBusqueda.textContent = '';

            bloquearDni();

        } else {
            limpiarCampos();
            mostrarMensaje('Paciente no encontrado. Verifique el DNI, o registre los datos del nuevo paciente', 0);
            bloquearDni();
        }
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        if (!validarDatos(form)) {
            return;
        }

        let dni = form.dni.value;  
        let pacienteExistente = consultarPaciente(dni); 

        // Modificación
        if (pacienteExistente) {
            let nuevosDatos = {
                apellidoNombres: form.apellidoNombres.value,
                fechaNacimiento: form.fechaNacimiento.value,
                sexo: form.sexo.value,
                direccion: form.direccion.value,
                telefono: form.telefono.value,
                email: form.email.value,
                idCobertura: form.idCobertura.value,
                contactoEmergencia: form.contactoEmergencia.value
            };

            modificarPaciente(dni, nuevosDatos);
            mostrarMensaje('Paciente actualizado exitosamente.', 1);

        } else {
            // Alta
            let nuevoPaciente = new Paciente(
                pacientes.length + 1,
                form.apellidoNombres.value,
                dni,
                form.fechaNacimiento.value,
                form.sexo.value,
                form.direccion.value,
                form.telefono.value,
                form.email.value,
                new Date().toISOString().split("T")[0],
                form.idCobertura.value,
                form.contactoEmergencia.value
            );

            agregarPaciente(nuevoPaciente);
            mostrarMensaje('Paciente registrado exitosamente.', 1);
        }

        resetearBusqueda();

    });

    function bloquearDni() {
        inputDni.disabled = true;
        inputDni.style.backgroundColor = "#f0f0f0"; 
        btnBuscar.textContent = "Nueva Búsqueda";
    }

    function resetearBusqueda() {
        inputDni.value = "";
        inputDni.disabled = false;
        inputDni.style.backgroundColor = ""; 
        limpiarCampos();
        btnBuscar.textContent = "Buscar";
        mensajeBusqueda.textContent = "";
        inputDni.focus();
    }
    
    function limpiarCampos() {
        form.apellidoNombres.value = "";
        form.fechaNacimiento.value = "";
        form.sexo.value = "";
        form.direccion.value = "";
        form.telefono.value = "";
        form.email.value = "";
        form.idCobertura.value = "";
        form.contactoEmergencia.value = "";
    }
});

function agregarPaciente(paciente) {
    pacientes.push(paciente);
}

function modificarPaciente(dni, nuevosDatos) {
    let paciente = pacientes.find(p => p.dni === dni);
    if (paciente) {
        Object.assign(paciente, nuevosDatos);  
    }
}

function consultarPaciente(dni) {
    return pacientes.find(p => p.dni === dni) || null;
}

function listarPacientes() {
    return pacientes;
}


function mostrarMensaje(mensajes, tipo) {

    const mensajeBusqueda = document.getElementById("mensajes");

    mensajeBusqueda.textContent = mensajes;

    if (tipo === 0) {
        mensajeBusqueda.style.color = "red";
        mensajeBusqueda.style.backgroundColor = "#f8d7da";  
    } else if (tipo === 1) {
        mensajeBusqueda.style.color = "#007bff";  
        mensajeBusqueda.style.backgroundColor = "#cce5ff";  
    }
    setTimeout(() => { mensajeBusqueda.textContent = ''; }, 3000);

}
