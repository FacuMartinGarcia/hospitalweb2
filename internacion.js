class Internacion {
    constructor(idInternacion, idPaciente, origen, idMedico, fechaInternacion, horaInternacion, motivo, fechaAlta = null) {
        this.idInternacion = idInternacion;
        this.idPaciente = idPaciente;
        this.origen = origen;
        this.idMedico = idMedico;
        this.fechaInternacion = fechaInternacion;
        this.horaInternacion = horaInternacion;
        this.motivo = motivo;
        this.fechaAlta = fechaAlta;
        this.activa = true; // Para controlar si está internado
    }
}

let Internaciones = [];

let medicos = [
    {
        idMedico: 1,
        nombre: "Laura",
        apellido: "González",
        especialidad: "Clínica Médica"
    },
    {
        idMedico: 2,
        nombre: "Carlos",
        apellido: "Perez",
        especialidad: "Pediatría"
    },
    {
        idMedico: 3,
        nombre: "Marcela",
        apellido: "Ramírez",
        especialidad: "Cardiología"
    },
    {
        idMedico: 4,
        nombre: "Javier",
        apellido: "Martínez",
        especialidad: "Traumatología"
    },
    {
        idMedico: 5,
        nombre: "Verónica",
        apellido: "Quiroga",
        especialidad: "Neurología"
    },
    {
        idMedico: 6,
        nombre: "Esteban",
        apellido: "Fernández",
        especialidad: "Ginecología"
    }
];

let pacientes = [
    {
        dni: 111,
        apellidoNombres: "Juárez, Ana",
        sexo: "F",
        fechaNacimiento: "1990-05-12",
        telefono: "3411234567",
        idCobertura: 1
    },
    {
        dni: 222,
        apellidoNombres: "Martínez, Pedro",
        sexo: "M",
        fechaNacimiento: "1985-10-30",
        telefono: "3417654321",
        idCobertura: 2
    },
    {
        dni: 333,
        apellidoNombres: "López, Camila",
        sexo: "F",
        fechaNacimiento: "2002-03-22",
        telefono: "25565221",
        idCobertura: 3
    }
];



document.addEventListener("DOMContentLoaded", () => {
    const inputDni = document.getElementById("dni");
    const btnBuscarPaciente = document.getElementById("btnBuscarPaciente");
    const mensajePaciente = document.getElementById("mensajePaciente");
    const datosPaciente = document.getElementById("datosPaciente");
    const seccionInternacion = document.getElementById("seccionInternacion");
    const seccionInternaciones = document.getElementById("seccionInternaciones");
    const formInternacion = document.getElementById("formInternacion");
    const selectMedico = document.getElementById("medico");

    let pacienteSeleccionado = null;

    cargarMedicos();

    const hoy = new Date();
    document.getElementById("fechaInternacion").value = hoy.toISOString().split('T')[0];
    document.getElementById("horaInternacion").value = hoy.toTimeString().substring(0, 5);

    btnBuscarPaciente.addEventListener("click", buscarPaciente);


    function buscarPaciente() {
        if (btnBuscarPaciente.textContent === "Nueva búsqueda") {
            return;
        }

        const dni = inputDni.value.trim();

        if (!dni || isNaN(dni)) {
            mostrarMensaje("Ingrese un número de documento válido", "error");
            return;
        }

        const paciente = consultarPaciente(dni);

        if (paciente) {
            pacienteSeleccionado = paciente;
            mostrarDatosPaciente(paciente);
            bloquearDNI();
        } else {
            Swal.fire({
                title: 'No Registrado',
                html: "El n° de documento ingresado no se encuentra registrado. <br>Verifique el documento, o registre los datos del nuevo paciente",
                icon: 'info',
                confirmButtonText: 'Entendido'
            }).then(() => {
                /*
                desbloquearCamposFormulario();
                btnModificar.disabled = true;*/
                setTimeout(() => {
                    document.getElementById('apellidoNombres').focus();
                }, 300);
            });
            limpiarDatosPaciente();
        }
    }

    function consultarPaciente(documento) {
        return pacientes.find(p => p.documento === documento) || null;
    }

    function mostrarDatosPaciente(paciente) {
        const fechaNac = new Date(paciente.fechaNacimiento);
        const hoy = new Date();
        let edad = hoy.getFullYear() - fechaNac.getFullYear();
        const mes = hoy.getMonth() - fechaNac.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
            edad--;
        }

        const cobertura = coberturas.find(c => c.idCobertura == paciente.idCobertura)?.denominacion || "Sin cobertura";

        datosPaciente.innerHTML = `
            <p><strong>DNI:</strong> ${paciente.dni}</p>
            <p><strong>Apellido y Nombres:</strong> ${paciente.apellidoNombres}</p>
            <p><strong>Sexo:</strong> ${paciente.sexo === 'M' ? 'Masculino' : 'Femenino'}</p>
            <p><strong>Fecha Nacimiento:</strong> ${paciente.fechaNacimiento} (${edad} años)</p>
            <p><strong>Teléfono:</strong> ${paciente.telefono || 'No registrado'}</p>
            <p><strong>Cobertura:</strong> ${cobertura}</p>
        `;

        mostrarMensaje("Paciente encontrado", "success");
    }


    function limpiarDatosPaciente() {
        datosPaciente.innerHTML = "";
        pacienteSeleccionado = null;
    }

    function bloquearDNI() {
        inputDni.disabled = true;
        btnBuscarPaciente.textContent = "Nueva búsqueda";
    }

    function cargarMedicos() {
        selectMedico.innerHTML = '<option value="">Seleccione un médico</option>';

        medicos.forEach(medico => {
            const option = document.createElement("option");
            option.value = medico.idMedico;
            option.textContent = `${medico.apellido}, ${medico.nombre} (${medico.especialidad})`;
            selectMedico.appendChild(option);
        });
    }
});
