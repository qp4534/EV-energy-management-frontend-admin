import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Header } from '@/components/common/header';
import { VehicleManagePanel } from '@/components/vehicle/vehicle-manage-panel';
import { VehicleRegisterForm } from '@/components/vehicle/vehicle-register-form';
import { Brand } from '@/constants/theme';
import { useVehicle } from '@/hooks/use-vehicle';
import { useVehicleBatteryStatus } from '@/hooks/use-vehicle-battery-status';

export default function VehicleScreen() {
  const { vehicle, isRegistered, registerVehicle, clearVehicle } = useVehicle();
  const { status, rul } = useVehicleBatteryStatus(vehicle?.id);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Header
          title={isRegistered ? '차량 관리' : '차량 등록'}
          showBack
          align="left"
          titleColor={Brand.primaryDark}
          backgroundColor={Brand.background}
        />
        <View style={styles.content}>
          {isRegistered && vehicle ? (
            <VehicleManagePanel
              vehicle={vehicle}
              status={status}
              rul={rul}
              onRegisterNew={clearVehicle}
            />
          ) : (
            <VehicleRegisterForm onSubmit={registerVehicle} />
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
});
