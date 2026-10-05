import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useData } from '../../contexts/DataContext';
import { ACTIVITIES, TOTAL_SESSIONS } from '../../constants/activities';
import { Colors, Fonts, Spacing, CardStyle, TitleSize } from '../../constants/theme';
import { formatWeekRange, getSundayFromMonday } from '../../utils/weekUtils';

export default function SummaryScreen() {
  const { currentWeek, completedCount, settings } = useData();
  const name = settings?.userName?.trim() || 'Veera';
  const pct = TOTAL_SESSIONS > 0 ? Math.round((completedCount / TOTAL_SESSIONS) * 100) : 0;

  const getMotivation = () => {
    if (pct === 100) return `Perfect week, ${name}! You crushed it!`;
    if (pct >= 70) return 'Almost there! Keep pushing!';
    if (pct >= 40) return 'Good start! Let\'s finish strong!';
    if (pct > 0) return 'Every session counts. You\'ve got this!';
    return 'A fresh week awaits. Let\'s go!';
  };

  const weekStart = currentWeek?.weekStart ?? '';
  const weekEnd = getSundayFromMonday(weekStart);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>Weekly Summary</Text>

        {/* Completion Circle */}
        <View style={styles.circleWrap}>
          <View style={styles.circle}>
            <Text style={styles.circlePct}>{pct}%</Text>
          </View>
          <Text style={styles.circleLabel}>completed</Text>
        </View>

        {/* Activity Breakdown */}
        <View style={styles.breakdownList}>
          {ACTIVITIES.map((activity) => {
            const sessions = currentWeek?.sessions?.[activity?.id] ?? [];
            const done = sessions.filter(Boolean).length;
            const allDone = done >= (activity?.target ?? 0) && (activity?.target ?? 0) > 0;
            return (
              <View key={activity?.id} style={styles.breakdownCard}>
                <View style={styles.breakdownLeft}>
                  <Text style={styles.breakdownName}>{activity?.name ?? ''}</Text>
                  <Text style={[styles.breakdownStatus, allDone && styles.breakdownDone]}>
                    {allDone ? '✓ Done' : `○ ${done} of ${activity?.target ?? 0} done`}
                  </Text>
                </View>
                {allDone && <Text style={styles.checkIcon}>✓</Text>}
              </View>
            );
          })}
        </View>

        {/* Motivation */}
        <View style={styles.motivationCard}>
          <Text style={styles.motivationText}>{getMotivation()}</Text>
        </View>

        {/* Week Range */}
        <Text style={styles.weekRange}>{formatWeekRange(weekStart, weekEnd)}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: 40,
  },
  header: {
    fontFamily: Fonts.display,
    fontSize: TitleSize,
    lineHeight: TitleSize + 4,
    color: Colors.black,
    textAlign: 'center',
  },
  circleWrap: {
    alignItems: 'center',
    marginTop: 24,
  },
  circle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: Colors.hotPink,
    backgroundColor: Colors.blush,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circlePct: {
    fontFamily: Fonts.display,
    fontSize: 42,
    color: Colors.hotPink,
  },
  circleLabel: {
    fontFamily: Fonts.label,
    fontSize: 16,
    color: Colors.black,
    marginTop: 8,
  },
  breakdownList: {
    marginTop: 24,
    gap: 8,
  },
  breakdownCard: {
    ...CardStyle,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  breakdownLeft: {
    flex: 1,
  },
  breakdownName: {
    fontFamily: Fonts.activityName,
    fontSize: 16,
    color: Colors.black,
  },
  breakdownStatus: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.black,
    marginTop: 2,
  },
  breakdownDone: {
    color: Colors.hotPink,
  },
  checkIcon: {
    fontSize: 20,
    color: Colors.hotPink,
    fontWeight: '700',
  },
  motivationCard: {
    ...CardStyle,
    marginTop: 20,
    alignItems: 'center',
  },
  motivationText: {
    fontFamily: Fonts.display,
    fontSize: 20,
    color: Colors.black,
    textAlign: 'center',
  },
  weekRange: {
    fontFamily: Fonts.label,
    fontSize: 14,
    color: Colors.black,
    textAlign: 'center',
    marginTop: 16,
  },
});
