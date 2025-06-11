import { buscarPaciente } from './buscarPaciente.js';
import { mostrarMensaje, getFechaLocal } from './utils.js';

//const API_URL_PACIENTES = '/api/pacientes';
//const API_URL_INTERNACIONES = '/api/internaciones';
const API_URL_MEDICOS = '/api/medicos';
const API_URL_ESTUDIOS = '/api/estudios';
const API_URL_DIAGNOSTICOS = '/api/diagnosticos';
const API_URL_MEDICAMENTOS = '/api/medicamentos';
const API_URL_TIPOSCIRUGIAS = '/api/tiposcirugias';
const API_URL_TIPOSANESTESIAS = '/api/tiposanestesias';


let datosMedicos = [];
let datosEstudios = [];
let datosDiagnosticos = [];
let datosMedicamentos = [];
let datosCirugias = [];
let datosAnestesias = [];
let idInternacionRecuperada = 0;

document.addEventListener("DOMContentLoaded", async () => {

    //formEvaluaciones = document.getElementById('evaluaciones');
    const inputDocumento = document.getElementById("documento");
    const btnBuscarPaciente = document.getElementById("btnBuscarPaciente");
    const datosPaciente = document.getElementById("datosPaciente");
    //const seccionInternacion = document.getElementById("seccionInternacion");
    const datosInternacion = document.getElementById("datosInternacion");

    const tipoAnestesia = document.getElementById('tipoAnestesia');    
    
    // Medicamentos
    //const medicoSesion = document.getElementById('medicoSesion');
    //const medicamentoPrescripcion = document.getElementById('medicamentoPrescripcion');
   // const cantidadPrescripcion = document.getElementById('cantidadPrescripcion');

    // Estudios
    //const tipoEstudio = document.getElementById('tipoEstudio');
    //const observacionesEstudios = document.getElementById('observacionesEstudios');

    
    // Evaluaciones medicas
    /*
    
    const fechaEvaluacion = document.getElementById('fechaEvaluacion');
    const medicoEvaluacion = document.getElementById('medicoEvaluacion');
    const diagnosticoEvaluacion = document.getElementById('diagnosticoEvaluacion');
    const observacionesEvaluacion = document.getElementById('observacionesEvaluacion');
    */

    let pacienteSeleccionado = null;

    await cargarMedicos();
    await cargarDiagnosticos();
    await cargarMedicamentos();
    await cargarEstudios();
    await cargarCirugias();
    await cargarTiposAnestesias();


    btnBuscarPaciente.addEventListener("click", () => {
                
        if (btnBuscarPaciente.textContent === "Nueva búsqueda") {
            resetearBusqueda();
            contenedorAtencionMedica.style.display = 'none';
        } else {
            if (btnBuscarPaciente.textContent === "Buscar") {
                const contenedorAtencionMedica = document.getElementById("contenedorAtencionMedica");
            }

            const dni = inputDocumento.value.trim();
            if (!dni || isNaN(dni)) {
                mostrarMensaje('#mensajes', 'Ingrese un número de documento válido', 0);
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

        const idmedico = document.getElementById('medicoSesion')?.value;
        const idmedicamento = document.getElementById('medicamentoPrescripcion')?.value;
        const cantidad = document.getElementById('cantidadPrescripcion')?.value;
        const observaciones = document.getElementById('observacionesPrescripcion')?.value;
        

        if (!idmedico) {
            mostrarMensaje('#mensajesSeccion', 'Debe seleccionar un médico de la lista', 0);
            medicoSesion.focus();
            return;
        }

        if (!idmedicamento) {
            mostrarMensaje('#mensajesSeccion', 'Debe seleccionar un medicamento de la lista', 0);
            medicamentoPrescripcion.focus();
            return;
        }

        const cantidadNum = parseInt(cantidad);
        if (isNaN(cantidadNum) || cantidadNum <= 0) {
            mostrarMensaje('#mensajesSeccion', 'La cantidad debe ser un número mayor a 0', 0);
            cantidadPrescripcion.focus();
            return;
        }

        if (!idInternacionRecuperada) {
            mostrarMensaje('#mensajesSeccion', 'Falta información clave en la ficha (internación)', 0);
            return;
        }

        const confirmacion = await Swal.fire({
            title: 'Confirmar Medicamento',
            html: `
            <div style="color: red; font-weight: bold; margin-bottom: 1rem;">
                Va a ingresar registro de medicación.<br>
                Este registro no podrá ser modificado, ni eliminado.
            </div>
            <div style="margin-bottom: 1rem;">
                <strong>Medicamento:</strong> ${medicamentoPrescripcion.options[medicamentoPrescripcion.selectedIndex].text}<br>
                <strong>Cantidad:</strong> ${cantidadNum}<br>
                <strong>Observación:</strong> ${observaciones || '-'}
            </div>
            <strong>¿Está seguro de ingresar el registro?</strong>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, registrar',
            cancelButtonText: 'Cancelar',
            reverseButtons: true, 
            focusCancel: true     
        });

        if (!confirmacion.isConfirmed) {
            return;
        }

    

        try {
            const res = await fetch('/api/atencionmedica/medicamentos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                idinternacion: idInternacionRecuperada, 
                fechaprescripcion: getFechaLocal(),
                idmedico,
                idmedicamento,
                cantidad: cantidadNum,
                observacionesme: observaciones ? observaciones.toUpperCase() : ''
            })
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Error ${res.status}: ${text}`);
            }

            const data = await res.json();

            if (data.success) {
                Swal.fire('Éxito', 'Prescripción registrada correctamente.', 'success');
                document.getElementById('medicamentoPrescripcion').value = '';
                document.getElementById('cantidadPrescripcion').value = '';
                document.getElementById('observacionesPrescripcion').value = '';
                await cargarPrescripciones(idInternacionRecuperada);
            } else {
                Swal.fire('Error', data.message || 'No se pudo registrar la prescripción.', 'error');
            }
        } catch (err) {
            console.error(err);
            Swal.fire('Error', 'Error al conectar con el servidor.', 'error');
        }
    });

    document.getElementById('btnRegistrarEstudio').addEventListener('click', async (e) => {

        e.preventDefault();

        const idmedico = document.getElementById('medicoSesion')?.value;
        const idestudio = document.getElementById('tipoEstudio')?.value;
        const observaciones = document.getElementById('observacionesEstudios')?.value;

        if (!idmedico) {
            mostrarMensaje('#mensajesSeccion', 'Debe seleccionar un médico de la lista', 0);
            medicoSesion.focus();
            return;
        }

        if (!idestudio) {
            mostrarMensaje('#mensajesSeccion', 'Debe seleccionar un estudio de la lista', 0);
            tipoEstudio.focus();
            return;
        }

        if (!idInternacionRecuperada) {
            mostrarMensaje('#mensajesSeccion', 'Falta información clave en la ficha (internación)', 0);
            return;
        }

        const confirmacion = await Swal.fire({
            title: 'Confirmar Registro de Estudio',
            html: `
            <div style="color: red; font-weight: bold; margin-bottom: 1rem;">
                Va a ingresar un registro de estudio / análisis.<br>
                Este registro no podrá ser modificado, ni eliminado.
            </div>
            <div style="margin-bottom: 1rem;">
                <strong>Estudio:</strong> ${tipoEstudio.options[tipoEstudio.selectedIndex].text}<br>
                <strong>Observación:</strong> ${observaciones || '-'}
            </div>
            <strong>¿Está seguro de ingresar el registro?</strong>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, registrar',
            cancelButtonText: 'Cancelar',
            reverseButtons: true, 
            focusCancel: true     
        });

        if (!confirmacion.isConfirmed) {
            return;
        }

        try {
            const res = await fetch('/api/atencionmedica/estudios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                idinternacion: idInternacionRecuperada, 
                fechaestudio: new Date().toISOString().split('T')[0],
                idmedico,
                idestudio,
                observacioneses: observaciones ? observaciones.toUpperCase() : ''
            })
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Error ${res.status}: ${text}`);
            }

            const data = await res.json();
            
            if (data.success) {
                Swal.fire('Éxito', 'Estudio/Análisis registrado correctamente.', 'success');
                document.getElementById('tipoEstudio').value = '';
                document.getElementById('observacionesEstudios').value = '';
                await cargarTablaEstudios(idInternacionRecuperada);
            } else {
                Swal.fire('Error', data.message || 'No se pudo registrar el estudio.', 'error');
            }
        } catch (err) {
            console.error(err);
            Swal.fire('Error', 'Error al conectar con el servidor.', 'error');
        }
    });
 
    document.getElementById('btnRegistrarCirugia').addEventListener('click', async (e) => {

        e.preventDefault();

        const idmedico = document.getElementById('medicoSesion')?.value;
        const idcirugia = document.getElementById('tipoCirugia')?.value;
        const idtipoanestesia = document.getElementById('tipoAnestesia')?.value;
        const observaciones = document.getElementById('observacionescirugia')?.value;

        if (!idmedico) {
            mostrarMensaje('#mensajesSeccion', 'Debe seleccionar un médico de la lista', 0);
            medicoSesion.focus();
            return;
        }

        if (!idcirugia) {
            mostrarMensaje('#mensajesSeccion', 'Debe seleccionar un estudio de la lista', 0);
            tipoCirugia.focus();
            return;
        }

        if (!idtipoanestesia) {
            mostrarMensaje('#mensajesSeccion', 'Debe seleccionar un estudio de la lista', 0);
            tipoAnestesia.focus();
            return;
        }
        if (!idInternacionRecuperada) {
            mostrarMensaje('#mensajesSeccion', 'Falta información clave en la ficha (internación)', 0);
            return;
        }

        const confirmacion = await Swal.fire({
            title: 'Confirmar Cirugia',
            html: `
            <div style="color: red; font-weight: bold; margin-bottom: 1rem;">
                Va a ingresar una práctica quirúrgica.<br>
                Este registro no podrá ser modificado, ni eliminado.
            </div>
            <div style="margin-bottom: 1rem;">
                <strong>Estudio:</strong> ${tipoCirugia.options[tipoCirugia.selectedIndex].text}<br>
                <strong>Observación:</strong> ${observaciones || '-'}
            </div>
            <strong>¿Está seguro de ingresar el registro?</strong>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, registrar',
            cancelButtonText: 'Cancelar',
            reverseButtons: true, 
            focusCancel: true     
        });

        if (!confirmacion.isConfirmed) {
            return;
        }

        try {
            const res = await fetch('/api/atencionmedica/estudios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                idinternacion: idInternacionRecuperada, 
                fechacirugia: getFechaLocal(),
                idmedico,
                idcirugia,
                idtipoanestesia,
                observaciones: observaciones ? observaciones.toUpperCase() : ''
            })
            });

            

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Error ${res.status}: ${text}`);
            }

            const data = await res.json();
            
            if (data.success) {
                Swal.fire('Éxito', 'Cirugia registrada correctamente.', 'success');
                document.getElementById('tipoCirugia').value = '';
                document.getElementById('tipoAnestesia').value = '';
                document.getElementById('observacionesCirugia').value = '';
                await cargarTablaCirugias(idInternacionRecuperada);
            } else {
                Swal.fire('Error', data.message || 'No se pudo registrar el estudio.', 'error');
            }
        } catch (err) {
            console.error(err);
            Swal.fire('Error', 'Error al conectar con el servidor.', 'error');
        }
    });
 

    async function cargarPrescripciones(idInternacionRecuperada) {
        try {
            const res = await fetch(`/api/atencionmedica/medicamentos/${idInternacionRecuperada}`);
            const data = await res.json();

            const tbody = document.getElementById('tablaMedicamentos');
            tbody.innerHTML = '';

            if (data.success && data.data.length > 0) {
                data.data.forEach(p => {
                    const tr = document.createElement('tr');
                        tr.innerHTML = `
                        <td class="text-center col-fecha">${p.fechaprescripcion}</td>
                        <td>${p.medico}</td>
                        <td class="col-medicamento">${p.medicamento.nombremedicamento} ${p.medicamento.presentacion}</td>
                        <td class="text-center col-cantidad">${p.cantidad}</td>
                        <td class="col-observaciones">${p.observacionesme || ''}</td>
                        `;
                    tbody.appendChild(tr);
                });
            } else {
                tbody.innerHTML = `<tr><td colspan="5" class="text-center">No hay prescripciones registradas.</td></tr>`;
            }
        } catch (error) {
            console.error('Error al cargar prescripciones:', error);
        }
    }


    async function cargarTablaMedicamentos(idInternacionRecuperada) {
        try {
            const res = await fetch(`/api/atencionmedica/medicamentos/${idInternacionRecuperada}`);
            const data = await res.json();

            const tbody = document.getElementById('tablaMedicamentos');
            tbody.innerHTML = '';

            if (data.success && data.data.length > 0) {
                data.data.forEach(p => {
                    const tr = document.createElement('tr');
                        tr.innerHTML = `
                        <td class="text-center col-fecha">${p.fechaprescripcion}</td>
                        <td>${p.medico}</td>
                        <td class="col-medicamento">${p.medicamento.nombremedicamento} ${p.medicamento.presentacion}</td>
                        <td class="text-center col-cantidad">${p.cantidad}</td>
                        <td class="col-observaciones">${p.observacionesme || ''}</td>
                        `;
                    tbody.appendChild(tr);
                });
            } else {
                tbody.innerHTML = `<tr><td colspan="5" class="text-center">No hay medicamentos registrados.</td></tr>`;
            }
        } catch (error) {
            console.error('Error al cargar prescripciones:', error);
        }
    }

    async function cargarTablaEstudios(idInternacionRecuperada) {
       
        try {
            const res = await fetch(`/api/atencionmedica/estudios/${idInternacionRecuperada}`);
            const data = await res.json();
        
            const tbody = document.getElementById('tablaEstudios');
            tbody.innerHTML = '';

            if (data.success && data.data.length > 0) {
                data.data.forEach(p => {
                    const tr = document.createElement('tr');
                        tr.innerHTML = `
                        <td class="text-center col-fecha">${p.fechaestudio}</td>
                        <td>${p.medico}</td>
                        <td class="col-tipoestudio">${p.estudio}</td>
                        <td class="col-observaciones">${p.observacioneses || ''}</td>
                        `;
                    tbody.appendChild(tr);
                });
            } else {
                tbody.innerHTML = `<tr><td colspan="4" class="text-center">No hay estudios registrados.</td></tr>`;
            }
        } catch (error) {
            console.error('Error al cargar pedidos de estudios:', error);
        }
    }

    async function cargarTablaCirugias(idInternacionRecuperada) {
       
        try {
            const res = await fetch(`/api/atencionmedica/cirugias/${idInternacionRecuperada}`);
            const data = await res.json();
        
            const tbody = document.getElementById('tablaCirugias');
            tbody.innerHTML = '';

            if (data.success && data.data.length > 0) {
                data.data.forEach(p => {
                    const tr = document.createElement('tr');
                        tr.innerHTML = `
                        <td class="text-center col-fecha">${p.fechacirugia}</td>
                        <td>${p.medico}</td>
                        <td class="col-tipoestudio">${p.estudio}</td>
                        <td class="col-tipoestudio">${p.anestesia}</td>
                        <td class="col-observaciones">${p.observaciones || ''}</td>
                        `;
                    tbody.appendChild(tr);
                });
            } else {
                tbody.innerHTML = `<tr><td colspan="5" class="text-center">No hay cirugias registradas.</td></tr>`;
            }
        } catch (error) {
            console.error('Error al cargar cirugias:', error);
        }
    }

    document.getElementById('btnRegistrarEvaluacion').addEventListener('click', async (e) => {
        e.preventDefault();

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
                        idinternacion: idInternacionRecuperada,
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
        
        idInternacionRecuperada = internacion.idinternacion;

        datosInternacion.innerHTML = `
            <div class="card border shadow-sm mb-3 bg-light-subtle" style="background-color:rgb(149, 196, 223);">
                <div class="card-body">
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
        //Una vez que recupera la internacion, debemos traer los datos de las tablas
        await cargarTablaMedicamentos(idInternacionRecuperada);
        await cargarTablaEstudios(idInternacionRecuperada);
        await cargarTablaCirugias(idInternacionRecuperada);

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
    async function cargarEstudios() {
        try {
            const response = await fetch(API_URL_ESTUDIOS);
            if (!response.ok) throw new Error("Error al cargar los tipos de estudios");
            datosEstudios = await response.json();
            datosEstudios.forEach(item => {
                const option = document.createElement('option');
                option.value = item.idestudio;
                option.textContent = item.denominacion;
                tipoEstudio.appendChild(option);
            });
        } catch (error) {
            console.error("Error al cargar tipos de estudos:", error);
        }
    }

    async function cargarCirugias() {
        try {
            const response = await fetch(API_URL_TIPOSCIRUGIAS);
            if (!response.ok) throw new Error("Error al cargar los tipos de cirugias");
            datosCirugias = await response.json();
            datosCirugias.forEach(item => {
                const option = document.createElement('option');
                option.value = item.idtipocirugia;
                option.textContent = item.denominacioncirugia;
                tipoCirugia.appendChild(option);
            });
        } catch (error) {
            console.error("Error al cargar tipos de cirugias:", error);
        }
    }

    async function cargarTiposAnestesias() {
        try {
            const response = await fetch(API_URL_TIPOSANESTESIAS);
            if (!response.ok) throw new Error("Error al cargar los tipos de anestesia");
            datosAnestesias = await response.json();
            datosAnestesias.forEach(item => {
                const option = document.createElement('option');
                option.value = item.idtipoanestesia;
                option.textContent = item.denominacionanestesia;
                tipoAnestesia.appendChild(option);
            });
        } catch (error) {
            console.error("Error al cargar tipos de anestesia:", error);
        }
    }

});