import { useEffect, useState } from 'react'
import CatalogoProductos from './components/CatalogoProductos.jsx'
import Carrito from './components/Carrito.jsx'

const claveCarrito = 'stick-drift-carrito'

function recuperarCarrito() {
    // El almacenamiento puede estar bloqueado o contener datos de una sesión inválida.
    try {
        const datos = JSON.parse(localStorage.getItem(claveCarrito) || '[]')
        const ids = new Set()
        if (!Array.isArray(datos) || datos.some((item) => {
            if (!item || typeof item.id !== 'string' || !item.id.trim() ||
                !Number.isSafeInteger(item.cantidad) || item.cantidad < 1 || ids.has(item.id)) {
                return true
            }
            ids.add(item.id)
            return false
        })) return []
        return datos.map(({ id, cantidad }) => ({ id, cantidad }))
    } catch {
        return []
    }
}

function App() {
    const [carrito, setCarrito] = useState(recuperarCarrito)
    const [productos, setProductos] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState('')
    const baseUrl = import.meta.env.BASE_URL

    useEffect(() => {
        // Una única carga compartida; se cancela al desmontar, también en StrictMode.
        const controlador = new AbortController()
        async function cargarProductos() {
            try {
                const respuesta = await fetch(`${baseUrl}juegos.json`, {
                    signal: controlador.signal,
                })
                if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`)
                const datos = await respuesta.json()
                const ids = new Set()
                if (!Array.isArray(datos) || datos.some((producto) => {
                    if (!producto || ['id', 'nombre', 'categoria', 'descripcion', 'imagen']
                        .some((campo) => typeof producto[campo] !== 'string' || !producto[campo].trim()) ||
                        !Number.isFinite(producto.precioNormal) || producto.precioNormal < 0 ||
                        !Number.isFinite(producto.precioOferta) || producto.precioOferta < 0 ||
                        ids.has(producto.id)) return true
                    ids.add(producto.id)
                    return false
                })) throw new Error('Catálogo inválido')
                if (controlador.signal.aborted) return
                setProductos(datos)
                // Descarta referencias guardadas a productos que ya no están disponibles.
                setCarrito((actual) => actual.filter((item) => ids.has(item.id)))
                setError('')
            } catch (fallo) {
                if (controlador.signal.aborted) return
                console.error('Error al cargar el catálogo:', fallo)
                setError('No pudimos cargar el catálogo. Recarga la página para intentarlo nuevamente.')
            } finally {
                if (!controlador.signal.aborted) setCargando(false)
            }
        }
        cargarProductos()
        return () => controlador.abort()
    }, [baseUrl])

    useEffect(() => {
        // Persiste solo IDs y cantidades; los precios siempre provienen del catálogo actual.
        try {
            localStorage.setItem(claveCarrito, JSON.stringify(carrito))
        } catch {
            console.warn('No se pudo guardar el carrito en este navegador.')
        }
    }, [carrito])

    function agregarAlCarrito(producto) {
        if (!producto || !productos.some((item) => item.id === producto.id)) return
        setCarrito((carritoActual) => {
            const productoExistente = carritoActual.find(
                (item) => item.id === producto.id,
            )

            if (productoExistente) {
                return carritoActual.map((item) =>
                item.id === producto.id
                    ? { ...item, cantidad: item.cantidad + 1}
                    : item,
                )
            }
            return [...carritoActual, { id: producto.id, cantidad: 1}]
        })
    }

    function quitarDelCarrito(idProducto) {
        setCarrito((carritoActual) => {
            const productoExistente = carritoActual.find(
                (item) => item.id === idProducto,
            )

            // Un ID inexistente no debe provocar una excepción ni cambiar el carrito.
            if (!productoExistente) return carritoActual

            if (productoExistente.cantidad > 1) {
                return carritoActual.map((item) =>
                    item.id === idProducto
                        ? { ...item, cantidad: item.cantidad - 1 }
                        : item,
                )
            }

            return carritoActual.filter(
                (item) => item.id !== idProducto,
            )
        })
    }

    return (
        <>
            <header>
                <h1>Stick Drift</h1>
                <p>Tu tienda de videojuegos para descubrir nuevas aventuras.</p>

                <nav
                    className="navbar navbar-expand-md navbar-dark"
                    aria-label="Navegación principal"
                >
                    <div className="container-fluid justify-content-center px-0">
                        <button
                            className="navbar-toggler"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#navegacionPrincipal"
                            aria-controls="navegacionPrincipal"
                            aria-expanded="false"
                            aria-label="Mostrar u ocultar navegación"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div
                            className="collapse navbar-collapse justify-content-center"
                            id="navegacionPrincipal"
                        >
                            <ul className="navbar-nav" id="opciones-navegacion">
                                <li className="nav-item">
                                    <a className="nav-link" href="#inicio">
                                        Inicio
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#productos">
                                        Productos
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#carrito">
                                        Carrito
                                    </a>
                                </li>
                                <li className="nav-item" id="opcion-contacto">
                                    <a className="nav-link" href="#contacto">
                                        Contacto
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>

            <main>
                <section id="inicio">
                    <h2>Bienvenido a Stick Drift</h2>
                    <p>Conoce nuestra amplia oferta de juegos y elige tu próxima aventura.</p>
                </section>

                <section
                    className="seccion-carousel"
                    aria-labelledby="tituloCarousel"
                >
                    <h2 id="tituloCarousel" className="visually-hidden">
                        Videojuegos destacados
                    </h2>

                    <div
                        id="carouselVideojuegos"
                        className="carousel slide"
                        data-bs-ride="carousel"
                        data-bs-interval="3000"
                    >
                        <div className="carousel-indicators">
                            <button
                                type="button"
                                data-bs-target="#carouselVideojuegos"
                                data-bs-slide-to="0"
                                className="active"
                                aria-current="true"
                                aria-label="Diapositiva 1"
                            ></button>
                            <button
                                type="button"
                                data-bs-target="#carouselVideojuegos"
                                data-bs-slide-to="1"
                                aria-label="Diapositiva 2"
                            ></button>
                            <button
                                type="button"
                                data-bs-target="#carouselVideojuegos"
                                data-bs-slide-to="2"
                                aria-label="Diapositiva 3"
                            ></button>
                        </div>

                        <div className="carousel-inner">
                            <div className="carousel-item active">
                                <a
                                    href="#producto-minecraft"
                                    aria-label="Ver Minecraft en el catálogo"
                                >
                                    <img
                                        src={`${baseUrl}assets/img/minecraft.webp`}
                                        className="d-block w-100 carousel-imagen"
                                        alt="Portada del videojuego Minecraft"
                                    />
                                </a>
                            </div>

                            <div className="carousel-item">
                                <a
                                    href="#producto-zelda-breath-of-the-wild"
                                    aria-label="Ver The Legend of Zelda: Breath of the Wild en el catálogo"
                                >
                                    <img
                                        src={`${baseUrl}assets/img/zelda-breath-of-the-wild.webp`}
                                        className="d-block w-100 carousel-imagen"
                                        alt="Portada del videojuego The Legend of Zelda: Breath of the Wild"
                                    />
                                </a>
                            </div>

                            <div className="carousel-item">
                                <a
                                    href="#producto-god-of-war-ragnarok"
                                    aria-label="Ver God of War Ragnarök en el catálogo"
                                >
                                    <img
                                        src={`${baseUrl}assets/img/god-of-war-ragnarok.jpg`}
                                        className="d-block w-100 carousel-imagen"
                                        alt="Portada del videojuego God of War Ragnarök"
                                    />
                                </a>
                            </div>
                        </div>

                        <button
                            className="carousel-control-prev"
                            type="button"
                            data-bs-target="#carouselVideojuegos"
                            data-bs-slide="prev"
                        >
              <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"
              ></span>
                            <span className="visually-hidden">Anterior</span>
                        </button>

                        <button
                            className="carousel-control-next"
                            type="button"
                            data-bs-target="#carouselVideojuegos"
                            data-bs-slide="next"
                        >
              <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
              ></span>
                            <span className="visually-hidden">Siguiente</span>
                        </button>
                    </div>
                </section>

                <CatalogoProductos
                    productos={productos}
                    cargando={cargando}
                    error={error}
                    onAgregarAlCarrito={agregarAlCarrito}
                />

                <Carrito
                    carrito={carrito}
                    productos={productos}
                    cargando={cargando}
                    error={error}
                    onQuitarDelCarrito={quitarDelCarrito}
                />

            </main>

            <footer id="contacto">
                <h2>Contacto</h2>
                <p>
                    Escríbenos a{' '}
                    <a href="mailto:contacto@stickdrift.cl">
                        contacto@stickdrift.cl
                    </a>
                    .
                </p>
                <p>&copy; 2026 Stick Drift.</p>
            </footer>
        </>
    )
}

export default App
