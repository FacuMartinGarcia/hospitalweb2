const API_URL_PACIENTES = '/api/pacientes';
const API_URL_INTERNACIONES = '/api/internaciones';
const API_URL_MEDICOS = '/api/medicos';
const API_URL_ORIGENES = '/api/origenes';
const API_URL_DIAGNOSTICOS = '/api/diagnosticos';
const API_URL_MEDICAMENTOS = '/api/medicamentos';

let datosMedicos=[];
let datosOrigenes=[];
let datosDiagnosticos=[];   
let datosMedicamentos=[];
let idinternacionRecuperada=0;

document.addEventListener("DOMContentLoaded", async () => {
    const inputDocumento = document.getElementById("documento");
    const btnBuscarPaciente = document.getElementById("btnBuscarPaciente");
    const datosPaciente = document.getElementById("datosPaciente");
    const seccionInternacion = document.getElementById("seccionInternacion");
    const datosInternacion = document.getElementById("datosInternacion");
    const mensajeBusqueda = document.getElementById("mensajes");
     
    const medicoSesion = document.getElementById('medicoSesion');

    //Evaluaciones medicas
    const formEvaluaciones = document.getElementById('evaluaciones');
    const fechaEvaluacion = document.getElementById('fechaEvaluacion');
    const diagnosticoEvaluacion = document.getElementById('diagnosticoEvaluacion');
    const observacionesEvaluacion = document.getElementById('observacionesEvaluacion');

    //Medicamentos
    const formPrescripciones= document.getElementById('prescripciones');
    const medicamentoPrescripcion = document.getElementById('medicamentoPrescripcion');
    const cantidadPrescripcion = document.getElementById('cantidadPrescripcion');
    const observacionesPrescripcion = document.getElementById('observacionesPrescripcion');

    let pacienteSeleccionado = null;
    let idinternacionRecuperada = 0;

    await cargarMedicos();
    await cargarOrigenes();
    await cargarDiagnosticos();
    await cargarMedicamentos();


    btnBuscarPaciente.addEventListener("click", buscarPaciente);


    formEvaluaciones.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validaciones
        if (!fechaEvaluacion.value) {
        Swal.fire('Error', 'Debe seleccionar una fecha de evaluación', 'error');
        return;
        }

        if (!medicoEvaluacion.value) {
        Swal.fire('Error', 'Debe seleccionar un médico', 'error');
        return;
        }

        if (!diagnosticoEvaluacion.value) {
        Swal.fire('Error', 'Debe seleccionar un diagnóstico', 'error');
        return;
        }

        if (!observacionesEvaluacion.value.trim()) {
        Swal.fire('Error', 'Debe ingresar una observación', 'error');
        return;
        }

        const confirmacion = await Swal.fire({
        title: '¿Está seguro?',
        text: 'Los datos serán incorporados a la historia clínica.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, registrar',
        cancelButtonText: 'Cancelar'
        });

        if (confirmacion.isConfirmed) {
        // Aquí iría la lógica para guardar los datos 
        Swal.fire('Registrado', 'La evaluación fue registrada correctamente.', 'success');

        // Limpieza de campos
        fechaEvaluacion.value = '';
        medicoEvaluacion.value = '';
        diagnosticoEvaluacion.value = '';
        observacionesEvaluacion.value = '';
        }
    });
   
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
                }).then(() => setTimeout(() => inputDocumento.focus(), 300));
                limpiarDatosPaciente();
                return;
            }

            pacienteSeleccionado = resultado.paciente;

            if (pacienteSeleccionado.fechafallecimiento) {
                Swal.fire({
                    title: 'Paciente fallecido',
                    html: `<p>El paciente fue registrado como</p>
                           <p><strong>fallecido</strong> en el día <strong>${pacienteSeleccionado.fechafallecimiento}</strong>.</p>
                           <p>No podrá registrar antecedentes en su historia clínica.</p>`,
                    icon: 'info',
                    confirmButtonText: 'Entendido'
                });
                mostrarDatosPaciente(pacienteSeleccionado);
                bloqueardocumento();
                return;
            }

            mostrarDatosPaciente(pacienteSeleccionado);
            bloqueardocumento();
            await verificarInternaciones(pacienteSeleccionado);
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
                if (response.status === 404) return null;
                throw new Error('Error en la respuesta del servidor');
            }
            return await response.json();
        } catch (error) {
            console.error('Error al buscar paciente:', error);
            throw error;
        }
    }

    function mostrarDatosPaciente(paciente) {
        let edadTexto = "Sin datos";
        let fechaNacTexto = "Sin datos";

        if (paciente.fechanacimiento) {
            const fechaNac = new Date(paciente.fechanacimiento);
            const hoy = new Date();
            let edad = hoy.getFullYear() - fechaNac.getFullYear();
            const mes = hoy.getMonth() - fechaNac.getMonth();
            if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) edad--;
            fechaNacTexto = paciente.fechanacimiento;
            edadTexto = `${edad} años`;
        }

        const sexoTexto = paciente.sexo === 'M' ? 'Masculino' : (paciente.sexo === 'F' ? 'Femenino' : 'Sin datos');
        const coberturaNombre = (paciente.cobertura && paciente.cobertura.denominacion)
            ? paciente.cobertura.denominacion
            : "Sin cobertura";

        datosPaciente.innerHTML = `
            <div class="card border shadow-sm mb-3">
            <div class="card-body">
                <h4 class="card-title mb-4 text-center fs-5">Datos del Paciente</h4>
                <div class="row mb-2 align-items-center">
                <div class="col-md-6">
                    <p><strong>Apellido y Nombres:</strong> ${paciente.apellidonombres}</p>
                </div>
                <div class="col-md-3">
                    <p><strong>Sexo:</strong> ${sexoTexto}</p>
                </div>
                <div class="col-md-3">
                    <p><strong>Edad:</strong> ${edadTexto}</p>
                </div>
                </div>
            </div>
            </div>
        `;
    }

    async function verificarInternaciones(paciente) {
        try {
            const response = await fetch(`${API_URL_INTERNACIONES}/paciente/${paciente.idpaciente}/activas`);
            if (!response.ok) throw new Error('Error al verificar internaciones');

            const resultado = await response.json();

            if (resultado.activa) {
                idinternacionRecuperada = resultado.internacion.idinternacion;
                console.log("idinternacionRecuperada");
                console.log(idinternacionRecuperada);
                console.log(resultado.internacion);
                mostrarAdmision(resultado.internacion);
                inputDocumento.disabled = true;
                btnBuscarPaciente.textContent = "Nueva búsqueda";

                
            } else {
                console.log("No hay internaciones activas");
            }
        } catch (error) {
            console.error('Error al verificar internaciones:', error);
            mostrarMensaje("Error al verificar internaciones del paciente", "error");
        }
    }
    async function mostrarAdmision(internacion) {
        console.log("Estoy en mostrarAdmision");
        console.log(internacion); 
        datosInternacion.innerHTML = `
            <div class="card border shadow-sm mb-3 bg-light-subtle" style="background-color:rgb(149, 196, 223);">
                <div class="card-body">
                    <h4 class="card-title mb-4 text-center fs-5 text-dark">Datos de Admisión</h4>
                    <div class="row mb-2">
                        <div class="col-md-6">
                            <p><strong>Origen:</strong> ${internacion.origen.denominacion}</p>
                        </div>
                        <div class="col-md-6">
                            <p><strong>Médico:</strong> ${internacion.medico.apellidonombres}</p>
                        </div>
                    </div>
                    <div class="row mb-2">
                        <div class="col-md-12">
                            <p><strong>Diagnóstico:</strong> ${internacion.diagnostico.descripcion}</p>
                        </div>
                    </div>
                    <div class="row mb-2">
                        <div class="col-md-6">
                            <p><strong>Fecha Ingreso:</strong> ${internacion.fechaingreso}</p>
                        </div>
                        <div class="col-md-6">
                            <p><strong>Hora Ingreso:</strong> ${internacion.horaingreso}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function resetearBusqueda() {
        inputDocumento.value = "";
        inputDocumento.disabled = false;
        btnBuscarPaciente.textContent = "Buscar";
        limpiarDatosPaciente();
        datosInternacion.innerHTML = "";
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
    async function cargarMedicos() {
        try {
            const response = await fetch(API_URL_MEDICOS);
            if (!response.ok) throw new Error("Error al cargar médicos");
            const json  = await response.json();
            datosMedicos = json.medicos;
            datosMedicos.forEach(item => {
                const option = document.createElement('option');
                option.value = item.idmedico;
                option.textContent = item.apellidonombres;
                medicoSesion.appendChild(option);
            });
        } catch (error) {
            console.error("Error al cargar médicos:", error);
        }
    }
    async function cargarDiagnosticos() {
        try {
            const response = await fetch(API_URL_DIAGNOSTICOS);
            if (!response.ok) throw new Error("Error al cargar diagnósticos");
                datosDiagnosticos = await response.json();

                datosDiagnosticos.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.iddiagnostico;
                    option.textContent = item.descripcion;
                    diagnosticoEvaluacion.appendChild(option);
            });
        } catch (error) {
            console.error("Error al cargar diagnósticos:", error);
        }
    }

    async function cargarMedicamentos() {
        try {
            const response = await fetch(API_URL_MEDICAMENTOS);
            if (!response.ok) throw new Error("Error al cargar medicamentos");
                datosMedicamentos = await response.json();

                datosMedicamentos.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.idmedicamento;
                    option.textContent = item.nombremedicamento + " - " + item.presentacion;
                    medicamentoPrescripcion.appendChild(option);
            });
        } catch (error) {
            console.error("Error al cargar medicamentos:", error);
        }
    }
    async function cargarOrigenes() {}

});
