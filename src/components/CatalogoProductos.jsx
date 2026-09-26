import juegos from '../data/juegos.json'
import TarjetaProducto from './TarjetaProducto.jsx'

function CatalogoProductos() {
    return (
        <section id="productos" aria-labelledby="tituloProductos">
            <h2 id="tituloProductos">Catálogo de videojuegos</h2>
            <p>Descubre tu próxima aventura.</p>

            <div
                id="contenedor-productos"
                className="row g-4 mt-3"
                aria-live="polite"
            >
                {juegos.map((producto) => (
                    <TarjetaProducto
                        key={producto.id}
                        producto={producto}
                    />
                ))}
            </div>
        </section>
    )
}

export default CatalogoProductos