export type Charger = {
  id: string;
  name: string;
  address: string;
  distanceKm: number;
  isAvailable: boolean;
  latitude: number; // 위도
  longitude: number; // 경도
  waitingCount?: number; // 현재 대기 대수 (CHARGING_STATION.min_queue_length)
  waitingMinutes?: number; // 예상 대기시간(분) (CHARGING_STATION.min_waiting_time)
};
