import { mockDelay } from '@/api/client';
import { Charger } from '@/types/charger';

export async function getNearbyChargers(): Promise<Charger[]> {
  return mockDelay([
    { id: 'c1', name: '강남역 충전소', address: '서울 강남구', distanceKm: 0.6, isAvailable: true, latitude: 37.4985, longitude: 127.0296 },
    { id: 'c2', name: '역삼 공영주차장', address: '서울 강남구', distanceKm: 1.2, isAvailable: false, latitude: 37.4965, longitude: 127.0256 },
  ]);
}
