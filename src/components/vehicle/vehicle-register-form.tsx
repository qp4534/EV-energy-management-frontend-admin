import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
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
  const [imageUri, setImageUri] = useState<string | null>(null);

  const canSubmit = model.length > 0 && plateNumber.length > 0 && !submitting;

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Pressable style={styles.imagePlaceholder} onPress={handlePickImage}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.previewImage} contentFit="cover" />
          ) : (
            <>
              <Text style={styles.imagePlaceholderText}>차량 이미지</Text>
              <Text style={styles.imagePlaceholderHint}>탭하여 사진 선택</Text>
            </>
          )}
        </Pressable>

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
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholderText: {
    fontSize: 13,
    color: Brand.textMuted,
  },
  imagePlaceholderHint: {
    fontSize: 11,
    color: Brand.textMuted,
    marginTop: 4,
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
