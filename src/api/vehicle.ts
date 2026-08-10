import { apiClient, mockDelay, USE_MOCK } from '@/api/client';
import { useAuthStore } from '@/store/auth-store';
import { Vehicle, VehicleRegisterRequest } from '@/types/vehicle';

type BackendCarDto = {
  carId: string;
  carNumber: string;
  model: string;
  vin: string | null;
  nickname: string;
  imageUrl: string | null;
  isPrimary: boolean | null;
  createdAt: string;
  userId: string;
};

type BackendBatteryPassportDto = {
  batteryId: string;
  sohScore: number | null;
  carId: string;
};

function toVehicle(car: BackendCarDto, passport?: BackendBatteryPassportDto): Vehicle {
  return {
    id: car.carId,
    nickname: car.nickname,
    model: car.model,
    plateNumber: car.carNumber,
    // 배터리 여권이 아직 없는(진단 전) 차량은 0으로 표시한다.
    batterySoh: passport?.sohScore != null ? Number(passport.sohScore) : 0,
    registeredAt: car.createdAt,
  };
}

export async function getMyVehicles(): Promise<Vehicle[]> {
  if (!USE_MOCK) {
    const userId = useAuthStore.getState().user?.id;
    const [{ data: cars }, { data: passports }] = await Promise.all([
      apiClient.get<BackendCarDto[]>('/api/cars'),
      apiClient.get<BackendBatteryPassportDto[]>('/api/battery-passports'),
    ]);
    // /api/cars가 아직 로그인 사용자 기준으로 필터링되지 않아 프론트에서 한 번 더 거른다.
    return cars
      .filter((car) => car.userId === userId)
      .map((car) => toVehicle(car, passports.find((passport) => passport.carId === car.carId)));
  }
  return mockDelay([]);
}

export async function deleteVehicle(carId: string): Promise<void> {
  if (!USE_MOCK) {
    await apiClient.delete(`/api/cars/${carId}`);
    return;
  }
  await mockDelay(undefined);
}

// CarController의 PUT은 부분수정이 아니라 레코드 전체를 덮어쓴다. isPrimary만 바꾸려고
// 일부 필드만 보내면 vin/imageUrl 등 나머지가 날아가서 frontend-web 관제 화면에도 영향을
// 주기 때문에, 먼저 전체 레코드를 GET해서 필요한 필드만 바꿔 그대로 다시 PUT한다.
async function setCarPrimaryFlag(carId: string, isPrimary: boolean): Promise<void> {
  const { data: current } = await apiClient.get<BackendCarDto>(`/api/cars/${carId}`);
  await apiClient.put(`/api/cars/${carId}`, { ...current, isPrimary });
}

// 백엔드에 "대표 차량 전환" 전용 엔드포인트가 없어서, 새 대표 차량을 isPrimary:true로,
// 기존 대표 차량을 isPrimary:false로 두 번에 나눠 반영한다(원자적이지 않음).
export async function setVehiclePrimary(carId: string, previousPrimaryId?: string): Promise<void> {
  if (!USE_MOCK) {
    await setCarPrimaryFlag(carId, true);
    if (previousPrimaryId && previousPrimaryId !== carId) {
      await setCarPrimaryFlag(previousPrimaryId, false);
    }
    return;
  }
  await mockDelay(undefined);
}

export async function registerVehicle(request: VehicleRegisterRequest): Promise<Vehicle> {
  if (!USE_MOCK) {
    const userId = useAuthStore.getState().user?.id;
    const { data } = await apiClient.post<BackendCarDto>('/api/cars', {
      nickname: request.nickname,
      model: request.model,
      carNumber: request.plateNumber,
      userId,
    });
    return toVehicle(data);
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
