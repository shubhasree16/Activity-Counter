import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, View, AccessibilityInfo } from 'react-native';
import { Colors } from '../constants/theme';

export interface BurstOrigin {
  x: number;
  y: number;
  key: number;
}

const PIECE_COUNT = 30;
const PIECE_COLORS = [Colors.hotPink, Colors.black, Colors.blush, Colors.hotPink];

interface Piece {
  dx: number;
  dy: number;
  rotate: number;
  color: string;
  w: number;
  h: number;
  round: boolean;
}

function makePieces(): Piece[] {
  return Array.from({ length: PIECE_COUNT }, (_, i) => {
    // Fan upwards like a party popper, with some spread to the sides
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.3;
    const dist = 70 + Math.random() * 110;
    const round = i % 3 === 0;
    return {
      dx: Math.cos(angle) * dist,
      dy: Math.sin(angle) * dist,
      rotate: (Math.random() - 0.5) * 900,
      color: PIECE_COLORS[i % PIECE_COLORS.length] ?? Colors.hotPink,
      w: round ? 8 : 6 + Math.random() * 4,
      h: round ? 8 : 10 + Math.random() * 6,
      round,
    };
  });
}

export default function ConfettiBurst({ origin }: { origin: BurstOrigin | null }) {
  const progress = useRef(new Animated.Value(0)).current;
  const pieces = useMemo(makePieces, [origin?.key]);
  const reduceMotion = useRef(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled?.()
      .then((v) => {
        reduceMotion.current = !!v;
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!origin) return;
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: reduceMotion.current ? 450 : 1100,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [origin, progress]);

  if (!origin) return null;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {pieces.map((p, i) => {
        const translateX = progress.interpolate({ inputRange: [0, 1], outputRange: [0, p.dx] });
        // Burst out, then gravity pulls the pieces back down
        const translateY = progress.interpolate({
          inputRange: [0, 0.55, 1],
          outputRange: [0, p.dy, p.dy + 90],
        });
        const rotate = progress.interpolate({ inputRange: [0, 1], outputRange: ['0deg', `${p.rotate}deg`] });
        const opacity = progress.interpolate({ inputRange: [0, 0.1, 0.75, 1], outputRange: [0, 1, 1, 0] });
        const scale = progress.interpolate({ inputRange: [0, 0.15, 1], outputRange: [0.3, 1, 0.8] });
        return (
          <Animated.View
            key={`${origin.key}-${i}`}
            style={[
              styles.piece,
              {
                left: origin.x - p.w / 2,
                top: origin.y - p.h / 2,
                width: p.w,
                height: p.h,
                borderRadius: p.round ? p.w / 2 : 2,
                backgroundColor: p.color,
                borderWidth: p.color === Colors.blush ? 1 : 0,
                borderColor: Colors.hotPink,
                opacity,
                transform: reduceMotion.current
                  ? [{ translateX }, { translateY }]
                  : [{ translateX }, { translateY }, { rotate }, { scale }],
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  piece: {
    position: 'absolute',
  },
});
