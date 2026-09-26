import { formatoPrecio } from '../utils/formatoPrecio.js'

function TarjetaProducto({ producto }) {
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

                    <p className="card-text">{producto.descripcion}</p>

                    <button
                        type="button"
                        className="btn btn-info btn-agregar-carrito mt-auto"
                    >
                        Agregar al carrito
                    </button>
                </div>
            </div>
        </article>
    )
}

export default TarjetaProducto