import { Text, View } from 'react-native';

import { DemandLevel } from '@/api/demand';

const LEVEL_COLORS: Record<string, { bg: string; text: string }> = {
  낮음: { bg: '#E3F3D9', text: '#4F6128' },
  보통: { bg: '#FFF3D6', text: '#8A6D1F' },
  높음: { bg: '#FFE3D1', text: '#C1502D' },
};

interface DemandBadgeProps {
  demand: DemandLevel | null;
}

/**
 * 지도 검색화면 상단 배지 - "지금 시간대 충전 수요"를 보여준다.
 * 충전소별 예측이 아니라 시간대 전반에 대한 참고 정보다.
 */
export function DemandBadge({ demand }: DemandBadgeProps) {
  if (!demand) return null;
  const colors = LEVEL_COLORS[demand.level] ?? LEVEL_COLORS['보통'];

  return (
    <View
      style={{
        alignSelf: 'flex-start',
        backgroundColor: colors.bg,
        borderRadius: 14,
        paddingHorizontal: 12,
        paddingVertical: 6,
      }}
    >
      <Text style={{ color: colors.text, fontSize: 12, fontWeight: 'bold' }}>
        지금 시간대 충전 수요: {demand.level}
      </Text>
    </View>
  );
}
