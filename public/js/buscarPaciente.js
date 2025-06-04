const API_URL_PACIENTES = '/api/pacientes';
const API_URL_INTERNACIONES = '/api/internaciones';

export async function buscarPaciente(documento, mostrarDatosPaciente, mostrarAdmision, limpiarDatosPaciente, bloquearDocumento, btnBuscarPaciente, inputDocumento, datosInternacion, manejarSinInternacionActiva) {
    try {
        const resultado = await buscarPacienteAPI(documento);

        if (!resultado || !resultado.paciente) {
            Swal.fire({
                title: 'Paciente No Registrado',
                html: "El n° de documento ingresado no se encuentra registrado",
                icon: 'info',
                confirmButtonText: 'Entendido'
            }).then(() => setTimeout(() => inputDocumento.focus(), 300));
            limpiarDatosPaciente();
            return null;
        }

        const pacienteSeleccionado = resultado.paciente;

        if (pacienteSeleccionado.fechafallecimiento) {
            Swal.fire({
                title: 'Paciente fallecido',
                html: `<p>El paciente fue registrado como <strong>fallecido</strong> el día <strong>${pacienteSeleccionado.fechafallecimiento}</strong>.</p>
                       <p>No podrá registrar antecedentes en su historia clínica.</p>`,
                icon: 'info',
                confirmButtonText: 'Entendido'
            });
            mostrarDatosPaciente(pacienteSeleccionado);
            bloquearDocumento();
            return pacienteSeleccionado;
        }

        mostrarDatosPaciente(pacienteSeleccionado);
        bloquearDocumento();

        const internacionActiva = await verificarInternaciones(pacienteSeleccionado);
        if (internacionActiva) {
            mostrarAdmision(internacionActiva, datosInternacion);
            inputDocumento.disabled = true;
            btnBuscarPaciente.textContent = "Nueva búsqueda";
        } else {
            manejarSinInternacionActiva();
        }

        return pacienteSeleccionado;

    } catch (error) {
        console.error('Error en búsqueda:', error);
        Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al realizar la búsqueda.',
            icon: 'error',
            confirmButtonText: 'Cerrar'
        });
    }
}


async function buscarPacienteAPI(documento) {
    const response = await fetch(`${API_URL_PACIENTES}/${documento}`);
    if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Error en la respuesta del servidor');
    }
    return await response.json();
}

async function verificarInternaciones(paciente) {
    const response = await fetch(`${API_URL_INTERNACIONES}/paciente/${paciente.idpaciente}/activas`);
    if (!response.ok) throw new Error('Error al verificar internaciones');
    const resultado = await response.json();
    return resultado && resultado.activa ? resultado.internacion : null;
}