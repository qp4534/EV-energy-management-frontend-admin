import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Brand } from '@/constants/theme';
import { VehicleRegisterRequest } from '@/types/vehicle';

type VehicleRegisterFormProps = {
  onSubmit: (request: VehicleRegisterRequest) => void;
  submitting?: boolean;
};

export function VehicleRegisterForm({ onSubmit, submitting = false }: VehicleRegisterFormProps) {
  const [model, setModel] = useState('');
  const [plateNumber, setPlateNumber] = useState('');

  const canSubmit = model.length > 0 && plateNumber.length > 0 && !submitting;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>차량 이미지</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>차종</Text>
          <TextInput
            style={styles.input}
            value={model}
            onChangeText={setModel}
            placeholder="차종 입력 (예: 아이오닉5)"
            placeholderTextColor={Brand.textMuted}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>차량 번호</Text>
          <TextInput
            style={styles.input}
            value={plateNumber}
            onChangeText={setPlateNumber}
            placeholder="차량 번호 입력"
            placeholderTextColor={Brand.textMuted}
          />
        </View>
      </View>

      <Pressable
        style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]}
        onPress={() => onSubmit({ nickname: model, model, plateNumber })}
        disabled={!canSubmit}>
        <Text style={styles.submitButtonText}>차량 등록 완료</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Brand.border,
    backgroundColor: Brand.card,
    padding: 16,
    gap: 12,
  },
  imagePlaceholder: {
    height: 120,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Brand.border,
    backgroundColor: Brand.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderText: {
    fontSize: 13,
    color: Brand.textMuted,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    color: Brand.label,
  },
  input: {
    borderWidth: 1,
    borderColor: Brand.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Brand.text,
  },
  submitButton: {
    borderRadius: 999,
    backgroundColor: Brand.primary,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Brand.primaryDark,
  },
});
