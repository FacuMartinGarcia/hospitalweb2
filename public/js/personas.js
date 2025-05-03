const API_URL = '/api/personas';

const tipoPersona = document.getElementById("tipoPersona");
const form = document.getElementById("formPersona");
const inputDocumento = document.getElementById("documento");
const btnBuscar = document.getElementById("btnBuscar");
const btnModificar = document.getElementById("btnModificar");
const btnRegistrar = document.getElementById("btnRegistrar");
const mensajeBusqueda = document.getElementById("mensajes");

const camposPaciente = document.getElementById("camposPaciente");
const camposMedico = document.getElementById("camposMedico");
const camposEnfermero = document.getElementById("camposEnfermero");

const selectCobertura = document.getElementById("idCobertura");
const selectEspecialidad = document.getElementById("idEspecialidad");
const selectTurno = document.getElementById("idTurno");

let datosCoberturas = [] 
let datosEspecialidades = []
let datosTurnos = []



function validarDocumento(documento) {
    if (documento === "" || documento === "0" || isNaN(documento) || !/^\d{1,9}$/.test(documento)) {
        mostrarMensaje('El documento debe contener solo números y tener hasta 9 dígitos.', 0);
        inputDocumento.focus();
        return false;
    }
    return true;
}
function validarDatos(form) {
    const tipo = document.getElementById("tipoPersona").value;

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

    // Validaciones específicas por tipo
    if (tipo === "paciente") {
        let cobertura = form.idCobertura.value;
        if (!cobertura || coberturas.find(c => c.idCobertura == cobertura) === undefined) {
            mostrarMensaje('Debe seleccionar una cobertura válida.', 0);
            return false;
        }

        let contacto = form.contactoEmergencia.value.trim();
        if (contacto === "") {
            mostrarMensaje('Debe ingresar un contacto de emergencia.', 0);
            return false;
        }

    } else if (tipo === "medico") {
        let idEspecialidad = form.idEspecialidad.value;
        let matricula = form.matricula.value.trim();

        if (!idEspecialidad || especialidades.find(e => e.idEspecialidad == idEspecialidad) === undefined) {
            mostrarMensaje('Debe seleccionar una especialidad válida.', 0);
            return false;
        }

        if (matricula === "") {
            mostrarMensaje('Debe ingresar la matrícula del médico.', 0);
            return false;
        }

    } else if (tipo === "enfermero") {
        let idTurno = form.idTurno.value;
        if (!idTurno || turnos.find(t => t.idTurno == idTurno) === undefined) {
            mostrarMensaje('Debe seleccionar un turno válido.', 0);
            return false;
        }
    }

    return true;
}

async function buscarPersona(documento, tipo) {
    try {
        if (!validarDocumento(documento)) return null;
        console.log(`Buscando persona con documento: ${documento}`);
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
        console.log('Error al buscar persona:', error);
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
        console.log('Error al guardar persona:', error);
        mostrarMensaje(error.message, 0);
        throw error;
    }
}

// Mostrar datos de persona en el formulario
function mostrarDatosPersona(persona, detalles, tipo) {
    form.apellidoNombres.value = persona.apellidoNombres;
    form.fechaNacimiento.value = persona.fechaNacimiento.split('T')[0]; 
    form.sexo.value = persona.sexo;
    form.direccion.value = persona.direccion || '';
    form.telefono.value = persona.telefono || '';
    form.email.value = persona.email || '';

    if (tipo === "Paciente") {
        form.idCobertura.value = detalles?.idCobertura || '';
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

btnBuscar.addEventListener("click", async () => {
    const documento = inputDocumento.value;
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
                inputDocumento.focus();
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

btnModificar.addEventListener("click", () => {
    desbloquearCamposFormulario();
    btnModificar.disabled = true;
    btnRegistrar.disabled = false;
    btnRegistrar.textContent = "Actualizar";
    
});


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

        const esActualizacion = btnRegistrar.disabled;

        if (esActualizacion) {
            // Actualizar persona
            await fetch(`/api/personas/${persona.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosPersona)
            });

            // Actualizar rol y datos específicos
            await fetch(`/api/personas/actualizarRol/${persona.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tipoPersona: tipo,
                    datosEspecificos
                })
            });

        } else {
            // Crear persona
            const response = await fetch('/api/personas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosPersona)
            });

            if (!response.ok) {
                const errorText = await response.text(); 
                console.error("Respuesta del servidor:", errorText);
                throw new Error('Error al registrar persona');
            }
            if (!response.ok) throw new Error('Error al registrar persona');

            const personaGuardada = await response.json();

            // Asignar rol y datos específicos
            await fetch('/api/personas/asignarRol', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    idPersona: personaGuardada.id,
                    tipoPersona: tipo,
                    datosEspecificos
                })
            });
        }

        await Swal.fire({
            title: '¡Registro exitoso!',
            text: 'Se ha registrado exitosamente.',
            icon: 'success',
            confirmButtonText: 'Entendido'
        });

        resetearBusqueda();

    } catch (error) {
        console.error('Error al guardar:', error);
        Swal.fire({
            title: 'Error',
            text: 'Ocurrió un error al guardar los datos.',
            icon: 'error',
            confirmButtonText: 'Cerrar'
        });
    }
});


// Funciones auxiliares
function bloqueardocumento() {
    inputDocumento.disabled = true;
    inputDocumento.style.backgroundColor = "#f0f0f0"; 
    btnBuscar.textContent = "Nueva Búsqueda";
}

function resetearBusqueda() {
    inputDocumento.value = "";
    inputDocumento.disabled = false;
    inputDocumento.style.backgroundColor = ""; 
    limpiarCampos();
    btnBuscar.textContent = "Buscar";
    mensajeBusqueda.textContent = '';
    inputDocumento.focus();
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
async function cargarEspecialidades() {
    try {
        const response = await fetch('/api/especialidades');
        if (!response.ok) throw new Error("Error al cargar especialidades");
        datosEspecialidades = await response.json();
        datosEspecialidades.forEach(cob => {
            const option = document.createElement('option');
            option.value = cob.idEspecialidad; 
            option.textContent = cob.denominacionEspecialidad;
            selectEspecialidad.appendChild(option);
        });
      

    } catch (error) {
        console.error("Error al cargar especialidades:", error);
    }
}

async function cargarTurnos() {
    try {
        const response = await fetch('/api/turnos');
        if (!response.ok) throw new Error("Error al cargar turnos");
        datosTurnos = await response.json();
        datosTurnos.forEach(cob => {
            const option = document.createElement('option');
            option.value = cob.idTurno; 
            option.textContent = cob.denominacionTurno;
            selectTurno.appendChild(option);
        });
      

    } catch (error) {
        console.error("Error al cargar turnos:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {

    tipoPersona.addEventListener("change", () => {
        const valor = tipoPersona.value;
        
        camposPaciente.style.display = valor === "Paciente" ? "grid" : "none";
        selectCobertura.disabled = false;
        contactoEmergencia.disabled = false;
        
        camposMedico.style.display = valor === "Medico" ? "grid" : "none";
        selectEspecialidad.disabled = false;
        matricula.disabled = false;

        camposEnfermero.style.display = valor === "Enfermero" ? "grid" : "none";
        selectTurno.disabled = false;   

    });
    
    tipoPersona.dispatchEvent(new Event("change"));

    
    bloquearCamposFormulario();
    
    cargarCoberturas();
    cargarEspecialidades();
    cargarTurnos();


});






