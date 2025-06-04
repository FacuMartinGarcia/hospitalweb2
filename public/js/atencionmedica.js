import { buscarPaciente } from './buscarPaciente.js';

const API_URL_PACIENTES = '/api/pacientes';
const API_URL_INTERNACIONES = '/api/internaciones';
const API_URL_MEDICOS = '/api/medicos';
const API_URL_ORIGENES = '/api/origenes';
const API_URL_DIAGNOSTICOS = '/api/diagnosticos';
const API_URL_MEDICAMENTOS = '/api/medicamentos';

let datosMedicos = [];
let datosOrigenes = [];
let datosDiagnosticos = [];
let datosMedicamentos = [];
let idinternacionRecuperada = 0;

document.addEventListener("DOMContentLoaded", async () => {

    const inputDocumento = document.getElementById("documento");
    const btnBuscarPaciente = document.getElementById("btnBuscarPaciente");
    const datosPaciente = document.getElementById("datosPaciente");
    const seccionInternacion = document.getElementById("seccionInternacion");
    const datosInternacion = document.getElementById("datosInternacion");
    const mensajeBusqueda = document.getElementById("mensajes");
    

    const medicoSesion = document.getElementById('medicoSesion');
    const medicamentoPrescripcion = document.getElementById('medicamentoPrescripcion');

    // Evaluaciones medicas
    const formEvaluaciones = document.getElementById('evaluaciones');
    const fechaEvaluacion = document.getElementById('fechaEvaluacion');
    const medicoEvaluacion = document.getElementById('medicoEvaluacion');
    const diagnosticoEvaluacion = document.getElementById('diagnosticoEvaluacion');
    const observacionesEvaluacion = document.getElementById('observacionesEvaluacion');

    let pacienteSeleccionado = null;

    await cargarMedicos();
    
    await cargarDiagnosticos();
    await cargarMedicamentos();

    btnBuscarPaciente.addEventListener("click", () => {
                
        if (btnBuscarPaciente.textContent === "Nueva búsqueda") {
            resetearBusqueda();
            contenedorAtencionMedica.style.display = 'none';
        } else {
            if (btnBuscarPaciente.textContent === "Buscar") {
                const contenedorAtencionMedica = document.getElementById("contenedorAtencionMedica");
            if (contenedorAtencionMedica) {
                //contenedorAtencionMedica.style.display = 'none';
            }
            }

            const dni = inputDocumento.value.trim();
            if (!dni || isNaN(dni)) {
                mostrarMensaje("Ingrese un número de documento válido", "error");
                return;
            }
            buscarPaciente(
                dni,
                mostrarDatosPaciente,
                mostrarAdmision,
                limpiarDatosPaciente,
                bloqueardocumento,
                btnBuscarPaciente,
                inputDocumento,
                datosInternacion,
                manejarSinInternacionActiva 
            );
        }
    });

    function manejarSinInternacionActiva() {

        document.getElementById('contenedorAtencionMedica').style.display = 'none';
        Swal.fire({
            title: 'Sin internación activa',
            html: `<p>El paciente no tiene una internación activa en curso.</p>
                <p>No puede registrar intervenciones.</p>`,
            icon: 'info',
            confirmButtonText: 'Entendido'
        });

        datosInternacion.style.display = 'none'; 
        inputDocumento.disabled = false;
        btnBuscarPaciente.textContent = "Nueva búsqueda";
        contenedorAtencionMedica.style.display = 'none'; 

    }


    document.getElementById('btnRegistrarPrescripcion').addEventListener('click', async (e) => {

        e.preventDefault();

        console.log("en registrar prescripcion");    
        const idinternacion = document.getElementById('datosInternacion')?.dataset?.id || idinternacionRecuperada;
        const idmedico = document.getElementById('medicoSesion')?.value;
        const idmedicamento = document.getElementById('medicamentoPrescripcion')?.value;
        const cantidad = document.getElementById('cantidadPrescripcion')?.value;
        const observaciones = document.getElementById('observacionesPrescripcion')?.value;

        console.log(idinternacionRecuperada);

        if (!idmedicamento) {
            mostrarMensaje('Debe seleccionar un medicamento de la lista', 0);
            medicamentoPrescripcion.focus();
            return;
        }

        const cantidadNum = parseInt(cantidad);
        if (isNaN(cantidadNum) || cantidadNum <= 0) {
            mostrarMensaje('La cantidad debe ser un número mayor a 0.', 0);
            document.getElementById('cantidadPrescripcion').focus();
            return;
        }

        if (!idinternacion || !idmedico) {
            mostrarMensaje('Falta información clave en la ficha', 0);
            return;
        }

        try {
            const res = await fetch('/atencion/medicamentos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    idinternacion,
                    idmedico,
                    idmedicamento,
                    cantidad: cantidadNum,
                    observacionesme: observaciones ? observaciones.toUpperCase() : ''
                })

            });

            const data = await res.json();

            if (data.success) {
                Swal.fire('Éxito', 'Prescripción registrada correctamente.', 'success');
                document.getElementById('medicamentoPrescripcion').value = '';
                document.getElementById('cantidadPrescripcion').value = '';
                document.getElementById('observacionesPrescripcion').value = '';
                await cargarPrescripciones(idinternacion);
            } else {
                Swal.fire('Error', data.message || 'No se pudo registrar la prescripción.', 'error');
            }
        } catch (err) {
            console.error(err);
            Swal.fire('Error', 'Error al conectar con el servidor.', 'error');
        }
    });

    async function cargarPrescripciones(idinternacionRecuperada) {
        try {
            const res = await fetch(`/atencion/medicamentos/${idinternacionRecuperada}`);
            const data = await res.json();

            const tbody = document.getElementById('tablaPrescripciones');
            tbody.innerHTML = '';

            if (data.success && data.data.length > 0) {
                data.data.forEach(p => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${p.fechaprescripcion}</td>
                        <td>${p.medico.apellido}, ${p.medico.nombre}</td>
                        <td>${p.medicamento.denominacion}</td>
                        <td>${p.cantidad}</td>
                        <td>${p.observacionesme || ''}</td>
                        <td><button class="btn btn-sm btn-danger disabled">Eliminar</button></td>
                    `;
                    tbody.appendChild(tr);
                });
            } else {
                tbody.innerHTML = `<tr><td colspan="6" class="text-center">No hay prescripciones registradas.</td></tr>`;
            }
        } catch (error) {
            console.error('Error al cargar prescripciones:', error);
        }
    }

    formEvaluaciones.addEventListener('submit', async (e) => {
        e.preventDefault();

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
            try {
                const response = await fetch('/api/evaluaciones', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        idinternacion: idinternacionRecuperada,
                        fecha: fechaEvaluacion.value,
                        idmedico: medicoEvaluacion.value,
                        iddiagnostico: diagnosticoEvaluacion.value,
                        observaciones: observacionesEvaluacion.value.trim().toUpperCase()
                    })
                });

                const data = await response.json();

                if (data.success) {
                    Swal.fire('Éxito', 'Evaluación registrada correctamente', 'success');
                    formEvaluaciones.reset();
                } else {
                    Swal.fire('Error', data.message || 'Error al registrar la evaluación', 'error');
                }
            } catch (error) {
                console.error('Error al registrar evaluación:', error);
                Swal.fire('Error', 'Error al conectar con el servidor', 'error');
            }
        }
    });

    function mostrarDatosPaciente(paciente) {
        let edadTexto = "Sin datos";

        if (paciente.fechanacimiento) {
            const fechaNac = new Date(paciente.fechanacimiento);
            const hoy = new Date();
            let edad = hoy.getFullYear() - fechaNac.getFullYear();
            const mes = hoy.getMonth() - fechaNac.getMonth();
            if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) edad--;
            edadTexto = `${edad} años`;
        }

        const sexoTexto = {
            'M': 'Masculino',
            'F': 'Femenino',
            'X': 'No binario'
        }[paciente.sexo] || 'Sin datos';

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
    async function mostrarAdmision(internacion) {
        
        idinternacionRecuperada = internacion.idinternacion;
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
        document.getElementById('contenedorAtencionMedica').style.display = 'block';
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
            const json = await response.json();
            datosMedicos = json.medicos;
            datosMedicos.forEach(item => {
                const option = document.createElement('option');
                option.value = item.idmedico;
                option.textContent = item.apellidonombres;
                medicoSesion.appendChild(option);
                medicoSesion.appendChild(option.cloneNode(true));
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

});