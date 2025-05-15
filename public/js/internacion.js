const API_URL_PACIENTES = '/api/pacientes';
const API_URL_INTERNACIONES = '/api/internaciones';
const API_URL_COBERTURAS = '/api/coberturas';
const API_URL_MEDICOS = '/api/medicos';
const API_URL_ORIGENES = '/api/origenes';
const API_URL_DIAGNOSTICOS = '/api/diagnosticos';

let datosMedicos=[];
let datosOrigenes=[];
let datosDiagnosticos=[];   


document.addEventListener("DOMContentLoaded", async () => {

    const inputDocumento = document.getElementById("documento");
    const btnBuscarPaciente = document.getElementById("btnBuscarPaciente");
    const datosPaciente = document.getElementById("datosPaciente");
    const seccionInternacion = document.getElementById("seccionInternacion");
    const formInternacion = document.getElementById("formInternacion");
    const datosInternacion = document.getElementById("datosInternacion");
    const selectMedico = document.getElementById("idmedico");
    const selectOrigen = document.getElementById("idorigen");
    const selectDiagnostico = document.getElementById("iddiagnostico");
    const btnRegistrarInternacion = document.getElementById("btnRegistrarInternacion");
    const mensajeBusqueda = document.getElementById("mensajes");

    btnRegistrarInternacion.addEventListener("click", registrarInternacion);
    
    let pacienteSeleccionado = null;

    await cargarMedicos();
    await cargarOrigenes();
    await cargarDiagnosticos();

    const hoy = new Date();
    document.getElementById("fechaInternacion").value = hoy.toISOString().split('T')[0];
    document.getElementById("horaInternacion").value = hoy.toTimeString().substring(0, 5);

    btnBuscarPaciente.addEventListener("click", buscarPaciente);

        console.log("ESTOY ENTRANDO A BUSCAR PACIENTE");
        async function buscarPaciente() {
            if (btnBuscarPaciente.textContent === "Nueva búsqueda") {
                resetearBusqueda();
                return;
            }

            const documento = inputDocumento.value.trim();

            if (!documento || isNaN(documento)) {
                mostrarMensaje("Ingrese un número de documento válido", "error");
                return;
            }

            try {
                const resultado = await buscarPacienteAPI(documento);
                
                if (!resultado || !resultado.paciente) {
                    Swal.fire({
                        title: 'Paciente No Registrado',
                        html: "El n° de documento ingresado no se encuentra registrado",
                        icon: 'info',
                        confirmButtonText: 'Entendido'
                    }).then(() => {
                        setTimeout(() => {
                            inputDocumento.focus();
                        }, 300);
                    });
                    limpiarDatosPaciente();
                    return;
                }

                pacienteSeleccionado = resultado.paciente;
                
                // Verificar si el paciente ha fallecido
                if (pacienteSeleccionado.fechaFallecimiento) {
                    mostrarMensaje("El paciente ha fallecido el " + pacienteSeleccionado.fechaFallecimiento, "info");
                    btnRegistrarInternacion.disabled = true;
                    mostrarDatosPaciente(pacienteSeleccionado);
                    bloqueardocumento();
                    return;
                }

                mostrarDatosPaciente(pacienteSeleccionado);
                bloqueardocumento();
                
                // deberiamos crear un metodo asi para la internacione activa (abierta, sin fecha de alta)
                //await verificarInternaciones(pacienteSeleccionado);

            } catch (error) {
                console.error('Error en búsqueda:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un problema al realizar la búsqueda.',
                    icon: 'error',
                    confirmButtonText: 'Cerrar'
                });
            }
        }

    async function buscarPacienteAPI(documento) {
        try {
            const response = await fetch(`${API_URL_PACIENTES}/${documento}`);
            if (!response.ok) {
                if (response.status === 404) {
                    return null; // paciente no encontrado
                }
                throw new Error('Error en la respuesta del servidor');
            }
            return await response.json();
        } catch (error) {
            console.error('Error al buscar paciente:', error);
            throw error;
        }
    }

    function mostrarDatosPaciente(paciente) {
        const fechaNac = new Date(paciente.fechanacimiento);
        const hoy = new Date();
        let edad = hoy.getFullYear() - fechaNac.getFullYear();
        const mes = hoy.getMonth() - fechaNac.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
            edad--;
        }

        // Obtener nombre de cobertura
        const coberturanombre = paciente.cobertura ? paciente.cobertura.denominacion : "Sin cobertura";

        datosPaciente.innerHTML = `
            <p><strong>Apellido y Nombres:</strong> ${paciente.apellidonombres}</p>
            <p><strong>Sexo:</strong> ${paciente.sexo === 'M' ? 'Masculino' : 'Femenino'}</p>
            <p><strong>Fecha Nacimiento:</strong> ${paciente.fechanacimiento} (${edad} años)</p>
            <p><strong>Teléfono:</strong> ${paciente.telefono || 'No registrado'}</p>
            <p><strong>Cobertura:</strong> ${coberturanombre}</p>
        `;
    }

    async function verificarInternaciones(paciente) {
        try {
            const response = await fetch(`${API_URL_INTERNACIONES}/paciente/${paciente.idPaciente}/activas`);
            if (!response.ok) {
                throw new Error('Error al verificar internaciones');
            }
            
            const internaciones = await response.json();
            
            if (internaciones.length > 0) {
                // Mostrar la última internación activa
                mostrarAdmision(internaciones[0]);
                inputDocumento.disabled = true;
                btnBuscarPaciente.textContent = "Nueva búsqueda";
                btnRegistrarInternacion.disabled = true;
                seccionInternacion.style.display = "none";
            } else {
                // No tiene internaciones activas, mostrar formulario
                seccionInternacion.style.display = "block";
                btnRegistrarInternacion.disabled = false;
            }
        } catch (error) {
            console.error('Error al verificar internaciones:', error);
            mostrarMensaje("Error al verificar internaciones del paciente", "error");
        }
    }

    function mostrarAdmision(internacion) {
        datosInternacion.innerHTML = `
            <p><strong>Origen:</strong> ${internacion.origen}</p>
            <p><strong>Médico:</strong> ${internacion.medico.apellidoNombres}</p>
            <p><strong>Fecha Internación:</strong> ${internacion.fechaInternacion}</p>
            <p><strong>Hora Internación:</strong> ${internacion.horaInternacion}</p>
            <p><strong>Motivo:</strong> ${internacion.motivo}</p>            
        `;
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
        
        if (motivo.trim() === "") {
            mostrarMensaje('Debe ingresar un motivo de internación.', 0);
            return false;
        }

        return true;
    }

    async function registrarInternacion(e) {    
        e.preventDefault(); 

        if (!validarDatos(formInternacion)) return;

        const nuevaInternacion = {
            idPaciente: pacienteSeleccionado.idPaciente,
            origen: formInternacion.origen.value,
            idMedico: Number(formInternacion.medico.value),
            fechaInternacion: formInternacion.fechaInternacion.value,
            horaInternacion: formInternacion.horaInternacion.value,
            motivo: formInternacion.motivo.value
        };

        try {
            const response = await fetch(API_URL_INTERNACIONES, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevaInternacion)
            });

            if (!response.ok) {
                throw new Error('Error al registrar internación');
            }

            const resultado = await response.json();
            
            mostrarMensaje("Internación registrada con éxito.", 1);
            
            formInternacion.reset();
            seccionInternacion.style.display = "none";
            limpiarDatosPaciente();
            inputDocumento.disabled = false;
            inputDocumento.value = "";
            inputDocumento.focus();
            btnBuscarPaciente.textContent = "Buscar";
            pacienteSeleccionado = null;

        } catch (error) {
            console.error('Error al registrar internación:', error);
            mostrarMensaje("Error al registrar la internación", "error");
        }
    }

    async function cargarOrigenes() {
        try {
            const response = await fetch('/api/origenes');
            if (!response.ok) throw new Error("Error al cargar orígenes");
            const json =  await response.json();
            const datosOrigenes = json.origenes;
            //const select = document.getElementById('origen');
            datosOrigenes.forEach(item => {
                const option = document.createElement('option');
                option.value = item.idorigen;
                option.textContent = item.denominacion;
                selectOrigen.appendChild(option);
            });
        } catch (error) {
            console.error("Error al cargar orígenes:", error);
        }
    }

    async function cargarMedicos() {
        try {
            const response = await fetch('/api/medicos');
            if (!response.ok) throw new Error("Error al cargar médicos");
            const json  = await response.json();
            const datosMedicos = json.medicos;
            //const selectMedico = document.getElementById('idmedico');
            datosMedicos.forEach(item => {
                const option = document.createElement('option');
                option.value = item.idmedico;
                option.textContent = `${item.apellidonombres}`;
                selectMedico.appendChild(option);
            });
        } catch (error) {
            console.error("Error al cargar médicos:", error);
        }
    }

    async function cargarDiagnosticos() {
        try {
            const response = await fetch('/api/diagnosticos');
            if (!response.ok) throw new Error("Error al cargar diagnósticos");
            const datosDiagnosticos = await response.json();
            //const select = document.getElementById('diagnostico');
            datosDiagnosticos.forEach(item => {
                const option = document.createElement('option');
                option.value = item.iddiagnostico;
                option.textContent = item.descripcion;
                selectDiagnostico.appendChild(option);
            });
        } catch (error) {
            console.error("Error al cargar diagnósticos:", error);
        }
    }


    function resetearBusqueda() {
        inputDocumento.value = "";
        inputDocumento.disabled = false;
        btnBuscarPaciente.textContent = "Buscar";
        limpiarDatosPaciente();
        datosInternacion.innerHTML = "";
        seccionInternacion.style.display = "none";
        btnRegistrarInternacion.disabled = false;
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

    function mostrarMensaje(mensaje, tipo) {
        mensajeBusqueda.textContent = mensaje;
        mensajeBusqueda.style.color = tipo === "error" ? "red" : "#007bff";
        mensajeBusqueda.style.backgroundColor = tipo === "error" ? "#f8d7da" : "#cce5ff";
        setTimeout(() => { mensajeBusqueda.textContent = ''; }, 3000);
    }
});