import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Header } from '@/components/common/header';
import { VehicleManagePanel } from '@/components/vehicle/vehicle-manage-panel';
import { Brand } from '@/constants/theme';
import { useVehicle } from '@/hooks/use-vehicle';
import { useVehicleBatteryStatus } from '@/hooks/use-vehicle-battery-status';

export default function VehicleManageScreen() {
  const { vehicle, isRegistered, clearVehicle } = useVehicle();
  const { status, rul } = useVehicleBatteryStatus(vehicle?.id);

  return (
    <View style={styles.container}>
      <Header title="차량 관리" showBack />
      <View style={styles.content}>
        {isRegistered && vehicle ? (
          <VehicleManagePanel
            vehicle={vehicle}
            status={status}
            rul={rul}
            onRegisterNew={clearVehicle}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Brand.background,
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
