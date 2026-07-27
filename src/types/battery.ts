export type BatteryHistoryPoint = {
  date: string;
  soh: number;
};

export type BatteryPassport = {
  vehicleId: string;
  soh: number;
  rul: number;
  history: BatteryHistoryPoint[];
};
