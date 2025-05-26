const API_URL_MEDICOS = '/api/medicos';
const API_URL_ESPECIALIDADES = '/api/especialidades';

const form = document.getElementById("formMedico");
const inputMatricula = document.getElementById("matricula");
const btnBuscar = document.getElementById("btnBuscar");
const btnModificar = document.getElementById("btnModificar");
const btnRegistrar = document.getElementById("btnRegistrar");
const btnDesactivar = document.getElementById("btnDesactivar");
const mensajeBusqueda = document.getElementById("mensajes");
const selectEspecialidad = document.getElementById("especialidad");

let modoEdicion = false;

let datosEspecialidades = []; 


document.addEventListener("DOMContentLoaded", async () => {

    bloquearCamposFormulario();
    inputMatricula.focus();
    await cargarEspecialidades();    
    
    btnRegistrar.addEventListener("click", async (event) => {
        event.preventDefault();
        if (!validarDatos(form)) return;

        const medico = {
            matricula: form.matricula.value.trim(),
            apellidonombres: form.apellidonombres.value.trim(),
            telefono: form.telefono.value.trim(),
            email: form.email.value.trim(),
            especialidad: form.especialidad.value
        };

        console.log('estos datos estoy enviando...');
        console.log(medico);

        try {
            await guardarMedico(medico, modoEdicion);
            Swal.fire({
                title: 'Éxito',
                text: modoEdicion ? 'Médico actualizado correctamente.' : 'Médico registrado correctamente.',
                icon: 'success',
                confirmButtonText: 'Cerrar'
            }).then(() => resetearBusqueda());
        } catch (error) {
            Swal.fire("Error", error.message, "error");
        }
    });

});


function validarMatricula(matricula) {
    matricula = matricula.trim();
    if (matricula === "" || matricula.length < 3 || matricula.length > 6) {
        mostrarMensaje('La matrícula debe tener entre 3 y 6 caracteres.', 0);
        inputMatricula.focus();
        return false;
    }
    if (!/^[a-zA-Z0-9]+$/.test(matricula)) {
        mostrarMensaje('La matrícula solo debe contener letras y números (sin espacios ni símbolos).', 0);
        inputMatricula.focus();
        return false;
    }
    return true;
}


function validarDatos(form) {

    const apellidonombres = form.apellidonombres.value.trim();
    const matricula = form.matricula.value.trim();
    const telefono = form.telefono.value.trim();
    const email = form.email.value.trim();
    const especialidad = form.especialidad.value;

    if (!validarMatricula(matricula)) return false;
    
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

    if (!especialidad || !datosEspecialidades.some(c => c.idespecialidad == especialidad)) {
        mostrarMensaje('Debe seleccionar una especialidad válida.', 0);
        return false;
    }


    return true;
}

btnBuscar.addEventListener("click", async () => {
    const matricula = inputMatricula.value;
    if (!validarMatricula(matricula)) return;

    if (btnBuscar.textContent === "Nueva Búsqueda") {
        resetearBusqueda();
        return;
    }

    try {
        const resultado = await buscarMedico(matricula);

        if (!resultado || !resultado.medico) {
            Swal.fire({
                title: 'No Registrado',
                html: 'La matrícula ingresada no está registrada.<br>Puede proceder a registrar los datos.',
                icon: 'info',
                confirmButtonText: 'Entendido',
                didClose: () => {
                    bloquearMatricula();
                    desbloquearCamposFormulario();
                    btnModificar.disabled = true;
                    btnRegistrar.disabled = false;
                    document.getElementById("apellidonombres").focus();
                }
            });
            return;
        }

        const medico = resultado.medico;
        
        Swal.fire({
            title: medico.activo === false ? 'Médico Desactivado' : 'Médico Registrado',
            html: 'La matrícula ingresada ya está registrada.<br>Presione "Modificar" si desea editar los datos.',
            icon: medico.activo === false ? 'warning' : 'success',
            confirmButtonText: 'Entendido'
        });

        mostrarDatosMedico(medico);
        bloquearMatricula();
        bloquearCamposFormulario();
        btnModificar.disabled = false;
        btnDesactivar.disabled = false;
        btnRegistrar.disabled = true;

    } catch (error) {
        Swal.fire("Error", "Hubo un problema al realizar la búsqueda.", "error");
    }
});

btnModificar.addEventListener("click", () => {
    desbloquearCamposFormulario();
    btnModificar.disabled = true;
    btnRegistrar.disabled = false;
    btnRegistrar.textContent = "Actualizar";
    modoEdicion = true;
});

document.getElementById("apellidonombres").addEventListener("input", function () {
    this.value = this.value.toUpperCase();
});
document.getElementById("email").addEventListener("input", function () {
    this.value = this.value.toLowerCase();
});



btnDesactivar.addEventListener("click", async () => {
    const matricula = form.matricula.value.trim();
    if (!matricula) return;

    const estado = btnDesactivar.dataset.estado;

    if (estado === "desactivar") {
        const confirmacion = await Swal.fire({
            title: '¿Está seguro?',
            text: "Esta acción desactivará al médico.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, desactivar',
            cancelButtonText: 'Cancelar'
        });

        if (!confirmacion.isConfirmed) return;

        try {
            const response = await fetch(`${API_URL_MEDICOS}/${matricula}`, { method: "DELETE" });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Error al desactivar médico.");
            Swal.fire('Desactivado', data.mensaje, 'success').then(() => resetearBusqueda());
        } catch (error) {
            Swal.fire("Error", error.message, "error");
        }

    } else if (estado === "reactivar") {
        const confirmacion = await Swal.fire({
            title: '¿Reactivar médico?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, reactivar',
            cancelButtonText: 'Cancelar'
        });

        if (!confirmacion.isConfirmed) return;

        try {
            const response = await fetch(`${API_URL_MEDICOS}/${matricula}/reactivar`, { method: "PUT" });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Error al reactivar médico.");
            Swal.fire('Reactivado', data.mensaje, 'success').then(() => resetearBusqueda());
        } catch (error) {
            Swal.fire("Error", error.message, "error");
        }
    }
});

function mostrarDatosMedico(medico) {

    console.log(medico);
    form.apellidonombres.value = medico.apellidonombres || "";
    form.telefono.value = medico.telefono || "";
    form.email.value = medico.email || "";
    form.especialidad.value = medico.idespecialidad || "";

    if (medico.deletedAt) {
        btnDesactivar.textContent = "Reactivar";
        btnDesactivar.dataset.estado = "reactivar";
        btnDesactivar.classList.replace("btn-danger", "btn-success");
    } else {
        btnDesactivar.textContent = "Desactivar";
        btnDesactivar.dataset.estado = "desactivar";
        btnDesactivar.classList.replace("btn-success", "btn-danger");
    }
    modoEdicion = true;

}

function resetearBusqueda() {
    form.reset();
    mensajeBusqueda.textContent = '';
    desbloquearCamposFormulario();
    inputMatricula.disabled = false;
    btnBuscar.textContent = "Buscar";
    btnRegistrar.textContent = "Registrar";
    btnRegistrar.disabled = true;
    btnModificar.disabled = true;
    btnDesactivar.disabled = true;
    btnDesactivar.dataset.estado = "desactivar";
    btnDesactivar.classList.replace("btn-success", "btn-danger");
    modoEdicion = false;
}

function bloquearMatricula() {
    inputMatricula.disabled = true;
    inputMatricula.style.backgroundColor = "#f0f0f0";
    btnBuscar.textContent = "Nueva Búsqueda";
}

function desbloquearCamposFormulario() {
    ["apellidonombres", "telefono", "email", "especialidad"].forEach(id => {
        const campo = document.getElementById(id);
        if (campo) campo.disabled = false;
    });
}

function bloquearCamposFormulario() {
    ["apellidonombres", "telefono", "email", "especialidad"].forEach(id => {
        const campo = document.getElementById(id);
        if (campo) campo.disabled = true;
    });
}

function mostrarMensaje(mensaje, tipo) {
    mensajeBusqueda.textContent = mensaje;
    mensajeBusqueda.style.color = tipo === 0 ? "red" : "#007bff";
    mensajeBusqueda.style.backgroundColor = tipo === 0 ? "#f8d7da" : "#cce5ff";
    setTimeout(() => { mensajeBusqueda.textContent = ''; }, 5000);
}

async function buscarMedico(matricula) {
    try {
        const response = await fetch(`${API_URL_MEDICOS}/${matricula}`);
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.log("Error al buscar médico:", error);
        return null;
    }
}

async function guardarMedico(medico, esEdicion = false) {
    
    const metodo = esEdicion ? "PUT" : "POST";
    const url = esEdicion ? `${API_URL_MEDICOS}/${medico.matricula}` : API_URL_MEDICOS;


    try {
        const datosParaBackend = {
            matricula: medico.matricula,
            apellidonombres: medico.apellidonombres,
            telefono: medico.telefono,
            email: medico.email,
            idespecialidad: parseInt(medico.especialidad)
        };
    
        console.log("Datos para backend:", datosParaBackend);

        
        Object.keys(datosParaBackend).forEach(key => {
            if (!datosParaBackend[key]) {
                delete datosParaBackend[key];
            }
        })
        
        const response = await fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosParaBackend)
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
        console.error('Error en guardarMedico:', error);
        throw error;
    }
}
async function cargarEspecialidades() {
    try {
        const response = await fetch(API_URL_ESPECIALIDADES);
        if (!response.ok) throw new Error("Error al cargar especialidades");    
        datosEspecialidades = await response.json();
        datosEspecialidades.forEach(esp => {
            const option = document.createElement("option");
            option.value = esp.idespecialidad;
            option.textContent = esp.denominacion;
            selectEspecialidad.appendChild(option); 
        });
    } catch (error) {
        console.error("Error al cargar especialidades:", error);
    }
}

