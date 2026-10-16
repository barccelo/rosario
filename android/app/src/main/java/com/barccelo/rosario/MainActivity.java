package com.barccelo.rosario;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Vibrator;
import android.os.VibratorManager;
import android.os.VibrationEffect;
import android.os.Bundle;
import android.os.Build;
import android.Manifest;
import android.content.pm.PackageManager;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.view.View;
import android.view.KeyEvent;
import android.view.ViewGroup;
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

    public final class RosarioBridge {
        @JavascriptInterface
        public void setPrayerActive(boolean active) {
            prayerActive = active;
        }

        @JavascriptInterface
        public void vibrate(int milliseconds) {
            if (milliseconds <= 0) return;
            final int duration = Math.min(milliseconds, 150);
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
        ReminderScheduler.schedule(this);
        webView.loadUrl(ROOT);
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
                "(function(){if(window.rosarioCloseChoiceSheet&&" +
                "window.rosarioCloseChoiceSheet())return true;" +
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
