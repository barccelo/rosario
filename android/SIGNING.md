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
