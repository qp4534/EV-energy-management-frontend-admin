import { apiClient, mockDelay, USE_MOCK } from '@/api/client';
import { BatteryLifecycleEvent, BatteryPassport } from '@/types/battery';

type BackendBatteryPassportDto = {
  batteryId: string;
  sohScore: number | null;
  currentTemp: number | null;
  voltage: number | null;
  current: number | null;
  rul: number | null;
  carId: string;
  manufacturedAt: string | null;
  installedAt: string | null;
  lastInspectedAt: string | null;
};

// 방금 등록해서 아직 진단을 안 받은 차량은 배터리 여권이 없는 게 정상 상태라, 이건 예외가
// 아니라 null로 표현한다. 각 화면은 이미 batteryInfo?.soh 식으로 옵셔널 체이닝을 쓰고 있어서
// null을 그대로 넘겨도 안전하다.
export async function getBatteryPassport(vehicleId: string): Promise<BatteryPassport | null> {
  if (!USE_MOCK) {
    const { data } = await apiClient.get<BackendBatteryPassportDto[]>('/api/battery-passports');
    const passport = data.find((item) => item.carId === vehicleId);
    if (!passport) {
      return null;
    }

    const lifecycle: BatteryLifecycleEvent[] = [
      passport.manufacturedAt && { label: '제조', date: passport.manufacturedAt },
      passport.installedAt && { label: '차량 장착', date: passport.installedAt },
      passport.lastInspectedAt && { label: '최근 정밀 진단', date: passport.lastInspectedAt },
    ].filter((event): event is BatteryLifecycleEvent => Boolean(event));

    return {
      vehicleId,
      soh: passport.sohScore ?? 0,
      rul: passport.rul ?? 0,
      temperatureC: passport.currentTemp ?? 0,
      voltage: passport.voltage ?? 0,
      current: passport.current ?? 0,
      // 백엔드에 SOH 추이 시계열 엔드포인트가 없어 비워둔다. 그래프는 데이터가 있을 때만 표시한다.
      history: [],
      lifecycle,
    };
  }
  return mockDelay({
    vehicleId,
    soh: 90,
    rul: 3.3,
    temperatureC: 50,
    voltage: 431,
    current: 15.3,
    history: [
      { date: '2026-01', soh: 98.1 },
      { date: '2026-04', soh: 97.2 },
      { date: '2026-07', soh: 96.4 },
    ],
    lifecycle: [
      { label: '제조', date: '2023-02-14' },
      { label: '차량 장착', date: '2023-03-03' },
      { label: '최근 정밀 진단', date: '2026-07-01' },
    ],
  });
}
