# Documento Diseño y Análisis Funcional

### BLOCKTICK



HOJA DE CONTROL



|**Proyecto**|BlockTick - Compra venta de tickets y creación de eventos|||
| :- | :- | :- | :- |
|**Entregable**|Documento diseño y análisis funcional|||
|**Autor**|[Ana Ndongo]|||
|**Versión/Edición**|0100|**Fecha Versión**|24/09/2023|



REGISTRO DE CAMBIOS


|**Versión**|**Motivo del Cambio**|**Responsable del Cambio**|**Fecha**|
| :- | :- | :- | :- |
|**001**|Versión inicial|Ana Ndongo|01/03/2023|
|||||



# Contenido
[1	Introducción](#_toc132831724)

[1.1	Objetivos](#_toc132831725)

[2	Especificación de Casos de uso del Sistema](#_toc132831726)

[2.1	Actores del sistema	](#_toc132831727)

[2.2	Listado Casos de uso del Sistema](#_toc132831728)

[2.3	Diagrama UML](#_toc132831729)

[2.4	Diagrama de secuencia	](#_toc132831730)

[2.5	Interfaces y pantallas](#_toc132831731)

[3	Detalle Casos de uso del Sistema](#_toc132831732)

[4	Entidades del sistema](#_toc132831733)

[4.1	Descripción entidades del sistema](#_toc132831734)

[5	Definición de Smart Contracts	](#_toc132831735)



# <a name="_toc97314074"></a><a name="_toc132831724"></a>**Introducción**
El presente proyecto presenta una plataforma web en el que las propietarias de salas o grupos que hagan bolos en estas salas puedan promocionar sus bolos, de esta plataforma se excluyen cualquier otro recinto que no sea una sala de conciertos.

La tecnología de blockchain presenta la ventaja de ser una plataforma que puede acabar con la reventa en el caso de grandes eventos, pero este proyecto pretende dar la oportunidad a pequeños eventos en los que las personas puedan interactuar directamente con el promotor de dicho evento sin necesidad de intermediarios que puedan encarecer el servicio ofrecido.

## <a name="_toc132831725"></a>***Objetivos***


La dAPP descrita a continuación será una plataforma donde las personas usuarias interesadas podrán crear eventos y poner a la venta tickets (NFT) que podrán ser vendidos/intercambios en dicha plataforma a otros usuarios interesados en la asistencia a dicho evento



` `Documento diseño y análisis funcional![](./img/Aspose.Words.bf69a840-4be1-487b-83a4-e77a894902c9.002.png) - Proyecto 
 # <a name="_toc97314077"></a><a name="_toc132831726"></a>**Especificación de Casos de uso del Sistema**
## <a name="_toc97314078"></a><a name="_toc132831727"></a>***Actores del sistema***
Definición de usuarios (o perfiles de usuario) que interactuarán en el sistema


|**1**|*Nombre Rol*|
| :- | :- |
|**Descripción**|Usuario interesado – promotora de conciertos en salas exclusivamente (**promoter**)|
|**Comentarios**|<p>*Persona física o jurídica que promueve un evento o espectáculo y lo publicita* </p><p>*Para venta de entrada dentro de la plataforma*</p><p></p>|


|**2**|*Nombre Rol*|
| :- | :- |
|**Descripción**|Usuario interesado – persona asistente al evento (**customer**)|
|**Comentarios**|*Persona física que quiere asistir a un evento musical*|

## <a name="_toc97314079"></a><a name="_toc132831728"></a>***Listado Casos de uso del Sistema***

|**Código**|**Descripción**|**Prioridad**|**Dependencia**|
| :- | :- | :- | :- |
|CU1|*Registro de usuarios*|1|Los usuarios pueden registrarse en la plataforma utilizando su wallet.|
||*Compra de Tickets NFT*|2|Los usuarios pueden buscar eventos disponibles en la plataforma y comprar tickets NFT para los eventos que les interesen|
||*Creación de Evento*|4|Los organizadores pueden crear un evento proporcionando detalles como el nombre del evento, la fecha, la ubicación y la descripción|
||*Venta/Intercambio de Tickets NFT*|5|Intercambiar tickets con otros usuarios|
|||||



























## <a name="_toc97314081"></a><a name="_toc132831730"></a>***Diagrama de secuencia***

Este diagrama de secuencias captura las interacciones típicas que un usuario puede realizar en la plataforma, desde la creación de un evento hasta la compra de tickets, la venta e intercambio de tickets NFT, y la interacción con otras funciones importantes. Sirve como una representación visual de cómo los actores interactúan con la plataforma para lograr sus objetivos y realizar actividades relacionadas con la gestión de eventos y tickets NFT.

![](./img/Aspose.Words.bf69a840-4be1-487b-83a4-e77a894902c9.004.png)


## <a name="_toc97314082"></a><a name="_toc132831731"></a>***Interfaces y pantallas***


**Landing Page**

Prototipo de diseño para el landing page el cual invita a los usuarios a unirse,  participar y registrarse en la plataforma

![](./img/Aspose.Words.bf69a840-4be1-487b-83a4-e77a894902c9.005.png)

**Ticket page**

Prototipo de diseño para visualizar los tickets en la plataforma

![](./img/Aspose.Words.bf69a840-4be1-487b-83a4-e77a894902c9.006.png)



**Event Page**

Prototipo de diseño para visualizar los eventos dados de alta en la plataforma

![](./img/Aspose.Words.bf69a840-4be1-487b-83a4-e77a894902c9.007.png)

**Create Form**

Prototipo de diseño para visualizar la creación de eventos y que datos son necesarios para que las personas u organizaciones puedan dar de alta un evento

![](./img/Aspose.Words.bf69a840-4be1-487b-83a4-e77a894902c9.008.png)

# <a name="_toc97314083"></a><a name="_toc132831732"></a>**Detalle Casos de uso del Sistema**


|**CU1**|*Registro de Usuario*|
| :- | :- |
|**Descripción**|Los usuarios pueden registrarse en la plataforma utilizando su dirección de correo electrónico u otros métodos de autenticación|
|**Pantalla**|Landing Page|
|**Rol**|Actor|

|**CU2**|*Creación de evento*|
| :- | :- |
|**Descripción**|Los organizadores pueden crear un evento proporcionando detalles como el nombre del evento, la fecha, la ubicación y la descripción. Pueden definir la cantidad de tickets disponibles para la venta y establecer un precio en criptomonedas o tokens NFT.|
|**Pantalla**|Create Form|
|**Rol**|Actor|

|**CU3**|*Venta de Tickets*|
| :- | :- |
|**Descripción**|A través de las transacciones en la cadena de bloques, en esta caso Ethereum, mediante la wallet de Metamask los usuarios pueden crear eventos o adquirir NFTs.|
|**Pantalla**|Tickets page|
|**Rol**|Actor|






# <a name="_toc97314084"></a><a name="_toc132831733"></a>**Entidades del sistema** 
## <a name="_toc132831734"></a>***Descripción entidades del sistema***


|**1**|*Nombre entidad*|
| :- | :- |
|**Descripción**||
|**Atributos**||
|**Acciones**||
<a name="_toc97314085"></a>Diagrama Entidad Relación E/R

Diagrama de clases

![](Aspose.Words.bf69a840-4be1-487b-83a4-e77a894902c9.009.png)

# <a name="_toc97314086"></a><a name="_toc132831735"></a>**Definición de Smart Contracts**

**Descripción entidades del sistema: cada una de las partes del smartContract**


|<p>**Nombre SC:   BlockTick**</p><p>*Nombre entidad*</p>||||
| :- | :- | :- | :- |
|***atributo***|***Tipo de dato***|***descripción***||
|**ticketPrice**|*uint256*|*Define el valor del ticket*||
|**owner**|*address*|*Define la dirección del creador del contrato*||
|**ticketHolder**|*Uint256*|*Estructura de datos de tipo mapping*||
|**Nombre función**|***Parámetro entrada***|***Parámetro salida***|***Descripción***|
|**constructor**||*owner*|*El propietario del contrato es el creador del mismo*|
|**buyTickets**|*\_user, \_amount*|*\_user, \_amount*|*Requiere que el valor final sea múltiplo del valor del ticket \* su cantidad*|
|**useTickets**|*\_user, \_amount*|*\_user, \_amount*|*Describe la cantidad de tickets usados por usuario*|
|**addTickets**|*\_user, \_amount*|*\_user, \_amount*|*Transfiere tickets a cualquier address y la cantidad*|
|**subTickets**|*\_user, \_amount*|*\_user, \_amount*|*Verifica la cantidad de tickets que tienes disponible para gastar*|
|**withraw**|*N/A*||*Recupera la cantidad de tickets vendidos al owner definido en el constructor*|
|**Relación con otros SC**|**BlockTickAsset**|||
|**observaciones**||||









|<p>**Nombre SC: BlockTickAsset**</p><p>*Nombre entidad*</p>||||
| :- | :- | :- | :- |
|***atributo***|***Tipo de dato***|***descripción***||
|**eventName**|*string*|*Describe el título del evento y es de tipo público*||
|**eventPromoter**|*string*|*Describe el nombre de la promotora del evento y es de tipo público*||
|**owner**|*address*|*Describe el propietario del contrato creador del contrato (Contract Factory)*||
|**price**|*uint*|*Describe el precio de asistencia al evento y es de tipo público*||
|**Nombre función**|***Parámetro entrada***|***Parámetro salida***|***Descripción***|
|**constructor**|<p>*\_eventName, \_eventPromoter, \_owner,* </p><p>*\_price*</p>|||
|**buyTicket**|*N/A*||*Requiere que el precio se igual al creado  en el contrat, una función de tipo “payable”, que tranfiere del* |
|**getPrice**|*N/A*|*price*||
|**Relación con otros SC**|**BlockTick**|||
|**observaciones**|Este es un Contract Factory|||



