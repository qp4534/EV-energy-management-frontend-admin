import { StyleSheet, Text, View } from 'react-native';
import { Circle, Svg } from 'react-native-svg';

import { Brand } from '@/constants/theme';

type BatterySohRingProps = {
  soh: number;
  size?: number;
};

export function BatterySohRing({ soh, size = 96 }: BatterySohRingProps) {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, soh));
  const dashOffset = circumference * (1 - clamped / 100);

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={Brand.border}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={Brand.primary}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          fill="none"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.center}>
        <Text style={styles.percent}>{Math.round(clamped)}%</Text>
        <Text style={styles.label}>SOH</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  percent: {
    fontSize: 20,
    fontWeight: '800',
    color: Brand.text,
  },
  label: {
    fontSize: 11,
    color: Brand.textMuted,
  },
});
