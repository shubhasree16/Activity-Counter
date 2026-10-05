import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ActivityIcon from './ActivityIcon';
import PillCheckbox from './PillCheckbox';
import { Colors, Fonts, CardStyle } from '../constants/theme';
import type { ActivityDef, ActivityId } from '../constants/activities';

interface Props {
  activity: ActivityDef;
  sessions: boolean[];
  onToggle: (activityId: ActivityId, index: number) => void;
  onChecked?: (x: number, y: number) => void;
}

export default function ActivityCard({ activity, sessions, onToggle, onChecked }: Props) {
  const safeSessions = sessions ?? [];
  const allDone = safeSessions.length > 0 && safeSessions.every(Boolean);
  const completedCount = safeSessions.filter(Boolean).length;

  return (
    <View style={[styles.card, allDone && styles.cardDone]}>
      <View style={styles.left}>
        <View style={styles.iconBox}>
          <ActivityIcon type={activity?.iconType ?? 'swimming'} size={26} />
        </View>
        <View style={styles.textCol}>
          <Text style={styles.name}>{activity?.name ?? ''}</Text>
          <Text style={styles.sub}>
            {completedCount} of {activity?.target ?? 0}
            {allDone ? ' · ' : ''}
            {allDone && <Text style={styles.doneLabel}>Done</Text>}
          </Text>
        </View>
      </View>
      <View style={styles.pills}>
        {safeSessions.map((checked, i) => (
          <PillCheckbox
            key={`${activity?.id ?? 'a'}-${i}`}
            checked={checked}
            onToggle={() => onToggle(activity?.id, i)}
            onChecked={onChecked}
            accessibilityLabel={`${activity?.name ?? 'Activity'} session ${i + 1}`}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...CardStyle,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardDone: {
    shadowColor: Colors.hotPink,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: {
    flex: 1,
  },
  name: {
    fontFamily: Fonts.activityName,
    fontSize: 20,
    color: Colors.black,
  },
  sub: {
    fontFamily: Fonts.label,
    fontSize: 14,
    color: Colors.black,
    marginTop: 2,
  },
  doneLabel: {
    fontFamily: Fonts.activityName,
    fontSize: 11,
    color: Colors.hotPink,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  pills: {
    flexDirection: 'row',
    gap: 8,
  },
});
