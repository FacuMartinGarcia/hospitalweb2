function transformarFechaArgentina(fecha) {
  const f = new Date(fecha);
  const dia = String(f.getDate()).padStart(2, '0');
  const mes = String(f.getMonth() + 1).padStart(2, '0');
  const anio = f.getFullYear();
  return `${dia}/${mes}/${anio}`;
}

function obtenerFechaArgentina2() {
  const hoy = new Date();
  const fechaArg = new Date(hoy.toLocaleString('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires'
  }));
  
  fechaArg.setHours(0, 0, 0, 0);
  
  return fechaArg.toISOString().split('T')[0]; 
}

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

