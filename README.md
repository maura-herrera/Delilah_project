# Delilah Restó
A REST API to provide delivery food services, managing CRUD products and orders usign Node.js, MySQL, and JavaScript.

## Comenzando 🚀

_Estas instrucciones te permitirán obtener una copia del proyecto en funcionamiento en tu máquina local para propósitos de desarrollo y pruebas: Primero necesitas estar seguro de tener un servidor web corriendo en tu compuradora. la manera más sencilla de lograr ésto, es usando XAMPP; de otra manera el proyecto no funcionará en tu entorno local. Acto seguido, clona el repositorio con git clone  https://github.com/maura-herrera/Delilah_project.git



### Pre-requisitos 📋

_Qué cosas necesitas para instalar el proyecto_

```

Node.js
Express
MySQL
JWT
Sequelize
Nodemon
Postman

```

### Instalación 🔧

_Una serie de ejemplos paso a paso que te dice lo que debes ejecutar para tener un entorno de desarrollo ejecutandose_

_Instala las dependencias requeridas: corre el siguiente comando, verificando previamente que estés posisionado en la carpera del proyecto_

```
npm install 

```

_Prepara la base de datos: Para ello, necesitas editar la ruta de la constante 'sequelize', declarada en los archivos 'server.js' y 'middlewares.js'. Recuerda la estructura de la ruta (mysql://user:password@host:port/database). Luego exporta el contenido del archivo 'delilah.sql' en tu manejador de base de datos._


_Instala las dependencias requeridas: corre el siguiente comando, verificando previamente que estés posisionado en la carpera del proyecto_

```
npm start 

```


## Ejecutando las pruebas ⚙️

_Esta sección explica como ejecutar las pruebas para comprobar y comprender el funcionamiento de la API_

### Endpoints relacionados con usuarios (users) 🔩

_Método post: /users_
_Crea un nuevo usuario con todos los datos que deben proporcionarse a través de req.body (con formato JSON), se obtiene un json con los datos proporcionados y la respuesta  "status": "User created"; en caso de que el usuario ya exista, devolverá la respuesta error: 'Username no disponible'_


```
Method: POST
Example of route: localhost:3000/users

{
	"username": "andressepulveda",
	"email": "andressepulveda@hotmail.com",
	"name": "Andrés Sepúlveda",
	"phone": "62836258",
	"password": "contra4",
	"address": "Cll 62 #57B"
}

Si se trata de un administrador, no olvides enviar el código de rol, que es '2' para administrador, como se muestra a continuación:

{
	"username": "claravelez",
	"email": "claravelez@gmail.com",
	"name": "Clara Velez",
	"phone": "62836258",
	"password": "adminpassw",
	"address": "Cll 62 #57B",
  "code_rol": 2
}

Cuando no se especifica el parámetro "code_rol", por defecto se envía '1' y se entiende que se trata de un cliente

```

_Método post: /login_
_A través del login de usuarios, se puede verificar su rol; es decir, si el usuario es un cliente o el administrador. Para tal efecto, se envía a través de req.body (con formato JSON) los parámetros: username, email y password, luego se obtiene un token para el proceso de autorización de acuerdo al rol del usuario. En caso de que las credenciales no sean correctas, se obtendrá la respuesta  error: 'Credenciales inválidas'_


```
Method: POST
Example of route: localhost:3000/login
El uso de las siguientes credenciales, devuelven un token de cliente:

{
	"username": "andressepulveda",
	"email": "andressepulveda@hotmail.com",
	"password": "contra4"
}

El uso de las siguientes credenciales, devuelven un token de administrador, con derecho a todos los accesos:

	"username": "claravelez",
	"email": "claravelez@gmail.com",
	"password": "adminpassw"
  
```

_Método get: /users_
_Este método obtiene una lista con todos los usuarios registrados. Este acceso sólo es posible para los usuarios con rol de administrador. Por tanto, se debe hacer el get con el envío del token de administrador en el header (con key: Authorization). Recordar  escribir en postman la palabra reservada "bearer" antes del token (en el parámetro 'value'), separados por un espacio. Esta consulta debe arrojar un listado de todos los usuarios, con su información personal, en formato JSON. De no tratarse de un administrador, arrojará la respuesta error: 'No tienes autorización'_

### Endpoints relacionados con los platos o productos que ofrece el restaurante (dishes) ⌨️

_Método post: /dishes_
_A través de este método, es posible agregar nuevos platos de comida a la base de datos. Para tal efecto, se envía en el header, el token que el administrador obtiene al loguearse. También debe enviarse la información del plato que se desea agregar en formato JSON en el body, como se muestra a continuación. Si el envío es exitoso, devuelve la respuesta status: 'Dish created' _


```
Method: POST
Example of route: localhost:3000/dishes

{
	"dish":"Costillas a la parrilla",
	"price":"500"
	
}
  
```

_Método get: /dishes_
_A través de este método, es posible obtener una lista con todos los platos de comida existentes. Para tal efecto, se envía en el header, el token que el usuario (sea administrador o cliente) obtiene al loguearse. Si el get es exitoso, devuelve una lista en formato JSON como se muestra a continuación' _


```
Method: GET
Example of route: localhost:3000/dishes

Response:

[
    {
        "id_dish": 2,
        "dish": "Focaccia",
        "price": 300
    },
    {
        "id_dish": 3,
        "dish": "Limonada fresca",
        "price": 100
    },
    {
        "id_dish": 4,
        "dish": "Bagel de salmón",
        "price": 425
    },
    {
        "id_dish": 5,
        "dish": "Hamburguesa clásica",
        "price": 350
    }
 
]
```

_Método PUT: /dishes_
_A través de este método, es posible cambiar información de los platos de comida existentes. Para tal efecto, se envía en el header, el token que el administrador obtiene al loguearse. Adicionalmente, en el body (en formato JSON) deberá enviarse el id del producto, el nuevo nombre (si aplica) o el nuevo precio. Si el put es exitoso, devuelve la respuesta "status": "Dish update successful"_

```
Method: PUT
Example of route: localhost:3000/dishes

{
  "id_dish":1,
	"dish":"Costillas a la parrilla con BBQ",
	"price":"350"
	
}
  
```

_Método DELETE: /dishes_
_A través de este método, es posible eliminar alguno de los platos de comida existentes. Para tal efecto, se envía en el header, el token que el administrador obtiene al loguearse. Adicionalmente, en el body (en formato JSON) deberá enviarse el id del producto; internamente se verifica si el id existe o no. Si el delete es exitoso, devuelve la respuesta status: 'Dish delete' _

```
Method: DELETE
Example of route: localhost:3000/dishes

{
  "id_dish":1,
}
  
```

## Endpoints relacionados con órdenes 📦

_Método POST: /orders_
_A través de este método, es posible realizar una orden con uno o varios de los platos ofrecidos por el restaurante, también es posible elegir entre los métodos de pago. Para tal efecto, se envía en el header, el token que el usuario obtiene al loguearse. Adicionalmente, en el body (en formato JSON) deberá enviarse el id del método de pago y los id de los platos de comida que se van a solicitar. Si el post de la orden es exitoso, devuelve la respuesta  status: 'Order created'_

```
id de los métodos de pago disponibles:

	(1, 'Credit'),
	(2, 'Debit'),
	(3, 'Cash'),
	(4, 'PSE');
  
Method: POST
Example of route: localhost:3000/dishes
   
{
	"id_paymethod": 2,
	"id_dishes": ["1","3","2"]

}

``` 

_Método GET: /myOrders_
_A través de este método, es posible obtener una lista con todas las órdenes (si se trata del administrador) o con las órdenes realizadas por un usuario (si se trata de un cliente). Para tal efecto, se envía en el header, el token que el usuario (sea administrador o cliente) obtiene al loguearse. Si el get es exitoso, devuelve una lista en formato JSON como se muestra a continuación' _


```
Method: GET
Example of route: localhost:3000/myOrders

Response (for admin account):

[
    {
        "state": "preparando",
        "hour": "09:09:34",
        "id_O": 1,
        "description": "Limonada fresca, Hamburguesa clásica",
        "method": "Cash",
        "total": "450",
        "name": "Maura Herrera",
        "address": "Cra 23#56A"
    },
    {
        "state": "confirmado",
        "hour": "09:20:09",
        "id_O": 2,
        "description": "Malteada de frutos del bosque",
        "method": "PSE",
        "total": "180",
        "name": "Carolina Linarez",
        "address": "Cll 56-A"
    },
    {
        "state": "nuevo",
        "hour": "10:31:54",
        "id_O": 3,
        "description": "Bagel de salmón, Focaccia, Limonada fresca",
        "method": "Debit",
        "total": "825",
        "name": "Andrés Sepúlveda",
        "address": "Cll 62 #57B"
    }
]

```

_Método PUT: /orders_
_A través de este método, es posible cambiar el estado o status de la orden. Para tal efecto, se envía en el header, el token que el administrador obtiene al loguearse. Adicionalmente, en el body (en formato JSON) deberá enviarse el id de la orden y el id del status. Si el put de la orden es exitoso, devuelve la respuesta: 'Order status update successful'_

```
id de los estados de orden disponibles:

	(1, 'nuevo'),
	(2, 'confirmado'),
	(3, 'preparando'),
	(4, 'enviando'),
	(5, 'cancelado'),
	(6, 'entregado');
  
Method: PUT
Example of route: localhost:3000/orders
   
{
	"id_O": 2,
	"code_status":6
}

``` 

_Método DELETE: /orders_
_A través de este método, es posible eliminar una orden por id. Para tal efecto, se envía en el header, el token que el administrador obtiene al loguearse. Adicionalmente, en el body (en formato JSON) deberá enviarse el id de la orden. Si el delete de la orden es exitoso, devuelve la respuesta: "status": "Order deleted"_

```
Method: DELETE
Example of route: localhost:3000/orders


{
	"id_O":1
}

```


---
⌨️ con ❤️ por [maura-herrera](https://github.com/maura-herrera) 😊
