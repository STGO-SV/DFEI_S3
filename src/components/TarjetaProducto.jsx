import { useState } from "react"
import { formatoPrecio } from '../utils/formatoPrecio.js'

function TarjetaProducto({ producto, onAgregarAlCarrito }) {
    const [descripcionExpandida, setDescripcionExpandida] = useState(false)
    const rutaImagen = `${import.meta.env.BASE_URL}${producto.imagen}`

    return (
        <article className="producto col-12 col-md-6">
            <div className="card h-100" id={`producto-${producto.id}`}>
                <img
                    src={rutaImagen}
                    className="card-img-top"
                    alt={`Portada del videojuego ${producto.nombre}`}
                />

                <div className="card-body d-flex flex-column">
                    <h3 className="card-title">{producto.nombre}</h3>

                    <p className="card-text">
                        <strong>Categoría:</strong> {producto.categoria}
                    </p>

                    <p className="card-text">
            <span className="text-decoration-line-through text-secondary">
              {formatoPrecio(producto.precioNormal)}
            </span>{' '}
                        <strong className="text-danger">
                            {formatoPrecio(producto.precioOferta)}
                        </strong>
                    </p>

                    {descripcionExpandida && (
                        <p className="card-text">{producto.descripcion}</p>
                    )}

                    <div className="mt-auto">
                        <button
                            type="button"
                            className="btn btn-outline-secondary mb-3 w-100"
                            aria-expanded={descripcionExpandida}
                            onClick={() => setDescripcionExpandida(!descripcionExpandida)}
                        >
                            {descripcionExpandida ? 'Ocultar descripción' : 'Ver descripción'}
                        </button>

                        <button
                            type="button"
                            className="btn btn-info btn-agregar-carrito w-100"
                            onClick={() => onAgregarAlCarrito(producto)}
                        >
                            Agregar al carrito
                        </button>
                    </div>

                </div>
            </div>
        </article>
    )
}

export default TarjetaProducto