package com.barccelo.rosario;

import android.Manifest;
import android.app.AlarmManager;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.graphics.BitmapFactory;
import android.os.Build;

import java.util.Calendar;

/** Local reminder: one upcoming alarm, rescheduled after delivery or reboot. */
final class ReminderScheduler {
    private static final String PREFS = "rosario_reminder";
    private static final String CHANNEL = "rosario_prayer";
    private static final String ACTION = "com.barccelo.rosario.PRAYER_REMINDER";
    private ReminderScheduler() {}

    static void save(Context context, boolean enabled, int hour, int minute, String weekdays) {
        if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return;
        if (weekdays == null || !weekdays.matches("[1-7](,[1-7])*")) {
            weekdays = "1,2,3,4,5,6,7";
        }
        context.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit()
            .putBoolean("enabled", enabled)
            .putInt("hour", hour)
            .putInt("minute", minute)
            .putString("weekdays", weekdays).apply();
    }

    private static PendingIntent reminderIntent(Context context) {
        Intent intent = new Intent(context, ReminderReceiver.class).setAction(ACTION);
        return PendingIntent.getBroadcast(context, 2026, intent,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    static void schedule(Context context) {
        AlarmManager alarm = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (alarm == null) return;
        PendingIntent pending = reminderIntent(context);
        alarm.cancel(pending);
        SharedPreferences p = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
        if (!p.getBoolean("enabled", false)) return;
        if (Build.VERSION.SDK_INT >= 33 &&
            context.checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS)
                != PackageManager.PERMISSION_GRANTED) return;

        int hour = p.getInt("hour", 20), minute = p.getInt("minute", 0);
        String days = p.getString("weekdays", "1,2,3,4,5,6,7");
        Calendar now = Calendar.getInstance();
        Calendar next = (Calendar) now.clone();
        next.set(Calendar.HOUR_OF_DAY, hour);
        next.set(Calendar.MINUTE, minute);
        next.set(Calendar.SECOND, 0);
        next.set(Calendar.MILLISECOND, 0);
        for (int i = 0; i <= 7; i++) {
            // ISO weekdays: Monday=1, Sunday=7.
            int iso = (next.get(Calendar.DAY_OF_WEEK) + 5) % 7 + 1;
            if (("," + days + ",").contains("," + iso + ",") &&
                next.getTimeInMillis() > now.getTimeInMillis() + 10000L) {
                alarm.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP,
                    next.getTimeInMillis(), pending);
                return;
            }
            next.add(Calendar.DAY_OF_MONTH, 1);
        }
    }

    static void showReminder(Context context) {
        if (Build.VERSION.SDK_INT >= 33 &&
            context.checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS)
                != PackageManager.PERMISSION_GRANTED) return;
        NotificationManager manager =
            (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        if (manager == null) return;
        if (Build.VERSION.SDK_INT >= 26) {
            NotificationChannel channel = new NotificationChannel(
                CHANNEL, "Recordatorios del Rosario", NotificationManager.IMPORTANCE_DEFAULT);
            channel.setDescription("Avisos para rezar el rosario");
            manager.createNotificationChannel(channel);
        }
        Intent launch = new Intent(context, MainActivity.class);
        launch.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent tap = PendingIntent.getActivity(context, 2027, launch,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        Notification.Builder builder = Build.VERSION.SDK_INT >= 26 ?
            new Notification.Builder(context, CHANNEL) : new Notification.Builder(context);
        builder.setContentTitle("Santo Rosario")
            .setContentText("Es un buen momento para rezar el rosario.")
            .setSmallIcon(R.drawable.ic_rosario_notification)
            .setLargeIcon(BitmapFactory.decodeResource(context.getResources(),
                R.drawable.rosario_launcher))
            .setColor(0xFFD7B77E)
            .setCategory(Notification.CATEGORY_REMINDER)
            .setContentIntent(tap)
            .setAutoCancel(true);
        manager.notify(2026, builder.build());
    }
}
