# Admisión Hospitalaria

El sistema para la Admisión Hospitalaria, permite registrar el proceso de internación de un paciente en un nosocomio.

## 📸 Captura de pantalla (opcional)

![Captura del proyecto](ruta/a/la/imagen.png)

## 🚀 Características

- ✅ Registro de Pacientes:
  
  
- ✅ Registro de Profesionales: Médicos / Enfermeros:
En cada uno de los apartados, podremos registrar los profesionales existentes en nuestro ámbito, o que puedan
llegar a hacer solicitudes que precisen ser procesadas por nuestro sistema informático. 
Cada uno de ellos, deberá ser guardado con su número de matricula profesional como valor único.
Además, si es necesario, pueden activarse / desactivarse para permitir o restringir la aceptación de información
(pedidos) por parte de ellos en nuestro sistema.
  
- ✅ Listado de Pacientes registrados en el Sistema.
  
- ✅ Admisión e Internación del Paciente registrado:
Desde este apartado, daremos ingreso al Paciente previamente registrado en "Pacientes Legajos", para su posterior
internación. Son datos necesarios para este proceso: Origen del pedido de internación, Profesional Médico que hace el pedido, y el Diagnóstico asociado. El sistema tomará automáticamente la fecha y hora del procedimiento, evitando 
asi cualquier inconsistencia con la trazabilidad de la acción.

- Asignación de Cama: Luego de seleccionar la unidad donde se debe internar al paciente, el sistema evaluará las camas disponibles, teniendo en cuenta
el proceso de validación solicitado: evitar que pacientes de distinto sexo puedan internarse en una misma habitacion. Luego de la correspondiente selección,
el sistema informa el detalle completo de su asignación (Unidad / Ala / Habitación / N° Cama).
  
- ✅ Observación de la infraestructura disponible a través del "Listado de Ocupación de Camas", donde es
- posible observar la estructura habitacional con sus respectivos pacientes internados, como asi tambíen nos
- permite "buscar" algun paciente a través de sus datos personales (DNI, Apellido, Etc).

- Características a incorporar en la siguiente versión:
- *-* Registrar las evaluaciones que realiza el enfermero afectado a la internacion.
- *-* Registrar las observaciones y pedidos que realiza el personal médico que atiende al paciente durante su internacion: evaluaciones, estudios/analisis solicitados, medicamentos prescriptos, terapias, etc  .
- *-* Detalle de Historia Clinica con toda la información que se ha registrado al paciente.

## 🛠️ Tecnologías utilizadas

- Javascript
- PUG / Css
- Node Express
- Sequelize
- MySQL

## ⚙️ Instalación

1. Clona el repositorio:

   git clone [Repositorio hospitalweb2](https://github.com/FacuMartinGarcia/hospitalweb2.git)

2. En la carpeta clonada, abre la consola e ingresa:
   node install express
   npm init -y
   node --watch app.js
