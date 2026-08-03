export type Charger = {
  id: string;
  name: string;
  address: string;
  distanceKm: number;
  isAvailable: boolean;
  latitude: number; // 위도
  longitude: number; // 경도
};
