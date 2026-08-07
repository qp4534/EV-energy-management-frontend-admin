export type BatteryHistoryPoint = {
  date: string;
  soh: number;
};

export type BatteryLifecycleEvent = {
  label: string;
  date: string;
};

export type BatteryPassport = {
  vehicleId: string;
  soh: number;
  rul: number;
  temperatureC: number;
  voltage: number;
  current: number;
  history: BatteryHistoryPoint[];
  lifecycle: BatteryLifecycleEvent[];
};
