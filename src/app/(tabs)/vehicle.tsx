import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Header } from '@/components/common/header';
import { VehicleManagePanel } from '@/components/vehicle/vehicle-manage-panel';
import { VehicleRegisterForm } from '@/components/vehicle/vehicle-register-form';
import { Brand } from '@/constants/theme';
import { useVehicle } from '@/hooks/use-vehicle';
import { useVehicleBatteryStatus } from '@/hooks/use-vehicle-battery-status';
import { VehicleRegisterRequest } from '@/types/vehicle';

export default function VehicleScreen() {
  const { vehicle, vehicles, isRegistered, registerVehicle, setPrimaryVehicle } = useVehicle();
  const { status, rul } = useVehicleBatteryStatus(vehicle?.id);
  const [isAdding, setIsAdding] = useState(false);

  const showForm = !isRegistered || isAdding;

  const handleSubmit = async (request: VehicleRegisterRequest) => {
    await registerVehicle(request);
    setIsAdding(false);
  };

  const handleBack = () => {
    if (isAdding) {
      setIsAdding(false);
      return;
    }
    router.canGoBack() ? router.back() : router.push('/(tabs)/home');
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Header
          title={showForm ? '차량 등록' : '차량 관리'}
          showBack
          align="left"
          titleColor={Brand.primaryDark}
          backgroundColor={Brand.background}
          onBackPress={handleBack}
        />
        <View style={styles.content}>
          {showForm ? (
            <VehicleRegisterForm onSubmit={handleSubmit} />
          ) : (
            vehicle && (
              <VehicleManagePanel
                vehicle={vehicle}
                vehicles={vehicles}
                status={status}
                rul={rul}
                onRegisterNew={() => setIsAdding(true)}
                onSelectPrimary={setPrimaryVehicle}
              />
            )
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
