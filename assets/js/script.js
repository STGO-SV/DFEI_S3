// Conserva el catálogo original y los filtros por separado.
let productos = [];
// Cada línea conserva la referencia original al producto y su cantidad.
let carrito = [];
let categoriaSeleccionada = "";
let terminoBusqueda = "";
let catalogoCargado = false;

// Permite buscar sin distinguir mayúsculas, tildes ni espacios de los extremos.
function normalizarTexto(texto) {
    return texto.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Crea controles a partir de las categorías reales del JSON, sin duplicar sus datos.
function inicializarCategorias() {
    const navegacion = document.querySelector("#opciones-navegacion");
    const contacto = document.querySelector("#opcion-contacto");
    navegacion.querySelectorAll(".opcion-categoria").forEach((opcion) => opcion.remove());
    const categorias = ["", ...new Set(productos.map((producto) => producto.categoria))];
    categorias.forEach((categoria) => {
        const item = document.createElement("li");
        const boton = document.createElement("button");
        item.classList.add("nav-item", "opcion-categoria");
        boton.type = "button";
        boton.classList.add("nav-link", "btn-categoria");
        boton.dataset.categoria = categoria;
        boton.textContent = categoria || "Todos";
        boton.setAttribute("aria-controls", "contenedor-productos");
        boton.setAttribute("aria-pressed", String(categoria === categoriaSeleccionada));
        boton.addEventListener("click", () => seleccionarCategoria(categoria));
        item.appendChild(boton);
        navegacion.insertBefore(item, contacto);
    });
}

// Cambia solo la categoría; el término enviado permanece intacto.
function seleccionarCategoria(categoria) {
    categoriaSeleccionada = categoria;
    document.querySelectorAll(".btn-categoria").forEach((boton) => {
        boton.setAttribute("aria-pressed", String(boton.dataset.categoria === categoria));
    });
    aplicarFiltros();
}

// Un único submit actualiza la búsqueda sin recargar ni reiniciar la categoría.
function inicializarBusqueda() {
    const formulario = document.querySelector("#formulario-busqueda");
    const campoBusqueda = formulario.elements.busqueda;
    const botonLimpiar = document.querySelector("#limpiar-busqueda");
    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();
        terminoBusqueda = normalizarTexto(campoBusqueda.value);
        aplicarFiltros();
    });
    botonLimpiar.addEventListener("click", () => {
        campoBusqueda.value = "";
        terminoBusqueda = "";
        aplicarFiltros();
        campoBusqueda.focus();
    });
}

// Distingue una búsqueda vacía de resultados de un fallo de Fetch.
function mostrarSinResultados(contenedor) {
    const mensaje = document.createElement("p");
    mensaje.classList.add("alert", "alert-info", "mb-0");
    mensaje.textContent = "No encontramos productos que coincidan con tu búsqueda.";
    contenedor.replaceChildren(mensaje);
}

// Deriva una lista nueva: nunca modifica el catálogo original ni oculta errores de carga.
function aplicarFiltros() {
    if (!catalogoCargado) return;
    const contenedor = document.querySelector("#contenedor-productos");
    const visibles = productos.filter((producto) => {
        const coincideCategoria = !categoriaSeleccionada || producto.categoria === categoriaSeleccionada;
        const texto = normalizarTexto(`${producto.nombre} ${producto.descripcion} ${producto.categoria}`);
        return coincideCategoria && texto.includes(terminoBusqueda);
    });
    if (productos.length > 0 && visibles.length === 0) {
        mostrarSinResultados(contenedor);
    } else {
        mostrarProductos(visibles, contenedor);
    }
}

// Comparte el formato monetario entre todas las tarjetas del catálogo.
const formatoPrecio = new Intl.NumberFormat("es-CL", {
    style: "currency", currency: "CLP", maximumFractionDigits: 0
});
const imagenRespaldo = "assets/img/portada-pendiente.svg";

// Rechaza datos incompletos, IDs repetidos, precios inválidos y rutas no locales.
function validarProductos(productos) {
    if (!Array.isArray(productos)) {
        throw new Error("El catálogo debe ser un array.");
    }
    const ids = new Set();
    const camposTexto = ["id", "nombre", "categoria", "imagen", "descripcion"];
    productos.forEach((producto) => {
        if (!producto || typeof producto !== "object" ||
            camposTexto.some((campo) => typeof producto[campo] !== "string" || !producto[campo].trim()) ||
            typeof producto.precio !== "number" || !Number.isFinite(producto.precio) || producto.precio < 0) {
            throw new Error("Producto incompleto o precio inválido.");
        }
        if (ids.has(producto.id) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(producto.id)) {
            throw new Error("ID inválido o duplicado.");
        }
        if (!/^assets\/img\/[a-zA-Z0-9_-]+\.(?:webp|png|jpe?g|svg)$/.test(producto.imagen)) {
            throw new Error("La imagen debe ser un recurso local de assets/img/.");
        }
        ids.add(producto.id);
    });
    return productos;
}

// Anuncia la carga hasta que Fetch termine.
function mostrarEstadoCarga(contenedor) {
    const mensaje = document.createElement("p");
    mensaje.textContent = "Cargando productos...";
    mensaje.classList.add("text-secondary", "mb-0");
    contenedor.setAttribute("aria-busy", "true");
    contenedor.replaceChildren(mensaje);
}

// Construye una tarjeta con texto seguro y una portada local accesible.
function crearTarjetaProducto(producto) {
    const columna = document.createElement("div");
    const tarjeta = document.createElement("article");
    const imagen = document.createElement("img");
    const cuerpo = document.createElement("div");
    const nombre = document.createElement("h3");
    const categoria = document.createElement("p");
    const precio = document.createElement("p");
    const descripcion = document.createElement("p");
    const detalles = document.createElement("button");
    const agregar = document.createElement("button");

    columna.classList.add("col-12", "col-md-6", "col-lg-4", "producto");
    tarjeta.classList.add("card", "h-100");
    tarjeta.id = `producto-${producto.id}`;
    tarjeta.dataset.id = producto.id;
    imagen.classList.add("card-img-top");
    imagen.alt = producto.imagen === imagenRespaldo
        ? `Portada pendiente de ${producto.nombre}` : `Portada del videojuego ${producto.nombre}`;
    // Un solo intento de respaldo evita bucles si también falla el recurso temporal.
    imagen.addEventListener("error", () => {
        imagen.alt = `Portada no disponible de ${producto.nombre}`;
        if (producto.imagen !== imagenRespaldo) imagen.src = imagenRespaldo;
    }, { once: true });
    imagen.src = producto.imagen;
    cuerpo.classList.add("card-body", "d-flex", "flex-column");
    nombre.classList.add("card-title");
    nombre.textContent = producto.nombre;
    categoria.classList.add("text-secondary");
    categoria.textContent = `Categoría: ${producto.categoria}`;
    precio.classList.add("fw-bold", "fs-5");
    precio.textContent = formatoPrecio.format(producto.precio);
    descripcion.id = `detalle-${producto.id}`;
    descripcion.classList.add("card-text", "d-none", "mb-3");
    descripcion.textContent = producto.descripcion;
    detalles.type = "button";
    detalles.classList.add("btn", "btn-outline-info", "btn-detalles", "mb-2");
    detalles.textContent = "Ver más";
    detalles.setAttribute("aria-expanded", "false");
    detalles.setAttribute("aria-controls", descripcion.id);
    agregar.type = "button";
    agregar.classList.add("btn", "btn-info", "btn-agregar-carrito", "mt-auto");
    agregar.dataset.id = producto.id;
    agregar.textContent = "Agregar al carrito";
    agregar.setAttribute("aria-label", `Agregar al carrito: ${producto.nombre}`);
    cuerpo.append(nombre, categoria, precio, descripcion, detalles, agregar);
    tarjeta.append(imagen, cuerpo);
    columna.appendChild(tarjeta);
    return columna;
}

// Renderiza en una sola actualización; distingue el catálogo vacío de un fallo.
function mostrarProductos(productos, contenedor) {
    const fragmento = document.createDocumentFragment();
    if (productos.length === 0) {
        const mensaje = document.createElement("p");
        mensaje.textContent = "No hay productos disponibles por ahora.";
        fragmento.appendChild(mensaje);
    } else {
        productos.forEach((producto) => fragmento.appendChild(crearTarjetaProducto(producto)));
    }
    contenedor.replaceChildren(fragmento);
}

// Presenta un aviso comprensible sin exponer detalles técnicos al visitante.
function mostrarErrorCarga(contenedor, texto) {
    const mensaje = document.createElement("p");
    mensaje.textContent = texto;
    mensaje.classList.add("alert", "alert-danger", "mb-0");
    mensaje.setAttribute("role", "alert");
    contenedor.replaceChildren(mensaje);
}

// El JSON en la raíz es la única fuente de datos del catálogo principal.
async function cargarProductos() {
    const contenedor = document.querySelector("#contenedor-productos");
    catalogoCargado = false;
    mostrarEstadoCarga(contenedor);
    let mensajeError = "No pudimos conectar para cargar los productos. Revisa tu conexión e inténtalo nuevamente.";
    try {
        const respuesta = await fetch("juegos.json");
        if (!respuesta.ok) {
            mensajeError = "No fue posible acceder al catálogo de productos. Inténtalo nuevamente más tarde.";
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }
        mensajeError = "No pudimos leer el catálogo de productos. Inténtalo nuevamente más tarde.";
        const datos = await respuesta.json();
        mensajeError = "El catálogo contiene datos incompletos o incorrectos. Inténtalo nuevamente más tarde.";
        productos = validarProductos(datos);
        catalogoCargado = true;
        inicializarCategorias();
        aplicarFiltros();
    } catch (error) {
        console.error("Error al cargar productos:", error);
        catalogoCargado = false;
        mostrarErrorCarga(contenedor, mensajeError);
    } finally {
        contenedor.setAttribute("aria-busy", "false");
    }
}

// Registra una sola vez los clics de los contenedores que sobreviven al renderizado.
function inicializarEventosCarrito() {
    document.querySelector("#contenedor-productos").addEventListener("click", (evento) => {
        const botonAgregar = evento.target.closest(".btn-agregar-carrito");
        if (botonAgregar && evento.currentTarget.contains(botonAgregar)) {
            agregarAlCarrito(botonAgregar.dataset.id);
            return;
        }

        const botonDetalles = evento.target.closest(".btn-detalles");
        if (botonDetalles && evento.currentTarget.contains(botonDetalles)) {
            alternarDetalles(botonDetalles);
        }
    });
    document.querySelector("#contenido-carrito").addEventListener("click", (evento) => {
        const boton = evento.target.closest(".btn-eliminar-carrito");
        if (boton && evento.currentTarget.contains(boton)) {
            eliminarDelCarrito(boton.dataset.id);
            // El botón pulsado desaparece: lleva el foco al siguiente control disponible.
            const siguiente = evento.currentTarget.querySelector(".btn-eliminar-carrito");
            (siguiente || document.querySelector("#tituloCarrito")).focus();
        }
    });
}

// Alterna los detalles de cualquier tarjeta creada o recreada por los filtros.
function alternarDetalles(boton) {
    const detalle = document.getElementById(boton.getAttribute("aria-controls"));
    if (!detalle) return;
    const seMostrara = detalle.classList.contains("d-none");
    detalle.classList.toggle("d-none", !seMostrara);
    boton.textContent = seMostrara ? "Ocultar detalles" : "Ver más";
    boton.setAttribute("aria-expanded", String(seMostrara));
}

// Actualiza una región de estado persistente sin interrumpir la interacción.
function mostrarMensajeCarrito(mensaje) {
    document.querySelector("#mensaje-carrito").textContent = mensaje;
}

// Acumula cantidades sin copiar productos ni alterar los datos del catálogo.
function agregarAlCarrito(idProducto) {
    const producto = productos.find((producto) => producto.id === idProducto);
    if (!producto) {
        console.warn("No se pudo agregar un producto inexistente.");
        mostrarMensajeCarrito("No pudimos agregar ese producto porque no está disponible en el catálogo.");
        return;
    }
    let item = carrito.find((item) => item.producto.id === idProducto);
    if (item) {
        item.cantidad += 1;
    } else {
        item = { producto, cantidad: 1 };
        carrito.push(item);
    }
    renderizarCarrito();
    mostrarMensajeCarrito(`${producto.nombre} fue agregado al carrito. Cantidad: ${item.cantidad}.`);
}

// Quita la línea completa, aunque tenga varias unidades.
function eliminarDelCarrito(idProducto) {
    const item = carrito.find((item) => item.producto.id === idProducto);
    if (!item) {
        mostrarMensajeCarrito("Ese producto ya no está en tu carrito.");
        return;
    }
    carrito = carrito.filter((item) => item.producto.id !== idProducto);
    renderizarCarrito();
    mostrarMensajeCarrito(`${item.producto.nombre} fue eliminado del carrito.`);
}

// Suma unidades, no solamente líneas distintas.
function calcularCantidadCarrito() {
    return carrito.reduce((cantidad, item) => cantidad + item.cantidad, 0);
}

// Mantiene los cálculos numéricos; el formato CLP solo se aplica al mostrar.
function calcularTotalCarrito() {
    return carrito.reduce((total, item) => total + item.producto.precio * item.cantidad, 0);
}

// Construye una línea flexible y accesible mediante DOM seguro.
function crearLineaCarrito(item) {
    const linea = document.createElement("li");
    const datos = document.createElement("div");
    const nombre = document.createElement("h3");
    const detalle = document.createElement("p");
    const subtotal = document.createElement("p");
    const eliminar = document.createElement("button");
    linea.classList.add("list-group-item", "d-flex", "flex-column", "flex-sm-row", "justify-content-between", "align-items-start", "gap-3");
    nombre.classList.add("h5");
    nombre.textContent = item.producto.nombre;
    detalle.classList.add("mb-1");
    detalle.textContent = `Precio unitario: ${formatoPrecio.format(item.producto.precio)} · Cantidad: ${item.cantidad}`;
    subtotal.classList.add("fw-bold", "mb-0");
    subtotal.textContent = `Subtotal: ${formatoPrecio.format(item.producto.precio * item.cantidad)}`;
    eliminar.type = "button";
    eliminar.classList.add("btn", "btn-outline-danger", "btn-eliminar-carrito", "flex-shrink-0");
    eliminar.dataset.id = item.producto.id;
    eliminar.textContent = "Eliminar";
    eliminar.setAttribute("aria-label", `Eliminar ${item.producto.nombre} del carrito`);
    datos.append(nombre, detalle, subtotal);
    linea.append(datos, eliminar);
    return linea;
}

// Actualiza lista y totales también cuando se elimina el último producto.
function renderizarCarrito() {
    const contenedor = document.querySelector("#contenido-carrito");
    const fragmento = document.createDocumentFragment();
    if (carrito.length === 0) {
        const vacio = document.createElement("p");
        vacio.textContent = "Tu carrito está vacío.";
        fragmento.appendChild(vacio);
    } else {
        const lista = document.createElement("ul");
        lista.classList.add("list-group", "mb-3");
        carrito.forEach((item) => lista.appendChild(crearLineaCarrito(item)));
        fragmento.appendChild(lista);
    }
    const cantidad = document.createElement("p");
    const total = document.createElement("p");
    cantidad.textContent = `Cantidad total de artículos: ${calcularCantidadCarrito()}`;
    total.classList.add("fw-bold", "fs-5", "mb-0");
    total.textContent = `Total general: ${formatoPrecio.format(calcularTotalCarrito())}`;
    fragmento.append(cantidad, total);
    contenedor.replaceChildren(fragmento);
}

// Registra eventos una vez e inicializa catálogo y carrito independientes.
document.addEventListener("DOMContentLoaded", () => {
    inicializarBusqueda();
    inicializarEventosCarrito();
    renderizarCarrito();
    cargarProductos();
});
