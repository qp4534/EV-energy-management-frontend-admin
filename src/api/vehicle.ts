import { apiClient, mockDelay, USE_MOCK } from "@/api/client";
import { guessImageContentType, putImageToPresignedUrl } from "@/api/upload";
import { useAuthStore } from "@/store/auth-store";
import { Vehicle, VehicleRegisterRequest } from "@/types/vehicle";

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

function toVehicle(
  car: BackendCarDto,
  passport?: BackendBatteryPassportDto,
): Vehicle {
  return {
    id: car.carId,
    nickname: car.nickname,
    model: car.model,
    plateNumber: car.carNumber,
    // 배터리 여권이 아직 없는(진단 전) 차량은 0으로 표시한다.
    batterySoh: passport?.sohScore != null ? Number(passport.sohScore) : 0,
    registeredAt: car.createdAt,
    imageUrl: car.imageUrl ?? undefined,
  };
}

export async function getMyVehicles(): Promise<Vehicle[]> {
  if (!USE_MOCK) {
    const [{ data: cars }, { data: passports }] = await Promise.all([
      apiClient.get<BackendCarDto[]>("/api/cars"),
      apiClient.get<BackendBatteryPassportDto[]>("/api/battery-passports"),
    ]);
    return cars.map((car) =>
      toVehicle(
        car,
        passports.find((passport) => passport.carId === car.carId),
      ),
    );
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

// CarController의 PUT은 부분수정이 아니라 레코드 전체를 덮어쓴다. 필드 하나만 바꾸려고
// 일부만 보내면 vin/imageUrl 등 나머지가 날아가서 frontend-web 관제 화면에도 영향을
// 주기 때문에, 먼저 전체 레코드를 GET해서 필요한 필드만 바꿔 그대로 다시 PUT한다.
async function updateCarFields(
  carId: string,
  fields: Partial<BackendCarDto>,
): Promise<void> {
  const { data: current } = await apiClient.get<BackendCarDto>(
    `/api/cars/${carId}`,
  );
  await apiClient.put(`/api/cars/${carId}`, { ...current, ...fields });
}

// 백엔드에 "대표 차량 전환" 전용 엔드포인트가 없어서, 새 대표 차량을 isPrimary:true로,
// 기존 대표 차량을 isPrimary:false로 두 번에 나눠 반영한다(원자적이지 않음).
export async function setVehiclePrimary(
  carId: string,
  previousPrimaryId?: string,
): Promise<void> {
  if (!USE_MOCK) {
    await updateCarFields(carId, { isPrimary: true });
    if (previousPrimaryId && previousPrimaryId !== carId) {
      await updateCarFields(previousPrimaryId, { isPrimary: false });
    }
    return;
  }
  await mockDelay(undefined);
}

// 차량 사진을 S3에 올리고, 저장용 공개 URL을 반환한다. registerVehicle()로 차량이 먼저 생성돼
// carId가 있어야 S3 키를 만들 수 있어서, 등록 완료 후 별도 스텝으로 호출된다.
export async function uploadVehicleImage(
  carId: string,
  localUri: string,
  mimeType?: string | null,
): Promise<string> {
  if (USE_MOCK) {
    return mockDelay(localUri);
  }
  const contentType = mimeType ?? guessImageContentType(localUri);
  const { data } = await apiClient.post<{
    uploadUrl: string;
    imageUrl: string;
  }>(`/api/cars/${carId}/image/upload-url`, { contentType });

  await putImageToPresignedUrl(data.uploadUrl, localUri, contentType);

  return data.imageUrl;
}

export async function setVehicleImage(
  carId: string,
  imageUrl: string,
): Promise<void> {
  if (!USE_MOCK) {
    await updateCarFields(carId, { imageUrl });
    return;
  }
  await mockDelay(undefined);
}

export async function registerVehicle(
  request: VehicleRegisterRequest,
): Promise<Vehicle> {
  if (!USE_MOCK) {
    const userId = useAuthStore.getState().user?.id;
    const { data } = await apiClient.post<BackendCarDto>("/api/cars", {
      nickname: request.nickname,
      model: request.model,
      carNumber: request.plateNumber,
      vin: request.vin,
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
