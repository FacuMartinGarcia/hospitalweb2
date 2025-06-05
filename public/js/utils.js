// public/js/mensajes.js

export function mostrarMensaje(selector, mensaje, tipo = 1) {
  const elemento = document.querySelector(selector);
  if (!elemento) return;

  elemento.textContent = mensaje;
  elemento.style.color = "white";
  elemento.style.backgroundColor = tipo === 0 ? "#b02a37" : "#0d6efd"; // rojo o azul bootstrap
  elemento.style.borderRadius = "6px";
  elemento.style.fontSize = "1rem";
  elemento.style.transition = "all 0.3s ease";
  elemento.style.padding = "10px";
  elemento.style.marginTop = "10px";


  elemento.scrollIntoView({ behavior: 'auto', block: 'center' });

  setTimeout(() => {
    elemento.textContent = '';
    elemento.style.backgroundColor = '';
  }, 2000);
}
