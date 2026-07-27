import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { VehicleCard } from '@/components/vehicle-card';
import { Spacing } from '@/constants/theme';
import { Vehicle } from '@/types/vehicle';

type RegisteredHomeProps = {
  vehicle: Vehicle;
};

export function RegisteredHome({ vehicle }: RegisteredHomeProps) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <VehicleCard vehicle={vehicle} />

      <ThemedView style={styles.linkRow}>
        <Link href="/battery-passport" asChild>
          <Pressable style={styles.linkPressable}>
            <ThemedView type="backgroundElement" style={styles.linkCard}>
              <ThemedText type="smallBold">배터리 여권</ThemedText>
            </ThemedView>
          </Pressable>
        </Link>
        <Link href="/home/report" asChild>
          <Pressable style={styles.linkPressable}>
            <ThemedView type="backgroundElement" style={styles.linkCard}>
              <ThemedText type="smallBold">리포트</ThemedText>
            </ThemedView>
          </Pressable>
        </Link>
        <Link href="/home/map" asChild>
          <Pressable style={styles.linkPressable}>
            <ThemedView type="backgroundElement" style={styles.linkCard}>
              <ThemedText type="smallBold">충전소 지도</ThemedText>
            </ThemedView>
          </Pressable>
        </Link>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.four,
    gap: Spacing.three,
  },
  linkRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  linkPressable: {
    flex: 1,
  },
  linkCard: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    alignItems: 'center',
  },
});
