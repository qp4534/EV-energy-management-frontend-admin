import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { Vehicle } from '@/types/vehicle';
import { formatSoh } from '@/utils/format-battery';

type VehicleCardProps = {
  vehicle: Vehicle;
};

export function VehicleCard({ vehicle }: VehicleCardProps) {
  return (
    <ThemedView type="backgroundElement" style={styles.container}>
      <ThemedText type="subtitle">{vehicle.nickname}</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        {vehicle.model} · {vehicle.plateNumber}
      </ThemedText>
      <ThemedText type="smallBold">SOH {formatSoh(vehicle.batterySoh)}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.one,
  },
});
