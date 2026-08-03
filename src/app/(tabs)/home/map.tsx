import { Feather, Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Platform, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { getNearbyChargers } from '@/api/charger';
import { Charger } from '@/types/charger';

// 웹 브라우저 튕김 방지용 네이티브 지도 동적 컴포넌트 처리
let MapView: any = View;
let Marker: any = View;
if (Platform.OS !== 'web') {
  try {
    const Maps = require('react-native-maps');
    MapView = Maps.default;
    Marker = Maps.Marker;
  } catch (e) {
    console.error('네이티브 지도 라이브러리를 로드하지 못했습니다.', e);
  }
}

// 서울 강남역 기준 기본 좌표 정의
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
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState<boolean>(true); 
  const [stations, setStations] = useState<Charger[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 사용자 현재 위치 상태 관리
  const [currentLocation, setCurrentLocation] = useState<typeof DEFAULT_REGION>(DEFAULT_REGION);

  // 📍 1. 기기 현재 위치 권한 요청 및 좌표 획득 함수
  const requestUserLocation = async () => {
    if (Platform.OS === 'web') return;

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('알림', '위치 권한이 거부되었습니다. 기본 위치로 표시합니다.');
        return;
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
      
      // 지도 컴포넌트가 준비되었다면 사용자의 현재 위치로 카메라 이동
      if (mapRef.current) {
        mapRef.current.animateToRegion(userRegion, 1000);
      }
    } catch (error) {
      console.error('위치 정보를 가져오는 중 오류 발생:', error);
    }
  };

  // 컴포넌트 마운트 시 주변 충전소 API 호출
  useEffect(() => {
    async function initScreen() {
      try {
        setIsLoading(true);
        // 위치 측정과 API 통신을 동시에 병렬 처리
        const [data] = await Promise.all([
          getNearbyChargers(),
          requestUserLocation()
        ]);
        setStations(data);
      } catch (error) {
        console.error('충전소 목록을 불러오는 중 오류 발생:', error);
        Alert.alert('에러', '충전소 데이터를 가져오지 못했습니다.');
      } finally {
        setIsLoading(false);
      }
    }
    initScreen();
  }, []);

  // 🔍 검색 실행 함수
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('알림', '검색어를 입력해주세요.');
      return;
    }
    try {
      setIsLoading(true);
      // 1. 우선 목데이터 API에서 전체 목록을 다시 긁어옵니다.
      const allStations = await getNearbyChargers();

      // 2. 유저가 입력한 검색어(예: 강남역)가 이름에 포함된 데이터만 쏙 필터링합니다.
      const filtered = allStations.filter(station => 
        station.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
      );

      // 3. 필터링된 결과로 화면 리스트를 갱신합니다.
      setStations(filtered);

      // 4. 만약 검색 결과가 하나도 없다면 알림을 띄워줍니다.
      if (filtered.length === 0) {
        Alert.alert('검색 결과', '해당하는 충전소가 없습니다.');
      } else{
        // 5. 검색 결과가 있다면 지도 중심을 첫 번째 결과로 이동시킵니다.
        const firstStation = filtered[0];
        const targetRegion = {
          latitude: firstStation.latitude,
          longitude: firstStation.longitude,
          latitudeDelta: 0.01, // 집중해서 볼 수 있도록 조금 더 확대
          longitudeDelta: 0.01,
        };

        if (mapRef.current && Platform.OS !== 'web') {
          mapRef.current.animateToRegion(targetRegion, 1000); // 1초 동안 부드럽게 이동
        }
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

      {/* 🟢 상단 딥그린 헤더 바 */}
      <View 
        style={{ 
          backgroundColor: '#113B29', paddingTop: 55, paddingBottom: 25, paddingHorizontal: 24, borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24, zIndex: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15, shadowRadius: 6, elevation: 5
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
        <Text style={{ color: '#3CD070', fontSize: 18, fontWeight: 'bold', marginRight: 4 }}>⚡</Text>
        <Text style={{ color: '#ffffff', fontSize: 15, fontWeight: 'bold', letterSpacing: 0.5, opacity: 0.9 }}>
          MijungE
        </Text>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={{ marginRight: 6, marginLeft: -6,}}
        >
          <Ionicons name="chevron-back" size={26} color="white" />
        </TouchableOpacity>
        
        <Text style={{ color: '#ffffff', fontSize: 25, fontWeight: 'bold', letterSpacing: -0.5 }}>
          충전소 위치 찾기
        </Text>
      </View>
    </View>

      {/* 🟢 지도 및 검색 영역 Container */}
      <View style={{ flex: 1, position: 'relative' }}>
        
        {/* 🗺️ 실제 지도 레이어 (현재는 UI 시안 대체 컴포넌트)
            추후 실제 구현 시: 
            1. npm i react-native-maps 설치
            2. import MapView, { Marker } from 'react-native-maps';
            3. 아래 View를 <MapView> 컴포넌트로 교체하면 진짜 지도가 뜹니다.
            4. npx expo install expo-location 설치 -> 위치 권한 요청 후 현재 위치 기반으로 지도 중심 이동 가능
        */}

        {/* 웹/모바일 분기 렌더링, 실제 지도 MapView와 마커로 교체 */}
        {Platform.OS === 'web' ? (
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#E2EFE0', justifyContent: 'center', alignItems: 'center' }}>
            <Feather name="map" size={64} color="#A3C9A8" style={{ opacity: 0.5 }} />
            <Text style={{ color: '#7FA885', fontSize: 13, marginTop: 12, fontWeight: 'bold' }}>
              모바일 기기(Expo Go)에서 지도가 표시됩니다.
            </Text>
          </View>
        ) : (
          <MapView
            ref={mapRef}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            // 처음 지도가 켜졌을 때 보여줄 중심 위치 (강남역기준)
            initialRegion={currentLocation} // 현재 위치로 지도 중심 이동
            showsUserLocation={true} // 현재 위치 표시
            showsMyLocationButton={true} // 현재 위치로 돌아가는 버튼 표시
          >
            {stations.map((station) => (
              <Marker
                key={station.id}
                coordinate={{ 
                  latitude: station.latitude, 
                  longitude: station.longitude 
                }}
                title={station.name}
                description={station.isAvailable ? '이용 가능' : '이용 불가'}
                pinColor={station.isAvailable ? '#3CD070' : '#FF924A'}
              />
            ))}
          </MapView>
        )}

        {/* 🔍 검색 바 */}
        <View 
          style={{ 
            position: 'absolute', top: 16, left: 16, right: 16, backgroundColor: '#C2E0C2', 
            borderRadius: 24, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 48,
            shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4,
            elevation: 4, 
          }}
        >
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

        {/* 🟢 하단 주변 충전소 정보 리스트 바텀 시트 */}
        <View 
          style={{ 
            position: 'absolute', bottom: isBottomSheetOpen ? 0 : 70, left: 0, right: 0, 
            backgroundColor: '#ffffff', borderTopLeftRadius: 24, borderTopRightRadius: 24, 
            paddingHorizontal: 20, paddingTop: 12, paddingBottom: isBottomSheetOpen ? 90 : 20,
            shadowColor: '#000', shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.1, shadowRadius: 5,
            elevation: 5,
          }}
        >
          {/* 토글 핸들러 (누르면 접히고 펴짐) */}
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={() => setIsBottomSheetOpen(!isBottomSheetOpen)}
            style={{ alignItems: 'center', width: '100%', paddingBottom: 10 }}
          >
            <View style={{ width: 40, height: 4, backgroundColor: '#113B29', borderRadius: 2, marginBottom: 10 }} />
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center', paddingHorizontal: 4 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#113B29', flex: 1 }}>
                주변 충전소
              </Text>
              {/* 열리고 닫힘을 알려주는 화살표 아이콘 */}
              <Feather name={isBottomSheetOpen ? "chevron-down" : "chevron-up"} size={20} color="#113B29" />
            </View>
          </TouchableOpacity>

          {/* 리스트 본문 (열려있을 때만 보임) */}
          {isLoading ? (
            <ActivityIndicator size="small" color="#113B29" style={{ marginVertical: 20 }} />
          ) : (
            isBottomSheetOpen && (
            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 200 }} contentContainerStyle={{ paddingBottom: 10 }}>
                {stations.map((item, idx) => {
                  const isAvailable = item.isAvailable;
                  return (
                    <View 
                      key={item.id} 
                      style={{ 
                        borderBottomWidth: idx === stations.length - 1 ? 0 : 1, 
                        borderBottomColor: '#EEF2EE', paddingBottom: 14, marginBottom: 14,
                        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
                      }}
                    >
                      <View style={{ flex: 1, marginRight: 8 }}>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#4A6B53', marginBottom: 6 }}>
                          {item.name}
                        </Text>
                        <Text style={{ fontSize: 12, color: '#999999' }}>
                          {item.distanceKm ? `${item.distanceKm} km` : '0 km'}, {item.address}
                        </Text>
                      </View>
                      <View style={{ backgroundColor: isAvailable ? '#EDF4D9' : '#FFE3D1', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14 }}>
                        <Text style={{ color: isAvailable ? '#4F6128' : '#FF924A', fontSize: 12, fontWeight: 'bold' }}>
                          {isAvailable ? '이용가능' : '이용불가'}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
            )
          )}
        </View>
      </View>
    </View>
  );
}