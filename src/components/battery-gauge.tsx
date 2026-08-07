import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { formatSoh } from '@/utils/format-battery';

type BatteryGaugeProps = {
  soh: number;
};

export function BatteryGauge({ soh }: BatteryGaugeProps) {
  return (
    <ThemedView type="backgroundElement" style={styles.container}>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.max(0, Math.min(100, soh))}%` }]} />
      </View>
      <ThemedText type="smallBold">{formatSoh(soh)}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  track: {
    height: Spacing.three,
    borderRadius: Spacing.two,
    backgroundColor: 'rgba(128, 128, 128, 0.2)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: Spacing.two,
    backgroundColor: '#3c87f7',
  },
});
