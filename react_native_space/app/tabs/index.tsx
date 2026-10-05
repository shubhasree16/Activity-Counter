import React from 'react';
import { View, Text, ScrollView, Pressable, Alert, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useData } from '../../contexts/DataContext';
import { ACTIVITIES, TOTAL_SESSIONS } from '../../constants/activities';
import ActivityCard from '../../components/ActivityCard';
import ProgressBar from '../../components/ProgressBar';
import { Colors, Fonts, Spacing } from '../../constants/theme';
import { formatWeekOf } from '../../utils/weekUtils';

export default function HomeScreen() {
  const { currentWeek, completedCount, toggleSession, resetWeek } = useData();
  const pct = TOTAL_SESSIONS > 0 ? Math.round((completedCount / TOTAL_SESSIONS) * 100) : 0;

  const handleReset = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Reset this week? Current progress will be saved to history.')) {
        resetWeek();
      }
    } else {
      Alert.alert(
        'Reset Week',
        'Reset this week? Current progress will be saved to history.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Reset', style: 'destructive', onPress: () => resetWeek() },
        ],
      );
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.weekLabel}>{formatWeekOf(currentWeek?.weekStart ?? '')}</Text>
            <Text style={styles.title}>
              {"Veera's Weekly"}
              {'\n'}
              <Text style={styles.titleAccent}>Fitness</Text>
            </Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>V</Text>
          </View>
        </View>

        <View style={styles.progressCard}>
          <View style={styles.progressRow}>
            <View>
              <Text style={styles.progressLabel}>This week</Text>
              <Text style={styles.progressCount}>
                {completedCount}{' '}
                <Text style={styles.progressTotal}>/ {TOTAL_SESSIONS} sessions</Text>
              </Text>
            </View>
            <Text style={styles.progressPct}>{pct}%</Text>
          </View>
          <View style={styles.progressBarWrap}>
            <ProgressBar completed={completedCount} total={TOTAL_SESSIONS} />
          </View>
          <Text style={styles.encouragement}>
            {pct === 100
              ? "You crushed it!"
              : pct >= 50
              ? "You're glowing. Keep it moving."
              : pct > 0
              ? 'Great start! Keep going.'
              : 'A fresh week awaits.'}
          </Text>
        </View>

        <View style={styles.activityList}>
          {ACTIVITIES.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              sessions={currentWeek?.sessions?.[activity.id] ?? []}
              onToggle={toggleSession}
            />
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.renewLabel}>Renews every Monday</Text>
          <Pressable style={styles.resetBtn} onPress={handleReset}>
            <Text style={styles.resetBtnText}>Reset Week</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  scroll: { flex: 1 },
  content: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  headerLeft: { flex: 1 },
  weekLabel: { fontFamily: Fonts.activityName, fontSize: 11, color: Colors.hotPink, textTransform: 'uppercase', letterSpacing: 3 },
  title: { fontFamily: Fonts.display, fontSize: 38, color: Colors.black, lineHeight: 40, marginTop: 8 },
  titleAccent: { fontFamily: Fonts.display, fontSize: 46, color: Colors.black, textDecorationLine: 'underline', textDecorationColor: Colors.hotPink },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.hotPink, borderWidth: 2, borderColor: Colors.black, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: Fonts.display, fontSize: 24, color: Colors.white },
  progressCard: { backgroundColor: Colors.black, borderRadius: 22, paddingHorizontal: 20, paddingVertical: 16, marginTop: 20 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  progressLabel: { fontFamily: Fonts.activityName, fontSize: 11, color: Colors.blush, textTransform: 'uppercase', letterSpacing: 3 },
  progressCount: { fontFamily: Fonts.display, fontSize: 36, color: Colors.white, marginTop: 4 },
  progressTotal: { fontFamily: Fonts.label, fontSize: 16, color: Colors.blush },
  progressPct: { fontFamily: Fonts.display, fontSize: 32, color: Colors.hotPink },
  progressBarWrap: { marginTop: 12 },
  encouragement: { fontFamily: Fonts.label, fontSize: 16, color: Colors.white, marginTop: 12 },
  activityList: { marginTop: 20, gap: 12 },
  footer: { marginTop: 24, paddingTop: 16, borderTopWidth: 2, borderTopColor: Colors.black, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  renewLabel: { fontFamily: Fonts.label, fontSize: 16, color: Colors.hotPink },
  resetBtn: { backgroundColor: Colors.black, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 24 },
  resetBtnText: { fontFamily: Fonts.activityName, fontSize: 12, color: Colors.white, textTransform: 'uppercase', letterSpacing: 2 },
});
