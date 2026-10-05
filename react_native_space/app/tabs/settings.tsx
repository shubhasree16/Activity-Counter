import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Switch,
  Pressable,
  Alert,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useData } from '../../contexts/DataContext';
import { ensureNotificationPermission } from '../../utils/notifications';

const MAX_NAME_LENGTH = 16;

function shiftTime(time: string, minutes: number): string {
  const [h, m] = (time || '21:00').split(':').map((n) => parseInt(n, 10));
  const total = (((h || 0) * 60 + (m || 0) + minutes) % 1440 + 1440) % 1440;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

function showMessage(title: string, message: string) {
  if (Platform.OS === 'web') window.alert(`${title}\n\n${message}`);
  else Alert.alert(title, message);
}
import { Colors, Fonts, Spacing, CardStyle, TitleSize } from '../../constants/theme';

export default function SettingsScreen() {
  const { settings, updateSettings, resetWeek } = useData();
  const [nameDraft, setNameDraft] = useState(settings?.userName ?? 'Veera');
  const reminderTime = settings?.reminderTime ?? '21:00';
  const remindersOn = settings?.remindersEnabled ?? false;

  useEffect(() => {
    setNameDraft(settings?.userName ?? 'Veera');
  }, [settings?.userName]);

  const trimmedDraft = nameDraft.trim();
  const nameChanged = trimmedDraft.length > 0 && trimmedDraft !== (settings?.userName ?? '');

  const saveName = () => {
    if (!trimmedDraft) {
      setNameDraft(settings?.userName ?? 'Veera');
      return;
    }
    updateSettings({ userName: trimmedDraft });
    Keyboard.dismiss();
  };

  const toggleReminders = async (val: boolean) => {
    if (!val) {
      updateSettings({ remindersEnabled: false });
      return;
    }
    if (Platform.OS === 'web') {
      updateSettings({ remindersEnabled: true });
      showMessage('Reminders saved', 'Notifications are delivered on your phone, not in the web preview.');
      return;
    }
    const granted = await ensureNotificationPermission();
    if (!granted) {
      showMessage('Notifications are off', 'Allow notifications for this app in your phone settings to get daily reminders.');
      return;
    }
    updateSettings({ remindersEnabled: true });
  };

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
      <KeyboardAvoidingView style={styles.scroll} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.header}>Settings</Text>

        {/* Name */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Your name</Text>
          <View style={styles.nameRow}>
            <TextInput
              value={nameDraft}
              onChangeText={setNameDraft}
              onSubmitEditing={saveName}
              onBlur={saveName}
              maxLength={MAX_NAME_LENGTH}
              placeholder="Your name"
              placeholderTextColor={Colors.gray}
              style={styles.nameInput}
              returnKeyType="done"
              autoCapitalize="words"
              autoCorrect={false}
              accessibilityLabel="Your name"
              testID="name-input"
            />
            <Pressable
              onPress={saveName}
              disabled={!nameChanged}
              style={[styles.saveBtn, !nameChanged && styles.saveBtnDisabled]}
              accessibilityRole="button"
              accessibilityLabel="Save name"
            >
              <Text style={[styles.saveBtnText, !nameChanged && styles.saveBtnTextDisabled]}>Save</Text>
            </Pressable>
          </View>
          <Text style={styles.helper}>Shown in your title as “{trimmedDraft || 'Veera'}'s Weekly Fitness”</Text>
        </View>

        {/* Daily Reminder */}
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.cardTitle}>Daily Reminder</Text>
            <Switch
              value={remindersOn}
              onValueChange={toggleReminders}
              trackColor={{ false: Colors.white, true: Colors.hotPink }}
              thumbColor={Colors.white}
              {...({ activeThumbColor: Colors.white } as object)}
              accessibilityLabel="Daily reminder"
            />
          </View>
          <Text style={styles.helper}>
            One box a day. If nothing is checked by this time, you get a nudge.
          </Text>
          {remindersOn && (
            <View style={styles.timeRow}>
              <Pressable
                style={styles.timeBtn}
                onPress={() => updateSettings({ reminderTime: shiftTime(reminderTime, -30) })}
                accessibilityRole="button"
                accessibilityLabel="Earlier by 30 minutes"
              >
                <Text style={styles.timeBtnText}>−</Text>
              </Pressable>
              <Text style={styles.timeValue}>{reminderTime}</Text>
              <Pressable
                style={styles.timeBtn}
                onPress={() => updateSettings({ reminderTime: shiftTime(reminderTime, 30) })}
                accessibilityRole="button"
                accessibilityLabel="Later by 30 minutes"
              >
                <Text style={styles.timeBtnText}>+</Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* Reset Day */}
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.cardTitle}>Week Resets On</Text>
            <Text style={styles.resetDay}>Monday</Text>
          </View>
        </View>

        {/* Reset Button */}
        <View style={styles.card}>
          <Pressable style={styles.resetBtn} onPress={handleReset}>
            <Text style={styles.resetBtnText}>Reset This Week</Text>
          </Pressable>
        </View>

        {/* About */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{settings?.userName?.trim() || 'Veera'}'s Activity Counter</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
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
    marginBottom: 20,
  },
  card: {
    ...CardStyle,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontFamily: Fonts.activityName,
    fontSize: 16,
    color: Colors.black,
  },
  resetDay: {
    fontFamily: Fonts.body,
    fontSize: 16,
    color: Colors.hotPink,
  },
  resetBtn: {
    backgroundColor: Colors.black,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center',
  },
  resetBtnText: {
    fontFamily: Fonts.activityName,
    fontSize: 14,
    color: Colors.white,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  sectionLabel: {
    fontFamily: Fonts.activityName,
    fontSize: 11,
    color: Colors.hotPink,
    textTransform: 'uppercase',
    letterSpacing: 3,
    marginBottom: 8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  nameInput: {
    flex: 1,
    minWidth: 0,
    width: '100%',
    minHeight: 48,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.black,
    borderRadius: 24,
    paddingHorizontal: 18,
    fontFamily: Fonts.display,
    fontSize: 22,
    color: Colors.black,
  },
  saveBtn: {
    minHeight: 48,
    paddingHorizontal: 20,
    borderRadius: 24,
    backgroundColor: Colors.hotPink,
    borderWidth: 2,
    borderColor: Colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnDisabled: {
    backgroundColor: Colors.white,
  },
  saveBtnText: {
    fontFamily: Fonts.activityName,
    fontSize: 13,
    color: Colors.white,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  saveBtnTextDisabled: {
    color: Colors.black,
  },
  helper: {
    fontFamily: Fonts.label,
    fontSize: 15,
    color: Colors.black,
    marginTop: 8,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginTop: 14,
  },
  timeBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeBtnText: {
    fontFamily: Fonts.activityName,
    fontSize: 24,
    color: Colors.black,
    lineHeight: 28,
  },
  timeValue: {
    fontFamily: Fonts.display,
    fontSize: 34,
    color: Colors.hotPink,
    minWidth: 96,
    textAlign: 'center',
  },
  version: {
    fontFamily: Fonts.label,
    fontSize: 14,
    color: Colors.black,
    marginTop: 4,
  },
});
