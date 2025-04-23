function validarDatos(form) {
    const tipo = document.getElementById("tipoPersona").value;

    let documento = form.documento.value.trim();
    let apellidoNombres = form.apellidoNombres.value.trim();
    let fechaNacimiento = form.fechaNacimiento.value;
    let telefono = form.telefono.value.trim();
    let email = form.email.value.trim();

    if (documento === "" || documento === "0" || isNaN(documento) || !/^\d{1,9}$/.test(documento)) {
        mostrarMensaje('El documento debe contener solo números y tener hasta 9 dígitos.', 0);
        form.documento.focus();
        return false;
    }

    if (apellidoNombres === "") {
        mostrarMensaje('El Apellido y Nombres es obligatorio.', 0);
        return false;
    }

    if (telefono !== "" && !/^\d{1,20}$/.test(telefono)) {
        mostrarMensaje('El Teléfono debe contener solo números.', 0);
        return false;
    }

    let fechaNac = new Date(fechaNacimiento);
    let hoy = new Date();
    let hace150años = new Date();
    hace150años.setFullYear(hoy.getFullYear() - 150);

    if (fechaNac < hace150años || fechaNac > hoy) {
        mostrarMensaje('La fecha de nacimiento no puede ser mayor a 150 años atrás ni estar en el futuro.', 0);
        return false;
    }

    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email !== "" && !emailRegex.test(email)) {
        mostrarMensaje('El correo electrónico no tiene un formato válido.', 0);
        return false;
    }

    // Validaciones específicas por tipo
    if (tipo === "paciente") {
        let cobertura = form.idCobertura.value;
        if (!cobertura || coberturas.find(c => c.idCobertura == cobertura) === undefined) {
            mostrarMensaje('Debe seleccionar una cobertura válida.', 0);
            return false;
        }

        let contacto = form.contactoEmergencia.value.trim();
        if (contacto === "") {
            mostrarMensaje('Debe ingresar un contacto de emergencia.', 0);
            return false;
        }

    } else if (tipo === "medico") {
        let idEspecialidad = form.idEspecialidad.value;
        let matricula = form.matricula.value.trim();

        if (!idEspecialidad || especialidades.find(e => e.idEspecialidad == idEspecialidad) === undefined) {
            mostrarMensaje('Debe seleccionar una especialidad válida.', 0);
            return false;
        }

        if (matricula === "") {
            mostrarMensaje('Debe ingresar la matrícula del médico.', 0);
            return false;
        }

    } else if (tipo === "enfermero") {
        let idTurno = form.idTurno.value;
        if (!idTurno || turnos.find(t => t.idTurno == idTurno) === undefined) {
            mostrarMensaje('Debe seleccionar un turno válido.', 0);
            return false;
        }
    }

    return true;
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-persona');
    const selectEspecialidad = document.getElementById('especialidad');
    const selectTurno = document.getElementById('turno');
    const selectCobertura = document.getElementById('cobertura');
    const tipoPersona = document.getElementById('tipo-persona');
    const camposPaciente = document.getElementById('camposPaciente');
    const camposMedico = document.getElementById('camposMedico');
    const camposEnfermero = document.getElementById('camposEnfermero');

    // Función para cargar combos
    async function cargarCombo(url, selectElement) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            
            data.forEach(item => {
                let option = document.createElement("option");
                option.value = item.id;
                option.textContent = item.denominacion;
                selectElement.appendChild(option);
            });
        } catch (error) {
            console.error('Error cargando datos:', error);
        }
    }

    //cargarCombo('/api/especialidades', selectEspecialidad);
    //cargarCombo('/api/turnos', selectTurno);
    //cargarCombo('/api/coberturas', selectCobertura);
    
    tipoPersona.addEventListener("change", () => {
        const valor = tipoPersona.value;
    
        camposPaciente.style.display = (valor === "Paciente") ? "grid" : "none";
        camposMedico.style.display = (valor === "Medico") ? "grid" : "none";
        camposEnfermero.style.display = (valor === "Enfermero") ? "grid" : "none";
    });

    tipoPersona.dispatchEvent(new Event("change"));

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validarDatos(e.target)) {
            return; 
        }

        const tipoPersonaValue = tipoPersona.value;
        const datosPersona = {
            apellidoNombres: document.getElementById('apellido-nombres').value,
            documento: document.getElementById('documento').value,
            fechaNacimiento: document.getElementById('fecha-nacimiento').value,
            sexo: document.getElementById('sexo').value,
            direccion: document.getElementById('direccion').value,
            telefono: document.getElementById('telefono').value,
            email: document.getElementById('email').value,
        };
        
        const datosEspecificos = {};
        if (tipoPersonaValue === 'Paciente') {
            datosEspecificos.idCobertura = document.getElementById('cobertura').value;
            datosEspecificos.contactoEmergencia = document.getElementById('contacto-emergencia').value;
        } 
        if (tipoPersonaValue === 'Medico') {
            datosEspecificos.idEspecialidad = document.getElementById('especialidad').value;
            datosEspecificos.matricula = document.getElementById('matricula').value;
        } 
        if (tipoPersonaValue === 'Enfermero') {
            datosEspecificos.idTurno = document.getElementById('turno').value;
        }   
        
        try {
            const response = await fetch('/api/personas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tipoPersona: tipoPersonaValue,
                    datosPersona,
                    datosEspecificos
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                alert('Persona registrada con éxito');
                form.reset();
            } else {
                throw new Error(data.error || 'Error al registrar persona');
            }
        } catch (error) {
            alert(error.message);
            console.error('Error:', error);
        }
    });
});