# Stick Drift — Semana 8

eCommerce académico desarrollado para la asignatura Desarrollo Frontend I (PFY2201). La Semana 8 continúa la migración a React con Vite realizada en Semana 7 e incorpora carga dinámica del catálogo, persistencia del carrito y mejoras de interacción, conservando el diseño responsivo.

## Objetivo

Mejorar las funcionalidades del eCommerce mediante `useState`, `useEffect` y renderizado condicional. El catálogo se carga con `fetch` desde un JSON local servido desde `public`, y el carrito se conserva entre recargas mediante `localStorage`. La aplicación mantiene componentes funcionales, props y funciones reutilizables.

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
├── public/
│   ├── juegos.json          # Catálogo local servido para fetch
│   └── assets/img/          # Imágenes locales del catálogo
├── src/
│   ├── components/          # Componentes React reutilizables
│   ├── styles/estilos.css   # Estilos generales y responsivos
│   ├── utils/formatoPrecio.js # Formato monetario en CLP
│   ├── App.jsx              # Carga del catálogo y estado/persistencia del carrito
│   └── main.jsx             # Punto de entrada de React
├── capturas/                # Evidencias visuales del proyecto
├── index.html               # Documento base de Vite
├── eslint.config.js
├── vite.config.js
└── package.json
```

## Componentes principales

- `App`: compone la aplicación, carga y valida el catálogo, administra el estado compartido y recupera/persiste el carrito.
- `CatalogoProductos`: genera las categorías, controla la búsqueda y filtra el catálogo.
- `TarjetaProducto`: presenta cada videojuego, alterna su descripción y muestra la cantidad actual en el carrito.
- `Carrito`: calcula y muestra los artículos, sus cantidades y el total general.
- `ItemCarrito`: presenta el producto con una imagen reducida, cantidad y subtotal, y permite quitar una unidad o eliminarlo.

## Funcionalidades

- Catálogo de seis videojuegos cargado dinámicamente desde `public/juegos.json`.
- Nombre, categoría, imagen, precio normal, precio de oferta y descripción por producto.
- Búsqueda por nombre, descripción o categoría, sin distinguir mayúsculas ni tildes.
- Filtro por categorías generado a partir de los datos, con estilo de categoría seleccionada.
- Descripciones que se pueden mostrar u ocultar.
- Carrito con incorporación de productos y acumulación de cantidades.
- Cantidad en el carrito visible en cada tarjeta; el botón cambia entre “Agregar al carrito” y “Agregar otra unidad”.
- Reducción de una unidad o eliminación del producto cuando queda la última unidad.
- Cálculo de subtotales, cantidad total de artículos y total general en pesos chilenos.
- Mensajes condicionales para carga, error, búsquedas sin resultados y carrito vacío.
- Persistencia del carrito entre recargas y validación defensiva de sus datos e identificadores.
- Diseño adaptable apoyado en Bootstrap y estilos propios.

### Hooks y manejo de datos

`useState` administra productos, carga, error, carrito, búsqueda, categoría y descripción expandida. Un `useEffect` en `App` ejecuta `fetch`, comprueba la respuesta HTTP y la estructura básica del JSON, y actualiza el catálogo. `AbortController` cancela la petición al desmontar el componente. La ruta utiliza `import.meta.env.BASE_URL` para funcionar bajo `/DFEI_S3/`.

La carga dinámica se realiza mediante `fetch` sobre el archivo local `public/juegos.json`, servido como `juegos.json` bajo la base de Vite, y `useEffect` actualiza el estado con los datos obtenidos. El proyecto no consume una API externa ni requiere backend.

El carrito se recupera desde `localStorage` al iniciar y otro `useEffect` lo guarda cuando cambia. Se almacenan únicamente IDs y cantidades; los precios provienen del catálogo actual. Los datos guardados inválidos producen un carrito vacío, los IDs inexistentes no provocan errores al modificar cantidades y las referencias a productos retirados se descartan al cargar el catálogo. Estas validaciones y la persistencia incorporan la retroalimentación del profesor de Semana 7.

`localStorage` es almacenamiento local del navegador, no una base de datos. Si no está disponible, el carrito funciona en memoria. El proyecto no incluye pagos, backend ni API externa.

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

Vite utiliza la base `/DFEI_S3/` para resolver correctamente scripts, estilos, imágenes y el JSON local en GitHub Pages. Bootstrap se carga desde un CDN y requiere conexión a Internet.

## Validaciones de Semana 8

Se comprobaron `npm run lint`, `npm run build`, la carga dinámica del catálogo, la persistencia con múltiples recargas, las acciones de agregar/quitar después de recargar y la presentación del carrito en escritorio y móvil. No se observó desbordamiento horizontal en la vista móvil probada.

## Evidencias

Las capturas existentes en `capturas/` corresponden a Semana 7 y se conservan como antecedente:

- [`1_vista_catalogo_escritorio.png`](capturas/1_vista_catalogo_escritorio.png): muestra la vista general del catálogo en escritorio, con las tarjetas de productos, imágenes, categorías y precios normal y de oferta.
- [`2_busqueda_filtro_descripcion_expandida.png`](capturas/2_busqueda_filtro_descripcion_expandida.png): evidencia la búsqueda de productos, el filtro por categoría y la visualización condicional de una descripción expandida.
- [`3_carrito_multiples_productos_y_unidades.png`](capturas/3_carrito_multiples_productos_y_unidades.png): muestra el carrito con distintos productos y varias unidades, junto con subtotales, cantidad total de artículos y total monetario.
- [`4_carrito_eliminacion.png`](capturas/4_carrito_eliminacion.png): evidencia el resultado de quitar unidades y eliminar productos del carrito, con la actualización de cantidades y totales.
- [`5_vista_movil.png`](capturas/5_vista_movil.png): muestra la adaptación responsiva de la interfaz y del catálogo en una pantalla móvil.

Las evidencias de Semana 8 están pendientes de generar. Deben mostrar la petición del JSON local y el catálogo cargado, el carrito antes y después de recargar, los estados condicionales (carga, error, sin resultados, carrito vacío y acciones según cantidad) y la vista responsive del carrito en escritorio y móvil.

Los precios son simulados y las imágenes se almacenan localmente con fines académicos.
