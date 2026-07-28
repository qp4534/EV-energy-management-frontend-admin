import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';

interface UserProfile {
  name: string;
  phone: string;
  birthDate: string;
  email: string;
}

interface VehicleData {
  id: string;
  vehicleName: string;
  vehicleNumber: string;
  imageUrl: string | null;
}

export default function HomeScreen() {
  const router = useRouter();

  const [user] = useState<UserProfile>({
    name: "홍길동",
    phone: "010-1234-5678",
    birthDate: "1995-01-01",
    email: "hong@mijung.com"
  });

  const [myVehicles, setMyVehicles] = useState<VehicleData[]>([
    { id: '1', vehicleName: '아이오닉5', vehicleNumber: '12가 3456', imageUrl: null },
    { id: '2', vehicleName: 'EV6', vehicleNumber: '78나 9012', imageUrl: null },
  ]);

  const [currentVehicleIdx, setCurrentVehicleIdx] = useState<number>(0);
  const currentVehicle = myVehicles[currentVehicleIdx];

  const [isVehicleRegistered, setIsVehicleRegistered] = useState<boolean>(true);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);

  // 🤖 [AI 연동 영역 데이터]
  const [aiReportSummary] = useState<string>("(기존 설명 대신) 추후 AI가 요약해준 보고서 요약 내용이 실시간으로 연동되어 표시될 영역입니다.");
  const [aiChargingGuide] = useState<string>("배터리 온도가 너무 높습니다!\n급속 충전 대신 완속 충전을 추천합니다.");
  const [aiBatteryDiagnosis] = useState<{ remainingLife: number; progress: number }>({
    remainingLife: 3.3,
    progress: 0.35
  });

  // 📍 [위치 기반 데이터] 가까운 충전소 2개
  const [nearbyStations] = useState([
    { name: '역삼 충전소', dist: '350m' },
    { name: '테헤란로 충전소', dist: '780m' }
  ]);

  useEffect(() => {
    if (isVehicleRegistered) {
      const timer = setTimeout(() => setShowReportModal(true), 1200);
      return () => clearTimeout(timer);
    }
  }, [isVehicleRegistered, currentVehicleIdx]);

  const handleSwitchVehicle = () => {
    if (myVehicles.length > 1) {
      const nextIdx = (currentVehicleIdx + 1) % myVehicles.length;
      setCurrentVehicleIdx(nextIdx);
      Alert.alert("차량 변경", `현재 메인 차량이 [${myVehicles[nextIdx].vehicleName}]로 변경되었습니다.`);
    } else {
      Alert.alert("알림", "등록된 다른 차량이 없습니다. 차량을 추가 등록해 주세요.");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F4F6F3' }}>
      <StatusBar barStyle="light-content" />
      
      {/* 🟢 상단 딥그린 헤더 바 */}
      <View 
        style={{ 
          backgroundColor: '#113B29', 
          paddingTop: 55, 
          paddingBottom: 25, 
          paddingHorizontal: 24,
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ color: '#3CD070', fontSize: 18, fontWeight: 'bold', marginRight: 4 }}>⚡</Text>
            <Text style={{ color: '#ffffff', fontSize: 15, fontWeight: 'bold', letterSpacing: 0.5 }}>
              MijungE
            </Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/notification/list')}>
            <Feather name="bell" size={22} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={{ color: '#ffffff', fontSize: 24, fontWeight: 'bold', marginTop: 16 }}>
          안녕하세요, {user.name}*님
        </Text>
      </View>

      <ScrollView 
        contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 16, paddingTop: 16 }} 
        showsVerticalScrollIndicator={false}
      >
        {/* ================= 🚗 [CASE 1] 차량 미등록시 메인 화면 ================= */}
        {!isVehicleRegistered ? (
          <View>
            <View style={{ backgroundColor: '#ffffff', borderRadius: 16, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: '#EAEFEA', marginBottom: 20 }}>
              <View style={{ width: 96, height: 96, backgroundColor: '#F5F9F4', borderRadius: 48, justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
                <MaterialCommunityIcons name="car-multiple" size={48} color="#8FBC8F" />
              </View>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#222222', textAlign: 'center', marginBottom: 8, lineHeight: 22 }}>
                환영합니다!{'\n'}차량을 가지고 계신가요?
              </Text>
              <Text style={{ fontSize: 12, color: '#666666', textAlign: 'center', marginBottom: 20, lineHeight: 18 }}>
                회원가입이 완료되었습니다. 지금 차량 종류와 차량 번호를 등록하시면 스마트한 배터리 관리 서비스를 이용할 수 있습니다.
              </Text>
              
              <TouchableOpacity 
                onPress={() => router.push('/(tabs)/vehicle')} 
                style={{ width: '100%', backgroundColor: '#B2D8B2', paddingVertical: 14, borderRadius: 12, alignItems: 'center' }}
              >
                <Text style={{ color: '#113B29', fontWeight: 'bold', fontSize: 14 }}>차량 등록하기</Text>
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingHorizontal: 4 }}>
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#222222' }}>이용 가능 서비스</Text>
              <TouchableOpacity onPress={() => setIsVehicleRegistered(true)}>
                <Text style={{ fontSize: 11, color: '#999999', textDecorationLine: 'underline' }}>[개발용] 등록 상태 보기</Text>
              </TouchableOpacity>
            </View>
            
            {['화재 위험 감지', 'AI 충전 가이드', '배터리 진단'].map((service, idx) => (
              <View key={idx} style={{ backgroundColor: '#ffffff', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#EAEFEA', marginBottom: 10 }}>
                <Feather name="plus-circle" size={18} color="#113B29" />
                <Text style={{ fontSize: 14, fontWeight: '500', color: '#444444', marginLeft: 12 }}>{service}</Text>
              </View>
            ))}
          </View>
        ) : (
          
          // ================= 🔋 [CASE 2] 차량 등록 완료 메인 화면 =================
          <View>
            {/* 1. 차량 관리 카드 */}
            <View style={{ backgroundColor: '#ffffff', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#EAEFEA', marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#222222', marginRight: 8 }}>
                    {currentVehicle.vehicleName}
                  </Text>
                  <View style={{ backgroundColor: '#C2E0C2', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 }}>
                    <Text style={{ color: '#113B29', fontSize: 10, fontWeight: 'bold' }}>대표 차량</Text>
                  </View>
                  
                  <TouchableOpacity 
                    onPress={handleSwitchVehicle}
                    style={{ backgroundColor: '#EFEFEF', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, marginLeft: 4 }}
                  >
                    <Text style={{ color: '#666666', fontSize: 10, fontWeight: 'bold' }}>다른 차량</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity 
                  onPress={() => router.push('/(tabs)/vehicle')}
                  style={{ backgroundColor: '#113B29', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 }}
                >
                  <Text style={{ color: '#ffffff', fontSize: 10, fontWeight: 'bold' }}>+ 등록</Text>
                </TouchableOpacity>
              </View>

              <View style={{ width: '100%', height: 140, backgroundColor: '#EFEFEF', borderRadius: 12, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ alignItems: 'center' }}>
                  <MaterialCommunityIcons name="car-side" size={48} color="#BBBBBB" />
                  <Text style={{ color: '#999999', fontSize: 11, marginTop: 4 }}>
                    {currentVehicle.vehicleNumber} (DB 이미지 준비중)
                  </Text>
                </View>
              </View>
            </View>

            {/* 2. AI 충전 가이드 카드 */}
            <View style={{ backgroundColor: '#ffffff', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#EAEFEA', marginBottom: 16 }}>
              <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#999999', marginBottom: 8 }}>AI 충전가이드</Text>
              <View style={{ backgroundColor: '#EDF4D9', padding: 16, borderRadius: 12 }}>
                <Text style={{ color: '#4F6128', fontSize: 13, fontWeight: '600', lineHeight: 20 }}>
                  {aiChargingGuide}
                </Text>
              </View>
            </View>

            {/* 3. 배터리 진단 카드 */}
            <View style={{ backgroundColor: '#ffffff', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#EAEFEA', marginBottom: 16 }}>
              <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#999999', marginBottom: 4 }}>배터리 진단</Text>
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#222222', marginBottom: 10 }}>
                예상 잔존 수명 {aiBatteryDiagnosis.remainingLife}년
              </Text>
              <View style={{ width: '100%', height: 8, backgroundColor: '#F0F4E8', borderRadius: 4, overflow: 'hidden' }}>
                <View style={{ width: `${aiBatteryDiagnosis.progress * 100}%`, height: '100%', backgroundColor: '#B2D8B2', borderRadius: 4 }} />
              </View>
            </View>

            {/* 🟢 4. 주변 충전소 카드 (터치 시 지도 화면 이동 버전으로 변경완료!) */}
            <TouchableOpacity 
              onPress={() => router.push('/(tabs)/home/map')}
              activeOpacity={0.7}
              style={{ 
                backgroundColor: '#ffffff', 
                borderRadius: 16, 
                padding: 20, 
                borderWidth: 1, 
                borderColor: '#EAEFEA', 
                marginBottom: 16,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 3,
                elevation: 2,
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#999999' }}>주변 충전소 (가까운 2개)</Text>
                <Feather name="chevron-right" size={16} color="#113B29" />
              </View>
              
              {nearbyStations.map((station, idx) => (
                <View 
                  key={idx} 
                  style={{ 
                    borderBottomWidth: idx === 0 ? 1 : 0, 
                    borderBottomColor: '#F5F5F5', 
                    paddingBottom: idx === 0 ? 10 : 0, 
                    marginBottom: idx === 0 ? 10 : 0, 
                    flexDirection: 'row', 
                    justifyContent: 'space-between', 
                    alignItems: 'center' 
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Feather name="map-pin" size={14} color="#113B29" />
                    <Text style={{ fontSize: 13, color: '#333333', marginLeft: 8 }}>{station.name}</Text>
                  </View>
                  <Text style={{ fontSize: 12, color: '#999999' }}>{station.dist}</Text>
                </View>
              ))}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setIsVehicleRegistered(false)} style={{ marginTop: 16, alignItems: 'center' }}>
              <Text style={{ fontSize: 11, color: '#999999', textDecorationLine: 'underline' }}>[개발용] 미등록 상태로 보기</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* ================= 🚨 [MODAL] 보고서 알림 모달 팝업 ================= */}
      {showReportModal && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, zIndex: 50 }}>
          <View style={{ backgroundColor: '#ffffff', width: '100%', borderRadius: 16, padding: 20, alignItems: 'center', position: 'relative' }}>
            
            {/* 🟢 최상단 씹힘 방지 설정 완료된 X 버튼 */}
            <TouchableOpacity 
              onPress={() => setShowReportModal(false)} 
              style={{ 
                position: 'absolute', 
                right: 16, 
                top: 16, 
                padding: 10, 
                zIndex: 9999,
              }}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            >
              <Feather name="x" size={20} color="#AAAAAA" />
            </TouchableOpacity>

            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#113B29', width: '100%', textAlign: 'left', marginBottom: 14 }}>
              보고서 알림
            </Text>
            
            <View style={{ width: '100%', backgroundColor: '#F7F9F6', borderWidth: 1, borderColor: '#DEE5DC', borderRadius: 12, padding: 16, marginBottom: 20 }}>
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#113B29', textAlign: 'center', marginBottom: 10 }}>
                보고서가 도착했습니다.
              </Text>
              <Text style={{ fontSize: 12, color: '#666666', lineHeight: 18, marginBottom: 14, textAlign: 'center', fontStyle: 'italic' }}>
                {aiReportSummary}
              </Text>
              
              <View style={{ borderTopWidth: 1, borderTopColor: '#E2E8E0', paddingTop: 12 }}>
                <Text style={{ fontSize: 11, color: '#999999', marginBottom: 4 }}>• 발생시각 : 2026/07/15 13:30</Text>
                <Text style={{ fontSize: 11, color: '#999999', marginBottom: 4 }}>• 위치 : 현재 충전소</Text>
                <Text style={{ fontSize: 11, color: '#999999' }}>• 배터리 온도 : 50 ℃</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              onPress={() => {
                setShowReportModal(false);
                router.push('/(tabs)/home/report');
              }}
              style={{ width: '100%', backgroundColor: '#DCECD8', paddingVertical: 14, borderRadius: 12, alignItems: 'center' }}
            >
              <Text style={{ color: '#113B29', fontWeight: 'bold', fontSize: 14 }}>자세히 보기</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}