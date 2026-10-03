import ItemCarrito from './ItemCarrito.jsx'
import { formatoPrecio } from '../utils/formatoPrecio.js'

function Carrito({ carrito, productos, cargando, error, onQuitarDelCarrito }) {
    // Solo calcula líneas que tengan un producto disponible en el catálogo cargado.
    const itemsDisponibles = carrito.filter((item) => productos.some((producto) => producto.id === item.id))
    const cantidadTotal = itemsDisponibles.reduce(
        (total, item) => total + item.cantidad,
        0,
    )
    const totalGeneral = itemsDisponibles.reduce((total, item) => {
        const producto = productos.find(
            (juego) => juego.id === item.id,
        )

        return total + producto.precioOferta * item.cantidad
    }, 0)
    return (
        <section id="carrito" aria-labelledby="tituloCarrito">
            <h2 id="tituloCarrito">Carrito</h2>

            {cargando ? (
                <p role="status">Cargando datos del carrito...</p>
            ) : error ? (
                <p role="status">El carrito estará disponible cuando se pueda cargar el catálogo.</p>
            ) : itemsDisponibles.length === 0 ? (
                <p>Tu carrito está vacío.</p>
            ) : (
                <div>
                    {itemsDisponibles.map((item) => {
                        const producto = productos.find(
                            (juego) => juego.id === item.id,
                        )

                        return (
                            <ItemCarrito
                                key={item.id}
                                producto={producto}
                                cantidad={item.cantidad}
                                onQuitar={onQuitarDelCarrito}
                            />
                        )
                    })}

                    <p>
                        <strong>Cantidad total de artículos:</strong> {cantidadTotal}
                    </p>

                    <p>
                        <strong>Total:</strong> {formatoPrecio(totalGeneral)}
                    </p>

                </div>

            )}
        </section>
    )
}

export default Carrito
