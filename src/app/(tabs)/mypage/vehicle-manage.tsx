import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Header } from '@/components/common/header';
import { VehicleManagePanel } from '@/components/vehicle/vehicle-manage-panel';
import { Brand } from '@/constants/theme';
import { useVehicle } from '@/hooks/use-vehicle';
import { useVehicleBatteryStatus } from '@/hooks/use-vehicle-battery-status';

export default function VehicleManageScreen() {
  const { vehicle, vehicles, isRegistered, removeVehicle, setPrimaryVehicle } = useVehicle();
  const { status, rul } = useVehicleBatteryStatus(vehicle?.id);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Header
          title="차량 관리"
          showBack
          align="left"
          titleColor={Brand.primaryDark}
          backgroundColor={Brand.background}
        />
        <View style={styles.content}>
          {isRegistered && vehicle ? (
            <VehicleManagePanel
              vehicle={vehicle}
              vehicles={vehicles}
              status={status}
              rul={rul}
              onRegisterNew={() => router.push('/vehicle')}
              onSelectPrimary={setPrimaryVehicle}
              onDelete={removeVehicle}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>등록된 차량이 없습니다.</Text>
              <Pressable style={styles.registerButton} onPress={() => router.push('/vehicle')}>
                <Text style={styles.registerButtonText}>+ 차량 등록하기</Text>
              </Pressable>
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Brand.background,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  emptyState: {
    gap: 16,
  },
  emptyText: {
    fontSize: 14,
    color: Brand.textMuted,
  },
  registerButton: {
    borderRadius: 999,
    backgroundColor: Brand.primary,
    paddingVertical: 14,
    alignItems: 'center',
  },
  registerButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: Brand.primaryDark,
  },
});
