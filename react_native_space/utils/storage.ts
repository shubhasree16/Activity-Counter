import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ActivityId } from '../constants/activities';

const KEYS = {
  currentWeek: '@veera/currentWeek',
  history: '@veera/history',
  settings: '@veera/settings',
} as const;

export interface WeekData {
  weekStart: string; // YYYY-MM-DD (Monday)
  sessions: Record<ActivityId, boolean[]>;
}

export interface HistoryEntry {
  weekStart: string;
  weekEnd: string;
  completed: number;
  total: number;
  activities: Record<ActivityId, boolean[]>;
}

export interface AppSettings {
  remindersEnabled: boolean;
  reminderTime: string; // HH:mm
  userName: string;
  lastCheckDate: string | null; // YYYY-MM-DD of the most recent box check
}

export const DEFAULT_SETTINGS: AppSettings = {
  remindersEnabled: true,
  reminderTime: '21:00',
  userName: 'Veera',
  lastCheckDate: null,
};

export function createEmptySessions(): Record<ActivityId, boolean[]> {
  return {
    swimming: [false],
    pilates: [false, false],
    gym: [false, false],
    yoga: [false],
    walk: [false],
  };
}

export function countCompleted(sessions: Record<ActivityId, boolean[]>): number {
  let count = 0;
  for (const key of Object.keys(sessions ?? {})) {
    const arr = sessions?.[key as ActivityId];
    if (arr) {
      for (const v of arr) {
        if (v) count++;
      }
    }
  }
  return count;
}

export async function loadCurrentWeek(): Promise<WeekData | null> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.currentWeek);
    if (!raw) return null;
    return JSON.parse(raw) as WeekData;
  } catch {
    return null;
  }
}

export async function saveCurrentWeek(data: WeekData): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.currentWeek, JSON.stringify(data));
  } catch {
    // silently fail
  }
}

export async function loadHistory(): Promise<HistoryEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.history);
    if (!raw) return [];
    return JSON.parse(raw) as HistoryEntry[];
  } catch {
    return [];
  }
}

export async function saveHistory(data: HistoryEntry[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.history, JSON.stringify(data));
  } catch {
    // silently fail
  }
}

export async function loadSettings(): Promise<AppSettings> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.settings);
    if (!raw) return { ...DEFAULT_SETTINGS };
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<AppSettings>) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export async function saveSettings(data: AppSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.settings, JSON.stringify(data));
  } catch {
    // silently fail
  }
}
