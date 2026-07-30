import { mockDelay } from '@/api/client';
import { Vehicle, VehicleRegisterRequest } from '@/types/vehicle';

export async function getMyVehicle(): Promise<Vehicle | null> {
  return mockDelay(null);
}

export async function registerVehicle(request: VehicleRegisterRequest): Promise<Vehicle> {
  return mockDelay({
    id: `v-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    nickname: request.nickname,
    model: request.model,
    plateNumber: request.plateNumber,
    batterySoh: 98,
    registeredAt: new Date().toISOString(),
  });
}
