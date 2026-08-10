import { Charger } from '@/types/charger';
import { Coordinates, getDistanceKm } from '@/utils/geo';

/**
 * 사용자 위치 기준으로 각 충전소의 distanceKm을 채우고 가까운 순으로 정렬한다.
 * ("추천" 1순위 표시는 하지 않기로 함 - 대신 지도 화면 상단에 시간대별 충전 수요
 * 낮음/보통/높음 배지(DemandBadge)를 따로 보여준다.)
 *
 * userLocation이 없으면(위치 권한 거부 등) 정렬 없이 원본 목록을 그대로 반환한다.
 */
export function sortStationsByDistance(
  stations: Charger[],
  userLocation: Coordinates | null,
): Charger[] {
  if (!userLocation) return stations;

  const withDistance = stations.map((station) => ({
    ...station,
    distanceKm: getDistanceKm(userLocation, {
      latitude: station.latitude,
      longitude: station.longitude,
    }),
  }));

  return withDistance.sort((a, b) => a.distanceKm - b.distanceKm);
}
