# Rosario Android: compilación, firma y Obtainium

La versión web sigue en la raíz del repositorio y GitHub Pages la sirve igual que antes. La APK compila **los mismos** `index.html`, `*.js` y `*.css` en cada ejecución de GitHub Actions. La APK así generada funciona sin conexión, pero necesita una nueva versión publicada para recibir cambios posteriores de la web.

## Pruebas

Cada cambio en `main` que afecte a la web o a Android genera un `Rosario-debug` en la pestaña **Actions → Android APK → Artifacts**. Los APK de prueba usan una firma temporal de GitHub Actions: no instalarlos como método permanente de actualización por Obtainium.

## Firma estable de la versión distribuible

La clave estable exclusiva de Rosario se creó el **16 de octubre de 2026**. La clave y los cuatro valores necesarios para los secretos de GitHub se entregaron de forma privada al responsable del proyecto. **No regenerar otra clave para versiones futuras:** la clave original se conserva para que Android pueda actualizar la aplicación sin reinstalarla.

Certificado oficial de Rosario, huella SHA-256 (dato público, no secreto):

```text
4C:DE:91:17:5B:ED:44:BD:8A:1C:3B:9B:E3:33:EF:46:00:BE:C1:F3:F3:4E:5A:FD:5B:B7:EA:2B:14:BB:8B:F3
```

La acción de publicación comprueba automáticamente que la APK final está firmada con este certificado.

### Configuración inicial (una sola vez)

Guardar fuera del repositorio `rosario-release.jks`, `rosario-firma-secrets.txt` y el respaldo `rosario-firma-respaldo.zip`. El ZIP entregado no está cifrado y contiene material privado; guardarlo en almacenamiento cifrado o en un gestor de archivos seguro.

En **Repository → Settings → Secrets and variables → Actions → Repository secrets**, crear cuatro secretos copiando los valores del archivo privado:

- `ROSARIO_KEYSTORE_BASE64`: contenido Base64 completo de la clave `.jks`, en una sola línea.
- `ROSARIO_KEYSTORE_PASSWORD`: contraseña del almacén.
- `ROSARIO_KEY_ALIAS`: `rosario`.
- `ROSARIO_KEY_PASSWORD`: contraseña de la clave.

**Nunca pegar los valores en Issues, commits, README, comentarios ni capturas públicas.** No sustituir o perder la clave original: una clave diferente impide actualizar una instalación previa sin desinstalarla.

## Publicar una versión

Cuando estén configurados los cuatro secretos, abre **Actions → Android APK → Run workflow**, selecciona `main` e introduce `v0.1.0` en **release_version**. La acción compilará un APK firmado, creará la etiqueta de versión y lo publicará en **GitHub Releases** con un nombre similar a `Rosario-v0.1.0.apk`. Alternativamente puedes crear manualmente la etiqueta `v0.1.0` para activar la publicación.

Los cambios posteriores en la página web seguirán disponibles inmediatamente, pero se incorporarán al APK al crear la **siguiente etiqueta** (`v0.1.1`, etc.). El mismo `applicationId` (`com.barccelo.rosario`), una versión interna creciente y **la misma clave de firma** permiten actualizar el APK instalado sin desinstalarlo.

## Obtainium

Cuando exista al menos una versión publicada:

1. Abrir Obtainium y añadir `https://github.com/barccelo/rosario`.
2. Elegir GitHub Releases como origen y seleccionar el archivo APK de la publicación.
3. A partir de entonces Obtainium detectará nuevas versiones cuando se publiquen etiquetas con sus APK firmados.

**Nota:** la web en Chrome y la app Android guardan preferencias/progreso en almacenamientos locales distintos. Instalar la APK no importa automáticamente el progreso de Chrome; las actualizaciones de la APK sí preservan el almacenamiento propio de la aplicación.

## Botones de volumen nativos

En la pantalla de oración: subir volumen = siguiente oración; bajar volumen = oración anterior. La aplicación evita avances repetidos cuando se mantiene pulsada una tecla. Si se abren Ajustes u otras pantallas completas, las teclas recuperan su comportamiento habitual del sistema. `MainActivity` llama a `window.rosarioHardwareKey` (implementado en `immersive.js`); no hay lógica de oraciones duplicada en Java.

## Recordatorios y teclas nativas

Desde Ajustes en la APK se puede asignar a cada botón de volumen «Siguiente oración», «Oración anterior» o «Volumen del teléfono» de forma independiente. El visor conserva el progreso existente. Los recordatorios permiten hora local y días de la semana, con permiso de notificaciones a partir de Android 13 y reagendado después de reiniciar el móvil. Android puede retrasar ligeramente los avisos para preservar la batería; no se solicita permiso de alarmas exactas.

El modo inmersivo de la APK usa la API de ventanas de Android; no depende de `document.requestFullscreen()` de Chrome. La página web conserva su comportamiento independiente.

## Correcciones de la versión v0.1.1

- «Rosario completo» pasa a ser la vista predeterminada; se mantienen las preferencias que cada usuario haya escogido explícitamente.
- Los dos rieles de cuentas permanecen paralelos, con separación fija a lo largo de su recorrido.
- Tocar una cuenta distinta en la vista completa vuelve a solicitar confirmación antes de cambiar la oración.
- Ajustes utiliza una sola flecha para todos los selectores y elimina el resaltado azul de toque de WebView.
- El botón Aa muestra durante un instante la alineación seleccionada.
- Android utiliza el permiso VIBRATE y un puente de vibración nativa; ambas teclas de volumen se interceptan al nivel de Activity cuando el sistema entrega sus eventos.
- Limitación: otro servicio de accesibilidad puede consumir teclas antes de que lleguen a Rosario. Debe probarse en el móvil con dicho servicio activo.


## Interfaz y geometría — v0.1.2

- Los símbolos litúrgicos de versículo y respuesta son signos SVG con letra serif y una única barra diagonal, sin remates adicionales.
- Los desplegables de Preferencias se sustituyen por un selector visual unificado y accesible con flecha fija y hoja de elección interna, sin diálogos nativos antiguos de Android.
- Los títulos, secciones, tarjetas y controles de Ajustes utilizan espaciados compactos y regulares, con conmutadores visuales uniformes.
- El botón Atrás de Android cierra primero el selector abierto antes de salir de Preferencias.
- El rosario completo elimina el desplazamiento horizontal de la cuenta grande de unión, alineándola con la rama izquierda, y mantiene las dos ramas en ejes verticales fijos.
- Los ajustes se mantienen en la web y se empaquetan en la APK firmada, sin modificar las claves ni las preferencias guardadas.


## Ajuste de escala de la versión v0.1.3

- El ancho de las dos ramas se calcula con el contenedor real del rosario (42% de la vista), y no con el ancho total del navegador. Esto mantiene las cuentas dentro del área visible del teléfono y evita recortes laterales.
- Se renuevan las versiones de caché de los recursos modificados.
- La versión conserva el mismo certificado permanente de firma Android que v0.1.0, v0.1.1 y v0.1.2.

## Ajustes correctivos v0.1.4

- Se restaura la forma centrada del cierre inferior del rosario de v0.1.1: cuenta grande compartida entre las dos ramas y separación constante de las columnas.
- Se suprime el efecto de estiramiento elástico de los límites del desplazamiento en Android (WebView y contenedor físico).
- Se evita regenerar el SVG cuando Android notifica únicamente un cambio de altura, conservando la posición y geometría.
- Se restauran los signos litúrgicos originales ℣/℟; se recorta únicamente el saliente superior que alteraba su apariencia.
- Los cheurones de selección se dibujan mediante trazos CSS independientes de SVG de fondo; los toques no abren involuntariamente el selector nativo de un control dentro de una etiqueta HTML.
- No se modifican la firma permanente ni los datos de usuario guardados.


## Recorrido sobre trayectoria estable — v0.1.5

- Conserva exactamente las coordenadas, cuentas, ramas, colores y curvas en reposo de v0.1.4.
- Durante el desplazamiento manual cerca de la unión inferior mantiene fija visualmente esa unión, mientras las cuentas del aro recorren los segmentos originales; la cuenta grande compartida sirve de referencia y el colgante permanece unido a ella.
- Las cuentas se interpolan sobre los mismos segmentos cúbicos Bézier que dibujan la cuerda, incluido el arco superior. No se trazan rectas de transición nuevas.
- El bloqueo de la unión se libera gradualmente cuando sale del encuadre y continúa el scroll nativo con su inercia.
- Al elegir otra oración se conserva el centrado habitual de su cuenta, sin alterar el progreso guardado.
- La corrección debe comprobarse en el teléfono especialmente al mover de la cuenta grande hacia la 1 y, en sentido inverso, desde la 8 hacia la unión.

## Corrección de la unión inferior — v0.1.6

- Se elimina completamente la animación experimental de cuentas de v0.1.5, que provocaba superposiciones durante los swipes.
- Se conserva el desplazamiento vertical nativo y la distribución de las 55 cuentas de v0.1.4.
- La unión inferior se traza como una única curva cúbica continua, siguiendo el criterio ya empleado en el arco superior; se divide matemáticamente en dos segmentos que coinciden con precisión en la cuenta compartida para no alterar el estado de las oraciones.
- No se desplaza ninguna cuenta independientemente de la cuerda, ni se cambia el tamaño de las cuentas, sus colores o el colgante.
- Pendiente de validación perceptual en el teléfono durante el recorrido entre la cuenta grande y las cuentas 1–10.


## Prueba de aislamiento de halo — v0.1.7

Esta versión es **diagnóstica**, no una solución confirmada a la apertura visual. Frente a v0.1.6, desactiva temporalmente exclusivamente en «Rosario completo» el círculo de halo de las cuentas y los filtros de resplandor/sombra de las cuentas y la cruz. Mantiene intactos la geometría, el hilo, las posiciones, la navegación, los colores, los tamaños y el desplazamiento. Se utilizará para comparar los movimientos desde la cuenta grande hasta la 1 y de la 8 hacia la cuenta grande.

Si persiste la apertura, el halo queda descartado como causa suficiente; si desaparece, analizar el efecto antes de restaurarlo. La firma Android permanece igual.

## Prueba de desplazamiento circular — v0.1.8

- Se **restauran todos los halos y resplandores** que estuvieron desactivados en v0.1.7.
- El Rosario completo conserva su dibujo estático, las curvas, la cuenta grande compartida, el colgante, las dimensiones y los colores.
- Al hacer swipe, una pista virtual permite conservar el scroll nativo con inercia mientras el aro permanece espacialmente estable; ya no entra o sale del encuadre la unión inferior en cada gesto.
- Las cuentas ordinarias circulan ordenadamente por el mismo trazado SVG según su **longitud geométrica real** (`getTotalLength` / `getPointAtLength`), no mediante posiciones aproximadas o interpolación por número de cuenta. La cuenta grande de unión y su colgante permanecen como referencia fija.
- El tap sobre una cuenta sigue permitiendo navegar con confirmación y el cambio de oración restaura el centrado normal.
- **Versión experimental para validar visualmente en Android:** comprobar el movimiento en ambos sentidos, el giro superior, el inferior y las cuentas junto a la cuenta grande. No considerar resuelto el efecto hasta comprobarlo en el dispositivo.

## Restauración segura del desplazamiento — v0.1.9

- Se revierte por completo la circulación independiente de cuentas de v0.1.8, que introdujo movimientos anormales al realizar swipes.
- `rosary-physical.js` vuelve al comportamiento exacto de v0.1.6, excepto por la revisión de la versión de caché de su CSS.
- `rosary-physical.css` vuelve íntegramente a v0.1.6: halos restaurados, sin pista virtual de desplazamiento ni transformaciones adicionales.
- El defecto visual de apertura/cierre inferior sigue **pendiente**. La reversión es deliberada y no se presenta como una solución de ese defecto.
- Para eliminar la apertura sin cambiar la forma inferior será necesario independizar su representación visual del desplazamiento del resto de las ramas; cualquier propuesta futura deberá probarse sin mover cuentas individualmente.

## Prueba de unión inferior independiente — v0.1.10

- Se mantiene la geometría, colores, halos, estilos y coordenadas de cuentas del rosario completo que estaban en v0.1.9.
- Se divide el SVG en dos capas: las **ramas completas** (hilos y cuentas 1–54) se desplazan con el scroll nativo; la **cuenta grande compartida**, el giro inferior original y el colgante forman una sola capa que permanece estable durante los primeros movimientos próximos a la unión.
- Los dos brazos conservan entre sí su separación horizontal fija. Se utiliza una ventana de recorte en el extremo inferior y dos prolongaciones rectas del mismo hilo detrás de las cuentas para evitar que se vea la conexión estirándose.
- La inmovilización de la unión es temporal (máximo 520 píxeles de movimiento); fuera de esa región, o cuando el usuario cambia de oración, vuelve al desplazamiento normal. No se mueven ni reposicionan cuentas de forma individual.
- Se conserva el tap sobre cuentas, la confirmación del salto, la vibración y las preferencias. El halo de la cuenta activa permanece habilitado.
- **Versión experimental**: validar en el teléfono las primeras cinco cuentas al subir, las últimas cinco al bajar y el cambio de rama superior. Si aparece una discontinuidad, detener la prueba y reportar video; no se afirma que el efecto esté solucionado antes de esa comprobación.

## Corrección del centrado automático — v0.1.11

- Revierte por completo la arquitectura de capas móviles de v0.1.10; vuelve al rosario y al **scroll manual nativo** de v0.1.9 con el halo original.
- Cambia **únicamente** la política de `viewport.scrollTop` utilizada al avanzar, retroceder o seleccionar una oración.
- Deja de recentrar todas las cuentas en el 64 % de la ventana; si la cuenta nueva está visible, **no desplaza** el SVG. Si se sale, realiza el desplazamiento mínimo para volver a verla.
- Al llegar al aro se conserva la cuenta grande y las primeras cinco cuentas en un encuadre común. Antes de las últimas cinco, el encuadre se prepara progresivamente para poder mantenerlo estable durante las cuentas 50–54 en pantallas de altura suficiente.
- Las cuentas, hilo, curvas, cuenta grande y colgante **no cambian ni se animan individualmente**. El scroll manual de las cuentas no se intercepta ni modifica.
- La visualización de primera/última decena debe validarse en el dispositivo. La compilación por sí sola no demuestra que el problema perceptivo esté resuelto.

## Fluidez del centrado y oraciones de cierre — v0.1.12

- Se corrige el mapeo litúrgico de los cuatro primeros misterios: **Gloria, Alabanzas y jaculatorias** vuelven a la **cuenta grande siguiente** (11, 22, 33 y 44), en lugar de quedar sobre la última Avemaría (10, 21, 32 y 43). El quinto misterio mantiene sus oraciones de cierre sobre la cuenta grande compartida 0.
- Se conserva sin cambios el **swipe manual** del rosario, la geometría de sus cuentas, los halos, el hilo y el colgante.
- El seguimiento automático usa `scrollTo({behavior:'smooth'})` únicamente cuando una cuenta requiere recolocar el encuadre; no se desplaza ni anima ninguna cuenta por separado.
- Se elimina el salto inverso que existía entre las cuentas 49 y 50: el seguimiento se prepara progresivamente hasta 49 y conserva el destino durante las últimas cinco.
- Un destino de scroll pendiente evita recalcular desde posiciones intermedias cuando se avanza rápidamente, y se limpia al terminar el desplazamiento o iniciar un gesto manual.
- La fluidez visual debe probarse en Android. Una compilación exitosa no confirma por sí sola la ausencia de saltos.

## Ajuste fino del seguimiento automático — v0.1.13

- Se mantiene intacta la solución de apertura de v0.1.12, los halos, las 55 cuentas, las curvas, las jaculatorias y el Gloria en sus cuentas grandes, así como el **swipe manual**.
- Se limita exclusivamente el `scrollTop` de **navegación automática entre oraciones contiguas**: máximo del 15 % de la altura visible junto a la unión inferior (hasta 128 px), o del 22 % fuera de ella (hasta 176 px), mediante desplazamientos suaves.
- En la subida del colgante, la tercera cuenta pequeña prepara gradualmente el encuadre de la cuenta grande; ya no se fuerza un recentrado excesivo al entrar al aro.
- Al avanzar por la rama derecha, la transición hacia el encuadre inferior comienza desde la cuenta 39 y termina en la **cuenta 51 (séptima Avemaría de la última decena)**. El encuadre final sitúa la cuenta grande inferior cerca del 39 % de la pantalla, con el crucifijo visible debajo. Desde las cuentas 8–10 permanece en el mismo lugar.
- Los desplazamientos deliberados a posiciones lejanas conservan el salto de navegación; el límite pequeño se aplica sólo a pasos consecutivos. El seguimiento de scrollend ya no borra prematuramente el destino de una animación posterior.
- El comportamiento y el ajuste exacto de la imagen final deben comprobarse visualmente en el dispositivo.

## Ajuste del arco superior y posición final — v0.1.14

- El encuadre de transición de la rama izquierda a la derecha se corrige sólo en la navegación **automática**: entre las cuentas 24 y 27 se revela progresivamente el arco superior, y desde las cuentas 27 y 28 se conserva el límite superior (`scrollTop = 0`). El arco completo permanece visible con el margen del diseño original.
- La posición inferior alcanzada al completar la **séptima Avemaría de la última decena** (cuenta 51) queda fija al avanzar por las cuentas 8, 9 y 10, el Gloria y jaculatorias del quinto misterio, el colgante, la Salve y todas las letanías. Las oraciones finales no vuelven a centrar el SVG según sus posiciones geométricas.
- Abrir directamente una oración de cierre desde otro punto sitúa el rosario en el encuadre final, sin recorrer artificialmente las cuentas.
- Se conservan exactamente la geometría, el halo, el orden y tamaño de las cuentas, el hilo, el desplazamiento manual nativo, la confirmación de saltos y el mapeo litúrgico.
- Se verificó con simulación de la misma lógica de `paint()`: el límite superior se alcanza en la cuenta 27 y el encuadre final queda inalterado entre las cuentas 51–54, Gloria, dedicaciones, Salve y letanías. Falta validación visual en teléfono Android.

## Límite inferior real — v0.1.15

- El encuadre final se calcula con el **límite de desplazamiento nativo** (`viewport.scrollHeight - viewport.clientHeight`) en lugar de la fórmula previa `MEDAL_Y - 39 % de la altura`, que cortaba parte de la cruz en el borde inferior.
- La transición sigue siendo **automática, suave y gradual**, alcanzando ese límite en la **séptima Avemaría de la última decena (cuenta 51)**. Después permanece fija durante las cuentas 8–10, Gloria, jaculatorias, dedicaciones, Salve y letanías.
- Para mantener la fluidez en pantallas compactas, la preparación de ese encuadre comienza antes en la rama derecha según la altura visible, siempre sin mover las cuentas individualmente.
- **Sin cambios** en el swipe manual, geometría, curvas, halo, colores, iconos o mapeo litúrgico de las oraciones.
- Se verificó el cálculo del seguimiento automático con alturas de 540–1100 px y varios desplazamientos iniciales: en las pruebas se alcanza el límite real en la cuenta 7 y se conserva durante el cierre. La prueba visual en Android sigue siendo necesaria.

## Encuadre al iniciar/reiniciar y orden de vistas — v0.1.16

- En el primer uso, cuando la oración actual es la inicial (índice 0), el **Rosario completo** se sitúa automáticamente en el mismo **límite inferior real** del desplazamiento que se usa al final del rezo. La cruz queda dentro del marco con su margen inferior, independientemente de la altura del teléfono.
- Al confirmar «Reiniciar progreso», también se restaura expresamente el encuadre inicial. Se fuerza el seguimiento aunque el índice ya sea 0, sin depender de un cambio de oración; los avances siguientes conservan el desplazamiento suave.
- En Ajustes, la opción ya predeterminada **«Rosario completo» aparece ahora en primer lugar** y «Vista vertical» en segundo, sin cambiar ni eliminar ninguna función.
- Permanecen intactos el swipe manual, la geometría, el halo, la corrección de la apertura y el seguimiento automático de las cuentas.
- Se comprobaron sintaxis de ambos scripts y simulaciones de inicio/reinicio en diferentes alturas del visor; la presentación visual debe verificarse en el teléfono.

## Luz acumulativa y cordón más natural — v0.1.17

- Se incorpora un **halo tenue persistente** a todas las cuentas que ya han sido rezadas, incluido el colgante. La cuenta activa se ilumina con más intensidad; al terminar, todas las cuentas del rosario conservan su halo. Es una prueba estética y puede afinarse según el resultado en el teléfono.
- La **cruz** conserva la iluminación después de que se completa la primera oración (índice de progreso mayor que cero), y se vuelve a destacar al rezar sobre ella al final. Reiniciar el progreso limpia ese estado acumulado.
- El **hilo** adquiere pequeñas irregularidades suaves y deterministas de hasta aproximadamente 5 unidades de SVG en los controles Bézier entre cuentas. El efecto es estable, sin movimiento ni aleatoriedad por render. Las posiciones y tamaños de las cuentas, el arco superior y la curva inferior se mantienen intactos.
- No se cambian el swipe manual, el seguimiento automático, el orden de oraciones, el encuadre inicial/final, el halo existente de la cuenta activa ni la confirmación de saltos. Se han verificado la sintaxis de JavaScript y la carga de los nuevos recursos CSS/JS.
- Validar visualmente en Android la iluminación acumulada y la naturalidad de los pequeños cambios de cuerda antes de considerarlos definitivos.

## Arco superior y alternancia natural de cuentas — v0.1.18

- Se modifica únicamente la geometría dibujada del Rosario completo. El arco superior utiliza controles Bézier 55 unidades por encima de las cuentas de los extremos, frente a 90 antes. Así queda **más bajo, menos ovalado y más parecido a un arco**; mantiene los mismos puntos de contacto y las tangentes verticales para no romper la continuidad.
- La rama de retorno incorpora un desfase vertical progresivo y determinista `46 * sin(π * n / 26)`. Las cuentas grandes dejan de quedar emparejadas horizontalmente con las de la rama de subida; además, la distancia entre cuentas consecutivas varía ligeramente como en una cadena real.
- El desfase vale **cero en ambos extremos**, por lo que ni la unión inferior ni el inicio/fin del arco superior cambian de posición. Se conservan las curvas inferiores, el colgante, la cruz y las ondulaciones previas del hilo.
- No se alteran el desplazamiento manual nativo, el seguimiento automático, el encuadre inicial/final, el mapeo de oraciones ni el halo acumulativo de cuentas y cruz.
- Validación estática: todas las cuentas de la rama de retorno conservan el orden vertical; los segmentos entre cuentas pequeñas permanecen dentro de distancias seguras. El efecto visual debe evaluarse en Android.

## Opciones de iluminación — v0.1.19

- En **Ajustes → Iluminación de las cuentas** se ofrecen tres opciones mutuamente excluyentes que pueden cambiarse durante el rezo y se guardan en `state.rosaryHaloMode` mediante la persistencia existente: **Halo normal**, **Halo continuo** y **Sin halo**. Se conserva **Halo continuo** como valor inicial de nuevas instalaciones y como alternativa de compatibilidad para preferencias antiguas.
- **Halo normal**: el halo sigue exclusivamente a la cuenta activa; las cuentas previamente rezadas mantienen su color, pero no su halo. La cruz queda discretamente iluminada una vez completada su oración inicial, y se realza cuando vuelve a ser la estación actual.
- **Halo continuo**: se conserva sin cambios la iluminación acumulativa de las cuentas completadas y la intensidad mayor de la cuenta activa, incluida la cruz.
- **Sin halo**: desaparecen todos los halos de cuentas y sombras luminosas del crucifijo, incluidos los efectos de foco. Los colores que indican el progreso continúan funcionando.
- La elección es inmediata, persiste al volver a abrir la app y no reinicia el progreso. No se alteran el scroll manual, el seguimiento automático, el dibujo ni las posiciones de las cuentas.
- Validación estática: sintaxis de JavaScript, los tres modos, persistencia, actualización sin resetear progreso, reglas CSS y versiones de caché de WebView.

## Nuevo icono transparente — v0.1.22

- Se reemplaza el antiguo icono del lanzador Android (vector verde opaco) por el rosario de la imagen proporcionada: cadena circular beige y crucifijo, con **fondo transparente**. La imagen se adapta a 192 × 192 px, con un pequeño margen de seguridad transparente para evitar recortes en los lanzadores.
- La imagen es idéntica para `android/app/src/main/res/drawable-nodpi/rosario_launcher.png` e `icon.png`. El manifiesto Android asigna el nuevo recurso tanto a `android:icon` como a `android:roundIcon`.
- La versión web usa `icon.png` como favicon e icono para accesos directos de iOS. La compilación de Android copia este mismo recurso en WebView junto a los HTML, CSS y JavaScript.
- No cambian identificador de la app, certificado de firma, progresos guardados, gestos, diseño ni oraciones. La actualización se distribuye mediante Obtainium.
- El tratamiento de iconos transparentes puede depender del lanzador Android; la imagen suministrada en sí conserva transparencia.

## Encuadre inicial seguro en la cruz — v0.1.23

- Al **abrir o recargar** Rosario completo, el visor físico empieza en el **límite inferior real del scroll**, mostrando la cruz y el colgante, tanto en una instalación nueva como con una oración/progreso previamente guardados. No se cambia el paso actual.
- Se corrige la carrera de inicialización: el primer `paint()` podía ejecutarse antes de cargar `rosary-physical.css` y antes de que el visor tuviera altura y overflow válidos, dejando `scrollTop=0` (arco superior). Ahora se reintenta el encuadre en el evento de carga del CSS y tras el primer frame hasta disponer de una zona realmente desplazable.
- Mientras el usuario no haya tocado la cadena ni avanzado, un `ResizeObserver` mantiene la cruz abajo frente a reajustes iniciales de altura por las barras del sistema. El primer gesto o avance detiene este anclaje; ningún movimiento posterior vuelve a forzarlo.
- Se conserva la lógica independiente del botón de **Reiniciar progreso**, que ya sitúa el rosario en la cruz, junto con el auto-follow durante las cuentas, el swipe manual, las curvas, los halos y todas las preferencias.
- Comprobación: JavaScript sintácticamente válido y simulación del arranque con progreso nuevo y guardado, CSS todavía no cargado, navegación temprana y gesto manual temprano. Requiere confirmación visual en Android.

## Ajustes litúrgicos, personalización y navegación — v0.1.24

- Estación al Santísimo: **tres vueltas** de invocación, Padrenuestro, Avemaría y Gloria, siempre con **Guía primero y Asamblea después** (sin invertir el dorado en la segunda).
- Guía y Asamblea: guía predeterminada en tono del texto (blanco en modo oscuro) y asamblea en acento; dos selectores independientes permiten intercambiar blanco/tono del texto y color de acento. La Asamblea ahora tiene su propio interruptor independiente del color y de la visibilidad de etiquetas.
- Rosario completo: configuración del **lado izquierdo/derecho** sin espejar la cadena ni modificar su geometría o scroll. Navegación, controles, toques, animación y botones físicos de volumen se agrupan en **Configurar navegación**, un botón que abre un diálogo. Los recordatorios permanecen en Ajustes.
- Comunión espiritual concluye con «Amén». El título del «Señor mío Jesucristo» pasa a «Acto de contrición», con las versiones **Señor mío Jesucristo** y **Jesús, mi Señor y Redentor**, seleccionables en Ajustes y desde una muesca que **sólo aparece en esa oración**.
- En los misterios II y IV la mención **«Gloria» se antepone sólo a la intervención de la Asamblea en la décima Avemaría**, cuando está activada dicha voz; ya no depende del color.
- Los días aparecen ordenados **lunes–domingo**, manteniendo sus correspondencias.
- Intenciones: opción de selección **según el misterio** (usa las 100 intenciones ya categorizadas y las personales) o **completamente aleatoria**; cada selección se conserva para esa decena. Se conserva el editor, la exportación y la lista del usuario.
- Animación **breve y sutil** del aro de la cuenta al llegar a una nueva Avemaría; se desactiva en Navegación y respeta la preferencia del sistema de movimiento reducido. No desplaza las cuentas ni el hilo.
- Tocar una cuenta anterior, la actual o la siguiente no pide confirmación; sólo los saltos de dos o más pasos muestran «Continuar desde aquí». Las cuentas grandes, que contienen varias oraciones, aceptan toques consecutivos sin saltarse Gloria o jaculatorias.
- «Virgen purísima y castísima»: «hacednos, Señora, mansos, humildes, puros y castos» y «En pensamientos, palabras y obras».
- Letanías: se corrige el corte de **Dios Padre celestial, Dios Hijo Redentor del mundo, Espíritu Santo y Santísima Trinidad**; «Consuelo de los afligidos». La oración final utiliza «hemos conocido» y «seamos llevados», con concordancia gramatical.
- Las tres intenciones conclusivas (Iglesia, persona/intenciones y benditas ánimas del purgatorio) llevan **una Avemaría cada una, sin Padrenuestro ni Gloria**. La respuesta por los difuntos es «Las almas de todos los fieles difuntos, por la misericordia de Dios descansen en paz. Amén».
- Devocionario y Oraciones: **editor persistente de texto completo**, con saltos de párrafo y opción de restaurar. También sincroniza las **63 letanías** y las tres invocaciones del Cordero de Dios con sus respectivas ruedas/pasos; se valida el número de versículos para preservar la estructura litúrgica. Los cambios permanecen sólo en este dispositivo.
- En la Salve, el encabezado es «te saludamos» con Asamblea activa y «te saludo» con Asamblea desactivada. Al concluir se añade el paso **Avemaría Purísima / Sin pecado concebida**, con marcas ℣/℟ SVG, inmediatamente antes de «El Señor nos bendiga…».
- **Migración v7→v8**: el índice guardado en la secuencia de v0.1.23 se reasigna a la oración equivalente, incluso cuando se han eliminado Padrenuestros y Glorias de las intenciones finales, evitando perder el progreso.
- Comprobaciones estáticas: sintaxis de los módulos, secuencia completa de 174 pasos, tres Estaciones de 4 oraciones, 63 letanías, correcciones de texto, migración de la segunda intención, editor de letanías y Cordero de Dios, recursos CSS/JS y vínculo del SVG de respuesta. Verificar visualmente en Android antes de dar por terminada la revisión.

## Ajustes visuales y litúrgicos — v0.1.25

- La transición entre Avemarías anima el **texto**, no las cuentas. Cuatro opciones en **Controles e interacción**: Fundido, Deslizamiento, Enfoque y Sin animación, con una oración de muestra y botón para reproducir. El modo elegido se guarda localmente y respeta el ajuste de movimiento reducido.
- Guía y Asamblea cuentan con tres colores independientes: **blanco/color del texto**, **dorado clásico** y **acento del misterio**. Las letanías usan también el acento seleccionado para sus respuestas, títulos y marco.
- El Acto de contrición muestra una **muesca circular discreta** para cambiar la fórmula, sin flecha desplegable.
- Misterios II y IV: en la décima Avemaría, «Gloria.» se presenta antes de **«Santa María»** (segundo fragmento, Asamblea), nunca antes de «Dios te salve».
- Oración final: se restituye «para que aquellos que» y se conservan «hemos conocido» / «seamos llevados». La intención conclusiva vuelve a decir «Por la persona e intenciones del señor Obispo de esta Diócesis». La respuesta a «Ave María Purísima» es «Sin pecado **original** concebida».
- Anuncio del misterio y encabezado durante el Padrenuestro/Avemarías reciben un **contorno fino dorado** equivalente a las letanías, con interiores compactos para no desplazar el contenido.
- Ajustes separados en secciones **Presentación / Iluminación / Controles e interacción / Oraciones / Participación / Recordatorio**. El menú de navegación (días, misterios, oraciones) conserva su función y nombre; los ajustes físicos se llaman ahora **Configurar controles**, sin duplicar «Navegación».
- En la APK, se eliminan los títulos «Android» y «Recordatorio para rezar»: queda **Activar recordatorio**, más su hora y selección de días.
- Los formularios dejan de heredar márgenes excesivos entre las tarjetas, como en la captura de la versión anterior.
- La secuencia sigue en v8 y el índice de oración guardado no cambia al instalar esta actualización. Se verificaron la sintaxis de los JS, las 63 letanías y el texto del Obispo, la conclusión y la respuesta final.
