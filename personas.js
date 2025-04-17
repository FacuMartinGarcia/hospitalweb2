class Persona {
    static ultimoId = 0;
    constructor(apellidoNombres, documento, fechaNacimiento, sexo, direccion, telefono, email, fechaFallecimiento, actaDefuncion) {
      this.idPersona = ++Persona.ultimoId;
      this.apellidoNombres = apellidoNombres;
      this.documento = documento;
      this.fechaNacimiento = fechaNacimiento;
      this.sexo = sexo;
      this.direccion = direccion;
      this.telefono = telefono;
      this.email = email;
      this.fechaFallecimiento = fechaFallecimiento;
      this.actaDefuncion = actaDefuncion;
    }
  }
  class Rol {
    constructor(idRol, nombre) {
      this.idRol = idRol;
      this.nombre = nombre;
    }
  }

  let roles = [
    new Rol(1, "Paciente"),
    new Rol(2, "Medico"),
    new Rol(3, "Enfermero"),
  ];
  
  class PersonaRol {
    static ultimoId = 0;
    constructor(idPersona, idRol) {
      this.idPersonaRol = ++PersonaRol.ultimoId;
      this.idPersona = idPersona;
      this.idRol = idRol;
    }
  }
  class MedicoDetalles {
    constructor(idPersona, idEspecialidad, matricula)  {
      this.idPersona = idPersona;
      this.idEspecialidad = idEspecialidad;
      this.matricula = matricula;
    }
  }
  class PacienteDetalles {
    constructor(idPersona, cobertura, contactoEmergencia) {
      this.idPersona = idPersona;
      this.cobertura = cobertura;
      this.contactoEmergencia = contactoEmergencia;
    }
  }

  class EnfermeroDetalles {
    constructor(idPersona, turno) {
      this.idPersona = idPersona;
      this.turno = turno;
    }
  }

class Especialidad {
    constructor(idEspecialidad, nombre) {
        this.idEspecialidad = idEspecialidad;
        this.nombre = nombre;
    }
}

class Turno {
    constructor(idTurno, denominacionTurno) {
        this.idTurno = idTurno;
        this.denominacionTurno = denominacionTurno; 
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

let especialidades = [
    new Especialidad(1, "Anestesiología"),
    new Especialidad(2, "Alergología"),
    new Especialidad(3, "Angiología"),
    new Especialidad(4, "Cardiología"),
    new Especialidad(5, "Cirugía General"),
    new Especialidad(6, "Cirugía Plástica y Estética"),
    new Especialidad(7, "Cirugía Vascular"),
    new Especialidad(8, "Dermatología"),
    new Especialidad(9, "Endocrinología"),
    new Especialidad(10, "Gastroenterología"),
    new Especialidad(11, "Ginecología y Obstetricia"),
    new Especialidad(12, "Hematología"),
    new Especialidad(13, "Infectología"),
    new Especialidad(14, "Medicina Interna"),
    new Especialidad(15, "Medicina de Urgencias"),
    new Especialidad(16, "Medicina Familiar y General"),
    new Especialidad(17, "Medicina Laboral"),
    new Especialidad(18, "Medicina Preventiva y Salud Pública"),
    new Especialidad(19, "Nefrología"),
    new Especialidad(20, "Neumonología"),
    new Especialidad(21, "Neurología"),
    new Especialidad(22, "Nutrición"),
    new Especialidad(23, "Odontología"),
    new Especialidad(24, "Oncología"),
    new Especialidad(25, "Oftalmología"),
    new Especialidad(26, "Otorrinolaringología"),
    new Especialidad(27, "Pediatría"),
    new Especialidad(28, "Psiquiatría"),
    new Especialidad(29, "Reumatología"),
    new Especialidad(30, "Traumatología y Ortopedia"),
    new Especialidad(31, "Urología"),
    new Especialidad(32, "Radiología"),
    new Especialidad(33, "Tocoginecología"),
    new Especialidad(34, "Fisiatría"),
    new Especialidad(35, "Medicina Física y Rehabilitación"),
    new Especialidad(36, "Flebología"),
    new Especialidad(37, "Gerontología"),
    new Especialidad(38, "Psicología"),
    new Especialidad(39, "Bioquímica Clínica")
];

let turnos = [
    new Turno(1, "Mañana"),
    new Turno(2, "Tarde"),
    new Turno(3, "Noche")
];

const personas = [];

const personaRoles = [];

const medicoDetalles = [];
const pacienteDetalles = [];
const enfermeroDetalles = [];


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


document.addEventListener("DOMContentLoaded", () => {
    
    const tipoPersona = document.getElementById("tipoPersona");
    
    const camposPaciente = document.getElementById("camposPaciente");
    const camposMedico = document.getElementById("camposMedico");
    const camposEnfermero = document.getElementById("camposEnfermero");

    const form = document.getElementById("formPersona");
    const inputdocumento = document.getElementById("documento");

    const btnBuscar = document.getElementById("btnBuscar");
    const btnModificar = document.getElementById("btnModificar");
    const btnRegistrar = document.getElementById("btnRegistrar");
    
    const mensajeBusqueda = document.getElementById("mensajes");
    
    const selectCobertura = document.getElementById("idCobertura");
    const selectEspecialidad = document.getElementById("idEspecialidad");
    const selectTurno = document.getElementById("idTurno");
    const tituloRegistro = document.getElementById("tituloRegistro");   

    //de acuerdo de que indice del menu hizo el llamado, nombrar el registro
    //además, deberiamos seleccionar el tipo correspondiente y bloquearlo

    especialidades.forEach(especialidad => {
      let option = document.createElement("option");
      option.value = especialidad.idEspecialidad;
      option.textContent = especialidad.nombre;
      selectEspecialidad.appendChild(option);
    });

    turnos.forEach(turno => {
        let option = document.createElement("option");
        option.value = turno.idTurno;
        option.textContent = turno.denominacionTurno;
        selectTurno.appendChild(option);
      });

    coberturas.forEach(cobertura => {
        let option = document.createElement("option");
        option.value = cobertura.idCobertura;
        option.textContent = cobertura.denominacion;
        selectCobertura.appendChild(option);
    });


    //este metodo deberia adaptarse para mostrar los campos correspondientes

    tipoPersona.addEventListener("change", () => {
        const valor = tipoPersona.value;
    
        camposPaciente.style.display = (valor === "Paciente") ? "block" : "none";
        camposMedico.style.display = (valor === "Medico") ? "block" : "none";
        camposEnfermero.style.display = (valor === "Enfermero") ? "block" : "none";

        if (valor === "Paciente") {
            document.getElementById("camposPaciente").style.display = "grid";
          } else if (valor === "Medico") {
            document.getElementById("camposMedico").style.display = "grid";
          } else if (valor === "Enfermero") {
            document.getElementById("camposEnfermero").style.display = "grid";
          }

    });

    tipoPersona.dispatchEvent(new Event("change"));


    bloquearCamposFormulario();

    btnBuscar.addEventListener("click", () => {
        const documento = inputdocumento.value;
        const tipo = tipoPersona.value;
    
        console.log(documento);
    
        if (documento === "" || documento === "0" || isNaN(documento) || !/^\d{1,9}$/.test(documento)) {
            mostrarMensaje('El documento debe contener solo números y tener hasta 9 dígitos.', 0);
            inputdocumento.focus();
            return false;
        }
    
        if (btnBuscar.textContent === "Nueva Búsqueda") {
            inputdocumento.value = "";
            inputdocumento.disabled = false;
            limpiarCampos();
            btnBuscar.textContent = "Buscar";
            mensajeBusqueda.textContent = '';
            inputdocumento.focus();
            return;
        }
    
        const persona = personas.find(p => p.documento === documento);
        
        if (persona) {

            const tieneRolEspecifico = personaRoles.some(pr => 
                pr.idPersona === persona.idPersona && 
                roles.find(r => r.idRol === pr.idRol).nombre.toLowerCase() === tipo.toLowerCase()
            );
    
            if (tieneRolEspecifico || confirmarBusquedaSinRol(tipo)) {

                form.apellidoNombres.value = persona.apellidoNombres;
                form.fechaNacimiento.value = persona.fechaNacimiento;
                form.sexo.value = persona.sexo;
                form.direccion.value = persona.direccion;
                form.telefono.value = persona.telefono;
                form.email.value = persona.email;
    
                if (tipo === "Paciente") {
                    const pacienteDetalle = pacienteDetalles.find(pd => pd.idPersona === persona.idPersona);
                    if (pacienteDetalle) {
                        form.idCobertura.value = pacienteDetalle.cobertura;
                        form.contactoEmergencia.value = pacienteDetalle.contactoEmergencia;
                    }
                } 
                else if (tipo === "Medico") {
                    const medicoDetalle = medicoDetalles.find(md => md.idPersona === persona.idPersona);
                    if (medicoDetalles) {
                        form.idEspecialidad.value = medicoDetalles.idEspecialidad;
                        form.matricula.value = medicoDetalles.matricula;
                    }
                } 
                else if (tipo === "Enfermero") {
                    const enfermeroDetalle = enfermeroDetalles.find(ed => ed.idPersona === persona.idPersona);
                    if (enfermeroDetalle) {
                        form.idTurno.value = enfermeroDetalle.idTurno;
                    }
                }
    
                mensajeBusqueda.textContent = '';
                bloqueardocumento();
                

                if (tieneRolEspecifico) {
                    bloquearCamposFormulario();
                    btnModificar.disabled = false;
                    btnRegistrar.disabled = true;
                } else {
                    desbloquearCamposFormulario();
                    btnModificar.disabled = true;
                    btnRegistrar.disabled = false;
                }
    
            } else {

                limpiarCampos();
                inputdocumento.focus();
            }
        } else {

            limpiarCampos();
            bloqueardocumento();
    
            Swal.fire({
                title: 'No Registrado',
                html: `El n° de documento ingresado no se encuentra registrado en el sistema.<br>Puede proceder a registrar los datos.`,
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
    
    function confirmarBusquedaSinRol(tipo) {
        return Swal.fire({
            title: `Persona Registrada sin Rol de ${tipo.toUpperCase()} `,
            html: `La persona ingresada no está registrada como ${tipo.toUpperCase()}.<br>¿Desea continuar y asignarle este rol?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, continuar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            return result.isConfirmed;
        });
    }
    

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
    
                const tipo = tipoPersona.value;
                const documento = form.documento.value;
                
                const datosPersona = {
                    apellidoNombres: form.apellidoNombres.value,
                    documento: documento,
                    fechaNacimiento: form.fechaNacimiento.value,
                    sexo: form.sexo.value,
                    direccion: form.direccion.value,
                    telefono: form.telefono.value,
                    email: form.email.value,
                    fechaFallecimiento: null,
                    actaDefuncion: null
                };
    
                const personaExistente = personas.find(p => p.documento === documento);
                
                if (personaExistente) {

                    
                    Object.assign(personaExistente, datosPersona);
                    
                    // 2. Actualizar detalles específicos según el tipo
                    if (tipo === "Paciente") {
                        const pacienteDetalle = pacienteDetalles.find(pd => pd.idPersona === personaExistente.idPersona);
                        if (pacienteDetalle) {
                            pacienteDetalle.cobertura = form.idCobertura.value;
                            pacienteDetalle.contactoEmergencia = form.contactoEmergencia.value;
                        } else {
                            // Si no tenía detalles de paciente pero ahora es paciente, crearlos
                            const nuevoPaciente = new PacienteDetalles(
                                personaExistente.idPersona,
                                form.idCobertura.value,
                                form.contactoEmergencia.value
                            );
                            pacienteDetalles.push(nuevoPaciente);
                            console.log(nuevoPaciente);
                            
                            if (!personaRoles.some(pr => pr.idPersona === personaExistente.idPersona && pr.idRol === 1)) {
                                const nuevoRol = new PersonaRol(
                                    personaExistente.idPersona,
                                    1 
                                );
                                personaRoles.push(nuevoRol);
                                console.log(nuevoRol);
                            }
                        }
                    } 
                    else if (tipo === "Medico") {
                        const medicoDetalle = medicoDetalles.find(md => md.idPersona === personaExistente.idPersona);
                        if (medicoDetalle) {
                            medicoDetalle.idEspecialidad = form.idEspecialidad.value;
                            medicoDetalle.matricula = form.matricula.value;
                        } else {
            
                            const nuevoMedico = new MedicoDetalles(
                                personaExistente.idPersona,
                                form.idEspecialidad.value,
                                form.matricula.value
                            );
                            medicoDetalles.push(nuevoMedico);
                            console.log(nuevoMedico);

                            if (!personaRoles.some(pr => pr.idPersona === personaExistente.idPersona && pr.idRol === 2)) {
                                const nuevoRol = new PersonaRol(
                                    personaExistente.idPersona,
                                    2 
                                );
                                personaRoles.push(nuevoRol);
                                console.log(nuevoRol);
                            }
                        }
                    } 
                    else if (tipo === "Enfermero") {
                        const enfermeroDetalle = enfermeroDetalles.find(ed => ed.idPersona === personaExistente.idPersona);
                        if (enfermeroDetalle) {
                            enfermeroDetalle.idTurno = form.idTurno.value;
                        } else {
                            const nuevoEnfermero = new EnfermeroDetalles(
                                personaExistente.idPersona,
                                form.idTurno.values
                            );
                            enfermeroDetalles.push(nuevoEnfermero);
                            console.log(nuevoEnfermero);    
                            
                            if (!personaRoles.some(pr => pr.idPersona === personaExistente.idPersona && pr.idRol === 3)) {
                                const nuevoRol = new PersonaRol(
                                    personaExistente.idPersona,
                                    3 
                                                                );
                                personaRoles.push(nuevoRol);
                                console.log(nuevoRol);
                            }
                        }
                    }
    
                    Swal.fire({
                        title: '¡Registro exitoso!',
                        text: 'Se ha registrado exitosamente.',
                        icon: 'success',
                        confirmButtonText: 'Entendido'
                      });
                      

                } else {
                    // Alta nueva
                    const datosEspecificos = {};
                    
                    if (tipo === "Paciente") {
                        datosEspecificos.cobertura = form.idCobertura.value;
                        datosEspecificos.contactoEmergencia = form.contactoEmergencia.value;
                    } else if (tipo === "Medico") {
                        datosEspecificos.idEspecialidad = form.idEspecialidad.value;
                        datosEspecificos.matricula = form.matricula.value;
                    } else if (tipo === "Enfermero") {
                        datosEspecificos.idTurno = form.idTurno.value;
                    }
                    
                    altaPersona(tipo, datosPersona, datosEspecificos);
                    
                    Swal.fire({
                        title: '¡Registro exitoso!',
                        text: 'Se ha registrado exitosamente.',
                        icon: 'success',
                        confirmButtonText: 'Entendido'
                      });
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
        form.idEspecialidad.value = "";
        form.matricula.value = "";
        form.idTurno.value = "";
    }
});

function altaPersona(tipoPersona, datosPersona, datosEspecificos) {

    if (!tipoPersona || !datosPersona || !datosEspecificos) {
        throw new Error("Faltan parámetros requeridos");
    }

    const existePersona = personas.some(p => p.documento === datosPersona.documento);
    if (existePersona) {
        throw new Error("Ya existe una persona con este documento");
    }

    const nuevaPersona = new Persona(
        datosPersona.apellidoNombres,
        datosPersona.documento,
        datosPersona.fechaNacimiento,
        datosPersona.sexo,
        datosPersona.direccion,
        datosPersona.telefono,
        datosPersona.email,
        datosPersona.fechaFallecimiento || null,
        datosPersona.actaDefuncion || null
    );
    
    personas.push(nuevaPersona);
    console.log(nuevaPersona);

    let idRol;
    switch(tipoPersona.toLowerCase()) {
        case "medico":
            idRol = 2; 
            break;
        case "enfermero":
            idRol = 3; 
            break;
        case "paciente":
            idRol = 1; 
            break;
        default:
            throw new Error("Tipo de persona no válido");
    }
    
    const nuevoRol = new PersonaRol(
        nuevaPersona.idPersona,
        idRol
    );
    
    personaRoles.push(nuevoRol);
    console.log(nuevoRol);
    
    let detallesCreados;
    switch(tipoPersona.toLowerCase()) {
        case "medico":
            if (!datosEspecificos.idEspecialidad || !datosEspecificos.matricula) {
                throw new Error("Faltan datos específicos para médico");
            }
            const nuevoMedico = new MedicoDetalles(
                nuevaPersona.idPersona,
                datosEspecificos.idEspecialidad,
                datosEspecificos.matricula
            );
            medicoDetalles.push(nuevoMedico);
            console.log(nuevoMedico);   
            detallesCreados = nuevoMedico;
            break;
            
        case "enfermero":
            if (!datosEspecificos.idTurno) {
                throw new Error("Falta el turno para enfermero");
            }
            const nuevoEnfermero = new EnfermeroDetalles(
                nuevaPersona.idPersona,
                datosEspecificos.idTurno
            );
            enfermeroDetalles.push(nuevoEnfermero);
            console.log(nuevoEnfermero);
            detallesCreados = nuevoEnfermero;
            break;
            
        case "paciente":
            if (!datosEspecificos.cobertura) {
                throw new Error("Falta la cobertura para paciente");
            }
            const nuevoPaciente = new PacienteDetalles(
                nuevaPersona.idPersona,
                datosEspecificos.cobertura,
                datosEspecificos.contactoEmergencia || ""
            );
            pacienteDetalles.push(nuevoPaciente);
            console.log(nuevoPaciente);
            detallesCreados = nuevoPaciente;
            break;
            
        default:
            console.log("Tipo de persona no soportado");
            throw new Error("Tipo de persona no soportado");
    }
    
    return {
        persona: nuevaPersona,
        rol: nuevoRol,
        detalles: detallesCreados,
        tipo: tipoPersona.toLowerCase()
    };
}

/*
function obtenerNuevoIdPersona() {
    if (personas.length === 0) {
        return 1;
    }
    return Math.max(...personas.map(p => p.idPersona)) + 1;
}
*/

function obtenerPersonaPorDocumento(documento) {
    return personas.find(p => p.documento === documento);
}


function obtenerRolesDePersona(idPersona) {
    return personaRoles
        .filter(pr => pr.idPersona === idPersona)
        .map(pr => roles.find(r => r.idRol === pr.idRol));
}


function obtenerDetallesPersona(idPersona) {
    const rolesPersona = obtenerRolesDePersona(idPersona);
    
    if (rolesPersona.some(r => r.nombre === "Medico")) {
        return medicoDetalles.find(md => md.idPersona === idPersona);
    } else if (rolesPersona.some(r => r.nombre === "Enfermero")) {
        return enfermeroDetalles.find(ed => ed.idPersona === idPersona);
    } else if (rolesPersona.some(r => r.nombre === "Paciente")) {
        return pacienteDetalles.find(pd => pd.idPersona === idPersona);
    }
    
    return null;
}

function obtenerInformacionCompleta(documento) {
    const persona = obtenerPersonaPorDocumento(documento);
    if (!persona) return null;
    
    const roles = obtenerRolesDePersona(persona.idPersona);
    const detalles = obtenerDetallesPersona(persona.idPersona);
    
    return {
        persona,
        roles,
        detalles
    };
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
        "contactoEmergencia", "idEspecialidad","matricula","idTurno"
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
        "contactoEmergencia", "idEspecialidad","matricula","idTurno"
    ];

    campos.forEach(id => {
        const campo = document.getElementById(id);
        if (campo) {
            campo.disabled = false;       
        }
    });
}
