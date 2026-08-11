export type Vehicle = {
  id: string;
  nickname: string;
  model: string;
  plateNumber: string;
  batterySoh: number;
  registeredAt: string;
  imageUrl?: string;
};

export type VehicleRegisterRequest = {
  nickname: string;
  model: string;
  plateNumber: string;
  vin: string;
  /** 등록 폼에서 고른 로컬 사진 URI. 차량이 먼저 생성된 뒤 그 carId로 S3에 업로드된다. */
  imageUri?: string | null;
  imageMimeType?: string | null;
};
