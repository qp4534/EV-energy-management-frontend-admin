import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RegisteredHome } from '@/components/home/registered-home';
import { UnregisteredHome } from '@/components/home/unregistered-home';
import { ThemedView } from '@/components/themed-view';
import { useVehicle } from '@/hooks/use-vehicle';

export default function HomeIndexScreen() {
  const { vehicle, isRegistered } = useVehicle();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.container}>
        {isRegistered && vehicle ? <RegisteredHome vehicle={vehicle} /> : <UnregisteredHome />}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
