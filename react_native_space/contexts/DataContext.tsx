import React, { createContext, useContext, useEffect, useRef, useState, useCallback, type ReactNode } from 'react';
import { AppState } from 'react-native';
import type { ActivityId } from '../constants/activities';
import {
  createEmptySessions,
  countCompleted,
  saveCurrentWeek,
  saveHistory,
  saveSettings,
  DEFAULT_SETTINGS,
  type WeekData,
  type HistoryEntry,
  type AppSettings,
} from '../utils/storage';
import { toDateString } from '../utils/weekUtils';
import { syncDailyReminders } from '../utils/notifications';
import { applyToggle, emptyWeek, loadState, toHistoryEntry } from '../services/weekStore';
import { refreshWidgets } from '../widgets';

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

const defaultWeek: WeekData = emptyWeek();

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
  const hydrated = useRef(false);

  // Load from storage (also handles the Monday reset). Re-run when the app comes back
  // to the foreground so ticks made on the home-screen widget show up here.
  const reload = useCallback(async () => {
    try {
      const state = await loadState();
      setCurrentWeek(state.week);
      setHistory(state.history);
      setSettings(state.settings);
    } catch (e) {
      console.error('Failed to load saved data', e);
    } finally {
      setIsLoading(false);
      hydrated.current = true;
    }
  }, []);

  useEffect(() => {
    reload();
    const sub = AppState.addEventListener('change', (s) => {
      if (s === 'active') reload();
    });
    return () => sub.remove();
  }, [reload]);

  // Redraw home-screen widgets whenever the data they show changes
  useEffect(() => {
    if (!hydrated.current) return;
    refreshWidgets({ week: currentWeek, history, settings });
  }, [currentWeek, history, settings]);

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
    const today = toDateString(new Date());
    const wasChecked = currentWeek?.sessions?.[activityId]?.[index] ?? false;
    if (!wasChecked && settings.lastCheckDate !== today) updateSettings({ lastCheckDate: today });
    setCurrentWeek((prev) => {
      const next = applyToggle(prev, activityId, index, today);
      saveCurrentWeek(next);
      return next;
    });
  }, [currentWeek, settings.lastCheckDate, updateSettings]);

  const resetWeek = useCallback(async () => {
    const newHistory = [toHistoryEntry(currentWeek), ...history];
    const newWeek = emptyWeek();
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
