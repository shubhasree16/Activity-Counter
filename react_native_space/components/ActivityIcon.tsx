import React from 'react';
import Svg, { Path, Circle, Rect, Ellipse } from 'react-native-svg';
import { Colors } from '../constants/theme';

interface Props {
  type: 'swimming' | 'pilates' | 'gym' | 'yoga' | 'walk';
  size?: number;
}

export default function ActivityIcon({ type, size = 26 }: Props) {
  switch (type) {
    case 'swimming':
      return (
        <Svg width={size} height={size * 0.85} viewBox="0 0 26 22" fill="none">
          <Path d="M2 5c3-3 5-3 7 0s5 3 8 0 5-3 7 0" stroke={Colors.hotPink} strokeWidth={3} strokeLinecap="round" />
          <Path d="M2 11c3-3 5-3 7 0s5 3 8 0 5-3 7 0" stroke={Colors.hotPink} strokeWidth={3} strokeLinecap="round" />
          <Path d="M2 17c3-3 5-3 7 0s5 3 8 0 5-3 7 0" stroke={Colors.hotPink} strokeWidth={3} strokeLinecap="round" />
        </Svg>
      );
    case 'pilates':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx={12} cy={12} r={8.5} stroke={Colors.black} strokeWidth={3.5} />
        </Svg>
      );
    case 'gym':
      return (
        <Svg width={size * 1.08} height={size * 0.62} viewBox="0 0 28 16" fill={Colors.black}>
          <Circle cx={5} cy={8} r={5} />
          <Circle cx={23} cy={8} r={5} />
          <Rect x={5} y={6} width={18} height={4} rx={2} />
        </Svg>
      );
    case 'yoga':
      return (
        <Svg width={size * 1.08} height={size * 0.77} viewBox="0 0 28 20" fill={Colors.black}>
          <Path d="M14 1 L19 12 L9 12 Z" />
          <Path d="M2 7 C6 8 10 12 11 18 L2 18 Z" fill={Colors.hotPink} />
          <Path d="M26 7 C22 8 18 12 17 18 L26 18 Z" fill={Colors.hotPink} />
          <Rect x={9} y={15} width={10} height={3} />
        </Svg>
      );
    case 'walk':
      return (
        <Svg width={size * 0.92} height={size} viewBox="0 0 24 26" fill={Colors.black}>
          <Ellipse cx={7} cy={8} rx={4} ry={6} />
          <Circle cx={7} cy={17.5} r={2.5} />
          <Ellipse cx={17} cy={12} rx={4} ry={6} fill={Colors.hotPink} />
          <Circle cx={17} cy={21.5} r={2.5} fill={Colors.hotPink} />
        </Svg>
      );
    default:
      return null;
  }
}
