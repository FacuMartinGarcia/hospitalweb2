/**
 * Obtiene la fecha actual en formato local (Argentina/San Luis)
 * @param {string} formato - 'YYYY-MM-DD' (default), 'DD-MM-YYYY', etc.
 * @returns {string} Fecha formateada
 */
export function getFechaLocal(formato = 'YYYY-MM-DD') {
  const hoy = new Date();
  const dia = String(hoy.getDate()).padStart(2, '0');
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const anio = hoy.getFullYear();

  switch (formato.toUpperCase()) {
    case 'DD-MM-YYYY':
      return `${dia}-${mes}-${anio}`; 
    case 'DD/MM/YYYY':
      return `${dia}/${mes}/${anio}`; 
    default: // 'YYYY-MM-DD'
      return `${anio}-${mes}-${dia}`; 
  }
}

export function formatearFecha(iso) {
    if (!iso) return '';
        const [a, m, d] = iso.split("T")[0].split("-");
    return `${d}/${m}/${a}`;
}


export function mostrarMensaje(selector, mensaje, tipo = 1) {
  const elemento = document.querySelector(selector);
  if (!elemento) return;

  // Estilos del mensaje
  elemento.textContent = mensaje;
  elemento.style.color = "white";
  elemento.style.backgroundColor = tipo === 0 ? "#b02a37" : "#0d6efd";
  elemento.style.borderRadius = "6px";
  elemento.style.fontSize = "1rem";
  elemento.style.transition = "all 0.3s ease";
  elemento.style.padding = "10px";
  elemento.style.marginTop = "10px";

  // Scroll y autodestrucción
  elemento.scrollIntoView({ behavior: 'auto', block: 'center' });
  setTimeout(() => {
    elemento.textContent = '';
    elemento.style.backgroundColor = '';
  }, 2000);
}