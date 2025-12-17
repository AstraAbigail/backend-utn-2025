# Backends UTN 2025

Este proyecto es un prototipo para una empresa que desea usar internamente un sistema para incoorporar los pedidos que le llegan de su tienda online SADARTSA.

# Tecnologias

Backend desarrollado en Node.js + Express, con conexión a MongoDB.

## Instrucciones para instalacion y ejecucion -> local

1. Clona el repositorio: https://github.com/AstraAbigail/backend-utn-2025
2. Ingresar a la carpeta y ejecutar en la terminal para instalar las dependencias -> npm install.
3. Crear el archivo .env e incooporar las variables correspondientes que se encuentran en el archivo .env.example
4. Ejecutar la aplicacion con, npm run dev

## Instrucciones producción

Backend Online: https://backend-utn-2025.onrender.com
Frontend Online: https://frontend-utn-2025.vercel.app/

Ejecutar npm run build
Ejecutar npm start

## Endpoints

### Autenticación

(POST)

- Registro de usuario /api/auth/register
- Login de usuario /api/auth/login
- Forgot Password /api/auth/forgot-password
- Reset Password api/auth/reset-password

### Resto

(GET)

- Obtener todos los pedidos /api/pedidos
- Obtener pedido por ID /api/pedidos/:id |

(POST)

- Crear pedido /api/pedidos

(PATCH)

- Actuzlizar pedido /api/pedidos/:id

(DELETE)

- Eliminar pedido api/pedidos/:id
