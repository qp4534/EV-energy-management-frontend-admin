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
    if (!request.imageUri) {
      addVehicle(res);
      return;
    }
    try {
      const imageUrl = await vehicleApi.uploadVehicleImage(res.id, request.imageUri, request.imageMimeType);
      await vehicleApi.setVehicleImage(res.id, imageUrl);
      addVehicle({ ...res, imageUrl });
    } catch {
      // 사진 업로드/저장만 실패한 경우, 차량 등록 자체는 이미 끝났으니 사진 없이 계속 진행한다.
      addVehicle(res);
    }
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
