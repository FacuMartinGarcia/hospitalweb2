const API_URL = '/api/enfermeros';
const form = document.getElementById("formEnfermero");
const inputMatricula = document.getElementById("matricula");
const btnBuscar = document.getElementById("btnBuscar");
const btnModificar = document.getElementById("btnModificar");
const btnRegistrar = document.getElementById("btnRegistrar");
const btnDesactivar = document.getElementById("btnDesactivar");
const mensajeBusqueda = document.getElementById("mensajes");


let modoEdicion = false;

function validarMatricula(matricula) {
    console.log(matricula);
    if (matricula === "" || matricula.length < 3 || matricula.length > 6) {
        mostrarMensaje('La matrícula debe tener entre 3 y 6 caracteres.', 0);
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
    console.log(matricula);
    console.log(apellidonombres);


    if (!validarMatricula(matricula)) return false;

    if (apellidonombres === "") {
        mostrarMensaje('El campo Apellido y Nombres es obligatorio.', 0);
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
        const resultado = await buscarEnfermero(matricula);

        if (!resultado || !resultado.enfermero) {
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
                    const campo = document.getElementById("apellidonombres");
                    if (campo && !campo.disabled) campo.focus();
                }
            });
            return;
        }

        const enfermero = resultado.enfermero;

        console.log("Estado activo:", enfermero.activo);
    
        Swal.fire({
            title: enfermero.activo === false ? 'Enfermero Desactivado' : 'Enfermero Registrado',
            html: 'La matrícula ingresada ya está registrada.<br>Presione "Modificar" si desea editar los datos.',
            icon: enfermero.activo === false ? 'warning' : 'success',
            confirmButtonText: 'Entendido'
        });

        mostrarDatosEnfermero(enfermero);
        bloquearMatricula();
        bloquearCamposFormulario();
        btnModificar.disabled = false;
        btnDesactivar.disabled = false;
        btnRegistrar.disabled = true;


    } catch (error) {
        console.error("Error en búsqueda:", error);
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

document.addEventListener("DOMContentLoaded", () => {
    bloquearCamposFormulario();
    inputMatricula.focus();

    btnRegistrar.addEventListener("click", async (event) => {
        event.preventDefault();

        if (!validarDatos(form)) return;

        const enfermero = {
            matricula: form.matricula.value.trim(),
            apellidonombres: form.apellidonombres.value.trim(),
            telefono: form.telefono.value.trim(),
            email: form.email.value.trim()
        };

        try {
            await guardarEnfermero(enfermero, modoEdicion);

            Swal.fire({
                title: 'Éxito',
                text: modoEdicion ? 'Enfermero actualizado correctamente.' : 'Enfermero registrado correctamente.',
                icon: 'success',
                confirmButtonText: 'Cerrar'
            }).then(() => resetearBusqueda());
        } catch (error) {
            Swal.fire("Error", error.message, "error");
        }
    });
});

btnDesactivar.addEventListener("click", async () => {
    const matricula = form.matricula.value.trim();
    if (!matricula) return;

    const estado = btnDesactivar.dataset.estado;

    if (estado === "desactivar") {
        const confirmacion = await Swal.fire({
            title: '¿Está seguro?',
            text: "Esta acción desactivará al enfermero. Puede reactivarlo más tarde.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, desactivar',
            cancelButtonText: 'Cancelar'
        });

        if (!confirmacion.isConfirmed) return;

        try {
            const response = await fetch(`${API_URL}/${matricula}`, {
                method: "DELETE"
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || "Error al desactivar enfermero.");

            Swal.fire('Desactivado', data.mensaje, 'success').then(() => resetearBusqueda());

        } catch (error) {
            Swal.fire("Error", error.message, "error");
        }

    } else if (estado === "reactivar") {
        const confirmacion = await Swal.fire({
            title: '¿Reactivar enfermero?',
            text: "El enfermero fue desactivado. ¿Desea reactivarlo?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, reactivar',
            cancelButtonText: 'Cancelar'
        });

        if (!confirmacion.isConfirmed) return;

        try {
            const response = await fetch(`${API_URL}/${matricula}/reactivar`, {
                method: "PUT"
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Error al reactivar enfermero.");
            Swal.fire('Reactivado', data.mensaje, 'success').then(() => resetearBusqueda());

        } catch (error) {
            Swal.fire("Error", error.message, "error");
        }
    }
});


async function buscarEnfermero(matricula) {
    try {
        const response = await fetch(`${API_URL}/${matricula}`);
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.log("Error al buscar enfermero:", error);
        return null;
    }
}

async function guardarEnfermero(enfermero, esEdicion = false) {
    const metodo = esEdicion ? "PUT" : "POST";
    const url = esEdicion ? `${API_URL}/${enfermero.matricula}` : API_URL;

    const datosParaBackend = Object.fromEntries(
        Object.entries(enfermero).filter(([_, v]) => v !== undefined && v !== "")
    );

    const response = await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ datosEnfermero: datosParaBackend })
    });

    const responseData = await response.json();

    if (!response.ok) {
        const mensaje = responseData.error || responseData.message || "Error al guardar datos";
        throw new Error(mensaje);
    }

    return responseData;
}

function mostrarDatosEnfermero(enfermero) {

    if (enfermero.deletedAt) {
        btnDesactivar.textContent = "Reactivar";
        btnDesactivar.dataset.estado = "reactivar";
        btnDesactivar.classList.remove("btn-danger");
        btnDesactivar.classList.add("btn-success");
    } else {
        btnDesactivar.textContent = "Desactivar";
        btnDesactivar.dataset.estado = "desactivar";
        btnDesactivar.classList.remove("btn-success");
        btnDesactivar.classList.add("btn-danger");
    }
    form.apellidonombres.value = enfermero.apellidonombres || "";
    form.telefono.value = enfermero.telefono || "";
    form.email.value = enfermero.email || "";
    modoEdicion = true;
    btnRegistrar.disabled = true;
    btnDesactivar.disabled = false;
}

function resetearBusqueda() {
    form.reset();
    mensajeBusqueda.textContent = '';
    desbloquearCamposFormulario();
    matricula.disabled = false;
    btnBuscar.textContent = "Buscar";
    btnRegistrar.textContent = "Registrar";
    btnRegistrar.disabled = true;
    btnModificar.disabled = true;
    btnDesactivar.disabled = true;
    btnDesactivar.textContent = "Desactivar";
    btnDesactivar.dataset.estado = "desactivar";
    btnDesactivar.classList.remove("btn-success");
    btnDesactivar.classList.add("btn-danger");      
    modoEdicion = false;
}

function bloquearMatricula() {
    matricula.disabled = true;
    matricula.style.backgroundColor = "#f0f0f0";
    btnBuscar.textContent = "Nueva Búsqueda";
}

function desbloquearCamposFormulario() {
    ["apellidonombres", "telefono", "email"].forEach(id => {
        const campo = document.getElementById(id);
        if (campo) campo.disabled = false;
    });
}

function bloquearCamposFormulario() {
    ["apellidonombres", "telefono", "email"].forEach(id => {
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
