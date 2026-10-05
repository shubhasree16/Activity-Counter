import React from 'react';
import { FlexWidget, OverlapWidget, SvgWidget, TextWidget } from 'react-native-android-widget';
import { ACTIVITIES, type ActivityId } from '../constants/activities';
import type { WeekData } from '../utils/storage';
import { toDateString } from '../utils/weekUtils';
import { activitySvg, iconSize } from './widgetIcons';
import { W } from './widgetTheme';

interface Props {
  week: WeekData;
}

// Veera's planned routine, Monday → Sunday
const PLAN: ActivityId[] = ['swimming', 'pilates', 'pilates', 'gym', 'yoga', 'gym', 'walk'];
const LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

/** Activities ticked on each day of the week (Mon = 0), in app order. */
export function ticksByDay(week: WeekData): ActivityId[][] {
  const days: ActivityId[][] = [[], [], [], [], [], [], []];
  const monday = new Date(week.weekStart + 'T00:00:00');
  const dayIndex: Record<string, number> = {};
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
    dayIndex[toDateString(d)] = i;
  }
  for (const a of ACTIVITIES) {
    const dates = week.tickDates?.[a.id] ?? [];
    dates.forEach((date, i) => {
      if (!date || !week.sessions?.[a.id]?.[i]) return;
      const idx = dayIndex[date];
      if (idx !== undefined && !days[idx].includes(a.id)) days[idx].push(a.id);
    });
  }
  return days;
}

function Day({ label, icon, ticked, extra, isToday }: { label: string; icon: ActivityId; ticked: boolean; extra: number; isToday: boolean }) {
  const size = iconSize(icon, 16);
  return (
    <FlexWidget style={{ flexDirection: 'column', alignItems: 'center' }}>
      <FlexWidget
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          borderWidth: isToday && !ticked ? 2.5 : 1.5,
          borderColor: ticked || isToday ? W.pink : W.black,
          backgroundColor: ticked ? W.pink : W.white,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <SvgWidget svg={activitySvg(icon, ticked ? W.white : undefined)} style={size} />
      </FlexWidget>
      <TextWidget
        text={extra > 0 ? `${label}+${extra}` : label}
        style={{
          fontSize: 13,
          marginTop: 2,
          color: isToday ? W.pink : W.black,
          fontFamily: W.serifBoldItalic,
          fontWeight: '700',
          fontStyle: 'italic',
        }}
      />
    </FlexWidget>
  );
}

export function WeekStripWidget({ week }: Props) {
  const ticks = ticksByDay(week);
  const now = new Date();
  const todayIdx = (now.getDay() + 6) % 7;
  const isThisWeek = toDateString(now) >= week.weekStart;

  return (
    <OverlapWidget style={{ width: 'match_parent', height: 'match_parent' }}>
      <FlexWidget
        style={{ width: 'match_parent', height: 'match_parent', marginLeft: 4, marginTop: 4, borderRadius: 22, backgroundColor: W.black }}
      />
      <FlexWidget
        clickAction="OPEN_APP"
        accessibilityLabel="Week strip. Open Activity Counter"
        style={{
          width: 'match_parent',
          height: 'match_parent',
          marginRight: 4,
          marginBottom: 4,
          borderRadius: 22,
          borderWidth: 2,
          borderColor: W.black,
          backgroundColor: W.blush,
          paddingHorizontal: 14,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {LABELS.map((label, i) => {
          const done = ticks[i];
          return (
            <Day
              key={i}
              label={label}
              icon={done[0] ?? PLAN[i]}
              ticked={done.length > 0}
              extra={Math.max(done.length - 1, 0)}
              isToday={isThisWeek && i === todayIdx}
            />
          );
        })}
      </FlexWidget>
    </OverlapWidget>
  );
}
