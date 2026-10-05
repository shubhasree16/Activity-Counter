import React from 'react';
import { FlexWidget, OverlapWidget, SvgWidget, TextWidget } from 'react-native-android-widget';
import { ACTIVITIES, TOTAL_SESSIONS, type ActivityDef } from '../constants/activities';
import { countCompleted, createEmptySessions, type WeekData } from '../utils/storage';
import { formatWeekOf } from '../utils/weekUtils';
import { activitySvg, iconSize } from './widgetIcons';
import { W } from './widgetTheme';

interface Props {
  week: WeekData;
}

const SHORT_NAME: Record<string, string> = { swimming: 'Swim' };

function Pill({ activityId, index, on }: { activityId: string; index: number; on: boolean }) {
  return (
    <FlexWidget
      clickAction="TOGGLE"
      clickActionData={{ activityId, index }}
      accessibilityLabel={`${on ? 'Untick' : 'Tick'} ${activityId} session ${index + 1}`}
      style={{ paddingHorizontal: 2, paddingVertical: 3 }}
    >
      <FlexWidget
        style={{
          width: 30,
          height: 20,
          borderRadius: 10,
          borderWidth: 1.5,
          borderColor: on ? W.pink : W.black,
          backgroundColor: on ? W.pink : W.white,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <TextWidget text={on ? '✓' : ' '} style={{ fontSize: 11, color: W.white, fontWeight: 'bold' }} />
      </FlexWidget>
    </FlexWidget>
  );
}

function ActivityRow({ activity, done }: { activity: ActivityDef; done: boolean[] }) {
  const size = iconSize(activity.id, 15);
  return (
    <FlexWidget
      style={{ width: 'match_parent', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
    >
      <FlexWidget style={{ flexDirection: 'row', alignItems: 'center' }}>
        <FlexWidget
          style={{
            width: 24,
            height: 24,
            borderRadius: 7,
            borderWidth: 1.5,
            borderColor: W.black,
            backgroundColor: W.white,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 6,
          }}
        >
          <SvgWidget svg={activitySvg(activity.id)} style={size} />
        </FlexWidget>
        <TextWidget
          text={SHORT_NAME[activity.id] ?? activity.name}
          style={{ fontSize: 16, color: W.black, fontFamily: W.serifSemiBold, fontWeight: '600' }}
        />
      </FlexWidget>
      <FlexWidget style={{ flexDirection: 'row' }}>
        {done.map((on, i) => (
          <Pill key={i} activityId={activity.id} index={i} on={on} />
        ))}
      </FlexWidget>
    </FlexWidget>
  );
}

export function WeeklyBoardWidget({ week }: Props) {
  const sessions = week?.sessions ?? createEmptySessions();
  const completed = countCompleted(sessions);
  const left = ACTIVITIES.slice(0, 3);
  const right = ACTIVITIES.slice(3);

  return (
    <OverlapWidget style={{ width: 'match_parent', height: 'match_parent' }}>
      <FlexWidget
        style={{ width: 'match_parent', height: 'match_parent', marginLeft: 4, marginTop: 4, borderRadius: 22, backgroundColor: W.black }}
      />
      <FlexWidget
        clickAction="OPEN_APP"
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
          paddingVertical: 10,
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <FlexWidget style={{ width: 'match_parent', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <TextWidget
            text={formatWeekOf(week.weekStart)}
            style={{ fontSize: 22, color: W.black, fontFamily: W.serifBoldItalic, fontWeight: '700', fontStyle: 'italic' }}
          />
          <TextWidget
            text={`${completed}/${TOTAL_SESSIONS}`}
            style={{ fontSize: 26, color: W.pink, fontFamily: W.serifBoldItalic, fontWeight: '700', fontStyle: 'italic', marginLeft: 8 }}
          />
        </FlexWidget>

        <FlexWidget style={{ width: 'match_parent', flexDirection: 'row' }}>
          <FlexWidget style={{ flex: 1, flexDirection: 'column', marginRight: 14 }}>
            {left.map((a) => (
              <ActivityRow key={a.id} activity={a} done={sessions[a.id] ?? []} />
            ))}
          </FlexWidget>
          <FlexWidget style={{ flex: 1, flexDirection: 'column' }}>
            {right.map((a) => (
              <ActivityRow key={a.id} activity={a} done={sessions[a.id] ?? []} />
            ))}
          </FlexWidget>
        </FlexWidget>
      </FlexWidget>
    </OverlapWidget>
  );
}
