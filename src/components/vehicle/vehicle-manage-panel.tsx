import { Pressable, StyleSheet, Text, View } from 'react-native';

import { StatusBadge } from '@/components/common/status-badge';
import { Brand } from '@/constants/theme';
import { Vehicle } from '@/types/vehicle';
import { formatRul } from '@/utils/format-battery';

type VehicleManagePanelProps = {
  vehicle: Vehicle;
  vehicles: Vehicle[];
  status: '경고' | '정상' | null;
  rul: number | null;
  onRegisterNew: () => void;
  onSelectPrimary: (id: string) => void;
};

export function VehicleManagePanel({
  vehicle,
  vehicles,
  status,
  rul,
  onRegisterNew,
  onSelectPrimary,
}: VehicleManagePanelProps) {
  const otherVehicles = vehicles.filter((v) => v.id !== vehicle.id);

  return (
    <View style={styles.container}>
      <Text style={styles.countLabel}>등록 차량 {vehicles.length}대</Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>대표 차량</Text>
        <Text style={styles.vehicleName}>{vehicle.nickname}</Text>
        <View style={styles.divider} />
        <View style={styles.metricsRow}>
          <View style={styles.metricColumn}>
            <Text style={styles.metricLabel}>배터리 상태</Text>
            {status && <StatusBadge status={status} />}
          </View>
          <View style={styles.metricColumn}>
            <Text style={styles.metricLabel}>예상 배터리 잔존 수명</Text>
            <Text style={styles.metricValue}>{rul !== null ? formatRul(rul) : '-'}</Text>
          </View>
        </View>
      </View>

      {otherVehicles.length > 0 && (
        <View style={styles.otherList}>
          {otherVehicles.map((other) => (
            <Pressable
              key={other.id}
              style={styles.otherCard}
              onPress={() => onSelectPrimary(other.id)}>
              <View>
                <Text style={styles.otherName}>{other.nickname}</Text>
                <Text style={styles.otherMeta}>{other.plateNumber}</Text>
              </View>
              <Text style={styles.otherAction}>대표로 설정</Text>
            </Pressable>
          ))}
        </View>
      )}

      <Pressable style={styles.registerButton} onPress={onRegisterNew}>
        <Text style={styles.registerButtonText}>+ 차량 등록하기</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  countLabel: {
    fontSize: 13,
    color: Brand.textMuted,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Brand.border,
    backgroundColor: Brand.card,
    padding: 16,
    gap: 8,
  },
  cardLabel: {
    fontSize: 12,
    color: Brand.textMuted,
  },
  vehicleName: {
    fontSize: 18,
    fontWeight: '700',
    color: Brand.primaryDark,
  },
  divider: {
    height: 1,
    backgroundColor: Brand.border,
    marginVertical: 4,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricColumn: {
    gap: 6,
  },
  metricLabel: {
    fontSize: 12,
    color: Brand.textMuted,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Brand.primaryDark,
  },
  otherList: {
    gap: 8,
  },
  otherCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Brand.border,
    backgroundColor: Brand.card,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  otherName: {
    fontSize: 14,
    fontWeight: '700',
    color: Brand.text,
  },
  otherMeta: {
    fontSize: 12,
    color: Brand.textMuted,
  },
  otherAction: {
    fontSize: 12,
    fontWeight: '700',
    color: Brand.primaryDark,
  },
  registerButton: {
    borderRadius: 999,
    backgroundColor: Brand.primary,
    paddingVertical: 14,
    alignItems: 'center',
  },
  registerButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: Brand.primaryDark,
  },
});
