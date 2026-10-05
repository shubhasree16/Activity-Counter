import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { Colors } from '../constants/theme';

interface Props {
  completed: number;
  total: number;
}

export default function ProgressBar({ completed, total }: Props) {
  const widthAnim = useRef(new Animated.Value(0)).current;
  const pct = total > 0 ? (completed / total) * 100 : 0;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: pct,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [pct, widthAnim]);

  const animatedWidth = widthAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <View
      style={styles.track}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: total, now: completed }}
    >
      <Animated.View style={[styles.fill, { width: animatedWidth }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.blush,
    borderWidth: 2,
    borderColor: Colors.white,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 7,
    backgroundColor: Colors.hotPink,
  },
});
