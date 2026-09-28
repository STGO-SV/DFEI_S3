# Stick Drift — Semana 7

eCommerce académico desarrollado para la asignatura Desarrollo Frontend I (PFY2201). En la Semana 7, la implementación anterior fue migrada a React con Vite, manteniendo el diseño responsivo y las funcionalidades del catálogo y del carrito de compras.

## Objetivo

Aplicar componentes funcionales, props, Hooks, eventos y renderizado condicional en una aplicación React modular. Los datos de los productos se mantienen en un archivo JSON local y el proyecto se prepara para compilación y publicación en GitHub Pages.

## Tecnologías utilizadas

- React 19 y React DOM.
- Vite 8.
- JavaScript y JSX.
- ESLint.
- Bootstrap 5.3.8 mediante CDN.
- CSS personalizado.
- `gh-pages` para el despliegue.

## Estructura general

```text
├── public/assets/img/       # Imágenes locales del catálogo
├── src/
│   ├── components/          # Componentes React reutilizables
│   ├── data/juegos.json     # Fuente de datos de los productos
│   ├── styles/estilos.css   # Estilos generales y responsivos
│   ├── utils/               # Utilidades compartidas
│   ├── App.jsx              # Estructura principal y estado del carrito
│   └── main.jsx             # Punto de entrada de React
├── capturas/                # Evidencias visuales del proyecto
├── index.html               # Documento base de Vite
├── eslint.config.js
├── vite.config.js
└── package.json
```

## Componentes principales

- `App`: compone la aplicación y administra el estado compartido del carrito.
- `CatalogoProductos`: genera las categorías, controla la búsqueda y filtra el catálogo.
- `TarjetaProducto`: presenta la información y las acciones de cada videojuego.
- `Carrito`: calcula y muestra los artículos, sus cantidades y el total general.
- `ItemCarrito`: representa una línea del carrito y permite quitar una unidad o eliminarla.

## Funcionalidades

- Catálogo de seis videojuegos obtenido desde `src/data/juegos.json`.
- Nombre, categoría, imagen, precio normal, precio de oferta y descripción por producto.
- Búsqueda por nombre, descripción o categoría, sin distinguir mayúsculas ni tildes.
- Filtro por categorías generado a partir de los datos.
- Descripciones que se pueden mostrar u ocultar.
- Carrito con incorporación de productos y acumulación de cantidades.
- Reducción de una unidad o eliminación del producto cuando queda la última unidad.
- Cálculo de subtotales, cantidad total de artículos y total general en pesos chilenos.
- Mensajes condicionales para búsquedas sin resultados y carrito vacío.
- Diseño adaptable apoyado en Bootstrap y estilos propios.

El estado se conserva solamente durante la sesión actual del navegador. El proyecto no incluye pagos, backend ni persistencia.

## Instalación y ejecución local

Se requiere Node.js y npm. Desde la raíz del repositorio:

```powershell
npm install
npm run dev
```

Vite mostrará en la terminal la dirección local de desarrollo.

### Comandos disponibles

```powershell
npm run dev      # Inicia el servidor de desarrollo
npm run lint     # Revisa el código con ESLint
npm run build    # Genera el build de producción en dist/
npm run preview  # Prueba localmente el build de producción
npm run deploy   # Compila y publica dist/ mediante gh-pages
```

## Repositorio y despliegue

- Repositorio: [github.com/STGO-SV/DFEI_S3](https://github.com/STGO-SV/DFEI_S3)
- Aplicación publicada: [stgo-sv.github.io/DFEI_S3](https://stgo-sv.github.io/DFEI_S3/)

Vite utiliza la base `/DFEI_S3/` para resolver correctamente scripts, estilos e imágenes en GitHub Pages. Bootstrap se carga desde un CDN y requiere conexión a Internet.

## Evidencias

Las capturas de la carpeta `capturas/` documentan las funcionalidades implementadas en la Semana 7:

- [`1_vista_catalogo_escritorio.png`](capturas/1_vista_catalogo_escritorio.png): muestra la vista general del catálogo en escritorio, con las tarjetas de productos, imágenes, categorías y precios normal y de oferta.
- [`2_busqueda_filtro_descripcion_expandida.png`](capturas/2_busqueda_filtro_descripcion_expandida.png): evidencia la búsqueda de productos, el filtro por categoría y la visualización condicional de una descripción expandida.
- [`3_carrito_multiples_productos_y_unidades.png`](capturas/3_carrito_multiples_productos_y_unidades.png): muestra el carrito con distintos productos y varias unidades, junto con subtotales, cantidad total de artículos y total monetario.
- [`4_carrito_eliminacion.png`](capturas/4_carrito_eliminacion.png): evidencia el resultado de quitar unidades y eliminar productos del carrito, con la actualización de cantidades y totales.
- [`5_vista_movil.png`](capturas/5_vista_movil.png): muestra la adaptación responsiva de la interfaz y del catálogo en una pantalla móvil.

Los precios son simulados y las imágenes se almacenan localmente con fines académicos.
