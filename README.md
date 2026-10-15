# Rosario

Camándula interactiva en español, con cuentas grandes, desplazamiento por el rosario, oraciones, misterios del día y progreso guardado en el dispositivo.

## Versión inicial

Código trasladado desde la versión 3 de https://rosario-sereno.barcco.chatgpt.site.
Commit de origen en Sites: `b1870ce56605455a7a0d05f5357761fcb774d3db`.

La aplicación es estática y no requiere compilación ni dependencias. Publicar todos los archivos de la raíz en un servidor web estático. `index.html` carga `app.js`, `rosary-enhancements.js`, `focus.js` e `immersive.js`, en ese orden.

## Controles

- Tocar o mantener pulsada una cuenta para completarla.
- Deslizar hacia arriba para avanzar; hacia abajo para retroceder.
- Tocar la zona superior para mostrar los controles: anterior, avanzar, navegar, ajustes y prueba de volumen. El tema y la pantalla completa se controlan desde los iconos superiores.
- En **Navegar** se puede elegir el día, uno de sus cinco misterios o una oración concreta.
- Cada misterio se anuncia antes de su decena. La meditación se despliega solamente al pulsar **Ver meditación**.
- En las letanías se muestra una invocación por paso, con la anterior y la siguiente visibles parcialmente. Deslizar hacia arriba o abajo avanza o retrocede una invocación.
- Los misterios se ajustan al día de la semana al abrir el rosario un nuevo día; una elección manual de día se conserva durante la jornada.

## Pantalla completa y Android

La versión web contiene una llamada a `requestFullscreen()` desde una interacción del usuario. Su funcionamiento depende del navegador; ocupar toda el área de la página no equivale a ocultar las barras del sistema Android.

El código escucha las teclas de volumen cuando el navegador las entrega. El traslado a GitHub no cambia esa limitación. Está disponible `window.rosarioHardwareKey('up')` para avanzar y `window.rosarioHardwareKey('down')` para retroceder desde una futura integración nativa. Esta debe interceptar las teclas mientras la pantalla de oración esté activa, evitar avances repetidos al mantenerlas pulsadas y conservar el comportamiento normal del volumen fuera de esa pantalla.

Para evaluar en el teléfono:

1. Probar el botón de pantalla completa, salida y reentrada, orientación y barras del sistema.
2. Comprobar si el navegador entrega las teclas de volumen.
3. Si se prepara una app Android, implementar pantalla inmersiva y teclas de volumen en la capa nativa, reutilizando esta interfaz.

Esta primera importación no incluye APK, contenedor Android ni configuración de GitHub Pages. El progreso usa almacenamiento local: no se transfiere automáticamente entre el dominio de Sites y otro dominio o una app instalada.
