import { LatestTwinState } from '@/types/twin';

export const TWIN_FRESHNESS_LIMIT_MS = 5 * 60 * 1000;

export type HomeChargingGuide = {
  status: 'FRESH' | 'STALE' | 'FALLBACK' | 'UNAVAILABLE';
  tone: 'normal' | 'caution' | 'warning' | 'emergency' | 'muted';
  headline: string;
  message: string | null;
  meta: string | null;
};

type GuideInput = {
  twin?: LatestTwinState | null;
  passportTemperatureC?: number | null;
  aiMessage?: string | null;
  nowMs?: number;
};

function validTemperature(value: number | null | undefined): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function formatTemperature(value: number): string {
  return Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1);
}

function formatObservedAt(value: string): string | null {
  const parsed = new Date(value);
  if (!Number.isFinite(parsed.getTime())) return null;
  return parsed.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function freshGuide(twin: LatestTwinState, aiMessage?: string | null): HomeChargingGuide {
  const temperature = formatTemperature(twin.temperatureC as number);
  const metaTime = formatObservedAt(twin.observedAt);
  const meta = metaTime ? `${metaTime} 수신` : null;
  const risk = twin.finalRiskLevel;

  if (risk !== null && risk >= 3) {
    return {
      status: 'FRESH',
      tone: 'emergency',
      headline: `배터리 온도 ${temperature}℃ · 긴급`,
      message:
        aiMessage || '충전을 즉시 중지하고 차량과 안전거리를 확보한 뒤 상태를 확인하세요.',
      meta,
    };
  }
  if (risk === 2) {
    return {
      status: 'FRESH',
      tone: 'warning',
      headline: `배터리 온도 ${temperature}℃ · 경고`,
      message: aiMessage || '충전을 중지하고 배터리 상태를 점검한 뒤 다시 이용하세요.',
      meta,
    };
  }
  if (risk === 1) {
    return {
      status: 'FRESH',
      tone: 'caution',
      headline: `배터리 온도 ${temperature}℃ · 주의`,
      message: aiMessage || '급속 충전보다 완속 충전을 권장하며 상태 변화를 확인하세요.',
      meta,
    };
  }
  if (risk === 0) {
    return {
      status: 'FRESH',
      tone: 'normal',
      headline: `배터리 온도 ${temperature}℃ · 정상`,
      message: null,
      meta,
    };
  }

  return {
    status: 'FRESH',
    tone: 'muted',
    headline: `배터리 온도 ${temperature}℃ · 판정 대기`,
    message: '위험도 판정 데이터가 없어 차량 안내에 따라 충전하세요.',
    meta,
  };
}

export function buildHomeChargingGuide({
  twin,
  passportTemperatureC,
  aiMessage,
  nowMs = Date.now(),
}: GuideInput = {}): HomeChargingGuide {
  if (twin && validTemperature(twin.temperatureC)) {
    const observedMs = Date.parse(twin.observedAt);
    const ageMs = nowMs - observedMs;
    const isFresh =
      Number.isFinite(observedMs) && ageMs >= -60 * 1000 && ageMs <= TWIN_FRESHNESS_LIMIT_MS;

    if (isFresh) return freshGuide(twin, aiMessage);

    const metaTime = formatObservedAt(twin.observedAt);
    return {
      status: 'STALE',
      tone: 'muted',
      headline: `배터리 온도 ${formatTemperature(twin.temperatureC)}℃ · 데이터 지연`,
      message: '데이터가 지연되어 현재 충전 방식을 판단할 수 없습니다.',
      meta: metaTime ? `${metaTime} 수신` : null,
    };
  }

  if (validTemperature(passportTemperatureC)) {
    return {
      status: 'FALLBACK',
      tone: 'muted',
      headline: `배터리 온도 ${formatTemperature(passportTemperatureC)}℃ · 기록값`,
      message: '최신 Twin 데이터가 없어 현재 충전 방식을 판단할 수 없습니다.',
      meta: null,
    };
  }

  return {
    status: 'UNAVAILABLE',
    tone: 'muted',
    headline: '배터리 온도 --℃ · 확인 불가',
    message: '최근 Twin 데이터가 없어 충전 가이드를 제공할 수 없습니다.',
    meta: null,
  };
}
