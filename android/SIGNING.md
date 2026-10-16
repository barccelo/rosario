# Rosario Android: compilación, firma y Obtainium

La versión web sigue en la raíz del repositorio y GitHub Pages la sirve igual que antes. La APK compila **los mismos** `index.html`, `*.js` y `*.css` en cada ejecución de GitHub Actions. La APK así generada funciona sin conexión, pero necesita una nueva versión publicada para recibir cambios posteriores de la web.

## Pruebas

Cada cambio en `main` que afecte a la web o a Android genera un `Rosario-debug` en la pestaña **Actions → Android APK → Artifacts**. Los APK de prueba usan una firma temporal de GitHub Actions: no instalarlos como método permanente de actualización por Obtainium.

## Firma estable de la versión distribuible

Sólo se hace **una vez**. En un equipo de confianza con JDK:

```bash
keytool -genkeypair -v -keystore rosario-release.jks -alias rosario -keyalg RSA -keysize 3072 -validity 10000 -storetype PKCS12
```

Conserva este archivo de forma privada y haz una copia de seguridad. Nunca lo subas a GitHub. En **Repository → Settings → Secrets and variables → Actions**, crea:

- `ROSARIO_KEYSTORE_BASE64`: contenido del archivo `rosario-release.jks` codificado en Base64 en **una sola línea**.
- `ROSARIO_KEYSTORE_PASSWORD`: contraseña del almacén.
- `ROSARIO_KEY_ALIAS`: `rosario` (o el alias escogido).
- `ROSARIO_KEY_PASSWORD`: contraseña de la clave privada.

En Linux puede obtenerse Base64 con `base64 -w 0 rosario-release.jks`; en macOS con `base64 -i rosario-release.jks | tr -d '\\n'`. **No compartas estos valores por el chat.**

## Publicar una versión

Cuando estén configurados los cuatro secretos, crea una etiqueta `v0.1.0` apuntando al commit de `main` que quieras distribuir. La acción **Android APK** compilará un APK firmado y lo publicará en **GitHub Releases** con un nombre similar a `Rosario-v0.1.0.apk`.

Los cambios posteriores en la página web seguirán disponibles inmediatamente, pero se incorporarán al APK al crear la **siguiente etiqueta** (`v0.1.1`, etc.). El mismo `applicationId` (`com.barccelo.rosario`), una versión interna creciente y **la misma clave de firma** permiten actualizar el APK instalado sin desinstalarlo.

## Obtainium

Cuando exista al menos una versión publicada:

1. Abrir Obtainium y añadir `https://github.com/barccelo/rosario`.
2. Elegir GitHub Releases como origen y seleccionar el archivo APK de la publicación.
3. A partir de entonces Obtainium detectará nuevas versiones cuando se publiquen etiquetas con sus APK firmados.

**Nota:** la web en Chrome y la app Android guardan preferencias/progreso en almacenamientos locales distintos. Instalar la APK no importa automáticamente el progreso de Chrome; las actualizaciones de la APK sí preservan el almacenamiento propio de la aplicación.

## Botones de volumen nativos

En la pantalla de oración: subir volumen = siguiente oración; bajar volumen = oración anterior. La aplicación evita avances repetidos cuando se mantiene pulsada una tecla. Si se abren Ajustes u otras pantallas completas, las teclas recuperan su comportamiento habitual del sistema. `MainActivity` llama a `window.rosarioHardwareKey` (implementado en `immersive.js`); no hay lógica de oraciones duplicada en Java.
