import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';

import { RegisteredHome } from '@/components/home/registered-home';
import { UnregisteredHome } from '@/components/home/unregistered-home';
import { EmergencyModal } from '@/components/modal/EmergencyModal';
import { ReportModal } from '@/components/modal/ReportModal';
import { VehiclePickerModal } from '@/components/modal/VehiclePickerModal';

import { useAuthStore } from '@/store/auth-store';
import { useVehicleStore } from '@/store/vehicle-store';
import { Report } from '@/types/report';

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

  // 🤖 백엔드 API 연동 전까지 UI 테스트를 위한 더미 객체 상태
  const [activeReport, setActiveReport] = useState<(Report & { type?: any }) | null>({
    id: 'rep_01',
    title: 'AI 정밀 진단 리포트',
    summary: '최근 충전 중 평소보다 배터리 이상 과열 현상이 누적 감지되어 AI 정밀 보고서가 발행되었습니다.',
    createdAt: '2026-08-01',
    type: '경고' 
  });

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

      {/* 메인 뷰포트 - 분리된 홈 컴포넌트 렌더링 영역 */}
      <ScrollView
        style={{ flex: 1, paddingHorizontal: 24 }} 
        contentContainerStyle={{ paddingBottom: 120, paddingTop: 16 }} 
        showsVerticalScrollIndicator={false}
      >
        {!isRegistered ? (
          <UnregisteredHome />
        ) : (
          <RegisteredHome 
            vehicle={vehicle}
            currentVehicleName={currentVehicleName}
            currentPlateNumber={currentPlateNumber}
            aiChargingGuide={aiChargingGuide}
            estimatedLife={estimatedLife}
            batterySohProgress={batterySohProgress}
            handleSwitchVehicle={handleSwitchVehicle}
          />
        )}
      </ScrollView>

      {/* 공통 팝업 모달 레이어 */}
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
        reportData={activeReport} // 낱개 텍스트 대신 객체 전달, 추후 백엔드 API 연동 시 실시간 데이터로 교체 가능
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