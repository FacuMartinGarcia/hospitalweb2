//import Persona from '../models/Persona.js';
// Configuración de endpoints
const API_URL = '/api/personas';

// Elementos del DOM
const tipoPersona = document.getElementById("tipoPersona");
const form = document.getElementById("formPersona");
const inputdocumento = document.getElementById("documento");
const btnBuscar = document.getElementById("btnBuscar");
const btnModificar = document.getElementById("btnModificar");
const btnRegistrar = document.getElementById("btnRegistrar");
const mensajeBusqueda = document.getElementById("mensajes");

// Campos específicos por tipo
const camposPaciente = document.getElementById("camposPaciente");
const camposMedico = document.getElementById("camposMedico");
const camposEnfermero = document.getElementById("camposEnfermero");

// Selectores
const selectCobertura = document.getElementById("idCobertura");
const selectEspecialidad = document.getElementById("idEspecialidad");
const selectTurno = document.getElementById("idTurno");

// Función para validar documento
function validarDocumento(documento) {
    if (documento === "" || documento === "0" || isNaN(documento) || !/^\d{1,9}$/.test(documento)) {
        mostrarMensaje('El documento debe contener solo números y tener hasta 9 dígitos.', 0);
        inputdocumento.focus();
        return false;
    }
    return true;
}

// Función para buscar persona en el servidor
async function buscarPersona(documento, tipo) {
    try {
        const response = await fetch(`${API_URL}/${documento}`);
        if (!response.ok) {
            if (response.status === 404) {
                return null; // Persona no encontrada
            }
            throw new Error('Error en la respuesta del servidor');
        }
        
        const data = await response.json();
        
        // Verificar si tiene el rol específico
        const tieneRolEspecifico = data.roles.some(rol => {
            const nombreRol = rol.idRol === 1 ? 'paciente' : 
                            rol.idRol === 2 ? 'medico' : 
                            rol.idRol === 3 ? 'enfermero' : '';
            return nombreRol === tipo.toLowerCase();
        });
        
        return { ...data, tieneRolEspecifico };
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('Error al buscar la persona', 0);
        return null;
    }
}

// Función para registrar/actualizar persona
async function guardarPersona(tipo, datosPersona, datosEspecificos, esActualizacion = false) {
    try {
        const method = esActualizacion ? 'PUT' : 'POST';
        const url = esActualizacion ? `${API_URL}/${datosPersona.documento}` : API_URL;
        
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tipoPersona: tipo,
                datosPersona,
                datosEspecificos
            }),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al guardar persona');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje(error.message, 0);
        throw error;
    }
}

// Mostrar datos de persona en el formulario
function mostrarDatosPersona(persona, detalles, tipo) {
    form.apellidoNombres.value = persona.apellidoNombres;
    form.fechaNacimiento.value = persona.fechaNacimiento.split('T')[0]; // Formatear fecha
    form.sexo.value = persona.sexo;
    form.direccion.value = persona.direccion || '';
    form.telefono.value = persona.telefono || '';
    form.email.value = persona.email || '';

    if (tipo === "Paciente") {
        form.idCobertura.value = detalles?.cobertura || '';
        form.contactoEmergencia.value = detalles?.contactoEmergencia || '';
    } 
    else if (tipo === "Medico") {
        form.idEspecialidad.value = detalles?.idEspecialidad || '';
        form.matricula.value = detalles?.matricula || '';
    } 
    else if (tipo === "Enfermero") {
        form.idTurno.value = detalles?.idTurno || '';
    }
}

// Manejador del botón Buscar
btnBuscar.addEventListener("click", async () => {
    const documento = inputdocumento.value;
    const tipo = tipoPersona.value;
    
    if (!validarDocumento(documento)) return;
    
    if (btnBuscar.textContent === "Nueva Búsqueda") {
        resetearBusqueda();
        return;
    }
    
    try {
        const resultado = await buscarPersona(documento, tipo);
        
        if (!resultado) {
            // Persona no encontrada
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
                form.apellidoNombres.focus();
            });
            return;
        }
        
        const { persona, roles, detalles, tieneRolEspecifico } = resultado;
        
        if (!tieneRolEspecifico) {
            const confirmar = await Swal.fire({
                title: `Persona Registrada sin Rol de ${tipo.toUpperCase()}`,
                html: `La persona ingresada no está registrada como ${tipo.toUpperCase()}.<br>¿Desea continuar y asignarle este rol?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, continuar',
                cancelButtonText: 'Cancelar'
            });
            
            if (!confirmar.isConfirmed) {
                limpiarCampos();
                inputdocumento.focus();
                return;
            }
        }
        
        mostrarDatosPersona(persona, detalles, tipo);
        bloqueardocumento();
        mensajeBusqueda.textContent = '';
        
        if (tieneRolEspecifico) {
            bloquearCamposFormulario();
            btnModificar.disabled = false;
            btnRegistrar.disabled = true;
        } else {
            desbloquearCamposFormulario();
            btnModificar.disabled = true;
            btnRegistrar.disabled = false;
        }
        
    } catch (error) {
        console.error('Error en búsqueda:', error);
    }
});

// Manejador del botón Modificar
btnModificar.addEventListener("click", () => {
    desbloquearCamposFormulario();
    btnModificar.disabled = true;
    btnRegistrar.disabled = false;
});

// Manejador del formulario
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    if (!validarDatos(form)) return;
    
    const tipo = tipoPersona.value;
    const documento = form.documento.value;
    
    const datosPersona = {
        apellidoNombres: form.apellidoNombres.value,
        documento: documento,
        fechaNacimiento: form.fechaNacimiento.value,
        sexo: form.sexo.value,
        direccion: form.direccion.value,
        telefono: form.telefono.value,
        email: form.email.value,
        fechaFallecimiento: null,
        actaDefuncion: null
    };
    
    const datosEspecificos = {};
    if (tipo === "Paciente") {
        datosEspecificos.cobertura = form.idCobertura.value;
        datosEspecificos.contactoEmergencia = form.contactoEmergencia.value;
    } else if (tipo === "Medico") {
        datosEspecificos.idEspecialidad = form.idEspecialidad.value;
        datosEspecificos.matricula = form.matricula.value;
    } else if (tipo === "Enfermero") {
        datosEspecificos.idTurno = form.idTurno.value;
    }
    
    try {
        const confirmacion = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Va a grabar los datos ingresados",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, grabar',
            cancelButtonText: 'Cancelar'
        });
        
        if (!confirmacion.isConfirmed) return;
        
        // Determinar si es una actualización o nuevo registro
        const esActualizacion = btnRegistrar.disabled;
        
        await guardarPersona(tipo, datosPersona, datosEspecificos, esActualizacion);
        
        await Swal.fire({
            title: '¡Registro exitoso!',
            text: 'Se ha registrado exitosamente.',
            icon: 'success',
            confirmButtonText: 'Entendido'
        });
        
        resetearBusqueda();
        
    } catch (error) {
        console.error('Error al guardar:', error);
    }
});

// Funciones auxiliares
function bloqueardocumento() {
    inputdocumento.disabled = true;
    inputdocumento.style.backgroundColor = "#f0f0f0"; 
    btnBuscar.textContent = "Nueva Búsqueda";
}

function resetearBusqueda() {
    inputdocumento.value = "";
    inputdocumento.disabled = false;
    inputdocumento.style.backgroundColor = ""; 
    limpiarCampos();
    btnBuscar.textContent = "Buscar";
    mensajeBusqueda.textContent = '';
    inputdocumento.focus();
    bloquearCamposFormulario();
    btnModificar.disabled = true;
    btnRegistrar.disabled = true;
}

function limpiarCampos() {
    const campos = [
        "apellidoNombres", "fechaNacimiento", "sexo",
        "direccion", "telefono", "email", "idCobertura",
        "contactoEmergencia", "idEspecialidad", "matricula", "idTurno"
    ];
    
    campos.forEach(id => {
        document.getElementById(id).value = "";
    });
}

function mostrarMensaje(mensaje, tipo) {
    mensajeBusqueda.textContent = mensaje;
    mensajeBusqueda.style.color = tipo === 0 ? "red" : "#007bff";
    mensajeBusqueda.style.backgroundColor = tipo === 0 ? "#f8d7da" : "#cce5ff";
    setTimeout(() => { mensajeBusqueda.textContent = ''; }, 3000);
}

function bloquearCamposFormulario() {
    const campos = [
        "apellidoNombres", "fechaNacimiento", "sexo",
        "direccion", "telefono", "email", "idCobertura",
        "contactoEmergencia", "idEspecialidad", "matricula", "idTurno"
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
        "contactoEmergencia", "idEspecialidad", "matricula", "idTurno"
    ];
    
    campos.forEach(id => {
        const campo = document.getElementById(id);
        if (campo) campo.disabled = false;
    });
}

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
    // Configuración inicial de los campos según el tipo
    tipoPersona.addEventListener("change", () => {
        const valor = tipoPersona.value;
        
        camposPaciente.style.display = valor === "Paciente" ? "grid" : "none";
        camposMedico.style.display = valor === "Medico" ? "grid" : "none";
        camposEnfermero.style.display = valor === "Enfermero" ? "grid" : "none";
    });
    
    tipoPersona.dispatchEvent(new Event("change"));
    bloquearCamposFormulario();
});