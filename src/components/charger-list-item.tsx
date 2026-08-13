import { ThemedText } from '@/components/themed-text';
import { Charger } from '@/types/charger';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

type ChargerListItemProps = {
  charger: Charger;
  isLast?: boolean; // 하단 테두리 분기용 추가
  onPress?: () => void;
};

export function ChargerListItem({ charger, isLast, onPress }: ChargerListItemProps) {
  const isAvailable = charger.isAvailable;
  const statusText = isAvailable ? '이용가능' : '이용불가';
  const displayDistance = charger.distanceKm ? `${charger.distanceKm} km` : '0 km';
  const waitLabel =
    charger.waitingCount != null ? `대기 ${charger.waitingCount}대` : null;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
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

      {/* 🟢 우측: 이용 가능 여부 둥근 배지 태그 */}
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
    </TouchableOpacity>
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
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});