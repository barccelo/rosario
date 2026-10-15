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


## Estructura y lectura (octubre de 2026)

La secuencia sigue el orden del [Santo Rosario en el devocionario de Opus Dei](https://opusdei.org/es/prayers/section/?section1=25&section2=35#dm-prayer-145), con personalizaciones solicitadas para esta aplicación. Comienza con la **Estación al Santísimo Sacramento** («Alabado sea el Santísimo Sacramento del Altar / Sea por siempre bendito y alabado»), tomada del TXT aportado, tres tandas de Padrenuestro, Avemaría y Gloria, comunión espiritual, Señal de la cruz, Señor mío Jesucristo, versículos iniciales y Gloria. Después se anuncian los cinco misterios del día con meditación optativa, se rezan las decenas y, al final, las tres Avemarías, Salve, respuesta, letanías, Cordero de Dios, Bajo tu amparo, oración final e intenciones. Se mantienen Salve y respuesta separadas, por indicación del usuario.

El menú permanente de tres líneas de la esquina superior abre **Días**, **Misterios**, **Oraciones** y **Texto**. En Texto, la lectura puede justificarse, alinearse a la izquierda, centrarse o alinearse a la derecha; esta preferencia se guarda localmente. V/ y R/ se presentan como marcas visuales diferenciadas en las intervenciones de diálogo y en las letanías.

## Revisión de lectura y secuencia (octubre de 2026)

- La **Estación al Santísimo Sacramento** se reza **tres veces en ciclos completos**: invocación y respuesta, Padrenuestro, Avemaría, Gloria. Al terminar cada Gloria se repite el ciclo, con su invocación.
- «Señor, ábreme los labios» y «Dios mío, ven en mi auxilio» se presentan juntos en un único paso, precedidos por una cruz. La oración de la Señal de la Cruz también muestra el símbolo.
- Cada misterio se anuncia con título destacado; durante cada Padrenuestro y Avemaría de una decena se ve arriba el número romano (I–V) y el nombre del misterio. Pulsando el número se lee la meditación **completa**.
- Las tres Avemarías finales tienen antes una invocación a la Virgen purísima y castísima: antes del parto, en el parto y después del parto. La respuesta es «En pensamiento, palabra y obra».
- Las intenciones finales se muestran destacadas al comienzo del Padrenuestro correspondiente.
- Los «Amén» aparecen en su propia línea a la derecha; se usa tipografía sin cortes automáticos por guiones.
- Las oraciones largas tienen desplazamiento vertical dentro de su panel, sin el botón «Leer oración completa». Cuando caben, el gesto vertical cambia de oración. T+ y T− cambian el tamaño y la preferencia se guarda.
- Las voces **Guía/Asamblea** se alternan entre primera y segunda parte de Padrenuestros y Avemarías en todo el recorrido, también en las tres Avemarías finales, y en jaculatorias. El oro identifica las respuestas de la asamblea. En **Voces** se pueden ocultar sus etiquetas y/o los colores, incluso sin etiquetas visibles. La pulsación prolongada sobre una respuesta dorada abre esos ajustes.
- La selección de **Jaculatorias** es independiente: «María, Madre de gracia», «Alabanzas y gracias» y «Oh Jesús mío», activables en cualquier combinación; en la migración de usuarios existentes se mantiene Alabanzas si antes seguía a María.
- Las letanías conservan la rueda, pero tocando cualquiera de las invocaciones visibles se abre un listado con la letanía actual centrada y resaltada; se puede saltar a otra.
- El botón de alinear texto en ventanas emergentes alterna justificada, izquierda, centrada y derecha. Se usan los signos litúrgicos ℣. y ℟. en los diálogos.
