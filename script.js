function crearMensajeInicial() {
    // Crea un aviso visible para confirmar que el contenido interactivo está disponible.
    const seccionInicio = document.querySelector("#inicio");
    const mensaje = document.createElement("p");

    mensaje.textContent = "¡Todo listo! El contenido interactivo de Stick Drift se cargó correctamente.";
    mensaje.classList.add("alert", "alert-info", "mb-0");
    mensaje.setAttribute("role", "status");

    seccionInicio.appendChild(mensaje);
}

// Alterna la información adicional asociada al botón seleccionado.
function alternarDetalles(evento) {
    const boton = evento.currentTarget;
    const detalles = document.getElementById(boton.getAttribute("aria-controls"));
    const estanOcultos = detalles.classList.toggle("d-none");

    boton.textContent = estanOcultos ? "Ver más" : "Ocultar detalles";
    boton.setAttribute("aria-expanded", String(!estanOcultos));
}

// Asigna el mismo comportamiento de click a todos los botones de detalles.
function inicializarBotonesDetalles() {
    const botonesDetalles = document.querySelectorAll(".btn-detalles");

    botonesDetalles.forEach((boton) => {
        boton.addEventListener("click", alternarDetalles);
    });
}

// Destaca visualmente cada card mientras el puntero se encuentra sobre ella.
function inicializarEventosMouse() {
    const cards = document.querySelectorAll(".producto .card");

    cards.forEach((card) => {
        card.addEventListener("mouseover", () => {
            card.classList.add("card-destacada");
        });

        card.addEventListener("mouseleave", () => {
            card.classList.remove("card-destacada");
        });
    });
}

// Revisa los datos ingresados y devuelve el primer problema encontrado.
function validarFormulario(datos) {
    if (!datos.nombreJuego) {
        return "Ingresa el nombre del juego.";
    }

    if (!datos.nombreUsuario) {
        return "Ingresa tu nombre.";
    }

    if (datos.comentario.length < 10) {
        return "El comentario debe contener al menos 10 caracteres.";
    }

    return "";
}

// Crea una sola alerta y la actualiza con el resultado de cada envío.
function mostrarMensajeFormulario(formulario, mensaje, tipo) {
    let retroalimentacion = formulario.querySelector(".mensaje-formulario");

    if (!retroalimentacion) {
        retroalimentacion = document.createElement("div");
        retroalimentacion.classList.add("mensaje-formulario", "alert", "mt-3", "mb-0");
        retroalimentacion.setAttribute("role", "alert");
        formulario.appendChild(retroalimentacion);
    }

    retroalimentacion.textContent = mensaje;
    retroalimentacion.classList.remove("alert-danger", "alert-success");
    retroalimentacion.classList.add(tipo === "error" ? "alert-danger" : "alert-success");
}

// Gestiona el envío, valida los campos y muestra la respuesta sin recargar la página.
function inicializarFormulario() {
    const formulario = document.querySelector("#formulario-recomendacion");

    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const datos = {
            nombreJuego: formulario.elements.nombreJuego.value.trim(),
            nombreUsuario: formulario.elements.nombreUsuario.value.trim(),
            comentario: formulario.elements.comentario.value.trim()
        };
        const error = validarFormulario(datos);

        if (error) {
            mostrarMensajeFormulario(formulario, error, "error");
            return;
        }

        mostrarMensajeFormulario(
            formulario,
            `Gracias por recomendar ${datos.nombreJuego}. ¡Revisaremos tu sugerencia!`,
            "exito"
        );
        formulario.reset();
    });
}

// Muestra un indicador temporal mientras se obtienen las recomendaciones.
function crearEstadoCarga(contenedor) {
    const mensajeCarga = document.createElement("p");

    mensajeCarga.textContent = "Cargando recomendaciones...";
    mensajeCarga.classList.add("text-secondary", "mb-0");
    contenedor.replaceChildren(mensajeCarga);
}

// Crea la presentación DOM de un videojuego recibido desde el archivo JSON.
function crearTarjetaJuego(juego) {
    const columna = document.createElement("div");
    const tarjeta = document.createElement("article");
    const cuerpo = document.createElement("div");
    const titulo = document.createElement("h3");
    const genero = document.createElement("span");
    const descripcion = document.createElement("p");

    columna.classList.add("col-12", "col-md-6", "col-lg-4");
    tarjeta.classList.add("card", "card-juego-adicional", "h-100");
    cuerpo.classList.add("card-body", "d-flex", "flex-column", "align-items-start");
    titulo.classList.add("card-title");
    genero.classList.add("badge", "text-bg-info", "mb-3");
    descripcion.classList.add("card-text", "mb-0");

    titulo.textContent = juego.titulo;
    genero.textContent = `Género: ${juego.genero}`;
    descripcion.textContent = juego.descripcion;

    cuerpo.appendChild(titulo);
    cuerpo.appendChild(genero);
    cuerpo.appendChild(descripcion);
    tarjeta.appendChild(cuerpo);
    columna.appendChild(tarjeta);

    return columna;
}

// Reemplaza el estado de carga por las recomendaciones recibidas.
function mostrarJuegos(juegos, contenedor) {
    contenedor.replaceChildren();

    juegos.forEach((juego) => {
        contenedor.appendChild(crearTarjetaJuego(juego));
    });
}

// Sustituye el contenido de la sección por un mensaje de error comprensible.
function mostrarErrorCarga(contenedor) {
    const mensajeError = document.createElement("p");

    mensajeError.textContent = "No fue posible cargar las recomendaciones. Inténtalo nuevamente más tarde.";
    mensajeError.classList.add("alert", "alert-danger", "mb-0");
    mensajeError.setAttribute("role", "alert");
    contenedor.replaceChildren(mensajeError);
}

// Obtiene los juegos desde JSON y coordina su renderizado o el manejo del error.
function cargarJuegos() {
    const contenedor = document.querySelector("#contenedor-juegos");

    crearEstadoCarga(contenedor);

    fetch("juegos.json")
        .then((respuesta) => {
            if (!respuesta.ok) {
                throw new Error(`Error HTTP: ${respuesta.status}`);
            }

            return respuesta.json();
        })
        .then((juegos) => {
            mostrarJuegos(juegos, contenedor);
        })
        .catch((error) => {
            console.error("Error al cargar juegos:", error);
            mostrarErrorCarga(contenedor);
        });
}

document.addEventListener("DOMContentLoaded", () => {
    crearMensajeInicial();
    inicializarBotonesDetalles();
    inicializarEventosMouse();
    inicializarFormulario();
    cargarJuegos();
});
