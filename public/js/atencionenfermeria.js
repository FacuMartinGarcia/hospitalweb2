import { buscarPaciente } from './buscarPaciente.js';

document.addEventListener("DOMContentLoaded", () => {
    
    const inputDocumento = document.getElementById("documento");
    const btnBuscarPaciente = document.getElementById("btnBuscarPaciente");
    const datosPaciente = document.getElementById("datosPaciente");
    const datosInternacion = document.getElementById("datosInternacion");
    const mensajeBusqueda = document.getElementById("mensajes");
    
    btnBuscarPaciente.addEventListener("click", () => {
        console.log("Click detectado");
        if (btnBuscarPaciente.textContent === "Nueva búsqueda") {
            resetearBusqueda();
        } else {
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
        
    }

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
    function mostrarMensaje(mensaje, tipo) {
        mensajeBusqueda.textContent = mensaje;
        mensajeBusqueda.style.color = tipo === "error" ? "red" : "#007bff";
        mensajeBusqueda.style.backgroundColor = tipo === "error" ? "#f8d7da" : "#cce5ff";
        setTimeout(() => { mensajeBusqueda.textContent = ''; }, 3000);
    }

    function limpiarDatosPaciente() {
        datosPaciente.innerHTML = "";
    }

    function bloqueardocumento() {
        inputDocumento.disabled = true;
        btnBuscarPaciente.textContent = "Nueva búsqueda";
    }

    function resetearBusqueda() {
        inputDocumento.value = "";
        inputDocumento.disabled = false;
        btnBuscarPaciente.textContent = "Buscar";
        limpiarDatosPaciente();
        datosInternacion.innerHTML = "";
        inputDocumento.focus();
    }
});
