import { mostrarMensaje} from './utils.js';

const form = document.getElementById("formUsuario");
//const btnGuardar = document.getElementById("btnGuardar");
const tablaUsuarios = document.getElementById("tablaUsuarios");
const selectRol = document.getElementById("idrol");
const selectActivo = document.getElementById("activo");
//const mensajes = document.getElementById("mensajes");
const inputBusqueda = document.getElementById("inputBusquedaUsuario");

const paginacion = document.getElementById("paginacionUsuarios");

let modoEdicion = false;
let idEditar = null;
let datosRoles = [];
let todosLosUsuarios = [];

let paginaActual = 1;
const cantidadPorPagina = 5;

document.addEventListener("DOMContentLoaded", () => {
  cargarRoles();
  
  const selectRol = document.getElementById("idrol");
  const camposUsuario = document.getElementById("camposUsuario");
  const cardTablaUsuarios = document.getElementById("cardTablaUsuarios");
  
  
  selectRol.addEventListener("change", async () => {
    
    const idrol = selectRol.value
    const inputMatricula = document.getElementById("matricula");

    if (idrol) {
      camposUsuario.style.display = "block";
      cardTablaUsuarios.style.display = "block";
      await cargarUsuariosPorRol(idrol); 
    } else {
      camposUsuario.style.display = "none";
      cardTablaUsuarios.style.display = "none";
      limpiarTablaUsuarios();
    }
    ;
    if (idrol === "3" || idrol === "4") {      // Si es médico o enfermero (podria se mejor manejado desde una tabla)
      inputMatricula.disabled = false;
      inputMatricula.value = "";
      inputMatricula.placeholder = "Ingrese matrícula";
    } else {
      inputMatricula.disabled = true;
      inputMatricula.value = "No aplica";
      inputMatricula.placeholder = "";
    }
  });
  
  document.addEventListener("DOMContentLoaded", () => {
  const selectRol = document.getElementById("idrol");
  const camposUsuario = document.getElementById("camposUsuario");
  const cardTablaUsuarios = document.getElementById("cardTablaUsuarios");

  selectRol.addEventListener("change", async () => {
    const idrol = selectRol.value;

    if (idrol) {
      camposUsuario.style.display = "block";
      cardTablaUsuarios.style.display = "block";
      await cargarUsuariosPorRol(idrol); // función que filtra
    } else {
      camposUsuario.style.display = "none";
      cardTablaUsuarios.style.display = "none";
      limpiarTablaUsuarios();
    }
  });
});




  
  //ver cuando usamos la funcion
  //listarUsuariosPaginado();





});

inputBusqueda.addEventListener("input", () => {
  paginaActual = 1;
  listarUsuariosPaginado();
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim().toUpperCase();
  const usuario = document.getElementById("usuario").value.trim();
  const password = document.getElementById("password").value;
  const idrol = selectRol.value;
  const activo = selectActivo.value === "true" ? 1 : 0;
  const matricula = document.getElementById("matricula").value.trim();

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

  const aliasResponse = await fetch(`/api/usuarios/verificar-alias?alias=${encodeURIComponent(usuario)}`);
  const aliasData = await aliasResponse.json();

  if (aliasData.existe) {
    console.log(aliasData);
    console.log(idEditar);
    console.log(modoEdicion);
    console.log(aliasData.idusuario);
    
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
      form.reset();
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
/*
async function cargarUsuariosPorRol(idrol) {
  try {
    const response = await fetch(`/api/usuarios/por-rol/${idrol}`);
    if (!response.ok) throw new Error("Error al obtener usuarios");
    const usuarios = await response.json();

    const tbody = document.getElementById("tablaUsuarios");
    tbody.innerHTML = "";

    usuarios.forEach(u => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${u.idusuario}</td>
        <td>${u.nombre}</td>
        <td>${u.usuario}</td>
        <td>${u.rol.nombre}</td>
        <td>${u.activo ? "Activo" : "Inactivo"}</td>
        <td>
          <button class="btn btn-sm btn-warning me-1" onclick="editarUsuario(${u.idusuario})">✏️</button>
          <button class="btn btn-sm btn-danger" onclick="eliminarUsuario(${u.idusuario})">🗑️</button>
        </td>
      `;
      tbody.appendChild(fila);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}
*/
function mostrarUsuariosPaginados() {
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
      <td>${u.activo ? "Activo" : "Inactivo"}</td>
      <td>
        <button class="btn btn-sm btn-warning me-1" onclick="editarUsuario(${u.idusuario})">✏️</button>
        <button class="btn btn-sm btn-danger" onclick="eliminarUsuario(${u.idusuario})">🗑️</button>
      </td>
    `;
    tablaUsuarios.appendChild(fila);
  });

  generarPaginacion(total);
}

async function cargarUsuariosPorRol(idrol) {
  try {
    const response = await fetch(`/api/usuarios/por-rol/${idrol}`);
    if (!response.ok) throw new Error("Error al obtener usuarios");

    todosLosUsuarios = await response.json();
    paginaActual = 1; 
    mostrarUsuariosPaginados();
  } catch (error) {
    console.error("Error:", error);
  }
}


function limpiarTablaUsuarios() {
  const tbody = document.getElementById("tablaUsuarios");
  tbody.innerHTML = "";
}
async function listarUsuariosPaginado() {
  try {
    const search = inputBusqueda.value.trim().toLowerCase();
    const res = await fetch("/api/usuarios");
    const usuarios = await res.json();
    todosLosUsuarios = usuarios;

    const filtrados = usuarios.filter((u) =>
      u.nombre.toLowerCase().includes(search) || u.usuario.toLowerCase().includes(search)
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

    paginados.forEach((u) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${u.idusuario}</td>
        <td>${u.nombre}</td>
        <td>${u.usuario}</td>
        <td>${u.rol?.nombre || "-"}</td>
        <td>${u.activo ? "Activo" : "Inactivo"}</td>
        <td>
          <button class="btn btn-sm btn-warning me-1" onclick="editarUsuario(${u.idusuario})">✏️</button>
          <button class="btn btn-sm btn-danger" onclick="eliminarUsuario(${u.idusuario})">🗑️</button>
        </td>`;
      tablaUsuarios.appendChild(tr);
    });

    generarPaginacion(total);
  } catch (err) {
    console.error("Error al listar usuarios:", err);
  }
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
        const res = await fetch(`/api/usuarios/${id}`, { method: "DELETE" });
        const data = await res.json();

        if (data.success) {
          Swal.fire('Éxito', 'Usuario eliminado correctamente.', 'success');
          listarUsuariosPaginado();
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

