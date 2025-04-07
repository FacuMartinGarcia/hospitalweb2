class Paciente {
    constructor(idPaciente, apellidoNombres, documento, fechaNacimiento, sexo, direccion, telefono, email, fechaRegistro, idCobertura, contactoEmergencia) {
        this.idPaciente = idPaciente;
        this.apellidoNombres = apellidoNombres.toUpperCase(); 
        this.documento = documento;
        this.fechaNacimiento = fechaNacimiento;
        this.sexo = sexo;
        this.direccion = direccion;
        this.telefono = telefono;
        this.email = email;
        this.fechaRegistro = fechaRegistro;
        this.idCobertura = idCobertura;
        this.contactoEmergencia = contactoEmergencia;
    }
}

class Cobertura {
    constructor(idCobertura, denominacion) {
        this.idCobertura = idCobertura;
        this.denominacion = denominacion;
    }
}

let coberturas = [
    new Cobertura(1, "Sin Datos"),
    new Cobertura(2, "Swiss Medical"),
    new Cobertura(3, "Galeno"),
    new Cobertura(4, "Medife"),
    new Cobertura(5, "OSDE"),
    new Cobertura(6, "DOSEP"),
];

let pacientes = [];


function validarDatos(form) {

    let documento = form.documento.value.trim(); 
    let apellidoNombres = form.apellidoNombres.value.trim() //.toUpperCase();
    let fechaNacimiento = form.fechaNacimiento.value;
    let telefono = form.telefono.value.trim();
    let email = form.email.value.trim();
    let cobertura = form.idCobertura.value;


    if (documento === "" || documento === "0" || isNaN(documento) || !/^\d{1,9}$/.test(documento)) {
        mostrarMensaje('El documento debe contener solo números y tener hasta 9 dígitos.',0);
        inputdocumento.focus();
        return false;
    }
    
    if (apellidoNombres === "") {
        mostrarMensaje('El Apellido y Nombres es obligatorio.',0);
        return false;
    }

    if (telefono.trim() !== "" && !/^\d{1,20}$/.test(telefono)) {
        mostrarMensaje('El Teléfono debe contener solo números',0);
        return false;
    }

    let fechaNac = new Date(fechaNacimiento);
    let hoy = new Date();
    let hace150años = new Date();
    hace150años.setFullYear(hoy.getFullYear() - 150);

    if (fechaNac < hace150años || fechaNac > hoy) {
        mostrarMensaje('La fecha de nacimiento no puede ser mayor a 150 años atrás ni estar en el futuro.',0);
        return false;
    }

    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.trim() !== "" && !emailRegex.test(email)) {
        mostrarMensaje('El correo electrónico no tiene un formato válido.', 0);
        return false;
    }

    if (coberturas.find(c => c.idCobertura == cobertura) === undefined) {
        mostrarMensaje('Debe seleccionar una cobertura válida.', 0);
        return false;
    }

    return true;
}

document.addEventListener("DOMContentLoaded", () => {
    

    const form = document.getElementById("formPaciente");
    const inputdocumento = document.getElementById("documento");
    const selectCobertura = document.getElementById("idCobertura");
    const btnBuscar = document.getElementById("btnBuscar");
    const btnModificar = document.getElementById("btnModificar");
    const mensajeBusqueda = document.getElementById("mensajes");

    coberturas.forEach(cobertura => {
        let option = document.createElement("option");
        option.value = cobertura.idCobertura;
        option.textContent = cobertura.denominacion;
        selectCobertura.appendChild(option);
    });

    bloquearCamposFormulario();

    btnBuscar.addEventListener("click", () => {

        console.log(inputdocumento.value);
    
        if (inputdocumento.value === "" || inputdocumento.value === "0" || isNaN(inputdocumento.value) || !/^\d{1,9}$/.test(inputdocumento.value)) {
            mostrarMensaje('El documento debe contener solo números y tener hasta 9 dígitos.',0);
            inputdocumento.focus();
            return false;
        }


        if (btnBuscar.textContent === "Nueva Búsqueda") {
            // Habilita el campo documento y limpia los campos
            inputdocumento.value = "";
            inputdocumento.disabled = false;
            limpiarCampos();
            btnBuscar.textContent = "Buscar";
            mensajeBusqueda.textContent = '';
            inputdocumento.focus();
            return;
        }

        let paciente = consultarPaciente(inputdocumento.value);

        if (paciente) {
            
            form.apellidoNombres.value = paciente.apellidoNombres;
            form.fechaNacimiento.value = paciente.fechaNacimiento;
            form.sexo.value = paciente.sexo;
            form.direccion.value = paciente.direccion;
            form.telefono.value = paciente.telefono;
            form.email.value = paciente.email;
            form.idCobertura.value = paciente.idCobertura;
            form.contactoEmergencia.value = paciente.contactoEmergencia;
            mensajeBusqueda.textContent = '';

            bloqueardocumento();
            bloquearCamposFormulario();
            btnModificar.disabled = false;

        } else {
            limpiarCampos();
            /*mostrarMensaje('Paciente no encontrado. Verifique el documento, o registre los datos del nuevo paciente', 0);*/
            bloqueardocumento();

            Swal.fire({
                title: 'No Registrado',
                html: "El n° de documento ingresado no se encuentra registrado. <br>Verifique el documento, o registre los datos del nuevo paciente",
                icon: 'info',
                confirmButtonText: 'Entendido'
            }).then(() => {
                desbloquearCamposFormulario();
                btnModificar.disabled = true;
                setTimeout(() => {
                    document.getElementById('apellidoNombres').focus();
                }, 300);
            });
        }
    });

    btnModificar.addEventListener("click", () => {
        desbloquearCamposFormulario();
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();


        Swal.fire({

            title: '¿Estás seguro?',
            text: "Va a grabar los datos ingresados",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, grabar',
            cancelButtonText: 'Cancelar'

          }).then((result) => {

            if (result.isConfirmed) {
                if (!validarDatos(form)) {
                    return;
                }
        
                let documento = form.documento.value;  
                let pacienteExistente = consultarPaciente(documento); 
        
                // Modificación
                if (pacienteExistente) {
                    let nuevosDatos = {
                        apellidoNombres: form.apellidoNombres.value,
                        fechaNacimiento: form.fechaNacimiento.value,
                        sexo: form.sexo.value,
                        direccion: form.direccion.value,
                        telefono: form.telefono.value,
                        email: form.email.value,
                        idCobertura: form.idCobertura.value,
                        contactoEmergencia: form.contactoEmergencia.value
                    };
        
                    btnModificar.disabled = false;
                    console.log(btnModificar);
                    modificarPaciente(documento, nuevosDatos);
                    mostrarMensaje('Paciente actualizado exitosamente.', 1);
        
                } else {
                    // Alta
                    let nuevoPaciente = new Paciente(
                        pacientes.length + 1,
                        form.apellidoNombres.value,
                        documento,
                        form.fechaNacimiento.value,
                        form.sexo.value,
                        form.direccion.value,
                        form.telefono.value,
                        form.email.value,
                        new Date().toISOString().split("T")[0],
                        form.idCobertura.value,
                        form.contactoEmergencia.value
                    );
        
                    agregarPaciente(nuevoPaciente);
                    mostrarMensaje('Paciente registrado exitosamente.', 1);
                }
        
                resetearBusqueda();
                btnModificar.disabled = true;
                desbloquearCamposFormulario();    

            } else {
              console.log("La grabación fue cancelada");
            }
          });

    });

    function bloqueardocumento() {
        inputdocumento.disabled = true;
        inputdocumento.style.backgroundColor = "#f0f0f0"; 
        btnBuscar.textContent = "Nueva Búsqueda";
    }

    function resetearBusqueda() {
        inputdocumento.value = "";
        inputdocumento.disabled = false;
        inputdocumento.style.backgroundColor = ""; 
        limpiarCampos();
        btnBuscar.textContent = "Buscar";
        mensajeBusqueda.textContent = '';
        inputdocumento.focus();
    }
    
    function limpiarCampos() {
        form.apellidoNombres.value = "";
        form.fechaNacimiento.value = "";
        form.sexo.value = "";
        form.direccion.value = "";
        form.telefono.value = "";
        form.email.value = "";
        form.idCobertura.value = "";
        form.contactoEmergencia.value = "";
    }
});

function agregarPaciente(paciente) {
    pacientes.push(paciente);
}

function modificarPaciente(documento, nuevosDatos) {
    let paciente = pacientes.find(p => p.documento === documento);
    if (paciente) {
        Object.assign(paciente, nuevosDatos);  
    }
}

function consultarPaciente(documento) {
    return pacientes.find(p => p.documento === documento) || null;
}

function listarPacientes() {
    return pacientes;
}


function mostrarMensaje(mensajes, tipo) {

    const mensajeBusqueda = document.getElementById("mensajes");

    mensajeBusqueda.textContent = mensajes;

    if (tipo === 0) {
        mensajeBusqueda.style.color = "red";
        mensajeBusqueda.style.backgroundColor = "#f8d7da";  
    } else if (tipo === 1) {
        mensajeBusqueda.style.color = "#007bff";  
        mensajeBusqueda.style.backgroundColor = "#cce5ff";  
    }
    setTimeout(() => { mensajeBusqueda.textContent = ''; }, 3000);

}

function bloquearCamposFormulario() {
    

    const campos = [
        "apellidoNombres", "fechaNacimiento", "sexo",
        "direccion", "telefono", "email", "idCobertura",
        "contactoEmergencia"
    ];


    campos.forEach(id => {
        const campo = document.getElementById(id);
        if (campo) {
            campo.disabled = true;       
        }
    });
}

function desbloquearCamposFormulario() {
    const campos = [
        "apellidoNombres", "fechaNacimiento", "sexo",
        "direccion", "telefono", "email", "idCobertura",
        "contactoEmergencia"
    ];

    campos.forEach(id => {
        const campo = document.getElementById(id);
        if (campo) {
            campo.disabled = false;       
        }
    });
}
