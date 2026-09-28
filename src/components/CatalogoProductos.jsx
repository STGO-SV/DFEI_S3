import { useState } from 'react';
import juegos from '../data/juegos.json'
import TarjetaProducto from './TarjetaProducto.jsx'

function normalizarTexto(texto) {
    return texto
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
}

function CatalogoProductos({ onAgregarAlCarrito }) {
    const [busqueda, setBusqueda] = useState('')
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas')

    const categorias = [
        'Todas',
        ...new Set(juegos.map((producto) => producto.categoria)),
    ]

    const productosFiltrados = juegos.filter((producto) => {
        const coincideCategoria =
            categoriaSeleccionada === 'Todas' ||
            producto.categoria === categoriaSeleccionada

        const textoBusqueda = normalizarTexto(busqueda.trim())

        const coincideBusqueda =
            normalizarTexto(producto.nombre).includes(textoBusqueda) ||
            normalizarTexto(producto.descripcion).includes(textoBusqueda) ||
            normalizarTexto(producto.categoria).includes(textoBusqueda)

        return coincideCategoria && coincideBusqueda

    })

    function limpiarBusqueda() {
        setBusqueda('')
        setCategoriaSeleccionada('Todas')
    }

    return (
        <section id="productos" aria-labelledby="tituloProductos">
            <h2 id="tituloProductos">Catálogo de videojuegos</h2>
            <p>Descubre tu próxima aventura.</p>

            <div
                className="d-flex flex-wrap gap-2 mt-4"
                aria-label="Filtrar productos por categoría"
            >
                {categorias.map((categoria) => (
                    <button
                        key={categoria}
                        type="button"
                        className="btn btn-outline-info btn-categoria"
                        aria-pressed={categoriaSeleccionada === categoria}
                        onClick={ () => setCategoriaSeleccionada(categoria)}
                    >
                        {categoria}
                    </button>
                ))}
            </div>

            <form
                id="formulario-busqueda"
                className="mt-4"
                role="search"
                onSubmit={(evento) => evento.preventDefault()}
            >
                <label htmlFor="busqueda" className="form-label">
                    Buscar productos
                </label>

                <div className="d-flex flex-column flex-sm-row gap-2">
                    <input
                        type="text"
                        className="form-control"
                        id="busqueda"
                        name="busqueda"
                        value={busqueda}
                        onChange={(evento) => setBusqueda(evento.target.value)}
                        aria-describedby="ayuda-busqueda"
                    />

                    <button type="submit" className="btn btn-info">
                        Buscar
                    </button>

                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={limpiarBusqueda}
                    >
                        Limpiar búsqueda
                    </button>
                </div>

                <p id="ayuda-busqueda" className="form-text">
                    Busca por nombre, descripción o categoría. Para ver todo,
                    selecciona Todas y busca con el campo vacío.
                </p>
            </form>

            {productosFiltrados.length> 0 ? (
                <div
                    id="contenedor-productos"
                    className="row g-4 mt-3"
                    aria-live="polite"
                >
                    {productosFiltrados.map((producto) => (
                        <TarjetaProducto
                            key={producto.id}
                            producto={producto}
                            onAgregarAlCarrito={onAgregarAlCarrito}
                        />
                    ))}
                </div>
            ) : (
                <p className="mt-4" role="status">
                    No se encontraron productos que coincidan con la búsqueda.
                </p>

            )}
        </section>

    )
}

export default CatalogoProductos
