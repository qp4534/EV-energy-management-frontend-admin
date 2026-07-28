import { mockDelay } from '@/api/client';
import { BatteryPassport } from '@/types/battery';

export async function getBatteryPassport(vehicleId: string): Promise<BatteryPassport> {
  return mockDelay({
    vehicleId,
    soh: 96.4,
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
