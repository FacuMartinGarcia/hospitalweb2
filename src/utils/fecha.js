function transformarFechaArgentina(fecha) {
  const f = new Date(fecha);
  const dia = String(f.getDate()).padStart(2, '0');
  const mes = String(f.getMonth() + 1).padStart(2, '0');
  const anio = f.getFullYear();
  return `${dia}/${mes}/${anio}`;
}


function getFechaArgentina() {
    const ahora = new Date();
    // Ajustar a UTC-3 (Argentina)
    ahora.setHours(ahora.getHours() - 3); // ¡Importante si el servidor usa UTC!
    return ahora.toISOString().split('T')[0]; // Formato ISO (YYYY-MM-DD)
}

module.exports = { getFechaArgentina };

function obtenerFechaArgentina() {
  const ahora = new Date();
  const opciones = { timeZone: 'America/Argentina/Buenos_Aires' };
  
  const fechaArgString = ahora.toLocaleDateString('es-AR', opciones)
    .split('/').reverse().join('-'); 
  
  return fechaArgString;
}

module.exports = {
  transformarFechaArgentina,
  obtenerFechaArgentina
};

