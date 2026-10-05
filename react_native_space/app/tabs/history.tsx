import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useData } from '../../contexts/DataContext';
import WeekHistoryRow from '../../components/WeekHistoryRow';
import { Colors, Fonts, Spacing, TitleSize } from '../../constants/theme';
import type { HistoryEntry } from '../../utils/storage';

export default function HistoryScreen() {
  const { history } = useData();
  const safeHistory = history ?? [];

  const renderItem = ({ item }: { item: HistoryEntry }) => (
    <WeekHistoryRow entry={item} />
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Text style={styles.header}>History</Text>
      {safeHistory.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTitle}>No history yet</Text>
          <Text style={styles.emptySub}>Complete your first week to see it here</Text>
        </View>
      ) : (
        <FlatList
          data={safeHistory}
          renderItem={renderItem}
          keyExtractor={(item, i) => `${item?.weekStart ?? i}`}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    fontFamily: Fonts.display,
    fontSize: TitleSize,
    lineHeight: TitleSize + 4,
    color: Colors.black,
    textAlign: 'center',
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  list: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 40,
  },
  emptyWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontFamily: Fonts.label,
    fontSize: 18,
    color: Colors.black,
  },
  emptySub: {
    fontFamily: Fonts.label,
    fontSize: 14,
    color: Colors.hotPink,
    marginTop: 8,
    textAlign: 'center',
  },
});
