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

El repositorio ahora incorpora un contenedor Android nativo en `android/` y una compilación automática en `.github/workflows/android.yml`. La publicación permanente de un APK en GitHub Releases necesita configurar primero la firma descrita en [`android/SIGNING.md`](android/SIGNING.md). El progreso usa almacenamiento local: no se transfiere automáticamente entre el dominio de Sites y otro dominio o una app instalada.


## Estructura y lectura (octubre de 2026)

La secuencia sigue el orden del [Santo Rosario en el devocionario de Opus Dei](https://opusdei.org/es/prayers/section/?section1=25&section2=35#dm-prayer-145), con personalizaciones solicitadas para esta aplicación. Comienza con la **Estación al Santísimo Sacramento** («Alabado sea el Santísimo Sacramento del Altar / Sea por siempre bendito y alabado»), tomada del TXT aportado, tres ciclos completos de invocación, Padrenuestro, Avemaría y Gloria, comunión espiritual, Señal de la cruz, Señor mío Jesucristo, versículos iniciales y Gloria. Después se anuncian los cinco misterios del día con meditación optativa, se rezan las decenas y, al final, las tres Avemarías de dedicación, letanías, Cordero de Dios, Bajo tu amparo, oración final e intenciones. La **Salve** se reza al terminar todo lo anterior, seguida únicamente por su respuesta independiente «Ruega por nosotros» y la bendición final. Se mantienen Salve y respuesta como pasos separados.

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

## Temas de colores del Rosario (octubre de 2026)

En **Ajustes → Colores del rosario** hay tres estilos persistentes:

- **Clásico**: conserva exactamente la apariencia dorada original y ambos fondos.
- **Misionero**: únicamente colorea las cuentas, decena por decena, siguiendo el orden tradicional de la imagen aportada: verde (África), rojo (América), blanco (Europa), azul (Oceanía), amarillo (Asia). Se preservan el fondo actual, la cruz, los conectores y el **resaltado dorado** de la cuenta activa. Las cuentas blancas llevan contorno y números oscuros para conservar el contraste.
- **Según los misterios**: adapta automáticamente todas las decenas al grupo de misterios del día, o al grupo elegido manualmente. Se aplica una paleta integrada al fondo, las cuentas, los conectores, los títulos y los controles. En **Dolorosos** se puede elegir Morado o Rojo; **Luminosos**, Dorado o Amarillo; **Gozosos**, Celeste o Azul; **Gloriosos**, Blanco perla. Cada variante tiene fondos y contrastes específicos para **claro** y **oscuro**, sin usar blanco sobre blanco para el grupo glorioso.

Una pequeña vista previa en Ajustes permite comprobar los colores antes de volver al rosario. El modo elegido y cada variante se guardan en el mismo `localStorage` de las demás preferencias. El modo inicial sigue siendo **Clásico** para no modificar la apariencia de los usuarios existentes.

La distinción de **Guía** y **Asamblea** continúa siendo independiente de la paleta; las respuestas de la asamblea conservan su dorado configurable. La cadena sigue utilizando el scroll cinético nativo del navegador, sin cambios en el progreso ni en las oraciones.

## Vista experimental «Rosario físico»: una cruz y cuenta grande compartida (octubre de 2026)

En **Ajustes → Presentación del rosario** se puede seleccionar **Vista vertical** (inalterada) o **Rosario físico · experimental**. La preferencia es local y el cambio no altera el orden de oraciones ni el progreso.

La **única cruz** cuelga de un colgante de **una cuenta grande inferior y tres cuentas pequeñas**. Al terminar ese colgante aparece la **cuenta grande compartida**: pertenece al primer misterio, cierra el quinto y está representada **una sola vez**, en la unión del aro. Por tanto, hay una cuenta grande, tres pequeñas y luego una grande compartida con el círculo; no se añade otra grande ni se duplica el medallón.

Los 55 elementos del aro forman un recorrido continuo, modelado mediante curvas cúbicas Bézier suavizadas en ambos extremos: de la cuenta compartida asciende la rama izquierda, la cadena gira con una curva redondeada arriba, desciende por la rama derecha y vuelve a esa misma cuenta. Las 55 cuentas se dibujan una sola vez. **El color es acumulativo**: lo recorrido conserva su color aun después de la curva superior; sólo lo pendiente aparece en gris y se colorea progresivamente según la oración actual. La cuenta activa tiene el acento del tema seleccionado.

**Correspondencia exacta de las cuentas introductorias:** en la única **cruz** se rezan las tres vueltas completas de la Estación al Santísimo Sacramento (cada una incluye invocación y respuesta, Padrenuestro, Avemaría y Gloria). La **cuenta grande inferior** corresponde a Comunión espiritual. Las **tres pequeñas**, desde la cruz hacia arriba, corresponden respectivamente a Señal de la cruz; Señor mío Jesucristo; y Versículos iniciales («Señor, ábreme los labios» / «Dios mío, ven en mi auxilio») junto con el Gloria siguiente. La **cuenta grande compartida** es el inicio del primer misterio y también el regreso después del Gloria de la quinta decena.

**Cierre:** las tres invocaciones con sus Avemarías finales se asignan a las mismas tres cuentas pequeñas. Las letanías, Cordero de Dios, Bajo tu amparo, oración final e intenciones permanecen en la cuenta grande inferior. La **Salve queda al final** de la secuencia, en la única cruz, seguida de su respuesta independiente «Ruega por nosotros» y, al completar ese paso, la bendición «El Señor nos bendiga…» en esa misma cruz. Las oraciones siguen siendo pasos independientes, aunque compartan una cuenta; no se añaden cuentas ficticias.

La zona izquierda sigue utilizando scroll nativo con inercia independiente del texto y conserva el acceso a las cuentas. Los estilos Clásico, Misionero y Según los misterios continúan disponibles. Falta comprobar el resultado geométrico y la correspondencia de los pasos en un teléfono antes de considerar la vista física definitiva.

## Estación sobre la cruz y Salve al terminar (15 de octubre de 2026)

Se ajustó exclusivamente la correspondencia de los pasos con las cuentas de la vista física: doce pasos de la Estación, una cuenta grande para la Comunión espiritual, tres pequeñas para las oraciones introductorias y la cuenta compartida para el anuncio del primer misterio. El Gloria de los versículos iniciales utiliza la misma cuenta que «Señor, ábreme los labios». El orden de esas oraciones se conserva.

Se cambió el orden de la secuencia final para colocar **Salve + «Ruega por nosotros»** después de letanías, oración final e intenciones, justo antes de la bendición final. El progreso guardado con versión de secuencia 6 se migra mediante identificación de la oración, distinguiendo las dos apariciones de «Ruega por nosotros». La versión de secuencia pasa a 7. La vista vertical también usa el orden de oraciones corregido; su desplazamiento y apariencia no cambian.

## Refinamiento táctil y visual de la vista física (octubre de 2026)

- **Capas y oclusión:** los enlaces del aro y del colgante se dibujan antes de todas las cuentas, que incluyen una base opaca. Ninguna cuerda debe verse a través de las cuentas (incluyendo las pendientes grises); en la cuenta grande compartida tampoco pasa por delante la cuerda del colgante.
- **Geometría:** el giro superior llega hasta cerca del borde alto del scroll (en vez de quedar a media altura), con curva cúbica redondeada. El diámetro máximo de las cuentas no crece. Las dos columnas tienen separación adaptativa a la anchura disponible para que ni las dos cuentas grandes enfrentadas ni sus contornos se toquen.
- **Colores finales:** los cuatro elementos del colgante, incluidas las tres pequeñas y la grande cercana a la cruz, recuperan el relleno de cuenta rezada al volver por el colgante, respetando los temas actuales.
- **Accesibilidad táctil:** se elimina el recuadro rectangular de foco que aparecía al tocar la única cruz; continúa existiendo indicación de foco por trazo cuando se navega con teclado.
- **Desplazamiento físico:** el scroll inercial nativo recorre la rama izquierda al arrastrar de arriba hacia abajo, gira cerca del borde superior y recorre la derecha al arrastrar de abajo hacia arriba. No se altera la oración por desplazar físicamente las cuentas.
- **Toques por mitades:** en **Ajustes → Navegación por toques** se puede activar/desactivar (desactivado inicialmente) la navegación con pulsaciones cortas sobre las áreas vacías. Mitad superior retrocede y mitad inferior avanza. No intercepta el texto, enlaces, elementos interactivos, gestos de arrastre ni el movimiento de la cadena. Se guarda la preferencia para ambas presentaciones.

La vista vertical anterior sigue disponible sin alteraciones de geometría. La vista física conserva su carácter experimental hasta la verificación real en Android.

## Cruz compartida y sentido de los swipes en la vista física (octubre de 2026)

La vista física ahora **clona la cruz SVG ya existente** en `focus.js`, conservando exactamente su geometría, argolla, contornos y detalles dorados. Únicamente se ajustan su posición y el ID local del mismo degradado para que funcione dentro del segundo SVG. Se suprimieron los estilos que convertían la cruz física en otro dibujo.

La navegación de las oraciones mediante swipe se adapta a la cuenta actual **en toda la vista física**, incluidos los textos largos:
- **Cruz, cuentas introductorias y rama izquierda del aro (hasta la cuenta 27):** arrastrar el dedo de **arriba hacia abajo avanza**; de **abajo hacia arriba retrocede**.
- **Primera cuenta de la rama derecha (28) hasta el final del Rosario:** de **abajo hacia arriba avanza**; de **arriba hacia abajo retrocede**.

El cambio se realiza al pasar de la cuenta 27 a la 28, no por la posición del dedo en la pantalla. **El área izquierda de las cuentas sólo desplaza la cadena con inercia nativa; no cambia de oración al deslizar.** La inversión de direcciones se aplica únicamente a los gestos de navegación en la zona de lectura. Los toques breves en una cuenta mantienen su acción original. La vista vertical convencional conserva sus gestos de siempre.

## Colgante completo y caída orgánica (octubre de 2026)

En la vista física, al terminar «El Señor nos bendiga» se conserva el mismo estado de **cierre** que se utiliza desde las oraciones finales: las tres cuentas pequeñas y la grande inferior permanecen coloreadas. La cruz sigue siendo el único punto de partida y llegada.

El aro deja de usar dos columnas especulares. Las cuentas de la derecha tienen un ligero desfase vertical, ambas ramas se curvan de forma irregular pero controlada, y se mantienen las distancias mínimas para que las cuentas grandes no se rocen, también en pantallas estrechas. Se conserva el scroll inercial existente y el mapa de oraciones.

El hilo del aro y del colgante emplea una base dorada más fina y una capa SVG con **pequeñas fibras cruzadas**, sin recursos externos ni efectos de ruido costosos. Ambas capas quedan detrás de las cuentas opacas. Se trata de una prueba estética de textura, pendiente de valoración en móvil. La vista vertical original no cambia.

## Corrección del desplazamiento y de la unión inferior (octubre de 2026)

Se retiraron los detectores `touchstart/touchend` de navegación de oraciones que se habían instalado en `.physical-scroll-viewport`. Esta zona vuelve a reservarse exclusivamente al desplazamiento nativo de las cuentas, sin modificar `state.index` al soltar el dedo. La zona del texto conserva su navegación contextual y los toques breves sobre cuentas conservan la selección directa.

Se aumentó la holgura entre la última Avemaría de la rama derecha (número 10 de la quinta decena) y la cuenta grande compartida. En lugar de deformar sólo la última unión, el desfase vertical se reparte gradualmente a lo largo de los 27 puntos de regreso para mantener la caída asimétrica y la separación entre cuentas.

## Pantallas completas y estilos compartidos (octubre de 2026)

Las ventanas de navegación, ajustes, lectura, meditación y confirmación utilizan ahora el mismo `<dialog>` semántico, pero ocupan **toda la pantalla del dispositivo**, con barra superior fija, flecha de regreso, controles de alineación conservados y contenido con desplazamiento propio de página. La presentación no altera el orden de oraciones, el progreso, los gestos del rosario ni las preferencias.

Se consolidaron los estilos de los formularios, selectores, tarjetas, pestañas, opciones de color, muestras y controles de la vista física en `rosary-ui.css`, cargado al final por `rosary-ui.js`. Se retiraron reglas duplicadas de `rosary-colors.css`, `rosary-physical.css`, `rosary-polish.css` y el antiguo tamaño compacto definido en `index.html`. Las variantes claro, oscuro y por misterio tienen variables de interfaz específicas.

Se eliminaron los textos auxiliares excesivos o técnicos de Ajustes, la selección de colores y la presentación física. Se conservaron las opciones funcionales, los rótulos necesarios, las acciones de navegación y las oraciones.

## Versión Android (octubre de 2026)

La app Android incorpora los HTML, CSS y JavaScript publicados por GitHub Pages en cada compilación. El código de oraciones y de interfaz sigue siendo único. Un WebView con `WebViewAssetLoader` carga los recursos locales; el contenedor Android intercepta volumen arriba y abajo para avanzar y retroceder oraciones mientras está activa la pantalla de oración. Las teclas vuelven a regular el volumen del sistema al abrir Ajustes, Navegación y demás ventanas.

En la interfaz se unificó el chevrón de todas las listas desplegables. El control de alineación ahora usa `Aa` para diferenciarse del icono de menú. Se oculta el HTML inicial antiguo hasta que acaba la carga visual para evitar su aparición fugaz.

Cada cambio en `main` compila un APK de prueba como artefacto de GitHub Actions; para distribución y actualizaciones mediante Obtainium se requiere **firmar con una misma clave** y publicar etiquetas de versión (`v0.1.0`, `v0.1.1`, etc.) en GitHub Releases. Consulta [Configuración y firma para Android](android/SIGNING.md).
