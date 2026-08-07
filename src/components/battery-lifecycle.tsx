import { StyleSheet, Text, View } from 'react-native';

import { Brand } from '@/constants/theme';
import { BatteryLifecycleEvent } from '@/types/battery';

type BatteryLifecycleProps = {
  events: BatteryLifecycleEvent[];
};

export function BatteryLifecycle({ events }: BatteryLifecycleProps) {
  return (
    <View>
      {events.map((event, index) => (
        <View key={event.label} style={styles.row}>
          <View style={styles.markerColumn}>
            <View style={styles.dot} />
            {index < events.length - 1 && <View style={styles.line} />}
          </View>
          <View style={styles.textColumn}>
            <Text style={styles.label}>{event.label}</Text>
            <Text style={styles.date}>{event.date}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  markerColumn: {
    alignItems: 'center',
    width: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 5,
    backgroundColor: Brand.resultCheckBg,
  },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: Brand.resultCheckBg,
    marginVertical: 2,
    minHeight: 24,
  },
  textColumn: {
    paddingBottom: 16,
    gap: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: Brand.label,
  },
  date: {
    fontSize: 13,
    color: Brand.label,
  },
});
