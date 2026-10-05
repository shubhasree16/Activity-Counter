import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { toDateString } from './weekUtils';

const CHANNEL_ID = 'daily-reminder';
const DAYS_AHEAD = 14;

if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export async function ensureNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
        name: 'Daily reminder',
        importance: Notifications.AndroidImportance.HIGH,
        lightColor: '#FF1F8E',
      });
    }
    const current = await Notifications.getPermissionsAsync();
    if (current.granted) return true;
    const requested = await Notifications.requestPermissionsAsync();
    return requested.granted;
  } catch (e) {
    console.error('Notification permission error', e);
    return false;
  }
}

/**
 * Schedules one reminder per day for the next two weeks at the chosen time.
 * Today's reminder is skipped when a box has already been checked today,
 * so the nudge only arrives on days a box was missed.
 */
export async function syncDailyReminders(
  enabled: boolean,
  time: string,
  lastCheckDate: string | null,
  userName: string,
): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    if (!enabled) return;
    const granted = await ensureNotificationPermission();
    if (!granted) return;

    const [h, m] = (time || '21:00').split(':').map((n) => parseInt(n, 10));
    const now = new Date();
    const todayStr = toDateString(now);

    for (let i = 0; i < DAYS_AHEAD; i++) {
      const fireAt = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i, h || 0, m || 0, 0, 0);
      if (fireAt <= now) continue;
      if (i === 0 && lastCheckDate === todayStr) continue;
      const isSunday = fireAt.getDay() === 0;
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `${userName || 'Hey'}, no box checked today`,
          body: isSunday
            ? 'Sunday walk time — get out there and tick it off.'
            : 'One box a day keeps the week on track. Tick off your session.',
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: fireAt,
          channelId: CHANNEL_ID,
        },
      });
    }
  } catch (e) {
    console.error('Failed to schedule reminders', e);
  }
}
