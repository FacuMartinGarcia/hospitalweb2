const API_URL_USUARIOS = '/api/usuarios';
const API_URL_ROLES = '/api/roles';

const form = document.getElementById("formUsuario");
const inputUsuario = document.getElementById("usuario");
const selectRol = document.getElementById("idrol");
const mensaje = document.getElementById("mensajes");
const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");

let modoEdicion = false;
let idUsuarioEditarEditar = null;

document.addEventListener("DOMContentLoaded", async () => {
    await cargarRoles();
    await cargarUsuarios();

    inputUsuario.addEventListener("input", () => {
        inputUsuario.value = inputUsuario.value.toLowerCase();
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (!validarCampos()) return;

        const datos = obtenerDatosFormulario();

        const confirmacion = await Swal.fire({
            title: modoEdicion ? '¿Actualizar usuario?' : '¿Registrar nuevo usuario?',
            html: `
                <strong>Nombre:</strong> ${datos.nombre}<br>
                <strong>Usuario:</strong> ${datos.usuario}<br>
                <strong>Rol:</strong> ${selectRol.options[selectRol.selectedIndex].text}<br>
                <strong>Matrícula:</strong> ${datos.matricula || '-'}
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: modoEdicion ? 'Sí, actualizar' : 'Sí, registrar',
            cancelButtonText: 'Cancelar'
        });

        if (!confirmacion.isConfirmed) return;

        try {
            const url = modoEdicion ? `${API_URL_USUARIOS}/${idusuarioEditar}` : API_URL_USUARIOS;
            const method = modoEdicion ? 'PUT' : 'POST';
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });

            const data = await res.json();
            if (!res.ok || !data.success) throw new Error(data.error || 'Error al guardar usuario.');

            Swal.fire('Éxito', modoEdicion ? 'Usuario actualizado correctamente.' : 'Usuario registrado correctamente.', 'success');
            resetearFormulario();
            await cargarUsuarios();
        } catch (error) {
            Swal.fire('Error', error.message, 'error');
        }
    });
    /*
    btnCancelar.addEventListener("click", () => {
        resetearFormulario();
    });
    */
});

async function cargarRoles() {
    try {
        const res = await fetch(API_URL_ROLES);
        if (!res.ok) throw new Error("Error al cargar roles.");
        const roles = await res.json();

        roles.forEach(rol => {
            const option = document.createElement("option");
            option.value = rol.idrol;
            option.textContent = rol.nombre;
            selectRol.appendChild(option);
        });
    } catch (error) {
        console.error(error);
    }
}

async function cargarUsuarios() {
    try {
        const res = await fetch(API_URL_USUARIOS);
        const usuarios = await res.json();
        const tbody = document.getElementById('tablaUsuarios');
        tbody.innerHTML = '';

        usuarios.forEach(u => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${u.idusuario}</td>
                <td>${u.nombre}</td>
                <td>${u.usuario}</td>
                <td>${u.rol?.nombre || '-'}</td>
                <td>${u.activo ? 'Activo' : 'Inactivo'}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editarUsuario(${u.idusuario})">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="eliminarUsuario(${u.idusuario})">Eliminar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error("Error al cargar usuarios:", error);
    }
}

function validarCampos() {
    const { nombre, usuario, password, idrol } = obtenerDatosFormulario();
    mensaje.textContent = '';
    if (!nombre || !usuario || !password || !idrol) {
        mensaje.textContent = 'Por favor, complete todos los campos obligatorios.';
        return false;
    }
    return true;
}

function obtenerDatosFormulario() {
    return {
        nombre: form.nombre.value.trim(),
        usuario: form.usuario.value.trim(),
        password: form.password.value.trim(),
        idrol: form.idrol.value,
        matricula: form.matricula.value.trim()
        
    };
}

function resetearFormulario() {
    form.reset();
    mensaje.textContent = '';
    modoEdicion = false;
    idusuarioEditar = null;
    btnGuardar.textContent = "Guardar usuario";
    //btnCancelar.hidden = true;
}


window.editarUsuario = async function (id) {
    try {
        const res = await fetch(`${API_URL_USUARIOS}/${id}`);
        if (!res.ok) throw new Error("No se pudo obtener el usuario.");
        const usuario = await res.json();

        form.nombre.value = usuario.nombre;
        form.usuario.value = usuario.usuario;
        form.password.value = ''; 
        form.idrol.value = usuario.idrol;
        form.matricula.value = usuario.matricula || '';

        modoEdicion = true;
        idusuarioEditar = id;

        btnGuardar.textContent = "Actualizar usuario";
        //btnCancelar.hidden = false;
    } catch (error) {
        console.error("Error al editar usuario:", error);
        Swal.fire("Error", "No se pudo editar el usuario.", "error");
    }
};

window.eliminarUsuario = async function (id) {
    const confirmacion = await Swal.fire({
        title: '¿Desactivar usuario?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, desactivar',
        cancelButtonText: 'Cancelar'
    });

    if (!confirmacion.isConfirmed) return;

    try {
        const res = await fetch(`${API_URL_USUARIOS}/${id}`, { method: "DELETE" });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || "Error al desactivar usuario.");
        Swal.fire("Desactivado", data.message, "success");
        resetearFormulario();
        await cargarUsuarios();
    } catch (error) {
        Swal.fire("Error", error.message, "error");
    }
};
