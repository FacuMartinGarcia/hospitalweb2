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

let Internaciones = [];

let medicos = [
    {
        idMedico: 1,
        apellidoNombres: "Gonzales Laura",
        especialidad: "Clínica Médica"
    },
    {
        idMedico: 2,
        apellidoNombres: "Corbalan Carlos",
        especialidad: "Pediatría"
    },
    {
        idMedico: 3,
        apellidoNombres: "Estrugo Marcela",
        especialidad: "Cardiología"
    },
    {
        idMedico: 4,
        apellidoNombres: "Montiveros Javier",
        especialidad: "Traumatología"
    },
    {
        idMedico: 5,
        apellidoNombres: "Ruiz Verónica",
        especialidad: "Neurología"
    },
    {
        idMedico: 6,
        apellidoNombres: "Urrutia Esteban",
        especialidad: "Ginecología"
    }
];

let pacientes = [
    {
        idPaciente: 1,
        documento: 111,
        apellidoNombres: "Juárez, Ana",
        sexo: "F",
        fechaNacimiento: "1990-05-12",
        telefono: "3411234567",
        idCobertura: 1,
        fechaFallecimiento: null
    },
    {
        idPaciente: 2,
        documento: 222,
        apellidoNombres: "Martínez, Pedro",
        sexo: "M",
        fechaNacimiento: "1985-10-30",
        telefono: "3417654321",
        idCobertura: 2,
        fechaFallecimiento: null
    },
    {
        idPaciente: 3,
        documento: 333,
        apellidoNombres: "López, Camila",
        sexo: "F",
        fechaNacimiento: "2002-03-22",
        telefono: "25565221",
        idCobertura: 3,
        fechaFallecimiento: "2024-10-02"
    }
];

document.addEventListener("DOMContentLoaded", () => {
    const inputDocumento = document.getElementById("documento");
    const btnBuscarPaciente = document.getElementById("btnBuscarPaciente");
    const datosPaciente = document.getElementById("datosPaciente");
    const seccionInternacion = document.getElementById("seccionInternacion");
    const formInternacion = document.getElementById("formInternacion");
    const datosInternacion = document.getElementById("datosInternacion");
    const selectMedico = document.getElementById("medico");
    const btnRegistrarInternacion = document.getElementById("btnRegistrarInternacion");

    btnRegistrarInternacion.addEventListener("click", registrarInternacion);

    let pacienteSeleccionado = null;

    cargarMedicos();

    const hoy = new Date();
    document.getElementById("fechaInternacion").value = hoy.toISOString().split('T')[0];
    document.getElementById("horaInternacion").value = hoy.toTimeString().substring(0, 5);

    btnBuscarPaciente.addEventListener("click", buscarPaciente);


    function buscarPaciente() {
        if (btnBuscarPaciente.textContent === "Nueva búsqueda") {
            resetearBusqueda();
            return;
        }

        const documento = inputDocumento.value.trim();

        if (!documento || isNaN(documento)) {
            mostrarMensaje("Ingrese un número de documento válido", "error");
            return;
        }

        const paciente = consultarPaciente(inputDocumento.value);

        if (paciente) {
            pacienteSeleccionado = paciente;
            const fechaFallecimiento = new Date(paciente.fechaFallecimiento);
            if (paciente.fechaFallecimiento !== null && paciente.fechaFallecimiento !== "") {
                mostrarMensaje("El paciente ha fallecido el " + paciente.fechaFallecimiento, "info");
                btnRegistrarInternacion.disabled = true;
                return;
            }

            mostrarDatosPaciente(paciente);
            bloqueardocumento();
            verificarInternaciones(paciente);
 
        } else {
            Swal.fire({
                title: 'Paciente No Registrado',
                html: "El n° de documento ingresado no se encuentra registrado",
                icon: 'info',
                confirmButtonText: 'Entendido'
            }).then(() => {
                /*
                desbloquearCamposFormulario();
                btnModificar.disabled = true;*/
                setTimeout(() => {
                    document.getElementById('documento').focus();
                }, 300);
            });
            limpiarDatosPaciente();
        }
    }

    function consultarPaciente(documento) {
        return pacientes.find(p => p.documento === Number(documento)) || null;
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
            <p><strong>Apellido y Nombres:</strong> ${paciente.apellidoNombres}</p>
            <p><strong>Sexo:</strong> ${paciente.sexo === 'M' ? 'Masculino' : 'Femenino'}</p>
            <p><strong>Fecha Nacimiento:</strong> ${paciente.fechaNacimiento} (${edad} años)</p>
            <p><strong>Teléfono:</strong> ${paciente.telefono || 'No registrado'}</p>
            <p><strong>Cobertura:</strong> ${cobertura}</p>
        `;

    }

    function mostrarAdmision(internacion) {

        alert('estoy entrando en mostrar admision')     
        const medico = medicos.find(m => m.idMedico == internacion.idMedico); 

        datosInternacion.innerHTML = `
            <p><strong>Origen:</strong> ${internacion.origen}</p>
            <p><strong>Médico:</strong> ${medico.apellidoNombres}</p>
            <p><strong>Fecha Internación:</strong> ${internacion.fechaInternacion}</p>
            <p><strong>Hora Internación:</strong> ${internacion.horaInternacion}</p>
            <p><strong>Motivo:</strong> ${internacion.motivo}</p>            
        `;

  
    }

    function verificarInternaciones(paciente) {
        for (const internacion of Internaciones) {
            if (internacion.idPaciente === paciente.idPaciente && internacion.fechaAlta === null) {
                alert('acá deberia mostrar la recuperada');
                mostrarAdmision(internacion);    
                inputDocumento.disabled = true;
                btnBuscarPaciente.textContent = "Nueva búsqueda";
                btnRegistrarInternacion.disabled = true;
                seccionInternacion.style.display = "none";
                break;
            }
        }
    }
    
    
    function validarDatos(form) {

        let origen = form.origen.value; 
        let medico = form.medico.value;
        let fechaInternacion = form.fechaInternacion.value;
        let horaInternacion = form.horaInternacion.value;
        let motivo = form.motivo.value;

   
  
        let fechaInter = new Date(fechaInternacion);
        let hoy = new Date();
        let hace1mes = new Date(hoy);
        hace1mes.setMonth(hace1mes.getMonth() - 1);
        
        if (fechaInter > hoy || fechaInter < hace1mes) {
            mostrarMensaje('La fecha de internación debe ser dentro del último mes y no puede estar en el futuro.', 0);
            return false;
        }

        if (origen === "") {
            mostrarMensaje('Debe seleccionar un origen.', 0);
            return false;
        }
        if (medico === "") {
            mostrarMensaje('Debe seleccionar un médico.', 0);
            return false;   
        }
   
        return true;
    }

    function registrarInternacion(e) {    
        e.preventDefault(); 

        if (!validarDatos(formInternacion)) return;

        // Creamos nueva internación
        const nuevaInternacion = new Internacion(
            Internaciones.length + 1, // ID autoincremental simple
            pacienteSeleccionado.idPaciente,
            formInternacion.origen.value,
            Number(formInternacion.medico.value),
            formInternacion.fechaInternacion.value,
            formInternacion.horaInternacion.value,
            formInternacion.motivo.value
        );

        Internaciones.push(nuevaInternacion);

        mostrarMensaje("Internación registrada con éxito.", 1);
        console.log("Nueva internación:", nuevaInternacion);

        formInternacion.reset();
        seccionInternacion.style.display = "none";
        limpiarDatosPaciente();
        inputDocumento.disabled = false;
        inputDocumento.value = "";
        inputDocumento.focus();
        btnBuscarPaciente.textContent = "Buscar";
        pacienteSeleccionado = null;

    }

    function resetearBusqueda() {
        inputDocumento.value = "";
        inputDocumento.disabled = false;
        btnBuscarPaciente.textContent = "Buscar";
        limpiarDatosPaciente();
        seccionInternacion.style.display = "none";
        inputDocumento.focus();
    }


    function limpiarDatosPaciente() {
        datosPaciente.innerHTML = "";
        pacienteSeleccionado = null;
    }

    function bloqueardocumento() {
        inputDocumento.disabled = true;
        btnBuscarPaciente.textContent = "Nueva búsqueda";
    }

    function cargarMedicos() {
        selectMedico.innerHTML = '<option value="">Seleccione un médico</option>';

        medicos.forEach(medico => {
            const option = document.createElement("option");
            option.value = medico.idMedico;
            option.textContent = `${medico.apellidoNombres}, (${medico.especialidad})`;
            selectMedico.appendChild(option);
        });
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
});
