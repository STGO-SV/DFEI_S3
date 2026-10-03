import { formatoPrecio } from '../utils/formatoPrecio.js'

function ItemCarrito({ producto, cantidad, onQuitar }) {
    const rutaImagen = `${import.meta.env.BASE_URL}${producto.imagen}`
    return (
        <article className="item-carrito">
            <div className="item-carrito-contenido">
                <div>
                    <h3>{producto.nombre}</h3>

                    <p>Cantidad: {cantidad}</p>

                    <p>
                        Subtotal:{' '}
                        {formatoPrecio(producto.precioOferta * cantidad)}
                    </p>

                    <button
                        type="button"
                        className="btn btn-outline-danger btn-eliminar-carrito"
                        onClick={() => onQuitar(producto.id)}
                    >
                        {cantidad > 1
                            ? 'Quitar una unidad'
                            : 'Eliminar del carrito'}
                    </button>
                </div>

                <img
                    src={rutaImagen}
                    alt={`Portada de ${producto.nombre}`}
                    className="item-carrito-imagen"
                />
            </div>
        </article>
    )
}

export default ItemCarrito