"use strict";
const contenedorProductos = document.getElementById("contenedor-productos");

let productos = [];

async function cargarProductos() {
    contenedorProductos.innerHTML = "<p>Cargando perfumes...</p>";

    try {
        const respuesta = await fetch("./data/productos.json");

        if (!respuesta.ok) {
            throw new Error("No se pudo cargar el catálogo.");
        }

        const datos = await respuesta.json();

        if (!Array.isArray(datos)) {
            throw new Error("El formato del catálogo no es válido.");
        }

        productos = datos;

        inicializarCarrito(productos);

        mostrarProductos(productos);

    } catch (error) {
        contenedorProductos.textContent =
            "Ocurrió un error al cargar los perfumes. Intentá nuevamente.";

        console.error("Error al cargar productos:", error);

    } finally {
        console.info("Proceso de carga finalizado.");
    }
}

function mostrarProductos(listaProductos) {

    const cantidad = listaProductos.length;

    if (cantidad === 0) {
        contenedorProductos.innerHTML = `
            <div class="sin-resultados">
                <h3>No encontramos perfumes</h3>
                <p>Probá con otro nombre, marca o categoría.</p>
            </div>
        `;
        return;
    }

    const tarjetas = listaProductos.map(producto => {

        const {
            id,
            nombre,
            marca,
            categoria,
            precio,
            imagen,
            descripcion
        } = producto;

        return `
            <article class="producto-card">

                <div class="producto-imagen">
                    <img
                        src="${imagen}"
                        alt="${marca} ${nombre}"
                        loading="lazy"
                    >
                </div>

                <div class="producto-info">

                    <span class="producto-categoria">
                        ${categoria}
                    </span>

                    <p class="producto-marca">${marca}</p>

                    <h3>${nombre}</h3>

                    <p class="producto-descripcion">
                        ${descripcion}
                    </p>

                    <p class="producto-precio">
                        US$ ${precio.toFixed(2)}
                    </p>

                    <button
                        class="btn-agregar"
                        data-id="${id}"
                        type="button"
                    >
                        Agregar al carrito
                    </button>

                </div>

            </article>
        `;
    });

    const mensajeCantidad = cantidad === 1
        ? "Mostrando 1 perfume"
        : `Mostrando ${cantidad} perfumes`;

    contenedorProductos.innerHTML = `
        <p class="contador-resultados">${mensajeCantidad}</p>
        ${tarjetas.join("")}
    `;
}

const buscador = document.getElementById("buscador");
const filtroCategoria = document.getElementById("filtro-categoria");
const ordenPrecio = document.getElementById("orden-precio");

function filtrarYOrdenarProductos() {
    const textoBusqueda = buscador.value.toLowerCase().trim();
    const categoriaSeleccionada = filtroCategoria.value;
    const ordenSeleccionado = ordenPrecio.value;

    let productosFiltrados = productos.filter(producto => {
        const coincideNombre = producto.nombre
            .toLowerCase()
            .includes(textoBusqueda);

        const coincideMarca = producto.marca
            .toLowerCase()
            .includes(textoBusqueda);

        const coincideCategoria =
            categoriaSeleccionada === "todos" ||
            producto.categoria === categoriaSeleccionada;

        return (coincideNombre || coincideMarca) && coincideCategoria;
    });

    if (ordenSeleccionado === "menor") {
        productosFiltrados.sort((a, b) => a.precio - b.precio);
    } else if (ordenSeleccionado === "mayor") {
        productosFiltrados.sort((a, b) => b.precio - a.precio);
    }

    mostrarProductos(productosFiltrados);
}

buscador.addEventListener("input", filtrarYOrdenarProductos);

filtroCategoria.addEventListener("change", filtrarYOrdenarProductos);

ordenPrecio.addEventListener("change", filtrarYOrdenarProductos);

cargarProductos();
