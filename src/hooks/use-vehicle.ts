import * as vehicleApi from '@/api/vehicle';
import { useVehicleStore } from '@/store/vehicle-store';
import { VehicleRegisterRequest } from '@/types/vehicle';

export function useVehicle() {
  const { vehicle, vehicles, isRegistered, addVehicle, removeVehicle, setPrimaryVehicle } =
    useVehicleStore();

  const registerVehicle = async (request: VehicleRegisterRequest) => {
    const res = await vehicleApi.registerVehicle(request);
    addVehicle(res);
  };

  return {
    vehicle,
    vehicles,
    isRegistered,
    registerVehicle,
    removeVehicle,
    setPrimaryVehicle,
  };
}
