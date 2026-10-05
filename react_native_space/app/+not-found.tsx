import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Fonts } from '../constants/theme';

export default function NotFound() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Page Not Found</Text>
      <Pressable style={styles.btn} onPress={() => router.replace('/tabs')}>
        <Text style={styles.btnText}>Go Home</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 20,
  },
  title: {
    fontFamily: Fonts.display,
    fontSize: 28,
    color: Colors.black,
    marginBottom: 20,
  },
  btn: {
    backgroundColor: Colors.hotPink,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  btnText: {
    fontFamily: Fonts.activityName,
    fontSize: 16,
    color: Colors.white,
  },
});
