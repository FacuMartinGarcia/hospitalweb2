function obtenerFechaArgentina() {
  const hoy = new Date();
  const dia = String(hoy.getDate()).padStart(2, '0');
  const mes = String(hoy.getMonth() + 1).padStart(2, '0'); // Enero = 0
  const anio = hoy.getFullYear();
  return `${dia}/${mes}/${anio}`;
}

module.exports = { obtenerFechaArgentina };
