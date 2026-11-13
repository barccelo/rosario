package com.barccelo.rosario;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.DownloadManager;
import android.content.Intent;
import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.Color;
import java.io.File;
import android.database.Cursor;
import android.net.Uri;
import android.os.Vibrator;
import android.os.VibratorManager;
import android.os.VibrationEffect;
import android.os.Bundle;
import android.os.Environment;
import android.os.Build;
import android.Manifest;
import android.content.pm.PackageManager;
import android.provider.Settings;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.view.View;
import android.view.KeyEvent;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.webkit.WebViewAssetLoader;

/** Android shell for the same static Rosary files served on GitHub Pages. */
public final class MainActivity extends Activity {
    private static final String ROOT =
            "https://appassets.androidplatform.net/assets/www/index.html";
    private WebView webView;
    private volatile boolean prayerActive = false;
    private volatile boolean upIsSystem = false;
    private volatile boolean downIsSystem = false;
    private boolean nativeFullscreen = false;
    private static final int NOTIFICATION_PERMISSION_REQUEST = 42;
    private static final String UPDATE_PREFERENCES = "rosario_updates";
    private static final String UPDATE_DOWNLOAD_ID = "download_id";
    private static final String UPDATE_DOWNLOAD_TAG = "download_tag";
    private static final String APK_MIME = "application/vnd.android.package-archive";

    public final class RosarioBridge {
        @JavascriptInterface
        public void setPrayerActive(boolean active) {
            prayerActive = active;
        }

        @JavascriptInterface
        public void vibrate(int milliseconds) {
            if (milliseconds <= 0) return;
            final int duration = Math.min(milliseconds, 1100);
            runOnUiThread(() -> {
                try {
                    Vibrator vibrator;
                    if (Build.VERSION.SDK_INT >= 31) {
                        VibratorManager manager = (VibratorManager)
                            getSystemService(VIBRATOR_MANAGER_SERVICE);
                        vibrator = manager != null ? manager.getDefaultVibrator() : null;
                    } else {
                        vibrator = (Vibrator) getSystemService(VIBRATOR_SERVICE);
                    }
                    if (vibrator == null || !vibrator.hasVibrator()) return;
                    if (Build.VERSION.SDK_INT >= 26) {
                        vibrator.vibrate(VibrationEffect.createOneShot(duration,
                            VibrationEffect.DEFAULT_AMPLITUDE));
                    } else {
                        vibrator.vibrate(duration);
                    }
                } catch (SecurityException ignored) {
                    // El sistema puede denegar vibración según sus permisos.
                }
            });
        }

        @JavascriptInterface
        public void vibratePattern(int firstMs, int pauseMs, int secondMs) {
            final int first = Math.max(1, Math.min(firstMs, 1100));
            final int pause = Math.max(20, Math.min(pauseMs, 450));
            final int second = Math.max(1, Math.min(secondMs, 1100));
            final long[] pattern = new long[]{0, first, pause, second};
            runOnUiThread(() -> {
                try {
                    Vibrator vibrator;
                    if (Build.VERSION.SDK_INT >= 31) {
                        VibratorManager manager = (VibratorManager)
                            getSystemService(VIBRATOR_MANAGER_SERVICE);
                        vibrator = manager != null ? manager.getDefaultVibrator() : null;
                    } else {
                        vibrator = (Vibrator) getSystemService(VIBRATOR_SERVICE);
                    }
                    if (vibrator == null || !vibrator.hasVibrator()) return;
                    if (Build.VERSION.SDK_INT >= 26) {
                        vibrator.vibrate(VibrationEffect.createWaveform(pattern, -1));
                    } else {
                        vibrator.vibrate(pattern, -1);
                    }
                } catch (SecurityException ignored) {
                    // La vibración puede estar restringida por Android.
                }
            });
        }

        // Admite tres pulsos sin temporizadores de JavaScript.
        @JavascriptInterface
        public void vibrateSequence(String values) {
            if (values == null || values.length() > 80) return;
            final String[] items = values.split(",");
            if (items.length < 1 || items.length > 9 || items.length % 2 == 0) return;
            final long[] waveform = new long[items.length + 1];
            waveform[0] = 0;
            try {
                for (int i = 0; i < items.length; i++) {
                    int ms = Integer.parseInt(items[i].trim());
                    if (ms < 1 || ms > 1100) return;
                    waveform[i + 1] = ms;
                }
            } catch (NumberFormatException ex) {
                return;
            }
            runOnUiThread(() -> {
                try {
                    Vibrator vibrator;
                    if (Build.VERSION.SDK_INT >= 31) {
                        VibratorManager manager = (VibratorManager)
                            getSystemService(VIBRATOR_MANAGER_SERVICE);
                        vibrator = manager != null ? manager.getDefaultVibrator() : null;
                    } else {
                        vibrator = (Vibrator) getSystemService(VIBRATOR_SERVICE);
                    }
                    if (vibrator == null || !vibrator.hasVibrator()) return;
                    if (Build.VERSION.SDK_INT >= 26)
                        vibrator.vibrate(VibrationEffect.createWaveform(waveform, -1));
                    else vibrator.vibrate(waveform, -1);
                } catch (SecurityException ignored) {
                    // Android puede restringir la vibración.
                }
            });
        }

        // Control de amplitud real (API 26+); comparte el mismo patrón
        // de tiempos con el modo predeterminado y respeta Android antiguo.
        @JavascriptInterface
        public void vibrateWithAmplitude(String values, int amplitude) {
            if (values == null || values.length() > 80) return;
            if (amplitude < 1 || amplitude > 255) return;
            final String[] items = values.split(",");
            if (items.length < 1 || items.length > 9 || items.length % 2 == 0) return;
            final long[] timings = new long[items.length + 1];
            final int[] strengths = new int[items.length + 1];
            timings[0] = 0;
            strengths[0] = 0;
            try {
                for (int i = 0; i < items.length; i++) {
                    int duration = Integer.parseInt(items[i].trim());
                    if (duration < 1 || duration > 1100) return;
                    timings[i + 1] = duration;
                    strengths[i + 1] = (i % 2 == 0) ? amplitude : 0;
                }
            } catch (NumberFormatException ex) {
                return;
            }
            runOnUiThread(() -> {
                try {
                    Vibrator vibrator;
                    if (Build.VERSION.SDK_INT >= 31) {
                        VibratorManager manager = (VibratorManager)
                            getSystemService(VIBRATOR_MANAGER_SERVICE);
                        vibrator = manager != null ? manager.getDefaultVibrator() : null;
                    } else {
                        vibrator = (Vibrator) getSystemService(VIBRATOR_SERVICE);
                    }
                    if (vibrator == null || !vibrator.hasVibrator()) return;
                    if (Build.VERSION.SDK_INT >= 26) {
                        vibrator.vibrate(VibrationEffect.createWaveform(timings,
                            strengths, -1));
                    } else {
                        vibrator.vibrate(timings, -1);
                    }
                } catch (SecurityException ignored) {
                    // El dispositivo puede limitar las vibraciones.
                }
            });
        }

        // Actualizador voluntario: una comprobación web al abrir; el
        // botón descarga la APK firmada mediante DownloadManager. Android
        // siempre exige que el usuario confirme su instalación.
        @JavascriptInterface
        public String getAppVersion() {
            try {
                String version = getPackageManager()
                    .getPackageInfo(getPackageName(), 0).versionName;
                return version != null ? version : "v0.0.0";
            } catch (PackageManager.NameNotFoundException ignored) {
                return "v0.0.0";
            }
        }

        @JavascriptInterface
        public boolean downloadUpdate(String url, String version) {
            if (url == null || version == null ||
                !version.matches("v[0-9]+\\.[0-9]+\\.[0-9]+")) return false;
            String expected = "https://github.com/barccelo/rosario/releases/download/"
                + version + "/Rosario-" + version + ".apk";
            if (!expected.equals(url)) return false;
            int previousStatus=getUpdateDownloadStatus();
            if (version.equals(getDownloadedUpdateVersion()) &&
                (previousStatus==DownloadManager.STATUS_PENDING ||
                 previousStatus==DownloadManager.STATUS_RUNNING ||
                 previousStatus==DownloadManager.STATUS_PAUSED ||
                 previousStatus==DownloadManager.STATUS_SUCCESSFUL)) return true;
            try {
                // Una descarga fallida de la misma versión puede dejar un
                // archivo parcial. Limpiar sólo ese APK antes de reintentar.
                File directory=getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS);
                if (directory == null) return false;
                File partial=new File(directory,"Rosario-" + version + ".apk");
                if (partial.exists()&&!partial.delete())return false;
                DownloadManager manager=(DownloadManager)
                    getSystemService(Context.DOWNLOAD_SERVICE);
                if (manager == null) return false;
                DownloadManager.Request request=new DownloadManager.Request(Uri.parse(url));
                request.setTitle("Rosario " + version);
                request.setDescription("Descargando actualización para instalarla");
                request.setMimeType(APK_MIME);
                request.setNotificationVisibility(
                    DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
                // Carpeta propia: sin permisos de almacenamiento adicionales
                // en Android 7-15. DownloadManager proporciona content URI
                // para que el instalador del sistema lea el APK.
                request.setDestinationInExternalFilesDir(MainActivity.this,
                    Environment.DIRECTORY_DOWNLOADS,"Rosario-" + version + ".apk");
                long id=manager.enqueue(request);
                getSharedPreferences(UPDATE_PREFERENCES,MODE_PRIVATE).edit()
                    .putLong(UPDATE_DOWNLOAD_ID,id)
                    .putString(UPDATE_DOWNLOAD_TAG,version).apply();
                return true;
            } catch (Exception ignored) {
                return false;
            }
        }

        @JavascriptInterface
        public String getDownloadedUpdateVersion() {
            return getSharedPreferences(UPDATE_PREFERENCES,MODE_PRIVATE)
                .getString(UPDATE_DOWNLOAD_TAG,"");
        }

        @JavascriptInterface
        public int getUpdateDownloadStatus() {
            long id=getSharedPreferences(UPDATE_PREFERENCES,MODE_PRIVATE)
                .getLong(UPDATE_DOWNLOAD_ID,-1);
            if (id < 0) return 0;
            try {
                DownloadManager manager=(DownloadManager)
                    getSystemService(Context.DOWNLOAD_SERVICE);
                if (manager == null) return 0;
                DownloadManager.Query query=new DownloadManager.Query().setFilterById(id);
                try (Cursor cursor=manager.query(query)) {
                    if (cursor != null && cursor.moveToFirst())
                        return cursor.getInt(cursor.getColumnIndexOrThrow(
                            DownloadManager.COLUMN_STATUS));
                }
            } catch (Exception ignored) {
                return 0;
            }
            return 0;
        }

        @JavascriptInterface
        public void installDownloadedUpdate() {
            runOnUiThread(() -> {
                if (getUpdateDownloadStatus()!=DownloadManager.STATUS_SUCCESSFUL)return;
                if (Build.VERSION.SDK_INT >= 26 &&
                    !getPackageManager().canRequestPackageInstalls()) {
                    try {
                        startActivity(new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES,
                            Uri.parse("package:" + getPackageName())));
                    } catch (Exception ignored) {}
                    return;
                }
                try {
                    long id=getSharedPreferences(UPDATE_PREFERENCES,MODE_PRIVATE)
                        .getLong(UPDATE_DOWNLOAD_ID,-1);
                    DownloadManager manager=(DownloadManager)
                        getSystemService(Context.DOWNLOAD_SERVICE);
                    if (manager == null) return;
                    Uri apk=manager.getUriForDownloadedFile(id);
                    if (apk == null) return;
                    Intent install=new Intent(Intent.ACTION_VIEW);
                    install.setDataAndType(apk,APK_MIME);
                    install.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                    startActivity(install);
                } catch (Exception ignored) {
                    // La app queda utilizable; Android sigue teniendo la APK
                    // descargada y el usuario puede reintentar la instalación.
                }
            });
        }

        @JavascriptInterface
        public void setFullscreen(boolean enabled) {
            runOnUiThread(() -> applyFullscreen(enabled));
        }

        @JavascriptInterface
        public void configureVolumeActions(String up, String down) {
            upIsSystem = "system".equals(up);
            downIsSystem = "system".equals(down);
        }

        @JavascriptInterface
        public void configureReminder(boolean enabled, int hour, int minute, String weekdays) {
            runOnUiThread(() -> {
                ReminderScheduler.save(MainActivity.this, enabled, hour, minute, weekdays);
                if (enabled && Build.VERSION.SDK_INT >= 33 &&
                    checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS)
                        != PackageManager.PERMISSION_GRANTED) {
                    requestPermissions(new String[] {
                        Manifest.permission.POST_NOTIFICATIONS
                    }, NOTIFICATION_PERMISSION_REQUEST);
                } else {
                    ReminderScheduler.schedule(MainActivity.this);
                    notifyReminderPermission();
                }
            });
        }
    }

    private void applyFullscreen(boolean enabled) {
        nativeFullscreen = enabled;
        // El tema oculta la barra ya durante el splash. Al salir de
        // pantalla completa hay que limpiar también el flag nativo:
        // WindowInsetsController.show() solo no revierte el tema.
        if (enabled) {
            getWindow().addFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN);
        } else {
            getWindow().clearFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN);
        }
        View decor = getWindow().getDecorView();
        if (Build.VERSION.SDK_INT >= 30) {
            WindowInsetsController controller = decor.getWindowInsetsController();
            if (controller != null) {
                if (enabled) {
                    controller.hide(WindowInsets.Type.statusBars() |
                        WindowInsets.Type.navigationBars());
                    controller.setSystemBarsBehavior(
                        WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
                } else {
                    controller.show(WindowInsets.Type.statusBars() |
                        WindowInsets.Type.navigationBars());
                }
            }
        } else {
            int flags = enabled ?
                View.SYSTEM_UI_FLAG_FULLSCREEN |
                View.SYSTEM_UI_FLAG_HIDE_NAVIGATION |
                View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY |
                View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN |
                View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION |
                View.SYSTEM_UI_FLAG_LAYOUT_STABLE : 0;
            decor.setSystemUiVisibility(flags);
        }
        if (webView != null) {
            webView.evaluateJavascript(
                "window.rosarioNativeFullscreenChanged&&" +
                "window.rosarioNativeFullscreenChanged(" + enabled + ")", null);
        }
    }

    private void notifyReminderPermission() {
        boolean allowed = Build.VERSION.SDK_INT < 33 ||
            checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS)
                == PackageManager.PERMISSION_GRANTED;
        if (webView != null) {
            webView.evaluateJavascript(
                "window.rosarioAndroidReminderPermission&&" +
                "window.rosarioAndroidReminderPermission(" + allowed + ")", null);
        }
    }

    @Override
    public void onRequestPermissionsResult(
            int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == NOTIFICATION_PERMISSION_REQUEST) {
            ReminderScheduler.schedule(this);
            notifyReminderPermission();
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle state) {
        super.onCreate(state);

        webView = new WebView(this);
        webView.setBackgroundColor(Color.rgb(32, 41, 36));
        // Prevent Android 12+ edge stretch from visually spreading bead columns.
        webView.setOverScrollMode(View.OVER_SCROLL_NEVER);
        webView.setLayoutParams(new ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT));

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setAllowFileAccessFromFileURLs(false);
        settings.setAllowUniversalAccessFromFileURLs(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setSupportMultipleWindows(false);

        final WebViewAssetLoader loader = new WebViewAssetLoader.Builder()
                .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
                .build();

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                // La interfaz web debe conocer el modo inicial después de
                // instalar sus controles. Sin esto el botón de pantalla
                // completa podría mostrar el estado contrario al de Android.
                if (ROOT.equals(url)) {
                    view.evaluateJavascript(
                        "window.rosarioNativeFullscreenChanged&&" +
                        "window.rosarioNativeFullscreenChanged(" + nativeFullscreen + ")",
                        null);
                }
            }

            @Override
            public WebResourceResponse shouldInterceptRequest(
                    WebView view, WebResourceRequest request) {
                return loader.shouldInterceptRequest(request.getUrl());
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if ("appassets.androidplatform.net".equals(uri.getHost())
                        && uri.getPath() != null
                        && uri.getPath().startsWith("/assets/www/")) {
                    return false;
                }
                try {
                    startActivity(new Intent(Intent.ACTION_VIEW, uri));
                } catch (Exception ignored) {
                    // No browser available; keep the Rosary open.
                }
                return true;
            }
        });
        webView.addJavascriptInterface(new RosarioBridge(), "RosarioAndroid");
        setContentView(webView);
        // En Android el rosario comienza directamente en pantalla
        // completa. El botón de la interfaz permite salir y regresar;
        // no se fuerza otra vez si el usuario decidió desactivarla.
        applyFullscreen(true);
        ReminderScheduler.schedule(this);
        webView.loadUrl(ROOT);
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        // Los diálogos del sistema y el cambio de aplicación pueden
        // devolver las barras: restaurarlas sólo si sigue activado el
        // modo inmersivo elegido por el usuario.
        if (hasFocus && nativeFullscreen) applyFullscreen(true);
    }

    @Override
    public boolean dispatchKeyEvent(KeyEvent event) {
        final int keyCode = event.getKeyCode();
        final boolean assigned =
            (keyCode == KeyEvent.KEYCODE_VOLUME_UP && !upIsSystem) ||
            (keyCode == KeyEvent.KEYCODE_VOLUME_DOWN && !downIsSystem);
        // Interceptar antes de que WebView procese la tecla. Sólo es
        // posible cuando Android realmente entrega el evento a esta Activity.
        if (prayerActive && assigned) {
            if (event.getAction() == KeyEvent.ACTION_DOWN &&
                    event.getRepeatCount() == 0 && webView != null) {
                final String direction =
                    keyCode == KeyEvent.KEYCODE_VOLUME_UP ? "up" : "down";
                webView.evaluateJavascript(
                    "window.rosarioHardwareKey && window.rosarioHardwareKey('"
                        + direction + "')", null);
            }
            return true;
        }
        return super.dispatchKeyEvent(event);
    }

    @SuppressWarnings("deprecation")
    @Override
    public void onBackPressed() {
        if (webView == null) {
            super.onBackPressed();
            return;
        }
        webView.evaluateJavascript(
                "(function(){if(window.rosarioNavigateBack&&" +
                "window.rosarioNavigateBack())return true;" +
                "const m=document.getElementById('modal');" +
                "if(m&&m.open){m.close();return true;}return false;})()",
                result -> {
                    if (!"true".equals(result)) {
                        if (nativeFullscreen) applyFullscreen(false);
                        else if (webView.canGoBack()) webView.goBack();
                        else MainActivity.super.onBackPressed();
                    }
                });
    }

    @Override
    protected void onDestroy() {
        prayerActive = false;
        if (webView != null) {
            webView.destroy();
            webView = null;
        }
        super.onDestroy();
    }
}
