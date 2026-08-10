import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

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
  onDelete: (id: string) => void;
};

export function VehicleManagePanel({
  vehicle,
  vehicles,
  status,
  rul,
  onRegisterNew,
  onSelectPrimary,
  onDelete,
}: VehicleManagePanelProps) {
  const otherVehicles = vehicles.filter((v) => v.id !== vehicle.id);
  // Alert.alert는 react-native-web에서 아무 동작도 하지 않는 no-op이라 커스텀 모달로 구현한다.
  const [pendingDelete, setPendingDelete] = useState<Vehicle | null>(null);

  const handleConfirmDelete = () => {
    if (pendingDelete) {
      onDelete(pendingDelete.id);
    }
    setPendingDelete(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.countLabel}>등록 차량 {vehicles.length}대</Text>

      <View style={styles.card}>
        <View style={styles.cardLabelRow}>
          <MaterialCommunityIcons name="crown" size={13} color="#F5B400" />
          <Text style={styles.cardLabel}>대표 차량</Text>
          <Pressable style={styles.deleteButton} onPress={() => setPendingDelete(vehicle)} hitSlop={8}>
            <Feather name="trash-2" size={14} color={Brand.textMuted} />
          </Pressable>
        </View>
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
            <View key={other.id} style={styles.otherCard}>
              <Pressable style={styles.otherInfo} onPress={() => onSelectPrimary(other.id)}>
                <View>
                  <Text style={styles.otherName}>{other.nickname}</Text>
                  <Text style={styles.otherMeta}>{other.plateNumber}</Text>
                </View>
                <Text style={styles.otherAction}>대표로 설정</Text>
              </Pressable>
              <Pressable style={styles.deleteButton} onPress={() => setPendingDelete(other)} hitSlop={8}>
                <Feather name="trash-2" size={14} color={Brand.textMuted} />
              </Pressable>
            </View>
          ))}
        </View>
      )}

      <Pressable style={styles.registerButton} onPress={onRegisterNew}>
        <Text style={styles.registerButtonText}>+ 차량 등록하기</Text>
      </Pressable>

      <Modal
        visible={pendingDelete !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setPendingDelete(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>차량 삭제</Text>
            <Text style={styles.modalDesc}>
              {pendingDelete?.nickname} 차량을 삭제할까요?{'\n'}복구할 수 없습니다.
            </Text>
            <View style={styles.modalButtonRow}>
              <Pressable style={styles.modalCancelButton} onPress={() => setPendingDelete(null)}>
                <Text style={styles.modalCancelText}>취소</Text>
              </Pressable>
              <Pressable style={styles.modalDeleteButton} onPress={handleConfirmDelete}>
                <Text style={styles.modalDeleteText}>삭제</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
  cardLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  deleteButton: {
    marginLeft: 'auto',
    padding: 4,
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
  },
  otherInfo: {
    flex: 1,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  modalCard: {
    width: '100%',
    borderRadius: 16,
    backgroundColor: '#ffffff',
    padding: 20,
    gap: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Brand.text,
  },
  modalDesc: {
    fontSize: 13,
    color: Brand.textMuted,
    lineHeight: 18,
  },
  modalButtonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  modalCancelButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F1F5EE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 13,
    fontWeight: '700',
    color: Brand.primaryDark,
  },
  modalDeleteButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFAAAA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalDeleteText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#D32F2F',
  },
});
