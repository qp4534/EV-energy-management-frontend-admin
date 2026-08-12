import { Feather } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, Platform, StatusBar, TextInput, TouchableOpacity, View } from 'react-native';

import { getCurrentDemandLevel, DemandLevel } from '@/api/demand';
import { getNearbyChargers } from '@/api/charger';
import { BrandHeader } from '@/components/common/brand-header';
import ChargerMap from '@/components/home/ChargerMap';
import { DemandBadge } from '@/components/home/DemandBadge';
import StationBottomSheet from '@/components/home/StationBottomSheet';
import { Charger } from '@/types/charger';

// 서울 강남역 기준 기본 위치 설정
const DEFAULT_REGION = {
  latitude: 37.4979,
  longitude: 127.0276,
  latitudeDelta: 0.02,
  longitudeDelta: 0.02,
};

export default function MapScreen() {
  const router = useRouter();
  const mapRef = useRef<any>(null);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [stations, setStations] = useState<Charger[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentLocation, setCurrentLocation] = useState<typeof DEFAULT_REGION>(DEFAULT_REGION);
  const [demand, setDemand] = useState<DemandLevel | null>(null);

  // 기기 위치 권한 요청 및 현재 위치 가져오기. 충전소와의 거리 계산에도 이 좌표를 사용한다.
  // expo-location은 웹도 지원한다(navigator.geolocation을 감싼 형태) — 웹이라고 건너뛰지 않는다.
  const requestUserLocation = async (): Promise<{ latitude: number; longitude: number } | null> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('알림', '위치 권한이 거부되었습니다. 기본 위치로 표시합니다.');
        return null;
      }
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const userRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      };
      setCurrentLocation(userRegion);

      // 현재 위치로 지도 이동 (네이티브 환경에서만)
      if (mapRef.current) mapRef.current.animateToRegion(userRegion, 1000);
      return { latitude: userRegion.latitude, longitude: userRegion.longitude };
    } catch (error) {
      console.error('위치 정보를 가져오는 중 오류 발생:', error);
      return null;
    }
  };

  // 초기 화면 로딩 시 위치 권한 요청 후 그 좌표 기준으로 충전소 데이터 가져오기
  useEffect(() => {
    async function initScreen() {
      try {
        setIsLoading(true);
        const origin = await requestUserLocation();
        const data = await getNearbyChargers(origin ?? undefined);
        setStations(data);
      } catch (error) {
        Alert.alert('에러', '충전소 데이터를 가져오지 못했습니다.');
      } finally {
        setIsLoading(false);
      }
    }
    initScreen();

    // 지금 시간대 충전 수요 배지 - 실패해도 화면엔 영향 없음(null이면 배지가 그냥 안 보임)
    getCurrentDemandLevel().then(setDemand);
  }, []);

  // 검색 버튼 클릭 시 충전소 검색 및 지도 이동 함수
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('알림', '검색어를 입력해주세요.');
      return;
    }
    try {
      setIsLoading(true);
      // 모든 충전소 데이터를 가져와서(현재 위치 기준 거리순 정렬 포함) 검색어와 일치하는 것만 필터링
      const allStations = await getNearbyChargers({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      });
      const filtered = allStations.filter(station =>
        station.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
      );
      setStations(filtered);

      if (filtered.length === 0) {
        Alert.alert('검색 결과', '해당하는 충전소가 없습니다.');
      } else if (mapRef.current && Platform.OS !== 'web') {
        // 검색 결과 중 첫 번째 충전소 위치로 지도 이동
        const firstStation = filtered[0];
        mapRef.current.animateToRegion({
          latitude: firstStation.latitude,
          longitude: firstStation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }, 1000);
      }
    } catch (error) {
      Alert.alert('오류', '검색 결과를 가져오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#E2EFE0' }}>
      <StatusBar barStyle="light-content" />

      <BrandHeader
        title="충전소 위치 찾기"
        showBack
      />

      {/* 맵 콘텐츠 바디 */}
      <View style={{ flex: 1, position: 'relative' }}>
        <ChargerMap mapRef={mapRef} currentLocation={currentLocation} stations={stations} />

        {/* 검색 바 */}
        <View style={{ position: 'absolute', top: 16, left: 16, right: 16, backgroundColor: '#C2E0C2', borderRadius: 24, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 48, zIndex: 20 }}>
          <TextInput
            placeholder="충전소 검색"
            placeholderTextColor="#557A59"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            style={{ flex: 1, fontSize: 16, color: '#113B29', fontWeight: 'bold' }}
          />
          <TouchableOpacity onPress={handleSearch} style={{ padding: 4 }}>
            <Feather name="search" size={20} color="#113B29" />
          </TouchableOpacity>
        </View>

        <View style={{ position: 'absolute', top: 72, left: 16, zIndex: 20 }}>
          <DemandBadge demand={demand} />
        </View>

        <StationBottomSheet stations={stations} isLoading={isLoading} demand={demand} />
      </View>
    </View>
  );
}
