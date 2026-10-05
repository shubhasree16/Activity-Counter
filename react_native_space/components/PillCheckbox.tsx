import React, { useRef } from 'react';
import { Pressable, Animated, StyleSheet, Platform, Text } from 'react-native';
import { Colors } from '../constants/theme';

interface Props {
  checked: boolean;
  onToggle: () => void;
  accessibilityLabel: string;
}

export default function PillCheckbox({ checked, onToggle, accessibilityLabel }: Props) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = async () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.85, duration: 80, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();

    if (Platform.OS !== 'web') {
      try {
        const Haptics = require('expo-haptics');
        Haptics?.impactAsync?.(Haptics?.ImpactFeedbackStyle?.Light);
      } catch {}
    }

    onToggle();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPress={handlePress}
        style={[styles.pill, checked ? styles.checked : styles.unchecked]}
        accessibilityRole="checkbox"
        accessibilityState={{ checked }}
        accessibilityLabel={accessibilityLabel}
      >
        {checked && <Text style={styles.checkmark}>&#x2713;</Text>}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  pill: {
    width: 42,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  unchecked: {
    backgroundColor: Colors.white,
    borderColor: Colors.black,
  },
  checked: {
    backgroundColor: Colors.hotPink,
    borderColor: Colors.hotPink,
  },
  checkmark: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
});
