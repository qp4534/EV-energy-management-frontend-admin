import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StatusBar, Text, View } from 'react-native';

import { RegisteredHome } from '@/components/home/registered-home';
import { UnregisteredHome } from '@/components/home/unregistered-home';
import { EmergencyModal } from '@/components/modal/EmergencyModal';
import { ReportModal } from '@/components/modal/ReportModal';
import { VehiclePickerModal } from '@/components/modal/VehiclePickerModal';

import { useAuthStore } from '@/store/auth-store';
import { useVehicleStore } from '@/store/vehicle-store';

import { Charger } from '@/types/charger';
//import { NotiType } from '@/types/notification';
import { Notification } from '@/types/notification';
import { Report } from '@/types/report';

import { getBatteryPassport } from '@/api/battery';
import { getNearbyChargers } from '@/api/charger';
import { getNotifications } from '@/api/notification';
import { getReports } from '@/api/report';
import { BrandHeader } from '@/components/common/brand-header';

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
  const [activeReport, setActiveReport] = useState<Report | null>(null);
  const [batteryInfo, setBatteryInfo] = useState<any>(null);
  const [aiChargingGuide, setAiChargingGuide] = useState<string>("추후 AI 가이드 연동, 배터리 온도가 너무 높습니다!\n급속 충전 대신 완속 충전을 추천합니다.");

  // 최신 알림 상태를 저장할 변수
  const [latestNotification, setLatestNotification] = useState<Notification | null>(null);

  // 데이터 바인딩 로직
  useEffect(() => {
    async function loadHomeData() {
      if (!isRegistered) {
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);

        // 충전소 거리 계산용 현재 위치 조회 (권한 거부/실패 시 위치 없이 목록만 표시)
        let origin: { latitude: number; longitude: number } | undefined;
        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status === 'granted') {
            const location = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.Balanced,
            });
            origin = { latitude: location.coords.latitude, longitude: location.coords.longitude };
          }
        } catch (error) {
          console.error('위치 정보를 가져오는 중 오류 발생:', error);
        }

        // 1. 충전소, 보고서, 배터리 패스포트 API 동시 호출
        const [chargerList, reportList, batteryData, notiList] = await Promise.all([
          getNearbyChargers(origin),
          getReports(),
          getBatteryPassport(vehicle?.id || 'default'),
          getNotifications(),
        ]);

        setChargers(chargerList);
        setBatteryInfo(batteryData);

        // 2. 가장 최신 보고서 연동 및 상태 레벨 매핑
        if (reportList && reportList.length > 0) {
          setActiveReport(reportList[0]);
        }

        // 3. 가장 최신 알림 연동
        if (notiList && notiList.length > 0) {
          setLatestNotification(notiList[0]);
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
    if (isRegistered && !isLoading && latestNotification) {
      const timer = setTimeout(() => {
        if (latestNotification.type === '긴급') {
          // 1순위: 긴급일시 팝업 작동
          setShowEmergencyModal(true);
        } else if (latestNotification.type === '경고') {
          // 2순위: 경고이면서 진단 보고서 발행 완료 시 팝업 작동
          setShowReportModal(true);
        }
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [isRegistered, isLoading, latestNotification]);

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

      <BrandHeader 
        title={`안녕하세요, ${currentUserName}님`} 
        rightIcon="bell" 
        onRightPress={() => router.push('/notification/list')} 
      />

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
            estimatedLife={batteryInfo ? batteryInfo.rul.toFixed(1) : null}
            batterySohProgress={batteryInfo ? batteryInfo.soh / 100 : null}
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
        reportData={activeReport? { ...activeReport, type: latestNotification?.type } : null} // 추후 백엔드 API 연동 시 실시간 데이터로 교체 가능
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