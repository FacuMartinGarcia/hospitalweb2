import { mostrarMensaje} from './utils.js';

const form = document.getElementById("formUsuario");

const tablaUsuarios = document.getElementById("tablaUsuarios");
const selectRol = document.getElementById("idrol");
const selectActivo = document.getElementById("activo");
const inputBusqueda = document.getElementById("inputBusquedaUsuario");
const inputMatricula = document.getElementById("matricula");
const paginacion = document.getElementById("paginacionUsuarios");
const camposUsuario = document.getElementById("camposUsuario");
const campoPassword = document.getElementById("password");
const cardTablaUsuarios = document.getElementById("cardTablaUsuarios");

let modoEdicion = false;
let idEditar = null;
let datosRoles = [];
let todosLosUsuarios = [];
let paginaActual = 1;
const cantidadPorPagina = 5;

document.addEventListener("DOMContentLoaded", () => {

  cargarRoles();

  selectRol.addEventListener("change", async () => {
    
    limpiarCampos();
    const idrol = selectRol.value
    const inputMatricula = document.getElementById("matricula");

    if (idrol) {
      actualizarColumnaMatricula();
      camposUsuario.style.display = "block";
      cardTablaUsuarios.style.display = "block";
      await cargarUsuariosPorRol(idrol); 

    } else {
      camposUsuario.style.display = "none";
      cardTablaUsuarios.style.display = "none";
      limpiarTablaUsuarios();
    }
    ;
    if (idrol === "3" || idrol === "4") { //Medico o Enfermero, habria que pensarlo tambien de otra forma 
      inputMatricula.disabled = false;
      inputMatricula.value = "";
      inputMatricula.placeholder = "Ingrese matrícula";
      document.getElementById("nombre").readOnly = true;
      document.getElementById("nombre").value = "";
    } else {
      inputMatricula.disabled = true;
      inputMatricula.value = "No aplica";
      inputMatricula.placeholder = "";
      document.getElementById("nombre").readOnly = false;
      document.getElementById("nombre").value = "";
    }
  });
  
  inputBusqueda.addEventListener("input", () => {
    paginaActual = 1;
    listarUsuariosPaginado();
  });

  inputMatricula.addEventListener("blur", async () => {
    
    const matricula = inputMatricula.value.trim();
    const idrol = selectRol.value;
    const inputNombre = document.getElementById("nombre");

    if (!matricula || (idrol !== "3" && idrol !== "4")) return;

    const url =
      idrol === "3"
        ? `/api/medicos/${matricula}`
        : `/api/enfermeros/${matricula}`;

    try {

      const res = await fetch(url);
      const data = await res.json();

      if (data.success && data.medico) {
        inputNombre.value = data.medico.apellidonombres;
      } else if (data.success && data.enfermero) {
        inputNombre.value = data.enfermero.apellidonombres;
      } else {
        inputNombre.value = "";
        Swal.fire({
          icon: "warning",
          title: `N° de Matrícula no registrada: <strong>${matricula}</strong>`,
          html: `Para crear el usuario de un Profesional, primero debe registrarlo con sus datos 
                personales en el apartado correspondiente (Médico / Enfermero).<br><br>
                <small>Luego búsquelo desde aquí con su número de matrícula</small>`,
          showConfirmButton: true,
        });
        inputMatricula.value="";
        nombre.value="";
        usuario.value="";
        password.value="";
        inputMatricula.focus();
        
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo buscar la matrícula.",
      });
    }
  });

});


form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim().toUpperCase();
  const usuario = document.getElementById("usuario").value.trim();
  const password = document.getElementById("password").value;
  const idrol = selectRol.value;
  const activo = selectActivo.value === "true" ? 1 : 0;
  const matricula = document.getElementById("matricula").value.trim();

  if (!matricula || (idrol !== "3" && idrol !== "4")){
      mostrarMensaje('#mensajes', 'Ingrese una matricula para el usuario medico/enfermero', 0);
      document.getElementById("matricula").focus();
      return;
  }

  if (!nombre) {
    mostrarMensaje('#mensajes', 'Debe especificar el apellido y nombre del usuario', 0);
    document.getElementById("nombre").focus();
    return;
  }

  if (!usuario) {
    mostrarMensaje('#mensajes', 'Debe especificar un nombre de usuario (alias)', 0);
    document.getElementById("usuario").focus();
    return;
  }

  if (!idrol) {
    mostrarMensaje('#mensajes', 'Debe especificar un rol para el usuario', 0);
    document.getElementById("selectRol").focus();
    return;
  }

  if (!password) {
    mostrarMensaje('#mensajes', 'Debe ingresar una contraseña para el usuario', 0);
    document.getElementById("password").focus();
    return;
  }

  
  const queryString = `/api/usuarios/verificar-alias?alias=${encodeURIComponent(usuario)}${modoEdicion ? `&idusuario=${idEditar}` : ''}`;
  const aliasResponse = await fetch(queryString);
  const aliasData = await aliasResponse.json();

  if (aliasData.existe) {
    if (!modoEdicion || aliasData.idusuario !== idEditar) {
      mostrarMensaje("#mensajes", 'El alias ya existe. Elegí otro.', 0);
      form.usuario.focus();
      return;
    }
  }
  
  
  const accion = modoEdicion ? "modificar" : "registrar";
  const texto = `¿Desea ${accion} al usuario "${nombre}"?`;
  const confirmButton = modoEdicion ? "Sí, modificar" : "Sí, registrar";

  const { isConfirmed } = await Swal.fire({
    title: `Confirmar ${accion}`,
    text: texto,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: confirmButton,
    cancelButtonText: "Cancelar"
  });

  if (!isConfirmed) return;

  const url = modoEdicion ? `/api/usuarios/${idEditar}` : "/api/usuarios";
  const metodo = modoEdicion ? "PUT" : "POST";

  try {
    const res = await fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, usuario, password, idrol, matricula, activo }),
    });

    const data = await res.json();

    if (data.success) {
      Swal.fire('Éxito', 'Usuario registrado correctamente.', 'success');
      const rolActual = selectRol.value;
      form.reset();
      selectRol.value = rolActual;
      selectRol.dispatchEvent(new Event('change'));
      modoEdicion = false;
      idEditar = null;
      listarUsuariosPaginado();
    } else {
      mostrarMensaje("#mensajes", data.error || "Ocurrió un error.", 0);
    }
  } catch (err) {
    console.error(err);
    mostrarMensaje("#mensajes", "Error de conexión.", 0);
  }
});

async function cargarRoles() {
  try {
    const res = await fetch("/api/roles");
    if (!res.ok) throw new Error("Error al cargar roles");

    datosRoles = await res.json();
    selectRol.innerHTML = `<option value="">Seleccione un rol</option>`;
    datosRoles.forEach((rol) => {
      const option = document.createElement("option");
      option.value = rol.idrol;
      option.textContent = rol.nombre;
      selectRol.appendChild(option);
    });
  } catch (err) {
    console.error("Error al cargar roles:", err);
  }
}

async function cargarUsuariosPorRol(idrol) {
  try {
    const response = await fetch(`/api/usuarios/por-rol/${idrol}`);
    if (!response.ok) throw new Error("Error al obtener usuarios");
      todosLosUsuarios = await response.json();
      paginaActual = 1;
      listarUsuariosPaginado(); 
    } catch (error) {
    console.error("Error:", error);
  }
}

function limpiarCampos(){
  document.getElementById("matricula").value = "";
  document.getElementById("nombre").value = "";
  document.getElementById("usuario").value = "";
  document.getElementById("password").value = "";
}
 function limpiarTablaUsuarios() {
  const tbody = document.getElementById("tablaUsuarios");
  tbody.innerHTML = "";
}
function listarUsuariosPaginado() {
  if (!selectRol.value) {
    limpiarTablaUsuarios();
    paginacion.innerHTML = "";
    return;
  }

  const search = inputBusqueda.value.trim().toLowerCase();
  const filtrados = todosLosUsuarios.filter(u =>
    u.nombre.toLowerCase().includes(search) ||
    u.usuario.toLowerCase().includes(search)
  );

  const total = filtrados.length;
  const inicio = (paginaActual - 1) * cantidadPorPagina;
  const paginados = filtrados.slice(inicio, inicio + cantidadPorPagina);

  tablaUsuarios.innerHTML = "";
  if (paginados.length === 0) {
    tablaUsuarios.innerHTML = `<tr><td colspan="6">No se encontraron resultados.</td></tr>`;
    paginacion.innerHTML = "";
    return;
  }

  paginados.forEach(u => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${u.idusuario}</td>
      <td>${u.nombre}</td>
      <td>${u.usuario}</td>
      <td>${u.rol?.nombre || "-"}</td>
      <td class="col-matricula">${u.matricula || "-"}</td>
      <td>${u.activo ? "Activo" : "Inactivo"}</td>
      <td>
        <button class="btn btn-sm btn-warning me-1" onclick="editarUsuario(${u.idusuario})">✏️</button>
        <button class="btn btn-sm btn-danger" onclick="eliminarUsuario(${u.idusuario})">🗑️</button>
      </td>
    `;
    tablaUsuarios.appendChild(fila);
  });

  actualizarColumnaMatricula();
  generarPaginacion(total);
}


function generarPaginacion(totalRegistros) {
  const totalPaginas = Math.ceil(totalRegistros / cantidadPorPagina);
  paginacion.innerHTML = "";

  for (let i = 1; i <= totalPaginas; i++) {
    const li = document.createElement("li");
    li.className = `page-item ${i === paginaActual ? "active" : ""}`;
    li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
    li.addEventListener("click", (e) => {
      e.preventDefault();
      paginaActual = i;
      listarUsuariosPaginado();
    });
    paginacion.appendChild(li);
  }
}
function actualizarColumnaMatricula() {
  const valorRol = parseInt(selectRol.value);
  const mostrar = (valorRol === 3 || valorRol === 4); // Médico o Enfermero

  const columnas = document.querySelectorAll(".col-matricula");
  columnas.forEach(col => {
    col.style.display = mostrar ? "" : "none";
  });
}

window.editarUsuario = async function (id) {
  try {
    const res = await fetch(`/api/usuarios/${id}`);
    const data = await res.json();

    if (data.success && data.usuario) {
      document.getElementById("nombre").value = data.usuario.nombre;
      document.getElementById("usuario").value = data.usuario.usuario;
      document.getElementById("password").value = data.usuario.password;
      selectRol.value = data.usuario.idrol;
      selectActivo.value = String(data.usuario.activo);
      document.getElementById("matricula").value = data.usuario.matricula || "";
      modoEdicion = true;
      idEditar = id;
    }
  } catch (err) {
    console.error("Error al editar usuario", err);
  }
};

window.eliminarUsuario = function (id) {
  const usuario = todosLosUsuarios.find(u => u.idusuario === id);
  const nombre = usuario?.nombre || "Usuario desconocido";

  Swal.fire({
    title: "¿Está seguro de Eliminar el Usuario?",
    html: `
      <div style="color: red; font-weight: bold; margin-bottom: 1rem;">
        No podrá deshacer esta operación.
      </div>
      <div style="margin-bottom: 1rem;">
        <strong>Usuario:</strong> ${nombre}<br>
      </div>
    `,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
    focusCancel: true
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const rolActual = selectRol.value;
        const res = await fetch(`/api/usuarios/${id}`, { method: "DELETE" });
        const data = await res.json();

        if (data.success) {
          Swal.fire('Éxito', 'Usuario eliminado correctamente.', 'success');
          selectRol.value = rolActual;
          selectRol.dispatchEvent(new Event('change'));
        } else {
          mostrarMensaje("#mensajes", data.error || "No se pudo eliminar.", 0);
        }
      } catch (err) {
        console.error("Error al eliminar usuario", err);
        mostrarMensaje("#mensajes", "Error de conexión.", 0);
      }
    }
  });
};

