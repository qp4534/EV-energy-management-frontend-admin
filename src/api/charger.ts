import { apiClient, mockDelay, USE_MOCK } from '@/api/client';
import { Charger } from '@/types/charger';

type BackendChargingStationDto = {
  chargeId: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  availableCount: number | null;
};

type Coordinates = { latitude: number; longitude: number };

// 하버사인 공식으로 두 좌표 사이 거리(km)를 구한다. 백엔드 응답엔 거리값이 없어서 직접 계산한다.
function distanceKm(a: Coordinates, b: Coordinates): number {
  const EARTH_RADIUS_KM = 6371;
  const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
  const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;
  const lat1 = (a.latitude * Math.PI) / 180;
  const lat2 = (b.latitude * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

export async function getNearbyChargers(origin?: Coordinates): Promise<Charger[]> {
  if (!USE_MOCK) {
    const { data } = await apiClient.get<BackendChargingStationDto[]>('/api/charging-stations');
    return data.map((station) => ({
      id: station.chargeId,
      name: station.name,
      address: station.address,
      isAvailable: (station.availableCount ?? 0) > 0,
      latitude: station.latitude,
      longitude: station.longitude,
      distanceKm: origin
        ? Math.round(distanceKm(origin, { latitude: station.latitude, longitude: station.longitude }) * 10) / 10
        : 0,
    }));
  }
  return mockDelay([
    { id: 'c1', name: '강남역 충전소', address: '서울 강남구', distanceKm: 0.6, isAvailable: true, latitude: 37.4985, longitude: 127.0296 },
    { id: 'c2', name: '역삼 공영주차장', address: '서울 강남구', distanceKm: 1.2, isAvailable: false, latitude: 37.4965, longitude: 127.0256 },
  ]);
}
