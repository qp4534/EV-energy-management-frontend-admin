import { ThemedText } from '@/components/themed-text';
import { DemandLevel } from '@/api/demand';
import { Charger } from '@/types/charger';
import { StyleSheet, View } from 'react-native';

type ChargerListItemProps = {
  charger: Charger;
  isLast?: boolean; // 하단 테두리 분기용 추가
  demand?: DemandLevel | null; // 지금 시간대 전반적인 충전 수요 (충전소별 대기와 합쳐서 혼잡도 계산용)
};

type CongestionLevel = '여유' | '보통' | '혼잡';

const CONGESTION_COLORS: Record<CongestionLevel, { bg: string; text: string }> = {
  여유: { bg: '#EDF4D9', text: '#4F6128' },
  보통: { bg: '#FFF3D6', text: '#8A6D1F' },
  혼잡: { bg: '#FFE3D1', text: '#C1502D' },
};

// 충전소별 실제 대기 대수(waitingCount) + 지금 시간대 전반적인 충전 수요(demand)를 합쳐서
// 혼잡도를 판단한다. waitingCount는 이 충전소만의 실측값이라 신뢰도가 높고, demand는
// 충전소 위치를 모르는 시간대 참고용 신호라 보조 지표로만 쓴다 - 대기가 이미 2대 이상이면
// 그 자체로 혼잡, 대기가 1대뿐이어도 지금 시간대 수요가 "높음"이면 곧 더 몰릴 걸로 보고
// 혼잡으로 올려서 판단한다.
function getCongestionLevel(
  waitingCount: number | undefined,
  demandLevel: string | undefined
): CongestionLevel | null {
  if (waitingCount == null) return null;
  if (waitingCount >= 2) return '혼잡';
  if (waitingCount >= 1) return demandLevel === '높음' ? '혼잡' : '보통';
  return demandLevel === '높음' ? '보통' : '여유';
}

export function ChargerListItem({ charger, isLast, demand }: ChargerListItemProps) {
  const isAvailable = charger.isAvailable;
  const statusText = isAvailable ? '이용가능' : '이용불가';
  const displayDistance = charger.distanceKm ? `${charger.distanceKm} km` : '0 km';
  const waitLabel =
    charger.waitingCount != null ? `대기 ${charger.waitingCount}대` : null;
  const congestion = getCongestionLevel(charger.waitingCount, demand?.level);

  return (
    <View
      style={[
        styles.rowContainer,
        {
          borderBottomWidth: isLast ? 0 : 1,
          borderBottomColor: '#EEF2EE',
        }
      ]}
    >
      {/* 🟢 좌측: 충전소 정보 영역 */}
      <View style={styles.infoArea}>
        <ThemedText style={styles.stationName}>
          {charger.name}
        </ThemedText>
        <ThemedText style={styles.stationSub}>
          {displayDistance} · {charger.address || '급속 1기'}
          {waitLabel ? ` · ${waitLabel}` : ''}
        </ThemedText>
      </View>

      {/* 🟢 우측: 이용 가능 여부 + 혼잡도 배지 (세로로 쌓음) */}
      <View style={styles.badgeColumn}>
        <View
          style={[
            styles.badge,
            { backgroundColor: isAvailable ? '#EDF4D9' : '#FFE3D1' }
          ]}
        >
          <ThemedText
            style={[
              styles.badgeText,
              { color: isAvailable ? '#4F6128' : '#FF924A' }
            ]}
          >
            {statusText}
          </ThemedText>
        </View>

        {congestion && (
          <View
            style={[
              styles.badge,
              styles.congestionBadge,
              { backgroundColor: CONGESTION_COLORS[congestion].bg }
            ]}
          >
            <ThemedText
              style={[
                styles.badgeText,
                { color: CONGESTION_COLORS[congestion].text }
              ]}
            >
              {congestion}
            </ThemedText>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
    marginBottom: 14,
  },
  infoArea: {
    flex: 1,
    marginRight: 8,
  },
  stationName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4A6B53',
    marginBottom: 6,
  },
  stationSub: {
    fontSize: 12,
    color: '#999999',
  },
  badgeColumn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  congestionBadge: {
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});