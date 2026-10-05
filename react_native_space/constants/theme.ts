export const Colors = {
  hotPink: '#FF1F8E',
  black: '#0D0D0D',
  blush: '#FFD6EC',
  white: '#FFFFFF',
  gray: '#9CA3AF',
  green: '#22C55E',
} as const;

export const Fonts = {
  display: 'CormorantGaramond_700Bold_Italic',
  heading: 'CormorantGaramond_700Bold_Italic',
  activityName: 'CormorantGaramond_600SemiBold',
  body: 'CormorantGaramond_400Regular',
  label: 'CormorantGaramond_300Light_Italic',
  caption: 'CormorantGaramond_300Light_Italic',
  fallbackSerif: 'serif',
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const CardStyle = {
  backgroundColor: Colors.blush,
  borderWidth: 2,
  borderColor: Colors.black,
  borderRadius: 16,
  shadowColor: Colors.black,
  shadowOffset: { width: 4, height: 4 },
  shadowOpacity: 1,
  shadowRadius: 0,
  elevation: 4,
  padding: Spacing.lg,
} as const;
