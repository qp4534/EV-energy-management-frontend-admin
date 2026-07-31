import { EmergencyModal } from '@/components/modal/EmergencyModal';
import { ReportModal } from '@/components/modal/ReportModal';
import { VehiclePickerModal } from '@/components/modal/VehiclePickerModal';
import { useAuthStore } from '@/store/auth-store';
import { useVehicleStore } from '@/store/vehicle-store';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { vehicle, vehicles, isRegistered, setPrimaryVehicle } = useVehicleStore();

  // 데이터 유실 혹은 초기 상태를 대비한 기본값 
  const currentUserName = user?.name || '사용자';
  const currentVehicleName = vehicle?.model || '등록된 차량 없음';
  const currentPlateNumber = vehicle?.plateNumber || '차량 번호 미등록';
  const currentBatteryTemp = (vehicle as any)?.temperatureC ?? 95;

  // 🚨 팝업 상태 관리 
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [showVehiclePicker, setShowVehiclePicker] = useState<boolean>(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState<boolean>(false); 

  // 🤖 [AI 연동 영역 데이터]
  const [aiReportSummary] = useState<string>("추후 AI가 요약해준 보고서 요약 내용이 실시간으로 연동되어 표시될 영역입니다.");
  
  // 💡 AI 충전가이드 연동 상태: 추후 백엔드 AI가 분석한 데이터(문구)를 setState에 넣어주면 실시간 갱신됩니다.
  const [aiChargingGuide, setAiChargingGuide] = useState<string>(
    "추후 AI 가이드 연동, 배터리 온도가 너무 높습니다!\n급속 충전 대신 완속 충전을 추천합니다."
  );

  // 배터리 잔존 수명(Soh)이 스토어에 있다면 해당 값을 반영하고, 없으면 기본값(3.3)을 보여줍니다.
  const batterySohProgress = vehicle?.batterySoh ? vehicle.batterySoh / 100 : 0.35;
  const estimatedLife = (batterySohProgress * 10).toFixed(1); // SOH 기반 잔존 수명 시뮬레이션

  // 📍 [위치 기반 데이터] 가까운 충전소 2개 기본셋팅
  const [nearbyStations, setNearbyStations] = useState([
    { name: '고성아파트 충전소', dist: '100m' }, 
    { name: '고성동 행정복지센터', dist: '250m' }
  ]);

  // 차량 등록 상태에서 알림 단계에 따라 적절한 팝업 자동 트리거
  useEffect(() => {
    if (isRegistered) {
      // 추후 백엔드 응답 알림 레벨이 '긴급' 또는 '경고'로 들어올 때 분기 작동
      const mockNotificationServerLevel = '긴급'; // '긴급' 또는 '경고'로 테스트해볼 수 있습니다.

      const timer = setTimeout(() => {
        if (mockNotificationServerLevel === '긴급') {
          // 1순위: 긴급 상황 발생 시 화재 위험 불꽃 팝업 작동
          setShowEmergencyModal(true);
        } else if (mockNotificationServerLevel === '경고') {
          // 2순위: 경고 상황 발생 시 기존 보고서 팝업 작동
          setShowReportModal(true);
        }
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, [isRegistered, vehicle]);

  // 🚗 등록된 차량 중 하나를 대표 차량으로 선택하는 창을 엽니다.
  // (Alert.alert는 웹 빌드의 react-native-web에서 아무 동작도 하지 않는 no-op이라 커스텀 모달로 구현)
  const handleSwitchVehicle = () => {
    setShowVehiclePicker(true);
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
        {/* 상단 타이틀과 알림 아이콘*/}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ color: '#3CD070', fontSize: 18, fontWeight: 'bold', marginRight: 4 }}>⚡</Text>
            <Text style={{ color: '#ffffff', fontSize: 15, fontWeight: 'bold', letterSpacing: 0.5, opacity: 0.9 }}>
              MijungE
            </Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/notification/list')}>
            <Feather name="bell" size={22} color="white" style={{ opacity: 0.9 }} />
          </TouchableOpacity>
        </View>
        
        {/* 메인 타이틀 */}
        <Text style={{ color: '#ffffff', fontSize: 25, fontWeight: 'bold' }}>
          안녕하세요, {currentUserName}님
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1, paddingHorizontal: 24 }} 
        contentContainerStyle={{ paddingBottom: 120, paddingTop: 16 }} 
        showsVerticalScrollIndicator={false}
      >
      
        {/* ================= 🚗 [CASE 1] 차량 미등록시 메인 화면 ================= */}
        {!isRegistered ? (
          <View>
            <View style={{ backgroundColor: '#ffffff', borderRadius: 16, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: '#EAEFEA', marginBottom: 20 }}>
              <View style={{ width: 96, height: 96, backgroundColor: '#F5F9F4', borderRadius: 48, justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
                <MaterialCommunityIcons name="car-multiple" size={48} color="#8FBC8F" />
              </View>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#222222', textAlign: 'center', marginBottom: 8, lineHeight: 22 }}>
                환영합니다!{'\n'}차량을 가지고 계신가요?
              </Text>
              <Text style={{ fontSize: 12, color: '#666666', textAlign: 'center', marginBottom: 20, lineHeight: 18 }}>
                지금 차량 종류와 차량 번호를 등록하시면 차량 화재 감지 및 배터리 관리 서비스를 이용할 수 있습니다.
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
                    {currentVehicleName}
                  </Text>

                  <View style={{ backgroundColor: '#C2E0C2', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 }}>
                    <Text style={{ color: '#113B29', fontSize: 10, fontWeight: 'bold' }}>{vehicle?.nickname || '대표 차량'}</Text>
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
                    {currentPlateNumber} (DB 이미지 준비중)
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
                예상 잔존 수명 {estimatedLife}년 {vehicle?.batterySoh ? `(SOH: ${vehicle.batterySoh}%)` : ''}
              </Text>
              <View style={{ width: '100%', height: 8, backgroundColor: '#F0F4E8', borderRadius: 4, overflow: 'hidden' }}>
                <View style={{ width: `${batterySohProgress * 100}%`, height: '100%', backgroundColor: '#B2D8B2', borderRadius: 4 }} />
              </View>
            </View>

            {/* 🟢 4. 주변 충전소 카드 */}
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
          </View>
        )}
      </ScrollView>

      <EmergencyModal 
        visible={showEmergencyModal} 
        onClose={() => setShowEmergencyModal(false)} 
        temperature={currentBatteryTemp} 
      />

      <ReportModal
        visible={showReportModal}
        onClose={() => setShowReportModal(false)}
        onDetailPress={() => {
          setShowReportModal(false);
          router.push('/(tabs)/home/report');
        }}
        vehicleModel={currentVehicleName}
        plateNumber={currentPlateNumber}
        summaryText={aiReportSummary}
    />

    <VehiclePickerModal
      visible={showVehiclePicker}
      onClose={() => setShowVehiclePicker(false)}
      vehicles={vehicles}
      currentVehicleId={vehicle?.id}
      onSelectVehicle={(id) => {
        setPrimaryVehicle(id);
        setShowVehiclePicker(false);
      }}
      onRegisterNewVehicle={() => {
        setShowVehiclePicker(false);
        router.push('/(tabs)/vehicle');
      }}
    />
    
    </View>
  );
}