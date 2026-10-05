import React from 'react';
import { requestWidgetUpdate, type WidgetTaskHandlerProps } from 'react-native-android-widget';
import type { ActivityId } from '../constants/activities';
import { ACTIVITIES } from '../constants/activities';
import { loadState, toggleInStorage, type StoredState } from '../services/weekStore';
import { syncDailyReminders } from '../utils/notifications';
import { WeeklyBoardWidget } from './WeeklyBoardWidget';
import { WeekStripWidget } from './WeekStripWidget';
import { WIDGET_NAMES } from './widgetTheme';

export function renderFor(widgetName: string, state: StoredState) {
  if (widgetName === WIDGET_NAMES.strip) return <WeekStripWidget week={state.week} />;
  return <WeeklyBoardWidget week={state.week} />;
}

/** Redraw every placed widget of both kinds from the given state. */
export async function redrawAll(state: StoredState): Promise<void> {
  await Promise.all(
    Object.values(WIDGET_NAMES).map((widgetName) =>
      requestWidgetUpdate({ widgetName, renderWidget: () => renderFor(widgetName, state) }),
    ),
  );
}

function isActivityId(v: unknown): v is ActivityId {
  return typeof v === 'string' && ACTIVITIES.some((a) => a.id === v);
}

export async function widgetTaskHandler(props: WidgetTaskHandlerProps): Promise<void> {
  try {
    switch (props.widgetAction) {
      case 'WIDGET_ADDED':
      case 'WIDGET_UPDATE':
      case 'WIDGET_RESIZED': {
        const state = await loadState();
        props.renderWidget(renderFor(props.widgetInfo.widgetName, state));
        break;
      }
      case 'WIDGET_CLICK': {
        if (props.clickAction !== 'TOGGLE') break;
        const { activityId, index } = props.clickActionData ?? {};
        if (!isActivityId(activityId) || typeof index !== 'number') break;
        const state = await toggleInStorage(activityId, index);
        props.renderWidget(renderFor(props.widgetInfo.widgetName, state));
        // Keep the other widget kind in step, and skip tonight's reminder once a box is ticked
        await redrawAll(state);
        const s = state.settings;
        await syncDailyReminders(s.remindersEnabled, s.reminderTime, s.lastCheckDate, s.userName);
        break;
      }
      default:
        break;
    }
  } catch (e) {
    console.error('Widget task failed', e);
  }
}
