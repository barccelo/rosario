package com.barccelo.rosario;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

public final class ReminderReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent != null &&
            "com.barccelo.rosario.PRAYER_REMINDER".equals(intent.getAction())) {
            ReminderScheduler.showReminder(context);
        }
        ReminderScheduler.schedule(context);
    }
}
