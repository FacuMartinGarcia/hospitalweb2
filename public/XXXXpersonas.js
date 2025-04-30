document.addEventListener("DOMContentLoaded", async () => {
    console.log("JS de personas cargado ");

    const form = document.getElementById('formPersona');
    const selectCobertura = document.getElementById('idCobertura');
    const selectEspecialidad = document.getElementById('idEspecialidad');
    const selectTurno = document.getElementById('idTurno');
    const tipoPersona = document.getElementById('tipoPersona');
    const camposPaciente = document.getElementById('camposPaciente');
    const camposMedico = document.getElementById('camposMedico');
    const camposEnfermero = document.getElementById('camposEnfermero');


    let coberturas = [];

    async function cargarCombo(url, selectElement, almacenamiento = null) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            console.log("Cargando datos desde:", url);

            if (almacenamiento !== null) {
                almacenamiento.splice(0, almacenamiento.length, ...data);
            }

            data.forEach(item => {
                const option = document.createElement("option");
                option.value = item.idCobertura || item.id || item.idEspecialidad || item.idTurno;
                option.textContent = item.denominacion;
                selectElement.appendChild(option);
            });
        } catch (error) {
            console.error('Error cargando datos:', error);
        }
    }


    await cargarCombo('/api/coberturas', selectCobertura, coberturas);
    //await cargarCombo('/api/especialidades', selectEspecialidad);
    //await cargarCombo('/api/turnos', selectTurno);


    tipoPersona.addEventListener("change", () => {
        const valor = tipoPersona.value;

        camposPaciente.style.display = (valor === "Paciente") ? "grid" : "none";
        camposMedico.style.display = (valor === "Medico") ? "grid" : "none";
        camposEnfermero.style.display = (valor === "Enfermero") ? "grid" : "none";
    });

    tipoPersona.dispatchEvent(new Event("change")); 

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validarDatos(e.target)) return;

        const datosPersona = {
            apellidoNombres: document.getElementById('apellidoNombres').value,
            documento: document.getElementById('documento').value,
            fechaNacimiento: document.getElementById('fechaNacimiento').value,
            sexo: document.getElementById('sexo').value,
            direccion: document.getElementById('direccion').value,
            telefono: document.getElementById('telefono').value,
            email: document.getElementById('email').value,
        };

        const tipo = tipoPersona.value;
        const datosEspecificos = {};

        if (tipo === 'Paciente') {
            datosEspecificos.idCobertura = document.getElementById('idCobertura').value;
            datosEspecificos.contactoEmergencia = document.getElementById('contactoEmergencia').value;
        } else if (tipo === 'Medico') {
            datosEspecificos.idEspecialidad = document.getElementById('idEspecialidad').value;
            datosEspecificos.matricula = document.getElementById('matricula').value;
        } else if (tipo === 'Enfermero') {
            datosEspecificos.idTurno = document.getElementById('idTurno').value;
        }

        try {
            const response = await fetch('/api/personas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tipoPersona: tipo,
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
