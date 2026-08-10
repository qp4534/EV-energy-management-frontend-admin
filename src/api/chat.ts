import { apiClient, mockDelay, USE_MOCK } from '@/api/client';

type BackendChatMessageResponse = {
  answer: string;
  route: string | null;
  safetyLevel: string | null;
  fallbackUsed: boolean | null;
};

type HomeChargingGuideMessageRequest = {
  vehicleId: string;
  observedAt: string;
  finalRiskLevel: number;
};

const homeChargingGuideCache = new Map<string, string>();

function mockHomeChargingGuideMessage(finalRiskLevel: number): string {
  if (finalRiskLevel >= 3) {
    return '충전을 즉시 중지하고 차량과 안전거리를 확보한 뒤 상태를 확인하세요.';
  }
  if (finalRiskLevel === 2) {
    return '충전을 중지하고 배터리 상태를 점검한 뒤 다시 이용하세요.';
  }
  return '급속 충전보다 완속 충전을 권장하며 상태 변화를 확인하세요.';
}

// conversationId는 백엔드가 발급하지 않는다. 대화가 이어지는 동안 프론트에서 만든 값을
// 계속 같은 값으로 보내야 백엔드/FastAPI가 같은 대화로 묶어서 처리한다.
export async function sendChatMessage(
  message: string,
  vehicleId?: string,
  conversationId?: string
): Promise<string> {
  if (!USE_MOCK) {
    const { data } = await apiClient.post<BackendChatMessageResponse>('/api/v1/chat/messages', {
      vehicleId: vehicleId ?? null,
      message,
      conversationId: conversationId ?? null,
    });
    return data.answer;
  }
  return mockDelay(
    `[AI 챗봇 연동 완료] 입력하신 "${message}" 분석에 따른 최적의 배터리 충전 가이드라인입니다.`
  );
}

export async function getHomeChargingGuideMessage({
  vehicleId,
  observedAt,
  finalRiskLevel,
}: HomeChargingGuideMessageRequest): Promise<string> {
  const cacheKey = `${vehicleId}:${observedAt}:${finalRiskLevel}`;
  const cached = homeChargingGuideCache.get(cacheKey);
  if (cached) return cached;

  if (USE_MOCK) {
    const message = await mockDelay(mockHomeChargingGuideMessage(finalRiskLevel));
    homeChargingGuideCache.set(cacheKey, message);
    return message;
  }

  const answer = await sendChatMessage(
    [
      '현재 내 차 배터리 상태와 충전 상태를 기준으로 홈 충전 가이드 카드용 안내 문장만 작성해줘.',
      '1~2문장, 80자 이내로 작성하고 인사말, 제목, 마크다운은 사용하지 마.',
      '화면에 온도와 위험등급과 수신 시각이 별도로 표시되므로 반복하지 말고 행동 안내만 작성해.',
      '현재 상태 JSON과 승인된 근거에 없는 원인이나 수치를 추가하지 마.',
    ].join(' '),
    vehicleId,
    `home-guide-${vehicleId}-${observedAt}`
  );
  const message = answer.trim();
  if (!message) throw new Error('EMPTY_HOME_CHARGING_GUIDE');
  homeChargingGuideCache.set(cacheKey, message);
  return message;
}
