# Stick Drift — Semana 6

Actividad sumativa de Desarrollo Frontend I (PFY2201): optimización de lógica y rendimiento con JavaScript.

## Ejecutar localmente

Desde la raíz del proyecto, con Python instalado:

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

Abrir http://localhost:8000/. Usar HTTP, no abrir el HTML mediante `file://`, para permitir Fetch. Si el puerto está ocupado, utilizar otro puerto disponible. Ante contenido antiguo, realizar una recarga forzada del navegador.

## Estructura del entregable

```text
index.html
juegos.json
assets/
├── css/estilos.css
├── js/script.js
└── img/
    ├── minecraft.webp
    ├── zelda-breath-of-the-wild.webp
    ├── god-of-war-ragnarok.jpg
    ├── portada-pendiente.svg
    └── favicon.png
capturas/  (evidencias históricas)
```

## Funcionamiento

- El catálogo de seis productos proviene exclusivamente de `juegos.json` mediante Fetch.
- Categorías generadas desde los datos: Simulación, Aventura y Acción, además de Todos.
- La búsqueda mediante submit combina categoría con nombre, descripción o categoría; ignora mayúsculas, tildes y espacios exteriores.
- Para mostrar todo: seleccionar Todos, vaciar la búsqueda y enviarla.
- El carrito acumula cantidades, calcula subtotales y total en CLP y elimina líneas completas. Los filtros no borran el carrito.
- El estado existe solo en memoria y se reinicia al recargar. No hay pagos, backend ni persistencia.

## Auditoría técnica final

- Sintaxis JavaScript y espacios del diff verificados.
- Revisados seis productos, categorías, búsqueda, combinación de filtros, carrito, cálculos, eliminación y teclado.
- Revisados anchos de 390, 768 y 1440 px, sin desbordamiento horizontal.
- Prueba HTTP real: se renombró temporalmente el JSON, se comprobó el aviso de error y se restauró inmediatamente; el catálogo volvió a cargar.
- Pruebas aisladas del código para JSON ilegible, estructura inválida, catálogo vacío, fallo de red e IDs inexistentes.
- Mensajes de error comprensibles en la página; `console.error` se reserva para diagnóstico técnico.
- Rutas locales verificadas mediante HTTP; botones con type, imágenes con alt y labels asociados.

## Imágenes y precios

Los precios son simulados para la actividad. Hollow Knight, Stardew Valley y Hades utilizan el recurso local `portada-pendiente.svg`, con texto alternativo que identifica la portada pendiente. Es una presentación temporal intencional, sin enlaces rotos; quedan pendientes las portadas reales.

El favicon se redujo localmente de 1.289.120 a 9.639 bytes, manteniendo el diseño y la proporción original en un PNG de 96 × 64 píxeles.

## Preparación de publicación

El sitio es estático, no requiere compilación y utiliza rutas relativas. Conservar `index.html`, `juegos.json` y `assets/` juntos, respetando nombres y mayúsculas. Bootstrap 5.3.8 se carga desde un CDN y requiere conexión.

La versión auditada permanece en la rama `semana-6`, con cambios locales sin preparar. La publicación de esta versión y su verificación en GitHub Pages están pendientes de autorización. No se ha modificado `main`, `semana-5` ni `gh-pages`, ni se ha realizado commit, push o merge.

Antes de entregar la URL definitiva: revisar los cambios acumulados, completar la publicación autorizada y volver a comprobar las rutas, Fetch y la consola en la URL publicada. Las capturas existentes corresponden a fases anteriores y no sustituyen evidencias de esta versión final.
