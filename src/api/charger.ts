import { apiClient } from '@/api/client';
import { Charger } from '@/types/charger';

// 백엔드 ChargingStationDto(EV-energy-management-backend) 필드명 그대로.
type ChargingStationResponse = {
  chargeId: string;
  region: string;
  address: string;
  latitude: number;
  longitude: number;
  name: string;
  slowChargerCount: number;
  fastChargerCount: number;
  availableCount: number;
  minQueueLength: number | null;
  minWaitingTime: number | null;
};

function mapToCharger(station: ChargingStationResponse): Charger {
  return {
    id: station.chargeId,
    name: station.name,
    address: station.address,
    distanceKm: 0, // 사용자 위치 기준 거리는 sortStationsByDistance에서 채운다
    isAvailable: (station.availableCount ?? 0) > 0,
    latitude: station.latitude,
    longitude: station.longitude,
    waitingCount: station.minQueueLength ?? undefined,
    waitingMinutes: station.minWaitingTime ?? undefined,
  };
}

export async function getNearbyChargers(): Promise<Charger[]> {
  const { data } = await apiClient.get<ChargingStationResponse[]>('/api/charging-stations');
  return data.map(mapToCharger);
}
