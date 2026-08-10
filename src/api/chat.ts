import { apiClient, mockDelay, USE_MOCK } from '@/api/client';

type BackendChatMessageResponse = {
  answer: string;
  route: string | null;
  safetyLevel: string | null;
  fallbackUsed: boolean | null;
};

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
