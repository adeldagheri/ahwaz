// بعد از `cap add android` اجرا می‌شود: افقی‌کردن و تمام‌صفحه‌کردن بازی
const fs = require('fs'), path = require('path');
const manifest = path.join('android','app','src','main','AndroidManifest.xml');
let m = fs.readFileSync(manifest, 'utf8');
if (!m.includes('screenOrientation')) {
  m = m.replace('<activity', '<activity\n            android:screenOrientation="sensorLandscape"');
}
fs.writeFileSync(manifest, m);

const styles = path.join('android','app','src','main','res','values','styles.xml');
let s = fs.readFileSync(styles, 'utf8');
if (!s.includes('windowFullscreen')) {
  s = s.replace(/(<style name="AppTheme.NoActionBar"[^>]*>)/,
    '$1\n        <item name="android:windowFullscreen">true</item>\n        <item name="android:windowLayoutInDisplayCutoutMode">shortEdges</item>');
}
fs.writeFileSync(styles, s);

// حالت immersive (مخفی‌شدن نوار پایین/بالا)
const ma = path.join('android','app','src','main','java','com','ahwaz','compiled','MainActivity.java');
fs.writeFileSync(ma, `package com.ahwaz.compiled;

import android.os.Bundle;
import android.view.View;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        hideBars();
    }
    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) hideBars();
    }
    private void hideBars() {
        getWindow().getDecorView().setSystemUiVisibility(
            View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
            | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
            | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
            | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
            | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
            | View.SYSTEM_UI_FLAG_FULLSCREEN);
    }
}
`);
console.log('Android project patched (landscape + fullscreen).');
