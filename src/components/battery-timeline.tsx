import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { BatteryHistoryPoint } from '@/types/battery';
import { formatSoh } from '@/utils/format-battery';

type BatteryTimelineProps = {
  history: BatteryHistoryPoint[];
};

export function BatteryTimeline({ history }: BatteryTimelineProps) {
  return (
    <ThemedView type="backgroundElement" style={styles.container}>
      {history.map((point) => (
        <View key={point.date} style={styles.row}>
          <ThemedText type="small" themeColor="textSecondary">
            {point.date}
          </ThemedText>
          <ThemedText type="smallBold">{formatSoh(point.soh)}</ThemedText>
        </View>
      ))}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
