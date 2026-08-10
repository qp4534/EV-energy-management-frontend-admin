import { apiClient, mockDelay, USE_MOCK } from '@/api/client';
import { LatestTwinState } from '@/types/twin';

type JsonObject = Record<string, unknown>;

type BackendTwinFrameDto = {
  frameId: string;
  observedAt: string;
  finalRiskLevel: number | null;
  rawMetrics: string | JsonObject | null;
  modelInput: string | JsonObject | null;
  carId: string;
};

function parseObject(value: unknown): JsonObject {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as JsonObject;
  }
  if (typeof value !== 'string' || !value.trim()) return {};
  try {
    const parsed: unknown = JSON.parse(value);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? (parsed as JsonObject)
      : {};
  } catch {
    return {};
  }
}

function finiteNumber(value: unknown): number | null {
  if (value === null || value === undefined || typeof value === 'boolean') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function maxDecicTemperature(value: unknown): number | null {
  if (!Array.isArray(value)) return null;
  const values = value
    .map(finiteNumber)
    .filter((item): item is number => item !== null);
  return values.length > 0 ? Math.max(...values) / 10 : null;
}

function extractTemperature(frame: BackendTwinFrameDto): number | null {
  const rawMetrics = parseObject(frame.rawMetrics);
  const directRawTemperature = finiteNumber(
    rawMetrics.temperature_c ?? rawMetrics.temp_max_c
  );
  if (directRawTemperature !== null) return directRawTemperature;

  const rawTwinFrame = parseObject(rawMetrics.twin_frame);
  const cellTemperature = maxDecicTemperature(rawTwinFrame.temperature_decic);
  if (cellTemperature !== null) return cellTemperature;

  const modelInput = parseObject(frame.modelInput);
  return finiteNumber(modelInput.temp_max_c);
}

function observedTime(frame: BackendTwinFrameDto): number {
  const parsed = Date.parse(frame.observedAt);
  return Number.isFinite(parsed) ? parsed : Number.NEGATIVE_INFINITY;
}

export async function getLatestTwinState(carId: string): Promise<LatestTwinState | null> {
  if (USE_MOCK) {
    return mockDelay({
      carId,
      observedAt: new Date().toISOString(),
      temperatureC: 50,
      finalRiskLevel: 2,
    });
  }

  const { data } = await apiClient.get<BackendTwinFrameDto[]>(`/api/twin-frames/car/${carId}`);
  const matchingFrames = data.filter((frame) => frame.carId === carId);
  if (matchingFrames.length === 0) return null;

  const latest = matchingFrames.reduce((current, candidate) =>
    observedTime(candidate) > observedTime(current) ? candidate : current
  );

  return {
    carId,
    observedAt: latest.observedAt,
    temperatureC: extractTemperature(latest),
    finalRiskLevel: finiteNumber(latest.finalRiskLevel),
  };
}
