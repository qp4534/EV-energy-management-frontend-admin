import { apiClient } from '@/api/client';

export type DemandLevel = {
  level: string; // '낮음' | '보통' | '높음'
  note: string;
  ratio: number;
};

// 모델(charging_demand/fastapi_app.py)의 dow 규약은 0=월 ~ 6=일.
// JS Date#getDay()는 0=일 ~ 6=토라 변환이 필요하다.
function toModelDow(jsDay: number): number {
  return (jsDay + 6) % 7;
}

/**
 * 지금 시간대의 전반적인 충전 수요 수준(낮음/보통/높음)을 가져온다.
 * ⚠️ 충전소별 예측이 아니라 "지금은 대체로 붐빈다/한산하다" 참고용 배지 표시 전용이다
 * (모델이 시각·요일·월만 입력받고 충전소 위치는 입력받지 않기 때문 - 충전소별 대기 정보는
 * 목록에 그대로 표시만 하고 순위를 매기진 않는다).
 *
 * charging-demand FastAPI 서비스는 EKS에서 ClusterIP로만 떠 있어 앱이 직접 못 붙는다 -
 * backend(EV-energy-management-backend)의 /api/charging-demand/current를 대신 호출한다
 * (client/ChargingDemandClient.java 참고, 연도 보정도 그쪽에서 처리). apiClient를 쓰므로
 * EXPO_PUBLIC_API_URL(이미 인증도 붙는 공용 백엔드 주소) 하나만 있으면 된다.
 * 서비스가 꺼져 있거나 호출에 실패하면 조용히 null을 반환해 배지를 숨긴다.
 */
export async function getCurrentDemandLevel(now: Date = new Date()): Promise<DemandLevel | null> {
  try {
    const { data } = await apiClient.get('/api/charging-demand/current', {
      params: {
        hour: now.getHours(),
        dow: toModelDow(now.getDay()),
        month: now.getMonth() + 1,
      },
    });
    return {
      level: data.수요수준,
      note: data.설명,
      ratio: data.수요수준_비율,
    };
  } catch (error) {
    console.error('충전 수요 정보를 가져오는 중 오류 발생:', error);
    return null;
  }
}
