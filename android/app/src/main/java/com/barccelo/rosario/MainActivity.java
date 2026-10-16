package com.barccelo.rosario;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
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

    public final class RosarioBridge {
        @JavascriptInterface
        public void setPrayerActive(boolean active) {
            prayerActive = active;
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle state) {
        super.onCreate(state);

        webView = new WebView(this);
        webView.setBackgroundColor(Color.rgb(32, 41, 36));
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
        webView.loadUrl(ROOT);
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (prayerActive &&
                (keyCode == KeyEvent.KEYCODE_VOLUME_UP ||
                 keyCode == KeyEvent.KEYCODE_VOLUME_DOWN)) {
            if (event.getRepeatCount() == 0) {
                String direction = keyCode == KeyEvent.KEYCODE_VOLUME_UP ? "up" : "down";
                webView.evaluateJavascript(
                        "window.rosarioHardwareKey && window.rosarioHardwareKey('"
                                + direction + "')", null);
            }
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }

    @Override
    public boolean onKeyUp(int keyCode, KeyEvent event) {
        if (prayerActive &&
                (keyCode == KeyEvent.KEYCODE_VOLUME_UP ||
                 keyCode == KeyEvent.KEYCODE_VOLUME_DOWN)) {
            return true;
        }
        return super.onKeyUp(keyCode, event);
    }

    @SuppressWarnings("deprecation")
    @Override
    public void onBackPressed() {
        webView.evaluateJavascript(
                "(function(){const m=document.getElementById('modal');"
                + "if(m&&m.open){m.close();return true;}return false;})()",
                result -> {
                    if (!"true".equals(result)) {
                        if (webView.canGoBack()) webView.goBack();
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
