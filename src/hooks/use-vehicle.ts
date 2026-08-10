import * as vehicleApi from '@/api/vehicle';
import { useVehicleStore } from '@/store/vehicle-store';
import { VehicleRegisterRequest } from '@/types/vehicle';

export function useVehicle() {
  const {
    vehicle,
    vehicles,
    isRegistered,
    setVehicles,
    addVehicle,
    removeVehicle: removeVehicleFromStore,
    setPrimaryVehicle: setPrimaryVehicleInStore,
  } = useVehicleStore();

  const fetchVehicles = async () => {
    const res = await vehicleApi.getMyVehicles();
    setVehicles(res);
  };

  const registerVehicle = async (request: VehicleRegisterRequest) => {
    const res = await vehicleApi.registerVehicle(request);
    addVehicle(res);
  };

  const removeVehicle = async (id: string) => {
    await vehicleApi.deleteVehicle(id);
    removeVehicleFromStore(id);
  };

  const setPrimaryVehicle = async (id: string) => {
    const previousPrimaryId = vehicle?.id;
    await vehicleApi.setVehiclePrimary(id, previousPrimaryId);
    setPrimaryVehicleInStore(id);
  };

  return {
    vehicle,
    vehicles,
    isRegistered,
    fetchVehicles,
    registerVehicle,
    removeVehicle,
    setPrimaryVehicle,
  };
}
