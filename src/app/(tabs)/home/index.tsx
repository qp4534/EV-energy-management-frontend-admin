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
import { getHomeChargingGuideMessage } from '@/api/chat';
import { getNearbyChargers } from '@/api/charger';
import { getNotifications } from '@/api/notification';
import { getReports } from '@/api/report';
import { getLatestTwinState } from '@/api/twin';
import { BrandHeader } from '@/components/common/brand-header';
import { BatteryPassport } from '@/types/battery';
import { buildHomeChargingGuide, HomeChargingGuide } from '@/utils/home-charging-guide';

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
  const [batteryInfo, setBatteryInfo] = useState<BatteryPassport | null>(null);
  const [chargingGuide, setChargingGuide] = useState<HomeChargingGuide>(() =>
    buildHomeChargingGuide()
  );

  // 최신 알림 상태를 저장할 변수
  const [latestNotification, setLatestNotification] = useState<Notification | null>(null);

  // 데이터 바인딩 로직
  useEffect(() => {
    let cancelled = false;

    async function loadHomeData() {
      const vehicleId = vehicle?.id;
      if (!isRegistered || !vehicleId) {
        setBatteryInfo(null);
        setChargingGuide(buildHomeChargingGuide());
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setBatteryInfo(null);
      setChargingGuide(buildHomeChargingGuide());

      const [chargerResult, reportResult, batteryResult, notificationResult, twinResult] =
        await Promise.allSettled([
          getNearbyChargers(),
          getReports(),
          getBatteryPassport(vehicleId),
          getNotifications(),
          getLatestTwinState(vehicleId),
        ]);

      if (cancelled) return;

      const batteryData = batteryResult.status === 'fulfilled' ? batteryResult.value : null;
      const twinData = twinResult.status === 'fulfilled' ? twinResult.value : null;

      setChargers(chargerResult.status === 'fulfilled' ? chargerResult.value : []);
      setActiveReport(
        reportResult.status === 'fulfilled' && reportResult.value.length > 0
          ? reportResult.value[0]
          : null
      );
      setBatteryInfo(batteryData);
      setLatestNotification(
        notificationResult.status === 'fulfilled' && notificationResult.value.length > 0
          ? notificationResult.value[0]
          : null
      );
      const guideInput = {
        twin: twinData,
        passportTemperatureC: batteryData?.temperatureC,
      };
      const initialGuide = buildHomeChargingGuide(guideInput);
      setChargingGuide(initialGuide);

      if (twinResult.status === 'rejected') {
        console.warn('최신 Twin 데이터를 불러오지 못했습니다:', twinResult.reason);
      }
      setIsLoading(false);

      if (
        twinData &&
        initialGuide.status === 'FRESH' &&
        twinData.finalRiskLevel !== null &&
        twinData.finalRiskLevel > 0
      ) {
        try {
          const aiMessage = await getHomeChargingGuideMessage({
            vehicleId,
            observedAt: twinData.observedAt,
            finalRiskLevel: twinData.finalRiskLevel,
          });
          if (cancelled) return;
          setChargingGuide(buildHomeChargingGuide({ ...guideInput, aiMessage }));
        } catch (error) {
          console.warn('AI 충전 가이드 문장을 생성하지 못했습니다:', error);
        }
      }
    }

    loadHomeData();

    return () => {
      cancelled = true;
    };
  }, [isRegistered, vehicle?.id]);

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
            chargingGuide={chargingGuide}
            estimatedLife={(batteryInfo?.rul ?? 3.3).toFixed(1)}
            batterySohProgress={(batteryInfo?.soh ?? 90) / 100}
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
