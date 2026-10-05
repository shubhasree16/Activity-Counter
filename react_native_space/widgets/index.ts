import { Platform } from 'react-native';
import type { StoredState } from '../services/weekStore';

// The widget library's native module only exists in the installed Android app (APK).
// It is loaded lazily so the web preview and Expo Go never touch it.
type WidgetModule = typeof import('./widgetTaskHandler');
let cached: WidgetModule | null | undefined;

function getWidgetModule(): WidgetModule | null {
  if (cached !== undefined) return cached;
  cached = null;
  if (Platform.OS !== 'android') return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    cached = require('./widgetTaskHandler') as WidgetModule;
  } catch (e) {
    console.warn('Home-screen widgets unavailable in this build', e);
  }
  return cached;
}

export function registerAndroidWidgets(): void {
  const mod = getWidgetModule();
  if (!mod) return;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { registerWidgetTaskHandler } = require('react-native-android-widget');
    registerWidgetTaskHandler(mod.widgetTaskHandler);
  } catch (e) {
    console.warn('Could not register widget handler', e);
  }
}

/** Redraw home-screen widgets after the app changes data. No-op outside the Android APK. */
export function refreshWidgets(state: StoredState): void {
  const mod = getWidgetModule();
  if (!mod) return;
  mod.redrawAll(state).catch((e) => console.warn('Widget refresh failed', e));
}
