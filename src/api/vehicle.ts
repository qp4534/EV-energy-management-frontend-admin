import { apiClient, mockDelay, USE_MOCK } from '@/api/client';
import { Vehicle, VehicleRegisterRequest } from '@/types/vehicle';

export async function getMyVehicle(): Promise<Vehicle | null> {
  if (!USE_MOCK) {
    const { data } = await apiClient.get<Vehicle[]>('/vehicles');
    return data[0] ?? null;
  }
  return mockDelay(null);
}

export async function registerVehicle(request: VehicleRegisterRequest): Promise<Vehicle> {
  if (!USE_MOCK) {
    const { data } = await apiClient.post<Vehicle>('/vehicles', request);
    return data;
  }
  return mockDelay({
    id: `v-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    nickname: request.nickname,
    model: request.model,
    plateNumber: request.plateNumber,
    batterySoh: 98,
    registeredAt: new Date().toISOString(),
  });
}
