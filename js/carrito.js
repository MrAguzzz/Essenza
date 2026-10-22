"use strict";

const botonCarrito = document.getElementById("btn-carrito");
const panelCarrito = document.getElementById("panel-carrito");
const botonCerrarCarrito = document.getElementById("cerrar-carrito");
const contenedorItems = document.getElementById("items-carrito");
const contadorCarrito = document.getElementById("contador-carrito");
const totalCarrito = document.getElementById("total-carrito");
const botonVaciarCarrito = document.getElementById("vaciar-carrito");
const botonFinalizarCompra = document.getElementById("finalizar-compra");

const CLAVE_STORAGE = "essenza_carrito";

let catalogoCarrito = [];
let carrito = [];

function cargarCarritoGuardado() {
    try {
        const datosGuardados = localStorage.getItem(CLAVE_STORAGE);

        const datos = JSON.parse(datosGuardados || "[]");

        carrito = Array.isArray(datos)
            ? datos.filter(item =>
                Number.isInteger(item.id) &&
                Number.isInteger(item.cantidad) &&
                item.cantidad > 0
            )
            : [];

    } catch (error) {
        carrito = [];
        console.error("Error al recuperar el carrito:", error);
    }
}

function guardarCarrito() {
    try {
        if (carrito.length === 0) {
            localStorage.removeItem(CLAVE_STORAGE);
        } else {
            localStorage.setItem(
                CLAVE_STORAGE,
                JSON.stringify(carrito)
            );
        }
    } catch (error) {
        console.error("No se pudo guardar el carrito:", error);
    }
}

function buscarProducto(id) {
    return catalogoCarrito.find(producto => producto.id === id);
}

function agregarAlCarrito(id) {
    const producto = buscarProducto(id);

    if (!producto) {
        return;
    }

    const itemExistente = carrito.find(item => item.id === id);

    if (itemExistente) {
        itemExistente.cantidad++;
    } else {
        carrito.push({
            id: id,
            cantidad: 1
        });
    }

    actualizarCarrito();
    abrirCarrito();
}

function modificarCantidad(id, cambio) {
    const item = carrito.find(producto => producto.id === id);

    if (!item) {
        return;
    }

    item.cantidad += cambio;

    if (item.cantidad <= 0) {
        eliminarDelCarrito(id);
        return;
    }

    actualizarCarrito();
}

function eliminarDelCarrito(id) {
    carrito = carrito.filter(item => item.id !== id);

    actualizarCarrito();
}

function vaciarCarrito() {
    carrito = [];

    actualizarCarrito();
}

function calcularTotal() {
    return carrito.reduce((total, item) => {
        const producto = buscarProducto(item.id);

        if (!producto) {
            return total;
        }

        return total + producto.precio * item.cantidad;
    }, 0);
}

function renderizarCarrito() {
    contenedorItems.innerHTML = "";

    const cantidadTotal = carrito.reduce(
        (acumulador, item) => acumulador + item.cantidad,
        0
    );

    contadorCarrito.textContent = cantidadTotal;

    if (carrito.length === 0) {
        contenedorItems.innerHTML = `
            <p class="carrito-vacio">
                Tu carrito está vacío.
            </p>
        `;
    } else {
        carrito.forEach(item => {
            const producto = buscarProducto(item.id);

            if (!producto) {
                return;
            }

            const subtotal = producto.precio * item.cantidad;

            contenedorItems.innerHTML += `
                <div class="carrito-item">

                    <img
                        src="${producto.imagen}"
                        alt="${producto.nombre}"
                        class="carrito-item-imagen"
                    >

                    <div class="carrito-item-info">

                        <h3>${producto.nombre}</h3>

                        <p>${producto.marca}</p>

                        <strong>
                            US$ ${subtotal.toFixed(2)}
                        </strong>

                        <div class="controles-cantidad">

                            <button
                                type="button"
                                data-accion="restar"
                                data-id="${producto.id}"
                                aria-label="Reducir cantidad"
                            >−</button>

                            <span>${item.cantidad}</span>

                            <button
                                type="button"
                                data-accion="sumar"
                                data-id="${producto.id}"
                                aria-label="Aumentar cantidad"
                            >+</button>

                            <button
                                type="button"
                                class="btn-eliminar"
                                data-accion="eliminar"
                                data-id="${producto.id}"
                                aria-label="Eliminar producto"
                            >
                                Eliminar
                            </button>

                        </div>

                    </div>
                </div>
            `;
        });
    }

    totalCarrito.textContent = `US$ ${calcularTotal().toFixed(2)}`;

    botonVaciarCarrito.disabled = carrito.length === 0;

    botonFinalizarCompra.disabled = carrito.length === 0;
}

function actualizarCarrito() {
    guardarCarrito();
    renderizarCarrito();
}

function abrirCarrito() {
    panelCarrito.hidden = false;
}

function cerrarCarrito() {
    panelCarrito.hidden = true;
}

function inicializarCarrito(productosCargados) {
    catalogoCarrito = productosCargados;

    cargarCarritoGuardado();

    carrito = carrito.filter(item => buscarProducto(item.id));

    actualizarCarrito();

    botonCarrito.addEventListener("click", abrirCarrito);

    botonCerrarCarrito.addEventListener("click", cerrarCarrito);

    botonVaciarCarrito.addEventListener("click", vaciarCarrito);
    
    botonFinalizarCompra.addEventListener("click",finalizarCompra);

    const contenedorProductos = document.getElementById(
        "contenedor-productos"
    );

    contenedorProductos.addEventListener("click", evento => {
        const boton = evento.target.closest(".btn-agregar");

        if (!boton) {
            return;
        }

        const id = Number(boton.dataset.id);

        agregarAlCarrito(id);
    });

    contenedorItems.addEventListener("click", evento => {
        const boton = evento.target.closest("button[data-accion]");

        if (!boton) {
            return;
        }

        const id = Number(boton.dataset.id);
        const accion = boton.dataset.accion;

        if (accion === "sumar") {
            modificarCantidad(id, 1);
        } else if (accion === "restar") {
            modificarCantidad(id, -1);
        } else if (accion === "eliminar") {
            eliminarDelCarrito(id);
        }
    });
}

function generarNumeroPedido() {
    return `ESS-${Date.now()}`;
}

async function finalizarCompra() {
    if (carrito.length === 0) {
        return;
    }

    if (typeof Swal === "undefined") {
        console.error("SweetAlert2 no está disponible.");
        return;
    }

    const resultadoDatos = await Swal.fire({
        title: "Datos del comprador",
        html: `
            <div class="formulario-compra">
                <label for="cliente-nombre">
                    Nombre completo
                </label>

                <input
                    id="cliente-nombre"
                    type="text"
                    placeholder="Tu nombre"
                    maxlength="80"
                    autocomplete="name"
                >

                <label for="cliente-email">
                    Correo electrónico
                </label>

                <input
                    id="cliente-email"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    autocomplete="email"
                >
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: "Continuar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#A88A65",
        focusConfirm: false,

        preConfirm: () => {
            const nombre = document
                .getElementById("cliente-nombre")
                .value.trim();

            const email = document
                .getElementById("cliente-email")
                .value.trim();

            const emailValido =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

            if (nombre.length < 2) {
                Swal.showValidationMessage(
                    "Ingresá un nombre válido."
                );
                return false;
            }

            if (!emailValido) {
                Swal.showValidationMessage(
                    "Ingresá un correo electrónico válido."
                );
                return false;
            }

            return { nombre, email };
        }
    });

    if (!resultadoDatos.isConfirmed) {
        return;
    }

    const { nombre, email } = resultadoDatos.value;

    const productosPedido = carrito.map(item => {
        const producto = buscarProducto(item.id);

        return {
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: item.cantidad,
            subtotal: producto.precio * item.cantidad
        };
    });

    const totalPedido = calcularTotal();

    const resumen = productosPedido.map(producto =>
        `${producto.nombre} x${producto.cantidad}: ` +
        `US$ ${producto.subtotal.toFixed(2)}`
    ).join("\n");

    const confirmacion = await Swal.fire({
        title: "Confirmar pedido",
        text:
            `Comprador: ${nombre}\n` +
            `Correo: ${email}\n\n` +
            `${resumen}\n\n` +
            `TOTAL: US$ ${totalPedido.toFixed(2)}`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Confirmar compra",
        cancelButtonText: "Volver al carrito",
        confirmButtonColor: "#A88A65",
        customClass: {
            htmlContainer: "resumen-confirmacion"
        }
    });

    if (!confirmacion.isConfirmed) {
        return;
    }

    const numeroPedido = generarNumeroPedido();

    const pedido = {
        numero: numeroPedido,
        fecha: new Date().toISOString(),
        productos: productosPedido,
        total: totalPedido,
        estado: "Confirmado"
    };

    try {
        localStorage.setItem(
            "essenza_ultimo_pedido",
            JSON.stringify(pedido)
        );
    } catch (error) {
        console.error("No se pudo registrar el pedido:", error);

        await Swal.fire({
            title: "No se pudo completar",
            text: "No fue posible guardar el pedido. " +
                  "Tu carrito se conserva para volver a intentar.",
            icon: "error",
            confirmButtonColor: "#A88A65"
        });

        return;
    }

    vaciarCarrito();
    cerrarCarrito();

    await Swal.fire({
        title: "¡Compra confirmada!",
        icon: "success",
        text:
            `Gracias por tu compra, ${nombre}.\n\n` +
            `Pedido: ${numeroPedido}\n` +
            `Total: US$ ${totalPedido.toFixed(2)}\n\n` +
            `Este es un pedido de demostración. ` +
            `No se realizó ningún pago ni envío real.`,
        confirmButtonText: "Volver a la tienda",
        confirmButtonColor: "#A88A65",
        customClass: {
            htmlContainer: "resumen-confirmacion"
        }
    });
}