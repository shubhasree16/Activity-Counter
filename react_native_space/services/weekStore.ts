import type { ActivityId } from '../constants/activities';
import {
  createEmptySessions,
  createEmptyTickDates,
  countCompleted,
  loadCurrentWeek,
  saveCurrentWeek,
  loadHistory,
  saveHistory,
  loadSettings,
  saveSettings,
  type WeekData,
  type HistoryEntry,
  type AppSettings,
} from '../utils/storage';
import { getCurrentMonday, toDateString, getSundayFromMonday } from '../utils/weekUtils';

export interface StoredState {
  week: WeekData;
  history: HistoryEntry[];
  settings: AppSettings;
}

export function emptyWeek(): WeekData {
  return {
    weekStart: toDateString(getCurrentMonday()),
    sessions: createEmptySessions(),
    tickDates: createEmptyTickDates(),
  };
}

export function toHistoryEntry(week: WeekData): HistoryEntry {
  const sessions = week?.sessions ?? createEmptySessions();
  return {
    weekStart: week.weekStart,
    weekEnd: getSundayFromMonday(week.weekStart),
    completed: countCompleted(sessions),
    total: 7,
    activities: { ...sessions },
  };
}

/**
 * Loads everything from device storage. If the saved week is from a previous
 * week, it is archived to history and a fresh week is started (Monday reset).
 * Shared by the app and the home-screen widgets so both see the same data.
 */
export async function loadState(): Promise<StoredState> {
  const [storedWeek, storedHistory, settings] = await Promise.all([
    loadCurrentWeek(),
    loadHistory(),
    loadSettings(),
  ]);
  const currentMondayStr = toDateString(getCurrentMonday());
  let week = storedWeek;
  let history = storedHistory ?? [];

  if (week && week.weekStart !== currentMondayStr) {
    history = [toHistoryEntry(week), ...history];
    await saveHistory(history);
    week = emptyWeek();
    await saveCurrentWeek(week);
  } else if (!week) {
    week = emptyWeek();
    await saveCurrentWeek(week);
  }
  return { week, history, settings };
}

/** Returns the week with one session box flipped, recording the tick date. */
export function applyToggle(week: WeekData, activityId: ActivityId, index: number, today: string): WeekData {
  const sessions = { ...(week?.sessions ?? createEmptySessions()) };
  const tickDates = { ...createEmptyTickDates(), ...(week?.tickDates ?? {}) };
  const arr = [...(sessions[activityId] ?? [])];
  const dates = [...(tickDates[activityId] ?? [])];
  if (index < 0 || index >= arr.length) return week;
  arr[index] = !arr[index];
  dates[index] = arr[index] ? today : null;
  sessions[activityId] = arr;
  tickDates[activityId] = dates;
  return { ...week, sessions, tickDates };
}

/** Toggle straight from storage (used by the widget, which has no React state). */
export async function toggleInStorage(activityId: ActivityId, index: number): Promise<StoredState> {
  const state = await loadState();
  const today = toDateString(new Date());
  const wasChecked = state.week.sessions?.[activityId]?.[index] ?? false;
  const week = applyToggle(state.week, activityId, index, today);
  await saveCurrentWeek(week);
  let settings = state.settings;
  if (!wasChecked && settings.lastCheckDate !== today) {
    settings = { ...settings, lastCheckDate: today };
    await saveSettings(settings);
  }
  return { ...state, week, settings };
}
