import juegos from '../data/juegos.json'
import ItemCarrito from './itemCarrito.jsx'
import { formatoPrecio } from '../utils/formatoPrecio.js'

function Carrito({ carrito, onQuitarDelCarrito }) {
    const cantidadTotal = carrito.reduce(
        (total, item) => total + item.cantidad,
        0,
    )
    const totalGeneral = carrito.reduce((total, item) => {
        const producto = juegos.find(
            (juego) => juego.id === item.id,
        )

        return total + producto.precioOferta * item.cantidad
    }, 0)
    return (
        <section id="carrito" aria-labelledby="tituloCarrito">

            {carrito.length === 0 ? (
                <p>Tu carrito está vacío.</p>
            ) : (
                <div>
                    {carrito.map((item) => {
                        const producto = juegos.find(
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