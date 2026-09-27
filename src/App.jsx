import { useState } from 'react'
import CatalogoProductos from './components/CatalogoProductos.jsx'
import Carrito from './components/Carrito.jsx'

function App() {
    const [carrito, setCarrito] = useState([])
    const baseUrl = import.meta.env.BASE_URL

    function agregarAlCarrito(producto) {
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

            if (productoExistente.cantidad > 1) {
                return carritoActual.map((item) =>
                    item.id === idProducto
                        ? { ...item, cantidad: item.cantidad - 1 }
                        : item,
                )
            }

            return carritoActual.filter(
                (item) => item.id!== idProducto,
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

                <section>

                <CatalogoProductos onAgregarAlCarrito={agregarAlCarrito} />

                <Carrito
                    carrito={carrito}
                    onQuitarDelCarrito={quitarDelCarrito}
                />

                </section>
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