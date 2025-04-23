async function cargarEspecialidades() {
    const response = await fetch('/api/personas/especialidades'); // Ajusta la ruta según tu API
    const especialidades = await response.json();
    const select = document.getElementById('selectEspecialidad');
    
    especialidades.forEach(especialidad => {
        const option = document.createElement('option');
        option.value = especialidad.id;
        option.textContent = especialidad.nombre;
        select.appendChild(option);
    });
}

document.addEventListener('DOMContentLoaded', cargarEspecialidades);