import React, { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { ActivityId } from '../constants/activities';
import { ACTIVITIES } from '../constants/activities';
import {
  createEmptySessions,
  countCompleted,
  loadCurrentWeek,
  saveCurrentWeek,
  loadHistory,
  saveHistory,
  loadSettings,
  saveSettings,
  DEFAULT_SETTINGS,
  type WeekData,
  type HistoryEntry,
  type AppSettings,
} from '../utils/storage';
import { getCurrentMonday, toDateString, getSundayFromMonday } from '../utils/weekUtils';
import { syncDailyReminders } from '../utils/notifications';

interface DataContextType {
  currentWeek: WeekData;
  history: HistoryEntry[];
  settings: AppSettings;
  completedCount: number;
  toggleSession: (activityId: ActivityId, index: number) => void;
  resetWeek: () => Promise<void>;
  updateSettings: (s: Partial<AppSettings>) => void;
  isLoading: boolean;
}

const defaultWeek: WeekData = {
  weekStart: toDateString(getCurrentMonday()),
  sessions: createEmptySessions(),
};

const DataContext = createContext<DataContextType>({
  currentWeek: defaultWeek,
  history: [],
  settings: DEFAULT_SETTINGS,
  completedCount: 0,
  toggleSession: () => {},
  resetWeek: async () => {},
  updateSettings: () => {},
  isLoading: true,
});

export function useData() {
  return useContext(DataContext);
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [currentWeek, setCurrentWeek] = useState<WeekData>(defaultWeek);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [storedWeek, storedHistory, storedSettings] = await Promise.all([
          loadCurrentWeek(),
          loadHistory(),
          loadSettings(),
        ]);

        const currentMondayStr = toDateString(getCurrentMonday());
        let week = storedWeek;
        let hist = storedHistory ?? [];

        if (week && week.weekStart !== currentMondayStr) {
          // Auto-save old week to history and reset
          const completed = countCompleted(week?.sessions ?? createEmptySessions());
          const entry: HistoryEntry = {
            weekStart: week.weekStart,
            weekEnd: getSundayFromMonday(week.weekStart),
            completed,
            total: 7,
            activities: { ...(week?.sessions ?? createEmptySessions()) },
          };
          hist = [entry, ...hist];
          await saveHistory(hist);
          week = { weekStart: currentMondayStr, sessions: createEmptySessions() };
          await saveCurrentWeek(week);
        } else if (!week) {
          week = { weekStart: currentMondayStr, sessions: createEmptySessions() };
          await saveCurrentWeek(week);
        }

        setCurrentWeek(week);
        setHistory(hist);
        if (storedSettings) setSettings(storedSettings);
      } catch (e) {
        console.error('Failed to load saved data', e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const updateSettings = useCallback((partial: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      saveSettings(next);
      return next;
    });
  }, []);

  // Keep the daily "missed a box" reminders in sync with settings and today's check-ins
  useEffect(() => {
    if (isLoading) return;
    syncDailyReminders(
      settings.remindersEnabled,
      settings.reminderTime,
      settings.lastCheckDate,
      settings.userName,
    );
  }, [isLoading, settings.remindersEnabled, settings.reminderTime, settings.lastCheckDate, settings.userName]);

  const toggleSession = useCallback((activityId: ActivityId, index: number) => {
    const wasChecked = currentWeek?.sessions?.[activityId]?.[index] ?? false;
    if (!wasChecked) {
      const today = toDateString(new Date());
      if (settings.lastCheckDate !== today) updateSettings({ lastCheckDate: today });
    }
    setCurrentWeek((prev) => {
      const sessions = { ...(prev?.sessions ?? createEmptySessions()) };
      const arr = [...(sessions[activityId] ?? [])];
      if (index >= 0 && index < arr.length) {
        arr[index] = !arr[index];
      }
      sessions[activityId] = arr;
      const next = { ...prev, sessions };
      saveCurrentWeek(next);
      return next;
    });
  }, [currentWeek, settings.lastCheckDate, updateSettings]);

  const resetWeek = useCallback(async () => {
    const completed = countCompleted(currentWeek?.sessions ?? createEmptySessions());
    const entry: HistoryEntry = {
      weekStart: currentWeek?.weekStart ?? toDateString(getCurrentMonday()),
      weekEnd: getSundayFromMonday(currentWeek?.weekStart ?? toDateString(getCurrentMonday())),
      completed,
      total: 7,
      activities: { ...(currentWeek?.sessions ?? createEmptySessions()) },
    };
    const newHistory = [entry, ...history];
    const newWeek: WeekData = {
      weekStart: toDateString(getCurrentMonday()),
      sessions: createEmptySessions(),
    };
    setHistory(newHistory);
    setCurrentWeek(newWeek);
    await saveHistory(newHistory);
    await saveCurrentWeek(newWeek);
  }, [currentWeek, history]);

  const completedCount = countCompleted(currentWeek?.sessions ?? createEmptySessions());

  return (
    <DataContext.Provider
      value={{
        currentWeek,
        history,
        settings,
        completedCount,
        toggleSession,
        resetWeek,
        updateSettings,
        isLoading,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
