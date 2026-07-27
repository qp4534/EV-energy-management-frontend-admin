import { mockDelay } from '@/api/client';
import { BatteryPassport } from '@/types/battery';

export async function getBatteryPassport(vehicleId: string): Promise<BatteryPassport> {
  return mockDelay({
    vehicleId,
    soh: 96.4,
    rul: 7,
    history: [
      { date: '2026-01', soh: 98.1 },
      { date: '2026-04', soh: 97.2 },
      { date: '2026-07', soh: 96.4 },
    ],
  });
}
