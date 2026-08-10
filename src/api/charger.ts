import { apiClient, mockDelay, USE_MOCK } from '@/api/client';
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

type Coordinates = { latitude: number; longitude: number };

// 하버사인 공식으로 두 좌표 사이 거리(km, 소수 1자리)를 구한다. 백엔드 응답엔 거리값이 없어서
// origin(사용자 현재 위치)이 있으면 직접 계산해서 채운다.
function distanceKm(a: Coordinates, b: Coordinates): number {
  const EARTH_RADIUS_KM = 6371;
  const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
  const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;
  const lat1 = (a.latitude * Math.PI) / 180;
  const lat2 = (b.latitude * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return Math.round(EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h)) * 10) / 10;
}

function mapToCharger(station: ChargingStationResponse, origin?: Coordinates): Charger {
  return {
    id: station.chargeId,
    name: station.name,
    address: station.address,
    distanceKm: origin
      ? distanceKm(origin, { latitude: station.latitude, longitude: station.longitude })
      : 0,
    isAvailable: (station.availableCount ?? 0) > 0,
    latitude: station.latitude,
    longitude: station.longitude,
    waitingCount: station.minQueueLength ?? undefined,
    waitingMinutes: station.minWaitingTime ?? undefined,
  };
}

// origin(사용자 현재 위치)이 있으면 거리순으로 정렬해서 반환한다 - 없으면(위치 권한 거부 등)
// 원본 순서 그대로.
export async function getNearbyChargers(origin?: Coordinates): Promise<Charger[]> {
  if (!USE_MOCK) {
    const { data } = await apiClient.get<ChargingStationResponse[]>('/api/charging-stations');
    const chargers = data.map((station) => mapToCharger(station, origin));
    return origin ? chargers.sort((a, b) => a.distanceKm - b.distanceKm) : chargers;
  }
  return mockDelay([
    { id: 'c1', name: '강남역 충전소', address: '서울 강남구', distanceKm: 0.6, isAvailable: true, latitude: 37.4985, longitude: 127.0296 },
    { id: 'c2', name: '역삼 공영주차장', address: '서울 강남구', distanceKm: 1.2, isAvailable: false, latitude: 37.4965, longitude: 127.0256 },
  ]);
}
