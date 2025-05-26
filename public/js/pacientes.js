const API_URL = '/api/pacientes';

const form = document.getElementById("formPaciente");
const inputDocumento  = document.getElementById("documento");
const btnBuscar = document.getElementById("btnBuscar");
const btnModificar = document.getElementById("btnModificar");
const btnRegistrar = document.getElementById("btnRegistrar");
const mensajeBusqueda = document.getElementById("mensajes");
const selectCobertura = document.getElementById("idcobertura");

let modoEdicion = false;

let datosCoberturas = [];

function validarDocumento(documento) {
    if (documento === "" || documento === "0" || isNaN(documento) || !/^\d{1,9}$/.test(documento)) {
        mostrarMensaje('El documento debe contener solo números y tener hasta 9 dígitos.', 0);
        inputDocumento.focus();
        return false;
    }
    return true;
}

function validarDatos(form) {

    let documento = form.documento.value.trim();
    let apellidonombres = form.apellidonombres.value.trim();
    let cobertura = form.idcobertura.value;

    if (documento === "" || documento === "0" || isNaN(documento)) {
        mostrarMensaje('El documento es obligatorio y debe contener solo números.', 0);
        form.documento.focus();
        return false;
    }

    if (documento.length > 9) {
        mostrarMensaje('El documento no debe exceder los 9 dígitos.', 0);
        form.documento.focus();
        return false;
    }

    if (apellidonombres === "") {
        mostrarMensaje('El Apellido y Nombres es obligatorio.', 0);
        form.apellidonombres.focus();
        return false;
    }

    if (!/^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]+$/.test(apellidonombres)) {
        mostrarMensaje('El Apellido y Nombres solo debe contener letras y espacios (sin signos, números ni símbolos).', 0);
        form.apellidonombres.focus();
        return false;
    }

    if (!cobertura || !datosCoberturas.some(c => c.idcobertura == cobertura)) {
        mostrarMensaje('Debe seleccionar una cobertura válida.', 0);
        return false;
    }

    let telefono = form.telefono.value.trim();
    let email = form.email.value.trim();
    let fechanacimiento = form.fechanacimiento.value;
    let fechafallecimiento = form.fechafallecimiento.value;
    let contacto = form.contactoemergencia.value.trim();

    if (telefono !== "" && !/^\d{1,20}$/.test(telefono)) {
        mostrarMensaje('El teléfono debe contener solo números (máx. 20 dígitos).', 0);
        form.telefono.focus();
        return false;
    }

    if (email !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        mostrarMensaje('El correo electrónico no tiene un formato válido.', 0);
        form.email.focus();
        return false;
    }

    if (fechanacimiento) {
        let fechaNac = new Date(fechanacimiento);
        let hoy = new Date();
        let hace150años = new Date(hoy.getFullYear() - 150, hoy.getMonth(), hoy.getDate());

        if (fechaNac > hoy) {
            mostrarMensaje('La fecha de nacimiento no puede ser futura.', 0);
            return false;
        }

        if (fechaNac < hace150años) {
            mostrarMensaje('La fecha de nacimiento no puede ser mayor a 150 años atrás.', 0);
            return false;
        }
    }

    if (fechafallecimiento) {
        let fechaFal = new Date(fechafallecimiento);
        let hoy = new Date();
        let hace30dias = new Date(hoy);
        hace30dias.setDate(hoy.getDate() - 30);

        if (fechaFal > hoy) {
            mostrarMensaje('La fecha de fallecimiento no puede ser futura.', 0);
            return false;
        }

        if (fechaFal < hace30dias) {
            mostrarMensaje('La fecha de fallecimiento no puede ser anterior a 30 días.', 0);
            return false;
        }
    }

    if (contacto !== "") {
        if (!/^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s\-\(\)]+$/.test(contacto)) {
            mostrarMensaje('El contacto de emergencia solo puede contener letras, números, espacios, guiones y paréntesis.', 0);
            form.contactoemergencia.focus();
            return false;
        }

        if (contacto.length < 3) {
            mostrarMensaje('El contacto de emergencia debe tener al menos 3 caracteres.', 0);
            form.contactoemergencia.focus();
            return false;
        }
    }

    return true;
}

btnBuscar.addEventListener("click", async () => {
    const documento = inputDocumento.value;

    if (!validarDocumento(documento)) return;

    if (btnBuscar.textContent === "Nueva Búsqueda") {
        resetearBusqueda();
        return;
    }

    try {

        const resultado = await buscarPaciente(documento);
         
        if (!resultado || !resultado.paciente) {
            Swal.fire({
                title: 'No Registrado',
                html: `El n° de documento ingresado no se encuentra registrado en el sistema.<br>Puede proceder a registrar los datos.`,
                icon: 'info',
                confirmButtonText: 'Entendido'
            }).then(() => {
                bloqueardocumento();
                desbloquearCamposFormulario();
                btnModificar.disabled = true;
                btnRegistrar.disabled = false;
                setTimeout(() => {
                    form.apellidonombres.focus();
                }, 300);
            });
            return;
        }

        Swal.fire({
            title: 'Paciente Registrado',
            html: `El n° de documento ingresado se encuentra registrado en el sistema.<br>Presione "Modificar" si desea agregar/modificar datos.`,    
            icon: 'success',
            confirmButtonText: 'Entendido'});

        const paciente = resultado.paciente;

        mostrarDatosPaciente(paciente);
        bloqueardocumento();
        mensajeBusqueda.textContent = '';

        bloquearCamposFormulario();
        btnModificar.disabled = false;
        btnRegistrar.disabled = true;
        

    } catch (error) {
        console.error('Error en búsqueda:', error);
        Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al realizar la búsqueda.',
            icon: 'error',
            confirmButtonText: 'Cerrar'
        });
    }
});

btnModificar.addEventListener("click", () => {
    desbloquearCamposFormulario();
    btnModificar.disabled = true;
    btnRegistrar.disabled = false;
    btnRegistrar.textContent = "Actualizar";
    modoEdicion = true;
    const campo = form.apellidonombres;
    if (!campo.disabled) campo.focus();
});

document.getElementById("apellidonombres").addEventListener("input", function () {
    this.value = this.value.toUpperCase();
});
document.getElementById("email").addEventListener("input", function () {
    this.value = this.value.toLowerCase();
});

document.addEventListener("DOMContentLoaded", async () => {
    
    await cargarCoberturas();
    bloquearCamposFormulario();
    inputDocumento.focus();
    
    btnRegistrar.addEventListener("click", async (event) => {
        event.preventDefault(); 
    
        if (!validarDatos(form)) return;
    
        if (fechafallecimiento.value !== "") {
            const result = await Swal.fire({
                title: 'Paciente Fallecido',
                text: 'No podrá registrar ningún tipo de operación sobre un paciente fallecido. ¿Está seguro?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, continuar',
                cancelButtonText: 'Cancelar'
            });
    
            if (!result.isConfirmed) {
                return; 
            }
        }
        const paciente = {
            documento: form.documento.value,
            apellidonombres: form.apellidonombres.value,
            fechanacimiento: form.fechanacimiento.value || null,
            sexo: form.sexo.value || null,
            direccion: form.direccion.value || null,
            telefono: form.telefono.value || null,
            email: form.email.value || null,
            idcobertura: form.idcobertura.value || null,
            contactoemergencia: form.contactoemergencia.value || null,
            fechafallecimiento: fechafallecimiento.value || null,
            actadefuncion: form.actadefuncion.value || null
        };
    
        try {
            await guardarPaciente(paciente, modoEdicion); 
    
            Swal.fire({
                title: 'Éxito',
                text: modoEdicion ? 'Paciente actualizado correctamente.' : 'Paciente registrado correctamente.',
                icon: 'success',
                confirmButtonText: 'Cerrar'
            }).then(() => {
                resetearBusqueda();
            });
        } catch (error) {
            console.error(`Error al ${modoEdicion ? 'modificar' : 'registrar'} paciente:`, error);
        }
    });

}); 



async function buscarPaciente(documento) {
    try {
        if (!validarDocumento(documento)) return null;
        const response = await fetch(`${API_URL}/${documento}`);
        if (!response.ok) {
            if (response.status === 404) {
                return null; // paciente no encontrada
            }
            throw new Error('Error en la respuesta del servidor');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.log('Error al buscar paciente:', error);
        return null;
    }
}

async function guardarPaciente(paciente, esEdicion = false) {
    const metodo = esEdicion ? 'PUT' : 'POST';
    const url = esEdicion ? `${API_URL}/${paciente.documento}` : API_URL;

    try {
        const datosParaBackend = {
            documento: paciente.documento,
            apellidonombres: paciente.apellidonombres,
            fechanacimiento: paciente.fechanacimiento,
            sexo: paciente.sexo,
            direccion: paciente.direccion,
            telefono: paciente.telefono,
            email: paciente.email,
            idcobertura: paciente.idcobertura,
            contactoemergencia: paciente.contactoemergencia,
            fechafallecimiento: paciente.fechafallecimiento,
            actadefuncion: paciente.actadefuncion
        };

        // Eliminar campos undefined o vacíos 
        Object.keys(datosParaBackend).forEach(key => {
            if (datosParaBackend[key] === undefined || datosParaBackend[key] === '') {
                delete datosParaBackend[key];
            }
        });

       const response = await fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ datosPaciente: datosParaBackend })
        });

        const responseData = await response.json();

        if (!response.ok) {
            const errorMessage = responseData.error || 
                               responseData.message || 
                               `Error ${response.status}: ${response.statusText}`;
            throw new Error(errorMessage);
        }

        return responseData;

    } catch (error) {
        console.error('Error en guardarPaciente:', error);
        
        let errorMessage = error.message;
        if (error.message.includes('Failed to fetch')) {
            errorMessage = 'No se pudo conectar con el servidor. Verifique su conexión a internet.';
        } else if (error.message.includes('validation')) {
            errorMessage = 'Datos inválidos: ' + error.message;
        }

        throw new Error(errorMessage);
    }
}

function mostrarDatosPaciente(paciente) {

    document.getElementById("apellidonombres").value = paciente.apellidonombres || '';
    
    const fechanacimiento = paciente.fechanacimiento;
    if (fechanacimiento) {
        const fechaFormateada = typeof fechanacimiento === 'string' && fechanacimiento.includes('T') 
            ? fechanacimiento.split('T')[0] 
            : fechanacimiento;
        document.getElementById("fechanacimiento").value = fechaFormateada;
    } else {
        document.getElementById("fechanacimiento").value = '';
    }
    
    document.getElementById("sexo").value = paciente.sexo || '';
    document.getElementById("direccion").value = paciente.direccion || '';
    document.getElementById("telefono").value = paciente.telefono || '';
    document.getElementById("email").value = paciente.email || '';
    document.getElementById("idcobertura").value = paciente.idcobertura || '';
    document.getElementById("contactoemergencia").value = paciente.contactoemergencia || '';
    document.getElementById("fechafallecimiento").value = paciente.fechafallecimiento || '';        
    document.getElementById("actadefuncion").value = paciente.actadefuncion || '';

    modoEdicion = true;
    btnRegistrar.disabled = true;

}


async function cargarCoberturas() {
    try {
        const response = await fetch('/api/coberturas');
        if (!response.ok) throw new Error("Error al cargar coberturas");
        datosCoberturas = await response.json();
        datosCoberturas.forEach(cob => {
            const option = document.createElement('option');
            option.value = cob.idcobertura; 
            option.textContent = cob.denominacion;
            selectCobertura.appendChild(option);
        });
      

    } catch (error) {
        console.error("Error al cargar coberturas:", error);
    }
}
function bloqueardocumento() {
    inputDocumento.disabled = true;
    inputDocumento.style.backgroundColor = "#f0f0f0"; 
    btnBuscar.textContent = "Nueva Búsqueda";
}


function resetearBusqueda() {
    form.reset();
    mensajeBusqueda.textContent = '';
    desbloquearCamposFormulario();
    inputDocumento.disabled = false;
    btnBuscar.textContent = "Buscar";
    btnRegistrar.textContent = "Registrar";
    btnRegistrar.disabled = true;
    btnModificar.disabled = true;
    modoEdicion = false; 
}

function limpiarCampos() {
    const campos = [
        "apellidonombres", "fechanacimiento", "sexo",
        "direccion", "telefono", "email", "idcobertura",
        "contactoemergencia", "fechafallecimiento", "actadefuncion"
    ];
    
    campos.forEach(id => {
        document.getElementById(id).value = "";
    });
}

function mostrarMensaje(mensaje, tipo) {
    mensajeBusqueda.textContent = mensaje;
    mensajeBusqueda.style.color = tipo === 0 ? "red" : "#007bff";
    mensajeBusqueda.style.backgroundColor = tipo === 0 ? "#f8d7da" : "#cce5ff";
    setTimeout(() => { mensajeBusqueda.textContent = ''; }, 5000);
}

function bloquearCamposFormulario() {
    const campos = [
        "apellidonombres", "fechanacimiento", "sexo",
        "direccion", "telefono", "email", "idcobertura",
        "contactoemergencia", "fechafallecimiento", "actadefuncion"
    ];
    
    campos.forEach(id => {
        const campo = document.getElementById(id);
        if (campo) campo.disabled = true;
    });
}

function desbloquearCamposFormulario() {
    const campos = [
        "apellidonombres", "fechanacimiento", "sexo",
        "direccion", "telefono", "email", "idcobertura",
        "contactoemergencia", "fechafallecimiento", "actadefuncion"
    ];
    
    campos.forEach(id => {
        const campo = document.getElementById(id);
        if (campo) campo.disabled = false;
    });
}
