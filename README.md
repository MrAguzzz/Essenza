# Essenza | Perfumería Online

## Descripción

Essenza es una aplicación web interactiva que simula una tienda online de perfumes de diseñador y árabes. Fue desarrollada como proyecto final del curso de JavaScript, aplicando manipulación del DOM, asincronismo, funciones de orden superior y persistencia de datos.

## Funcionalidades

- Catálogo dinámico de 12 perfumes.
- Búsqueda por nombre y marca.
- Filtrado por categoría.
- Ordenamiento por precio.
- Carrito de compras interactivo.
- Modificación de cantidades y eliminación de productos.
- Cálculo automático del total.
- Persistencia del carrito mediante localStorage.
- Formulario de datos del comprador y validaciones.
- Confirmación de compra con SweetAlert2.
- Generación de comprobante y almacenamiento local del último pedido.

## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript
- JSON
- Fetch API y async/await
- localStorage
- SweetAlert2

## Ejecución

1. Descargar o clonar el repositorio.
2. Abrir la carpeta del proyecto en Visual Studio Code.
3. Iniciar un servidor local, por ejemplo con Live Server.
4. Abrir index.html desde el servidor local.

El servidor local permite que fetch cargue correctamente el archivo JSON.

## Funcionamiento

Los productos se almacenan en `data/productos.json` y se cargan dinámicamente mediante Fetch.

El usuario puede buscar productos, agregarlos al carrito y modificar su selección. El carrito se almacena en localStorage para conservar su contenido entre sesiones.

Al finalizar la compra, se solicitan los datos del comprador y se muestra un resumen. Una vez confirmado, se registra un pedido simulado y se vacía el carrito.

## Aclaración

Este proyecto es una simulación educativa. No procesa pagos reales ni envía pedidos a una empresa.

## Autor

Agustín Molinari proyecto final de javaScript — Essenza
