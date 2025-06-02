# Admisión Hospitalaria - Trabajo Práctico Integrador para WEB II - 2025
- Manuel Facundo Martin Garcia

El sistema para la Admisión Hospitalaria, en su primera etápa, permite registrar el proceso de internación de un paciente en un nosocomio.
La idea general del proyecto, es también incorporar los datos médicos concernientes al proceso de internación, como los medicamentos dispensados, estudios realizados, etc.

En el proceso de programación del mismo, me encontré con la principal dificultad de comprender (cambiar la cabeza, en realidad) el frontend / backend, ya que siempre me dediqué a trabajar, desde hace varios años, con la programación clásica, que no estaba orientado a este tipo de desarrollos. De igual forma, creo que entendí los conceptos, y me siento muy contento con los resultados obtenidos del cursado, ya que fué principalmente mi objetivo al inscribirme en en esta carrera: programar sistemas WEB. 

## 🚀 Características

- ✅ Registro de Profesionales: Médicos / Enfermeros:
En cada uno de los apartados, podremos registrar los profesionales existentes en nuestro ámbito, o que puedan
llegar a hacer solicitudes que precisen ser procesadas por nuestro sistema informático. 
Cada uno de ellos, deberá ser guardado con su número de matricula profesional como valor único.
Además, si es necesario, pueden activarse / desactivarse para permitir o restringir la aceptación de información
(pedidos) por parte de ellos en nuestro sistema.
  

- ✅ Registro de Pacientes:
Mediante el número de documento, identificamos a los pacientes que acuden al nosocomio. Este dato es único, y a partir de su ingreso, accedemos al resto de sus datos, si existe, o podemos completarlos si no existe. En este apartado, también especificamos que cobertura de obra social tiene, además de permitir ingresar algún dato de contacto ante emergencia.
    
- ✅ Listado de Pacientes registrados en el Sistema. 
Como su nombre lo indica, podemos ver todos los pacientes que tenemos registrados en nuestro sistema, con sus datos principales.
  
- ✅ Admisión e Internación del Paciente registrado:
Desde este apartado, daremos ingreso al Paciente previamente registrado en "Pacientes Legajos", para su posterior
internación. Son datos necesarios para este proceso: Origen del pedido de internación, Profesional Médico que hace el pedido, y el Diagnóstico asociado. El sistema tomará automáticamente la fecha y hora del procedimiento, evitando asi cualquier inconsistencia con la trazabilidad de la acción.

- Asignación de Cama: Luego de seleccionar la unidad donde se debe internar al paciente, el sistema evaluará las camas disponibles, teniendo en cuenta
el proceso de validación solicitado: evitar que pacientes de distinto sexo puedan internarse en una misma habitacion. Luego de la correspondiente selección,
el sistema informa el detalle completo de su asignación (Unidad / Ala / Habitación / N° Cama).

- Es posible cancelar asignación de la ultima cama asignada, volviendo a la anterior asignacion de cama, SIEMPRE QUE LA ESTA CAMA ANTERIOR no haya sido OCUPADA POR OTRO PACIENTE.

- Asi mismo, es posible CANCELAR LA INTERNACIÓN, siempre que no existan movimientos dentro de la historia clinica del paciente durante la internación, relacionado a ella. Esta aclaración se le realiza al usuario al momento de confirmar la internación.
  
- ✅ Observación de la infraestructura disponible a través del "Listado de Ocupación de Camas", donde es posible observar la estructura habitacional con sus respectivos pacientes internados, como asi tambíen nos permite "buscar" algun paciente a través de sus datos personales (DNI, Apellido, Etc).

- Características a incorporar en la siguiente versión:
- *-* Registrar las evaluaciones que realiza el enfermero afectado a la internacion.
- *-* Registrar las observaciones y pedidos que realiza el personal médico que atiende al paciente durante su internacion: evaluaciones, estudios/analisis solicitados, medicamentos prescriptos, terapias, etc  .
- *-* Detalle de Historia Clinica con toda la información que se ha registrado al paciente.

## 🛠️ Tecnologías utilizadas

- Javascript
- PUG / BOOSTSRAP
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

Acceso al video de muestra:
https://vimeo.com/1089680089/a134ca2139

Repositorio Railway:
https://hospitalweb2-production.up.railway.app


