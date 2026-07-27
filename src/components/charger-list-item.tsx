import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { Charger } from '@/types/charger';

type ChargerListItemProps = {
  charger: Charger;
};

export function ChargerListItem({ charger }: ChargerListItemProps) {
  return (
    <ThemedView type="backgroundElement" style={styles.container}>
      <ThemedText type="smallBold">{charger.name}</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        {charger.address} · {charger.distanceKm}km
      </ThemedText>
      <ThemedText type="small" themeColor={charger.isAvailable ? 'text' : 'textSecondary'}>
        {charger.isAvailable ? '이용 가능' : '이용 불가'}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.half,
  },
});
