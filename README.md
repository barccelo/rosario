# Rosario

Camándula interactiva en español, con cuentas grandes, desplazamiento por el rosario, oraciones, misterios del día y progreso guardado en el dispositivo.

## Versión inicial

Código trasladado desde la versión 3 de https://rosario-sereno.barcco.chatgpt.site.
Commit de origen en Sites: `b1870ce56605455a7a0d05f5357761fcb774d3db`.

La aplicación es estática y no requiere compilación ni dependencias. Publicar todos los archivos de la raíz en un servidor web estático. `index.html` carga `app.js`, `rosary-enhancements.js`, `meditations-full.js`, `focus.js`, `immersive.js` y `rosary-polish.js`, en ese orden.

## Controles

- Tocar o mantener pulsada una cuenta para completarla.
- **Zona derecha (texto):** deslizar hacia arriba avanza una oración y hacia abajo retrocede; las oraciones largas se desplazan hasta sus extremos.
- **Zona izquierda (cuentas):** arrastrar mueve sólo la cadena. Un gesto rápido produce un desplazamiento con inercia prolongada; tocar de nuevo detiene el impulso. En ordenadores también funciona con rueda/trackpad. Tocar una cuenta conserva el salto directo a esa oración.
- Hay **una sola barra de controles**: Navegar, T−, T+, Tema, Ajustes y Pantalla completa. Se puede colocar arriba o abajo. En pantalla completa se pliega dentro del punto compacto. Ya no hay un botón/zona superior invisible que abra una segunda barra.
- En **Navegar** se puede elegir el día, uno de sus cinco misterios o una oración concreta.
- Cada misterio se anuncia antes de su decena. La meditación completa se abre en una ventana emergente al pulsar **Ver meditación** o el número romano del misterio.
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

La secuencia sigue el orden del [Santo Rosario en el devocionario de Opus Dei](https://opusdei.org/es/prayers/section/?section1=25&section2=35#dm-prayer-145), con personalizaciones solicitadas para esta aplicación. Comienza con la **Estación al Santísimo Sacramento** («Alabado sea el Santísimo Sacramento del Altar / Sea por siempre bendito y alabado»), tomada del TXT aportado, tres ciclos completos de invocación, Padrenuestro, Avemaría y Gloria, comunión espiritual, Señal de la cruz, Señor mío Jesucristo, versículos iniciales y Gloria. Después se anuncian los cinco misterios del día con meditación optativa, se rezan las decenas y, al final, las tres Avemarías, Salve, respuesta, letanías, Cordero de Dios, Bajo tu amparo, oración final e intenciones. Se mantienen Salve y respuesta separadas, por indicación del usuario.

El menú permanente de tres líneas de la esquina superior abre **Días**, **Misterios**, **Oraciones**, **Jaculatorias**, **Texto** y **Voces**. En Texto, la lectura puede justificarse, alinearse a la izquierda, centrarse o alinearse a la derecha; esta preferencia se guarda localmente. ℣. y ℟. se presentan como marcas visuales diferenciadas en las intervenciones de diálogo y en las letanías.

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

## Ajustes visuales y de gestos — 15 de octubre de 2026
- El número romano y el título del misterio se presentan juntos y ambos abren la meditación; el botón «Ver meditación» aparece centrado bajo el anuncio.
- El texto de cada Gloria se divide en respuesta del guía y de la asamblea. En las decenas II y IV la intervención del guía en el Avemaría comienza con «Gloria.», antes de «Santa María».
- Se muestran los títulos «Comunión espiritual» y «Y ahora te saludamos con una Salve».
- La oración final usa «para que aquellos que ... han conocido ... sean llevados».
- El texto que cabe admite deslizar para pasar de oración; el texto más largo se desplaza dentro del panel y desde sus extremos se puede navegar con otro deslizamiento.
- En pantalla completa, el menú y los controles T−/T+ se ocultan junto con tema/pantalla en el punto superior.
- La configuración de voces se puede abrir desde una pulsación prolongada sobre la participación dorada, además del menú y los ajustes.

## Intenciones, consulta y gestos (octubre de 2026)

- **Ver meditación** queda centrado y sin flecha.
- El «Gloria.» previo a «Santa María...» en los misterios II y IV sólo se muestra cuando está activada la diferenciación de voces por color.
- **Intenciones aleatorias**: activas inicialmente, con diez textos de partida. El menú Intenciones permite añadir, modificar, eliminar y desactivar intenciones. La intención se elige una vez por misterio y se mantiene durante la decena.
- Se guardan junto al progreso en **localStorage** del navegador, sin servicio de cuentas ni sincronización. La sección permite exportar y restaurar la lista en formato JSON para trasladarla o hacer una copia.
- **Gestos diferenciados**: deslizar por el lado izquierdo recorre visualmente la camándula sin alterar la oración. Tocar una cuenta sí salta a esa cuenta. El lado derecho sigue avanzando y retrocediendo las oraciones. Al cambiar de paso se centra la cuenta correspondiente.
- **Menú por deslizamiento horizontal**: navega entre Días, Misterios, Oraciones, Jaculatorias, Intenciones, Texto y Voces. Las oraciones muestran un enlace «Leer» y los misterios otro de «Meditación»; ambos abren el contenido sin abandonar la ventana del menú ni modificar el progreso.
- **Notificaciones programadas**: pendientes. Para recibirlas fiablemente con la webapp cerrada hace falta implementar Web Push con service worker y un servicio programador de envíos. Los temporizadores de una pestaña no ofrecen garantías.

## Ajustes de interfaz y cierre (octubre de 2026)

- La pestaña del navegador muestra solamente **Rosario**.
- El arrastre vertical de las cuentas a la izquierda tiene **inercia**: al soltar después de un movimiento rápido sigue avanzando y se detiene suavemente en los límites, sin cambiar el texto.
- El avance hacia el Gloria ya no genera el patrón de vibración de varios pulsos: se utiliza un único pulso breve, igual que en los demás pasos.
- En **Ajustes → Posición de los controles** se puede elegir **Arriba** o **Abajo**. La barra expandida y el punto compacto de pantalla completa siguen la misma posición y se conserva la elección localmente.
- El nombre y el número romano del misterio tienen contraste reforzado en modo claro.
- Al terminar el rosario, la cruz se mantiene cerca de la parte inferior de la pantalla para que la cadena no siga subiendo excesivamente.
- La oración «Te suplicamos, Señor, que derrames tu gracia...» aparece con el encabezado **Oración**.
- La pantalla final muestra una cruz y «El Señor nos bendiga, nos guarde de todo mal y nos lleve a la vida eterna. Amén.», con el Amén en línea independiente.

## Barra única e inercia prolongada (octubre de 2026)

- Se eliminó del DOM la barra secundaria que aparecía al tocar la zona superior y su superficie invisible. Los **Ajustes** están en la barra principal; el test de volumen está en Ajustes y en **Navegar → Acciones**, donde también aparecen **Anterior** y **Avanzar**.
- El impulso de las cuentas utiliza muestras temporales del movimiento táctil, permite alcanzar rápidamente otras decenas y continúa tras levantar el dedo. La fricción reduce gradualmente la velocidad y los extremos limitan el recorrido; la preferencia del sistema de reducir movimiento desactiva la inercia.
- El desplazamiento de las cuentas no modifica el estado del rezo. Cambiar de oración vuelve a centrar la cuenta activa.

## Desplazamiento cinético del rosario en teléfonos

Se corrigió el cálculo de velocidad al soltar el dedo, que podía quedar en cero cuando Android emitía muy pocos eventos `touchmove`. Ahora se calcula con el punto `touchend` y se combina la velocidad total del gesto con las muestras recientes. Si el gesto es rápido y corto, se proyecta un recorrido adicional de varias cuentas (mínimo aproximado de diez cuentas cuando existe espacio), con frenado progresivo y límites en ambos extremos. Arrastrar lentamente conserva el seguimiento directo del dedo. El movimiento sólo afecta a la cadena del lado izquierdo, no al paso de oración. La preferencia de accesibilidad para reducir movimiento evita la inercia.

## Desplazamiento nativo de la camándula (octubre de 2026)

Se sustituyó el desplazamiento artificial mediante transformaciones SVG y velocidad calculada con JavaScript por un **contenedor con overflow-y: auto, touch-action: pan-y y desplazamiento cinético nativo de Android/Chrome**. La cadena ocupa todo su recorrido dentro del contenedor izquierdo, con espacio superior para centrar el inicio y espacio inferior para mostrar la cruz final. Al soltar un gesto rápido, la inercia y el frenado quedan a cargo del navegador, como en el scroll de una página larga.

El texto y la oración actual no cambian al recorrer las cuentas. Tocar una cuenta sí permite seleccionarla; al avanzar de oración la cuenta correspondiente se centra automáticamente. Esta implementación reemplaza las simulaciones anteriores con animaciones y cálculos de velocidad que no reproducían el scroll esperado.
