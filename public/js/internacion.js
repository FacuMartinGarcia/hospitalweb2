const API_URL_PACIENTES = '/api/pacientes';
const API_URL_INTERNACIONES = '/api/internaciones';
const API_URL_COBERTURAS = '/api/coberturas';
const API_URL_MEDICOS = '/api/medicos';
const API_URL_ORIGENES = '/api/origenes';
const API_URL_DIAGNOSTICOS = '/api/diagnosticos';
const API_URL_INFRAESTRUCTURA = '/api/infraestructura';
const API_URL_UNIDADES = '/api/unidades';

let datosMedicos=[];
let datosOrigenes=[];
let datosDiagnosticos=[];   
let idinternacionRecuperada=0;


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
    const seccionCancelarAdmision = document.getElementById("seccionCancelarAdmision");
    const btnCancelarAdmision = document.getElementById("btnCancelarAdmision");
    const seccionCamasAsignadas = document.getElementById("seccionCamasAsignadas");

    const mensajeBusqueda = document.getElementById("mensajes");

    btnRegistrarInternacion.addEventListener("click", registrarInternacion);
    
    let pacienteSeleccionado = null;

    await cargarMedicos();
    await cargarOrigenes();
    await cargarDiagnosticos();

    const hoy = new Date();
    document.getElementById("fechaingreso").value = hoy.toISOString().split('T')[0];
    document.getElementById("horaingreso").value = hoy.toTimeString().substring(0, 5);

    btnBuscarPaciente.addEventListener("click", buscarPaciente);

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
                if (pacienteSeleccionado.fechafallecimiento) {
                    Swal.fire({
                        title: 'Paciente fallecido',
                        html: `<p>El paciente fue registrado como</p>
                            <p><strong>fallecido</strong> en el día <strong>${pacienteSeleccionado.fechafallecimiento}</strong>.</p>
                            <p>No podrá registrar antecedentes en su historia clínica.</p>`,
                        icon: 'info',
                        confirmButtonText: 'Entendido'
                    });
                    btnRegistrarInternacion.disabled = true;
                    mostrarDatosPaciente(pacienteSeleccionado);
                    bloqueardocumento();
                    return;
                }

                mostrarDatosPaciente(pacienteSeleccionado);
                bloqueardocumento();


                verificarInternaciones(pacienteSeleccionado);
                
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
            const data = await response.json();
            return data;
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
            if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
                edad--;
            }
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
                    <h4 class="card-title mb-4 text-center fs-5">Datos del Paciente</h4> <!-- Título agregado -->
                    <div class="row mb-2">
                        <div class="col-md-6">
                            <p><strong>Apellido y Nombres:</strong> ${paciente.apellidonombres}</p>
                        </div>
                        <div class="col-md-3">
                            <p><strong>Sexo:</strong> ${sexoTexto}</p>
                        </div>
                        <div class="col-md-3">
                            <p><strong>Teléfono:</strong> ${paciente.telefono || 'No registrado'}</p>
                        </div>
                    </div>

                    <div class="row mb-2">
                        <div class="col-md-6">
                            <p><strong>Fecha Nacimiento:</strong> ${fechaNacTexto}</p>
                        </div>
                        <div class="col-md-6">
                            <p><strong>Edad:</strong> ${edadTexto}</p>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-12">
                            <p><strong>Cobertura:</strong> ${coberturaNombre}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }



    async function verificarInternaciones(paciente) {
        idinternacionRecuperada = 0;
        try {

            const response = await fetch(`${API_URL_INTERNACIONES}/paciente/${paciente.idpaciente}/activas`);
            if (!response.ok) {
                throw new Error('Error al verificar internaciones');
            }

            const resultado = await response.json();

            if (resultado.activa) {
               
                
                idinternacionRecuperada = resultado.internacion.idinternacion;
                mostrarAdmision(resultado.internacion);
                inputDocumento.disabled = true;
                btnBuscarPaciente.textContent = "Nueva búsqueda";
                btnRegistrarInternacion.disabled = true;
                seccionInternacion.style.display = "none";
                seccionCancelarAdmision.style.display = "block";
                btnCancelarAdmision.disabled = false;
                seccionCamasAsignadas.style.display = "block";
                seleccionarUnidadYBuscarHabitaciones(paciente.sexo);
            } else {
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
            <div class="card border shadow-sm mb-3">
                <div class="card-body">
                    <h4 class="card-title mb-4 text-center fs-5">Datos de Admisión</h4> <!-- Título -->
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
                    <div class="row">
                        <div class="col-md-12">
                            <p><strong>Observaciones:</strong> ${internacion.observaciones}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

    }

        // Asumiendo que tienes el idInternacion disponible (ej: desde un campo oculto o variable global)
    btnCancelarAdmision.addEventListener("click", async () => {
            
            /*
            TERMINAR LA FUNCION PARA VERIFICAR REGISTROS RELACIONADOS;
            TABLAS: 
            internacion_estudios, terapias, cirugias, evmedica, evenfermeria,medicamentos, cama?
            const tieneRegistrosAsociados = await verificarRegistrosAsociados(idinternacion);
            
            if (tieneRegistrosAsociados) {
                Swal.fire({
                    title: 'No se puede cancelar',
                    html: `Esta admisión tiene registros asociados en el sistema.<br>
                        <small>Elimine primero los registros relacionados antes de cancelar.</small>`,
                    icon: 'error',
                    confirmButtonText: 'Entendido'
                });
                return;
            }
            */
        Swal.fire({
            title: '¿Cancelar admisión?',
            html: `Esta acción <strong>eliminará permanentemente</strong> el registro de admisión.<br>
                <small>ID: ${idinternacionRecuperada}</small>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, cancelar',
            cancelButtonText: 'No, volver',
            reverseButtons: true,
            focusCancel: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`/api/internaciones/${idinternacionRecuperada}/cancelarAdmision`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    const data = await response.json();

                    if (data.success) {
                        Swal.fire({
                            title: '¡Cancelada!',
                            text: 'La admisión fue cancelada exitosamente.',
                            icon: 'success',
                            confirmButtonText: 'Cerrar'
                        }).then(() => {
                            location.reload(); // O reemplazar esto por lógica que limpie la UI sin recargar
                        });
                    } else {
                        throw new Error(data.message || 'No se pudo cancelar la admisión.');
                    }
                } catch (error) {
                    Swal.fire({
                        title: 'Error',
                        text: error.message,
                        icon: 'error',
                        confirmButtonText: 'Cerrar'
                    });
                    console.error('Error cancelando admisión:', error);
                }
            }
        });


    });

    function validarDatos(form) {
        let origen = form.idorigen.value;
        let medico = form.idmedico.value;
        let diagnostico = form.iddiagnostico.value;
        let fechaingreso = form.fechaingreso.value;
        let horaingreso = form.horaingreso.value;

        let fechainter = new Date(fechaingreso);
        let hoy = new Date();
        let hace1mes = new Date(hoy);
        hace1mes.setMonth(hace1mes.getMonth() - 1);

        if (fechainter > hoy || fechainter < hace1mes) {
            mostrarMensaje('La fecha de internación debe ser dentro del último mes y no puede estar en el futuro.', 0);
            return false;
        }

        const fechaIngresadaEsHoy = (
            fechainter.getFullYear() === hoy.getFullYear() &&
            fechainter.getMonth() === hoy.getMonth() &&
            fechainter.getDate() === hoy.getDate()
        );

        if (fechaIngresadaEsHoy) {
            const [hora, minuto] = horaingreso.split(':').map(Number);
            const horaInter = new Date(fechainter);
            horaInter.setHours(hora, minuto, 0);

            if (horaInter < hoy) {
                mostrarMensaje('La hora de internación no puede ser anterior a la hora actual.', 0);
                return false;
            }
        }

        if (origen === "") {
            mostrarMensaje('Debe seleccionar un origen.', 0);
            return false;
        }

        if (medico === "") {
            mostrarMensaje('Debe seleccionar un médico.', 0);
            return false;   
        }

        if (diagnostico === "") {
            mostrarMensaje('Debe seleccionar un diagnóstico.', 0);
            return false;   
        }

        return true;
    }

    async function registrarInternacion(e) {    
        e.preventDefault(); 

        if (!validarDatos(formInternacion)) return;

        const nuevaInternacion = {
            idpaciente: pacienteSeleccionado.idpaciente,
            idorigen: Number(formInternacion.idorigen.value),
            idmedico: Number(formInternacion.idmedico.value),
            iddiagnostico: Number(formInternacion.iddiagnostico.value),
            fechaingreso: formInternacion.fechaingreso.value,
            horaingreso: formInternacion.horaingreso.value,
            observaciones: formInternacion.observaciones.value
        };

        const resultadoConfirmacion = await Swal.fire({
            title: '¿Desea continuar?',
            html: `<p>Va a registrar los datos de admisión para la internación.</p>
                <p class="fw-bold text-danger">Estos datos no podrán ser modificados luego de registrar movimientos en la historia clínica del paciente.</p>
                <p>¿Está seguro que desea continuar?</p>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, continuar',
            cancelButtonText: 'Cancelar'
        });

        if (!resultadoConfirmacion.isConfirmed) {
            return; 
        }

        try {
            const response = await fetch(API_URL_INTERNACIONES, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevaInternacion)
            });

            if (!response.ok) {
                throw new Error('Error al registrar internación');
            }

            await Swal.fire({
                title: 'Éxito',
                text: 'Internación registrada correctamente.',
                icon: 'success',
                confirmButtonText: 'Cerrar'
            });

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
            Swal.fire({
                title: 'Error',
                text: 'Error al registrar la internación',
                icon: 'error',
                confirmButtonText: 'Cerrar'
            });
        }
    }


    async function cargarOrigenes() {
        try {
            const response = await fetch(API_URL_ORIGENES);
            if (!response.ok) throw new Error("Error al cargar orígenes");
            const json =  await response.json();
            datosOrigenes = json.origenes;
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
            const response = await fetch(API_URL_MEDICOS);
            if (!response.ok) throw new Error("Error al cargar médicos");
            const json  = await response.json();
            datosMedicos = json.medicos;
            datosMedicos.forEach(item => {
                const option = document.createElement('option');
                option.value = item.idmedico;
                option.textContent = item.apellidonombres;
                selectMedico.appendChild(option);
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

    async function seleccionarUnidadYBuscarHabitaciones(sexoPaciente) {
        
        try {
            const unidadesResponse = await fetch(API_URL_UNIDADES);
            const unidadesData = await unidadesResponse.json();
            if (!unidadesData.success) {
                throw new Error('No se pudieron cargar las unidades');
            }

            const selectHtml = `
            <div style="text-align: center;">
                <select id="swal-select-unidad" style="
                width: 90%;
                font-size: 14px;
                padding: 6px 8px;
                border-radius: 4px;
                margin-top: 10px;
                max-width: 300px;
                ">
                <option value="">Seleccione una unidad...</option>
                ${unidadesData.unidades.map(u => `<option value="${u.idunidad}">${u.denominacion}</option>`).join('')}
                </select>
            </div>
            `;


            const { value: confirm } = await Swal.fire({
            title: 'Seleccionar unidad',
            html: selectHtml,
            preConfirm: () => {
                const unidadSeleccionada = document.getElementById('swal-select-unidad').value;
                if (!unidadSeleccionada) {
                    Swal.showValidationMessage('Debe seleccionar una unidad');
                }
                return unidadSeleccionada;
            },
            showCancelButton: true,
            confirmButtonText: 'Buscar habitaciones'
            });

            if (confirm) await cargarHabitacionesCompatibles(confirm, sexoPaciente);

        } catch (error) {
            console.error('Error:', error);
            Swal.fire('Error', error.message || 'Algo salió mal', 'error');
        }
    }


    async function cargarHabitacionesCompatibles(idunidad, sexo) {

        console.log(`Cargando habitaciones compatibles para unidad ${idunidad} y sexo ${sexo}`);
        console.log(`FETCH --> /api/infraestructura/habitaciones-compatibles?idunidad=${idunidad}&sexo=${sexo}`);

        try {
            const response = await fetch(`/api/infraestructura/habitaciones-compatibles?idunidad=${idunidad}&sexo=${sexo}`);
            const data = await response.json();

            if (data.success) {
            const select = document.getElementById('comboHabitaciones');
            select.innerHTML = '<option value="">Seleccione una habitación...</option>';

            data.habitaciones.forEach(h => {
                const option = document.createElement('option');
                option.value = h.idhabitacion;
                option.textContent = h.nombrehabitacion;
                select.appendChild(option);
            });
            } else {
            Swal.fire('Error', data.message || 'No se pudieron cargar habitaciones', 'error');
            }
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Fallo en la carga de habitaciones', 'error');
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
        seccionCancelarAdmision.style.display = "none";
        seccionCamasAsignadas.style.display = "none";
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