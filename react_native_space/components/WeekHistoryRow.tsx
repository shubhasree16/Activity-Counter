import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Fonts, CardStyle } from '../constants/theme';
import type { HistoryEntry } from '../utils/storage';
import { formatWeekRange } from '../utils/weekUtils';

interface Props {
  entry: HistoryEntry;
}

export default function WeekHistoryRow({ entry }: Props) {
  const completed = entry?.completed ?? 0;
  const total = entry?.total ?? 7;
  let indicatorColor: string = Colors.gray;
  if (completed >= total) indicatorColor = Colors.green;
  else if (completed > 0) indicatorColor = Colors.hotPink;

  return (
    <View style={styles.card}>
      <View style={[styles.indicator, { backgroundColor: indicatorColor }]} />
      <View style={styles.textCol}>
        <Text style={styles.range}>
          {formatWeekRange(entry?.weekStart ?? '', entry?.weekEnd ?? '')}
        </Text>
        <Text style={styles.detail}>{completed} of {total} sessions</Text>
      </View>
      <Text style={styles.fraction}>{completed}/{total}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...CardStyle,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  indicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  textCol: {
    flex: 1,
  },
  range: {
    fontFamily: Fonts.activityName,
    fontSize: 16,
    color: Colors.black,
  },
  detail: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.black,
    marginTop: 2,
  },
  fraction: {
    fontFamily: Fonts.display,
    fontSize: 20,
    color: Colors.black,
  },
});
