const API_URL = '/api/pacientes';

const form = document.getElementById("formPaciente");
const inputDocumento  = document.getElementById("documento");
const btnBuscar = document.getElementById("btnBuscar");
const btnModificar = document.getElementById("btnModificar");
const btnRegistrar = document.getElementById("btnRegistrar");
const mensajeBusqueda = document.getElementById("mensajes");
const selectCobertura = document.getElementById("idCobertura");

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
    let apellidoNombres = form.apellidoNombres.value.trim();
    let fechaNacimiento = form.fechaNacimiento.value;
    let telefono = form.telefono.value.trim();
    let email = form.email.value.trim();

    if (documento === "" || documento === "0" || isNaN(documento) || !/^\d{1,9}$/.test(documento)) {
        mostrarMensaje('El documento debe contener solo números y tener hasta 9 dígitos.', 0);
        form.documento.focus();
        return false;
    }

    if (apellidoNombres === "") {
        mostrarMensaje('El Apellido y Nombres es obligatorio.', 0);
        return false;
    }

    if (telefono !== "" && !/^\d{1,20}$/.test(telefono)) {
        mostrarMensaje('El Teléfono debe contener solo números.', 0);
        return false;
    }

    let fechaNac = new Date(fechaNacimiento);
    let hoy = new Date();
    let hace150años = new Date();
    hace150años.setFullYear(hoy.getFullYear() - 150);

    if (fechaNac < hace150años || fechaNac > hoy) {
        mostrarMensaje('La fecha de nacimiento no puede ser mayor a 150 años atrás ni estar en el futuro.', 0);
        return false;
    }

    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email !== "" && !emailRegex.test(email)) {
        mostrarMensaje('El correo electrónico no tiene un formato válido.', 0);
        return false;
    }

    let cobertura = form.idCobertura.value;
    if (!cobertura || datosCoberturas.find(c => c.idCobertura == cobertura) === undefined) {
        mostrarMensaje('Debe seleccionar una cobertura válida.', 0);
        return false;
    }

    let contacto = form.contactoEmergencia.value.trim();
    if (contacto === "") {
        mostrarMensaje('Debe ingresar un contacto de emergencia.', 0);
        return false;
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

        const resultado = await buscarpaciente(documento);
        console.log("Aqui el resultado");
        console.log(resultado);
        
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
            });
            return;
        }
        
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
});

document.addEventListener("DOMContentLoaded", async () => {

    btnRegistrar.addEventListener("click", async (event) => {
        event.preventDefault(); 
    
        if (!validarDatos(form)) return;
    
        const paciente = {
            documento: form.documento.value,
            apellidoNombres: form.apellidoNombres.value,
            fechaNacimiento: form.fechaNacimiento.value,
            sexo: form.sexo.value,
            direccion: form.direccion.value,
            telefono: form.telefono.value,
            email: form.email.value,
            idCobertura: form.idCobertura.value,
            contactoEmergencia: form.contactoEmergencia.value
        };
    
        try {
            await guardarpaciente(paciente, modoEdicion); 
    
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

    await cargarCoberturas();
    bloquearCamposFormulario();
    
    inputDocumento.focus();
}); 



async function buscarpaciente(documento) {
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
        mostrarMensaje('Error al buscar la paciente', 0);
        return null;
    }
}

async function guardarpaciente(paciente, esEdicion = false) {
    const metodo = esEdicion ? 'PUT' : 'POST';
    const url = esEdicion ? `${API_URL}/${paciente.documento}` : API_URL;



    try {

        console.log('Guardando paciente...');
        console.log('URL:', url);
        console.log('Método:', metodo);
        console.log('Body:', JSON.stringify({ datosPaciente: paciente }));
        
        const response = await fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({datosPaciente: paciente})
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al guardar paciente');
        }

        return await response.json();

    } catch (error) {
        console.error('Error en guardarpaciente:', error);
        throw error; // Re-lanzamos el error para manejarlo en el evento click
    }
}

function mostrarDatosPaciente(paciente) {
    document.getElementById("apellidoNombres").value = paciente.apellidoNombres;
    document.getElementById("fechaNacimiento").value = paciente.fechaNacimiento.split('T')[0];
    document.getElementById("sexo").value = paciente.sexo;
    document.getElementById("direccion").value = paciente.direccion;
    document.getElementById("telefono").value = paciente.telefono;
    document.getElementById("email").value = paciente.email;
    document.getElementById("idCobertura").value = paciente.idCobertura;
    document.getElementById("contactoEmergencia").value = paciente.contactoEmergencia;
}


async function cargarCoberturas() {
    try {
        const response = await fetch('/api/coberturas');
        if (!response.ok) throw new Error("Error al cargar coberturas");
        datosCoberturas = await response.json();
        datosCoberturas.forEach(cob => {
            const option = document.createElement('option');
            option.value = cob.idCobertura; 
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
        "apellidoNombres", "fechaNacimiento", "sexo",
        "direccion", "telefono", "email", "idCobertura",
        "contactoEmergencia"
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
        "apellidoNombres", "fechaNacimiento", "sexo",
        "direccion", "telefono", "email", "idCobertura",
        "contactoEmergencia"
    ];
    
    campos.forEach(id => {
        const campo = document.getElementById(id);
        if (campo) campo.disabled = true;
    });
}

function desbloquearCamposFormulario() {
    const campos = [
        "apellidoNombres", "fechaNacimiento", "sexo",
        "direccion", "telefono", "email", "idCobertura",
        "contactoEmergencia"
    ];
    
    campos.forEach(id => {
        const campo = document.getElementById(id);
        if (campo) campo.disabled = false;
    });
}