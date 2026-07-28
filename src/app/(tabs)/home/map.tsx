// import { StyleSheet } from 'react-native';

// import { Header } from '@/components/common/header';
// import { ThemedView } from '@/components/themed-view';

// export default function MapScreen() {
//   return (
//     <ThemedView style={styles.container}>
//       <Header title="충전소 지도" showBack />
//     </ThemedView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// });

import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';

// 🔌 충전소 데이터 규격 (추후 API 연동용)
interface ChargingStation {
  id: string;
  name: string;
  distance: string;
  type: string; // 완속 2기, 급속 1기 등
  status: 'available' | 'unavailable'; // 이용가능, 이용불가
  statusText: string;
}

export default function MapScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 📍 더미 데이터 (시안 이미지 기준 매핑)
  // 추후 실제 구현 시: expo-location으로 사용자 위/경도를 딴 후 백엔드 API에서 가까운 목록을 fetch 받아옵니다.
  const [stations] = useState<ChargingStation[]>([
    {
      id: '1',
      name: '고성아파트 충전소',
      distance: '100m',
      type: '완속 2기',
      status: 'available',
      statusText: '이용가능'
    },
    {
      id: '2',
      name: '고성동 행정복지센터 충전소',
      distance: '250m',
      type: '급속 1기',
      status: 'unavailable',
      statusText: '이용불가'
    }
  ]);

  return (
    <View style={{ flex: 1, backgroundColor: '#F4F6F3' }}>
      <StatusBar barStyle="light-content" />

      {/* 🟢 1. 상단 딥그린 헤더 바 */}
      <View 
        style={{ 
          backgroundColor: '#113B29', 
          paddingTop: 55, 
          paddingBottom: 20, 
          paddingHorizontal: 24,
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
          zIndex: 10,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* 뒤로가기 버튼 */}
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={{ color: '#ffffff', fontSize: 20, fontWeight: 'bold' }}>
            충전소 위치 찾기
          </Text>
        </View>
      </View>

      {/* 🟢 2. 지도 및 검색 영역 Container */}
      <View style={{ flex: 1, position: 'relative' }}>
        
        {/* 🗺️ 실제 지도 레이어 (현재는 UI 시안 대체 컴포넌트)
            추후 실제 구현 시: 
            1. npm i react-native-maps 설치
            2. import MapView, { Marker } from 'react-native-maps';
            3. 아래 View를 <MapView> 컴포넌트로 교체하면 진짜 지도가 뜹니다.
        */}
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#E2EFE0', justifyContent: 'center', alignItems: 'center' }}>
          {/* 시안의 지도 그래픽 분위기를 내기 위한 임시 아이콘 배치 */}
          <Feather name="map" size={64} color="#A3C9A8" style={{ opacity: 0.5 }} />
          <Text style={{ color: '#7FA885', fontSize: 12, marginTop: 8 }}>[ react-native-maps 지도 연동 영역 ]</Text>
          
          {/* 시안에 있는 지도 위 마커들 예시 (📍 위치) */}
          <View style={{ position: 'absolute', top: '30%', left: '40%', backgroundColor: '#113B29', padding: 6, borderRadius: 20 }}>
            <Feather name="zap" size={14} color="#3CD070" />
          </View>
          <View style={{ position: 'absolute', top: '50%', left: '60%', backgroundColor: '#113B29', padding: 6, borderRadius: 20 }}>
            <Feather name="zap" size={14} color="#3CD070" />
          </View>
          
          {/* 사용자 현재 위치 붉은색 핀 효과 */}
          <View style={{ position: 'absolute', top: '65%', left: '25%', width: 20, height: 20, backgroundColor: '#FF6B6B', borderRadius: 10, borderWidth: 3, borderColor: 'white' }} />
        </View>

        {/* 🔍 검색 바 (지도 위에 둥둥 떠 있는 형태) */}
        <View 
          style={{ 
            position: 'absolute', 
            top: 16, 
            left: 16, 
            right: 16, 
            backgroundColor: '#C2E0C2', 
            borderRadius: 24, 
            flexDirection: 'row', 
            alignItems: 'center', 
            paddingHorizontal: 16, 
            height: 48,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 4, // 안드로이드 그림자
          }}
        >
          <TextInput
            placeholder="충전소 검색"
            placeholderTextColor="#557A59"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{ flex: 1, fontSize: 16, color: '#113B29', fontWeight: 'bold' }}
          />
          <Feather name="search" size={20} color="#113B29" />
        </View>

        {/* 🟢 3. 하단 주변 충전소 정보 리스트 바텀 시트 (탭바 가림 해결 버전) */}
        <View 
          style={{ 
            position: 'absolute', 
            bottom: 0, 
            left: 0, 
            right: 0, 
            backgroundColor: '#ffffff', 
            borderTopLeftRadius: 24, 
            borderTopRightRadius: 24, 
            paddingHorizontal: 20, 
            paddingTop: 12, 
            paddingBottom: 90, // 👈 기존 24에서 90으로 올려서 탭바 두께만큼 바닥 공간 확보!
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -3 },
            shadowOpacity: 0.1,
            shadowRadius: 5,
            elevation: 5,
          }}
        >
          {/* 바텀 시트 핸들 라인 */}
          <View style={{ width: 40, height: 4, backgroundColor: '#113B29', borderRadius: 2, alignSelf: 'center', marginBottom: 16 }} />

          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#113B29', marginBottom: 16 }}>
            주변 충전소
          </Text>

          {/* 스크롤 가능한 영역 제한 및 내부 패딩 추가 */}
          <ScrollView 
            showsVerticalScrollIndicator={false} 
            style={{ maxHeight: 200 }}
            contentContainerStyle={{ paddingBottom: 10 }} // 👈 스크롤 끝단 바운스 여백
          >
            {stations.map((item, idx) => (
              <View 
                key={item.id} 
                style={{ 
                  borderBottomWidth: idx === stations.length - 1 ? 0 : 1, 
                  borderBottomColor: '#EEF2EE', 
                  paddingBottom: 14, 
                  marginBottom: 14,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#4A6B53', marginBottom: 6 }}>
                    {item.name}
                  </Text>
                  <Text style={{ fontSize: 12, color: '#999999' }}>
                    {item.distance}, {item.type}, {item.statusText}
                  </Text>
                </View>

                {/* 이용 가능 여부 태그 */}
                <View 
                  style={{ 
                    backgroundColor: item.status === 'available' ? '#EDF4D9' : '#FFE3D1', 
                    paddingHorizontal: 12, 
                    paddingVertical: 6, 
                    borderRadius: 14 
                  }}
                >
                  <Text 
                    style={{ 
                      color: item.status === 'available' ? '#4F6128' : '#FF924A', 
                      fontSize: 12, 
                      fontWeight: 'bold' 
                    }}
                  >
                    {item.statusText}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}