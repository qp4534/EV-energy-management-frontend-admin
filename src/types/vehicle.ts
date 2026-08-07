export type Vehicle = {
  id: string;
  nickname: string;
  model: string;
  plateNumber: string;
  batterySoh: number;
  registeredAt: string;
};

export type VehicleRegisterRequest = {
  nickname: string;
  model: string;
  plateNumber: string;
};
