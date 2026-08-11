import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Brand } from '@/constants/theme';
import { VehicleRegisterRequest } from '@/types/vehicle';

type VehicleRegisterFormProps = {
  onSubmit: (request: VehicleRegisterRequest) => void;
  submitting?: boolean;
  errorMessage?: string | null;
};

export function VehicleRegisterForm({ onSubmit, submitting = false, errorMessage = null }: VehicleRegisterFormProps) {
  const [model, setModel] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [vin, setVin] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string | null>(null);

  // 백엔드 CAR.vin이 VARCHAR(17) NOT NULL이라(실제 VIN 규격과 동일) 정확히 17자여야 한다.
  const canSubmit = model.length > 0 && plateNumber.length > 0 && vin.length === 17 && !submitting;

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
      setImageMimeType(result.assets[0].mimeType ?? null);
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
            // 공백 유무로 "123가1234"와 "123가 1234"가 다른 값으로 취급돼 중복 등록을
            // 못 걸러내던 문제 - 입력 시점에 공백을 아예 없애서 항상 같은 값으로 저장한다.
            onChangeText={(value) => setPlateNumber(value.replace(/\s/g, ''))}
            placeholder="차량 번호 입력 (예: 123가1234)"
            placeholderTextColor={Brand.textMuted}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>차대번호(VIN)</Text>
          <TextInput
            style={styles.input}
            value={vin}
            onChangeText={(value) => setVin(value.toUpperCase())}
            placeholder="차대번호 17자리 입력"
            placeholderTextColor={Brand.textMuted}
            autoCapitalize="characters"
            maxLength={17}
          />
        </View>
      </View>

      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

      <Pressable
        style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]}
        onPress={() => onSubmit({ nickname: model, model, plateNumber, vin, imageUri, imageMimeType })}
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
  errorText: {
    fontSize: 13,
    color: '#D32F2F',
    textAlign: 'center',
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
