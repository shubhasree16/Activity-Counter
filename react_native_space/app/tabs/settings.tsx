import React from 'react';
import { View, Text, ScrollView, Switch, Pressable, Alert, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useData } from '../../contexts/DataContext';
import { Colors, Fonts, Spacing, CardStyle } from '../../constants/theme';

export default function SettingsScreen() {
  const { settings, updateSettings, resetWeek } = useData();

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
        <Text style={styles.header}>Settings</Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.cardTitle}>Workout Reminders</Text>
            <Switch
              value={settings?.remindersEnabled ?? false}
              onValueChange={(val) => updateSettings({ remindersEnabled: val })}
              trackColor={{ false: Colors.blush, true: Colors.hotPink }}
              thumbColor={Colors.white}
            />
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.cardTitle}>Week Resets On</Text>
            <Text style={styles.resetDay}>Monday</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Pressable style={styles.resetBtn} onPress={handleReset}>
            <Text style={styles.resetBtnText}>Reset This Week</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Veera's Activity Counter</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  scroll: { flex: 1 },
  content: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg, paddingBottom: 40 },
  header: { fontFamily: Fonts.display, fontSize: 28, color: Colors.black, textAlign: 'center', marginBottom: 20 },
  card: { ...CardStyle, marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontFamily: Fonts.activityName, fontSize: 16, color: Colors.black },
  resetDay: { fontFamily: Fonts.body, fontSize: 16, color: Colors.hotPink },
  resetBtn: { backgroundColor: Colors.black, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 24, alignItems: 'center' },
  resetBtnText: { fontFamily: Fonts.activityName, fontSize: 14, color: Colors.white, textTransform: 'uppercase', letterSpacing: 2 },
  version: { fontFamily: Fonts.label, fontSize: 14, color: Colors.black, marginTop: 4 },
});
