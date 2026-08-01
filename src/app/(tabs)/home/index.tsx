import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';

import { RegisteredHome } from '@/components/home/registered-home';
import { UnregisteredHome } from '@/components/home/unregistered-home';
import { EmergencyModal } from '@/components/modal/EmergencyModal';
import { ReportModal } from '@/components/modal/ReportModal';
import { VehiclePickerModal } from '@/components/modal/VehiclePickerModal';

import { useAuthStore } from '@/store/auth-store';
import { useVehicleStore } from '@/store/vehicle-store';

import { Charger } from '@/types/charger';
import { NotiType } from '@/types/notification';
import { Report } from '@/types/report';

import { getBatteryPassport } from '@/api/battery';
import { getNearbyChargers } from '@/api/charger';
import { getReports } from '@/api/report';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { vehicle, vehicles, isRegistered, setPrimaryVehicle } = useVehicleStore();

  // 데이터 유실 혹은 초기 상태를 대비한 기본값 
  const currentUserName = user?.name || '사용자';
  const currentVehicleName = vehicle?.model || '등록된 차량 없음';
  const currentPlateNumber = vehicle?.plateNumber || '차량 번호 미등록';

  // 🚨 팝업 및 데이터 상태 관리 
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [showVehiclePicker, setShowVehiclePicker] = useState<boolean>(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState<boolean>(false); 
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 실시간 API 연동 상태들
  const [chargers, setChargers] = useState<Charger[]>([]);
  const [activeReport, setActiveReport] = useState<(Report & { type?: NotiType }) | null>(null);
  const [batteryInfo, setBatteryInfo] = useState<any>(null);
  const [aiChargingGuide, setAiChargingGuide] = useState<string>("추후 AI 가이드 연동, 배터리 온도가 너무 높습니다!\n급속 충전 대신 완속 충전을 추천합니다.");

  // 데이터 바인딩 로직
  useEffect(() => {
    async function loadHomeData() {
      if (!isRegistered) {
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        // 1. 충전소, 보고서, 배터리 패스포트 API 동시 호출
        const [chargerList, reportList, batteryData] = await Promise.all([
          getNearbyChargers(),
          getReports(),
          getBatteryPassport(vehicle?.id || 'default'),
        ]);

        setChargers(chargerList);
        setBatteryInfo(batteryData);

        // 2. 가장 최신 보고서 연동 및 상태 레벨 매핑 (임의로 '경고' 주입 테스트)
        if (reportList && reportList.length > 0) {
          setActiveReport({
            ...reportList[0],
            type: '경고', 
          });
        }
      } catch (error) {
        console.error('홈 데이터를 불러오는 중 에러 발생:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadHomeData();
  }, [isRegistered, vehicle]);

  // 알림 단계 상태 자동 모달 레이어 트리거 연동
  useEffect(() => {
    if (isRegistered && !isLoading) {
      // 배터리 실시간 온도가 50도 이상 비상이거나 알림이 긴급일 때 분기 작동
      const currentTemp = batteryInfo?.temperatureC ?? 0;
      
      const timer = setTimeout(() => {
        if (currentTemp >= 50) {
          // 1순위: 위험 고온 상태 시 불꽃 팝업 작동
          setShowEmergencyModal(true);
        } else if (activeReport) {
          // 2순위: 진단 보고서 발행 완료 시 팝업 작동
          setShowReportModal(true);
        }
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [isRegistered, isLoading, batteryInfo, activeReport]);

  // 🚗 등록된 차량 중 하나를 대표 차량으로 선택하는 창을 엽니다.
  // (Alert.alert는 웹 빌드의 react-native-web에서 아무 동작도 하지 않는 no-op이라 커스텀 모달로 구현)
  const handleSwitchVehicle = () => {
    setShowVehiclePicker(true);
  };

  // 백엔드 API 지연 응답 처리 레이아웃 시프트 방지 로딩 스피너 가드
  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#F4F6F3', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#113B29" />
        <Text style={{ marginTop: 12, color: '#666666', fontSize: 13, fontWeight: '500' }}>데이터 로드 중...</Text>
      </View>
    );
  }

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
            estimatedLife={(batteryInfo?.rul || 3.3).toFixed(1)}
            batterySohProgress={(batteryInfo?.soh || 90) / 100}
            nearbyStations={chargers} 
            handleSwitchVehicle={handleSwitchVehicle}
          />
        )}
      </ScrollView>

      {/* 공통 팝업 모달 레이어 */}
      <EmergencyModal 
        visible={showEmergencyModal} 
        onClose={() => setShowEmergencyModal(false)} 
        temperature={batteryInfo?.temperatureC ?? 95}
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