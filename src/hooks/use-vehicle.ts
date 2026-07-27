import * as vehicleApi from '@/api/vehicle';
import { useVehicleStore } from '@/store/vehicle-store';
import { VehicleRegisterRequest } from '@/types/vehicle';

export function useVehicle() {
  const { vehicle, isRegistered, setVehicle, clearVehicle } = useVehicleStore();

  const registerVehicle = async (request: VehicleRegisterRequest) => {
    const res = await vehicleApi.registerVehicle(request);
    setVehicle(res);
  };

  return { vehicle, isRegistered, registerVehicle, clearVehicle };
}
