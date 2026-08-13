import * as Location from 'expo-location';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, AppState, ScrollView, StatusBar, Text, View } from 'react-native';

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
import { getNotifications, markNotificationAsRead } from '@/api/notification';
import { getReports } from '@/api/report';
import { getLatestTwinState } from '@/api/twin';
import { BrandHeader } from '@/components/common/brand-header';
import { useBottomTabInset } from '@/hooks/use-bottom-tab-inset';
import { BatteryPassport } from '@/types/battery';
import { buildHomeChargingGuide, HomeChargingGuide } from '@/utils/home-charging-guide';

export default function HomeScreen() {
  const router = useRouter();
  const bottomInset = useBottomTabInset();
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
  // 종 아이콘 빨간 점 표시 여부
  const [hasUnreadNotification, setHasUnreadNotification] = useState(false);
  // 폴링/재진입 시 같은 알림으로 팝업이 중복해서 뜨지 않도록 마지막으로 팝업을 띄운 알림 id를 기억
  const lastPoppedNotificationIdRef = useRef<string | null>(null);

  // 알림 목록을 받아서 "최신 알림"과 "안 읽은 알림 있음" 배지 상태에 반영한다.
  // 초기 로드/폴링/탭 재진입 시 공통으로 쓴다.
  const applyNotifications = useCallback((list: Notification[]) => {
    setLatestNotification(list.length > 0 ? list[0] : null);
    setHasUnreadNotification(list.some((item) => !item.isRead));
  }, []);

  // 앱을 계속 켜둔 상태에서도 새 알림(웹 관제자 액션 등)을 어느 정도 실시간처럼 반영하기 위한
  // 폴링. 진짜 푸시(FCM)가 아니라 "홈 화면에 머무는 동안 주기적으로 다시 확인"하는 수준이다.
  const pollNotifications = useCallback(async () => {
    if (AppState.currentState !== 'active') return;
    try {
      const list = await getNotifications();
      applyNotifications(list);
    } catch (error) {
      console.warn('알림 폴링 실패:', error);
    }
  }, [applyNotifications]);

  useEffect(() => {
    if (!isRegistered) return;
    const interval = setInterval(pollNotifications, 20000);
    return () => clearInterval(interval);
  }, [isRegistered, pollNotifications]);

  // 다른 탭에 있다가 홈으로 돌아왔을 때도 바로 최신 알림을 반영한다.
  useFocusEffect(
    useCallback(() => {
      if (isRegistered) {
        pollNotifications();
      }
    }, [isRegistered, pollNotifications])
  );

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

      const [chargerResult, reportResult, batteryResult, notificationResult, twinResult] =
        await Promise.allSettled([
          getNearbyChargers(origin),
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
      if (notificationResult.status === 'fulfilled') {
        applyNotifications(notificationResult.value);
      }
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

  // 알림 단계 상태 자동 모달 레이어 트리거 연동. "이미 읽은 알림"이면 새로고침/재방문해도
  // 다시 뜨지 않도록 서버의 isRead를 기준으로 판단한다 (세션 메모리만 쓰면 새로고침 시
  // 초기화돼서 매번 다시 뜨는 문제가 있었다). lastPoppedNotificationIdRef는 같은 세션 안에서
  // 읽음 처리 API가 아직 반영되기 전에 폴링이 겹쳐 두 번 뜨는 것만 막는 보조 장치.
  useEffect(() => {
    if (
      isRegistered &&
      !isLoading &&
      latestNotification &&
      !latestNotification.isRead &&
      latestNotification.id !== lastPoppedNotificationIdRef.current
    ) {
      const timer = setTimeout(() => {
        if (latestNotification.type === '긴급') {
          // 1순위: 긴급일시 팝업 작동
          lastPoppedNotificationIdRef.current = latestNotification.id;
          setShowEmergencyModal(true);
        } else if (latestNotification.type === '경고') {
          // 2순위: 경고이면서 진단 보고서 발행 완료 시 팝업 작동
          lastPoppedNotificationIdRef.current = latestNotification.id;
          setShowReportModal(true);
        }
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [isRegistered, isLoading, latestNotification]);

  // 자동 팝업을 닫으면 그 알림을 읽음 처리한다 - 서버에 isRead가 반영돼야 새로고침해도
  // 다시 뜨지 않는다.
  const acknowledgeLatestNotification = useCallback(() => {
    if (latestNotification && !latestNotification.isRead) {
      markNotificationAsRead(latestNotification.id).catch(() => {});
      pollNotifications();
    }
  }, [latestNotification, pollNotifications]);

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
        showBadge={hasUnreadNotification}
      />

      {/* 메인 뷰포트 - 분리된 홈 컴포넌트 렌더링 영역 */}
      <ScrollView
        style={{ flex: 1, paddingHorizontal: 24 }} 
        contentContainerStyle={{ paddingBottom: bottomInset, paddingTop: 16 }}
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
        onClose={() => {
          setShowEmergencyModal(false);
          acknowledgeLatestNotification();
        }}
        title={latestNotification?.title ?? '긴급 상황 발생'}
        message={latestNotification?.body ?? '즉시 확인이 필요합니다.'}
      />

      <ReportModal
        visible={showReportModal}
        onClose={() => {
          setShowReportModal(false);
          acknowledgeLatestNotification();
        }}
        onDetailPress={() => {
          setShowReportModal(false);
          acknowledgeLatestNotification();
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
