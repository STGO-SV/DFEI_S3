import { formatoPrecio } from '../utils/formatoPrecio.js';

function ItemCarrito({ producto, cantidad, onQuitar }) {
    return (
        <div>
            <p>
                <strong>{producto.nombre}</strong>
            </p>

            <p>Cantidad: {cantidad}</p>

            <p>
                Subtotal: {''}
                {formatoPrecio(
                    producto.precioOferta * cantidad
                )}
            </p>

            <button
                type="button"
                className="btn btn-outline-danger  btn-eliminar-carrito mb-3"
                onClick={() => onQuitar(producto.id)}
            >
                {cantidad > 1 ? 'Quitar una unidad' : 'Eliminar del carrito'}
            </button>
        </div>
    )
}

export default ItemCarrito