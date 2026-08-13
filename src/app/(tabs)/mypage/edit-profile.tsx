import * as authApi from '@/api/auth';
import { useBottomTabInset } from '@/hooks/use-bottom-tab-inset';
import { useAuthStore } from '@/store/auth-store';
import { formatPhoneNumber } from '@/utils/format-phone';
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function EditProfileScreen() {
  const router = useRouter();
  const bottomInset = useBottomTabInset();
  const { user, updateUser } = useAuthStore();

  // 🟡 이름/전화번호 편집 상태 (마운트 시 /api/auth/me로 최신 값을 채운다)
  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [savingProfile, setSavingProfile] = useState(false);
  // getMe() 응답이 늦게 오면 그 사이 사용자가 입력한 값을 덮어쓸 수 있어서,
  // 로딩이 끝나기 전까지는 이름/전화번호 입력을 막는다.
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // 🔒 비밀번호 변경 입력 상태 관리
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  // 🛠️ 커스텀 알림 모달 제어 상태
  const [alertVisible, setAlertVisible] = useState<boolean>(false);
  const [alertType, setAlertType] = useState<
    'success' | 'error' | 'empty' | 'saveSuccess' | 'wrongCurrentPassword' | 'saveError'
  >('success');

  useEffect(() => {
    authApi.getMe().then((me) => {
      updateUser(me);
      setName(me.name);
      setPhone(me.phone ?? '');
      setProfileLoaded(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 0. 프로필 사진 선택 및 업로드 처리 함수
  const handlePickProfileImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (result.canceled || result.assets.length === 0) return;

    setUploadingImage(true);
    try {
      const imageUrl = await authApi.uploadProfileImage(result.assets[0].uri, result.assets[0].mimeType);
      const updated = await authApi.updateProfile({ profileImageUrl: imageUrl });
      updateUser(updated);
    } catch {
      setAlertType('saveError');
      setAlertVisible(true);
    } finally {
      setUploadingImage(false);
    }
  };

  // 1. 비밀번호 개별 변경 처리 함수
  const handlePasswordChange = async () => {
    if (!currentPassword || !password || !confirmPassword) {
      setAlertType('empty');
      setAlertVisible(true);
      return;
    }
    if (password !== confirmPassword) {
      setAlertType('error');
      setAlertVisible(true);
      return;
    }

    setChangingPassword(true);
    try {
      await authApi.updateProfile({ currentPassword, newPassword: password });
      setAlertType('success');
      setAlertVisible(true);
      setCurrentPassword('');
      setPassword('');
      setConfirmPassword('');
    } catch {
      setAlertType('wrongCurrentPassword');
      setAlertVisible(true);
    } finally {
      setChangingPassword(false);
    }
  };

  // 2. 하단 전체 변경사항 저장 처리 함수 (커스텀 팝업 트리거)
  const handleSaveChanges = async () => {
    setSavingProfile(true);
    try {
      const updated = await authApi.updateProfile({ name, phone });
      updateUser(updated);
      setAlertType('saveSuccess');
      setAlertVisible(true);
    } catch {
      setAlertType('saveError');
      setAlertVisible(true);
    } finally {
      setSavingProfile(false);
    }
  };

  // 3. 모달을 닫을 때 실행할 액션 (정보 저장 성공 팝업일 때는 마이페이지 메인으로 리다이렉트)
  const handleCloseModal = () => {
    setAlertVisible(false);
    if (alertType === 'saveSuccess') {
      router.back(); // 정보가 성공적으로 반영되었으므로 마이페이지 메인으로 이동
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* 🟢 상단 헤더 바 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="chevron-left" size={24} color="#113B29" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>회원정보 수정</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoider}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomInset }]}
        showsVerticalScrollIndicator={false}
      >
        {/* 🟡 중앙 프로필 이미지 영역 */}
        <View style={styles.profileImageContainer}>
          <TouchableOpacity
            style={styles.profileCircle}
            activeOpacity={0.8}
            onPress={handlePickProfileImage}
            disabled={uploadingImage}
          >
            {uploadingImage ? (
              <ActivityIndicator color="#113B29" />
            ) : user?.profileImageUrl ? (
              <Image source={{ uri: user.profileImageUrl }} style={styles.profileImage} contentFit="cover" />
            ) : (
              <Feather name="user" size={54} color="#113B29" />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cameraBadge}
            activeOpacity={0.8}
            onPress={handlePickProfileImage}
            disabled={uploadingImage}
          >
            <Feather name="camera" size={12} color="#113B29" />
          </TouchableOpacity>
        </View>

        {/* ⚪ 유저 가입 정보 카드 */}
        <View style={styles.infoCard}>
          <View style={styles.infoGroup}>
            <Text style={styles.infoLabel}>이름</Text>
            <TextInput
              style={styles.infoInput}
              value={name}
              onChangeText={setName}
              placeholder="이름"
              editable={profileLoaded}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.infoGroup}>
            <Text style={styles.infoLabel}>이메일</Text>
            <View style={styles.emailRow}>
              <Text style={styles.infoValue}>{user?.email || 'user@mijunge.com'}</Text>
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>인증됨</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoGroup}>
            <Text style={styles.infoLabel}>휴대폰 번호</Text>
            <TextInput
              style={styles.infoInput}
              value={phone}
              onChangeText={(value) => setPhone(formatPhoneNumber(value))}
              placeholder="휴대폰 번호"
              keyboardType="phone-pad"
              editable={profileLoaded}
            />
          </View>
        </View>

        {/* 🔒 비밀번호 변경 섹션 */}
        <Text style={styles.sectionLabel}>비밀번호 변경</Text>

        <TextInput
          style={styles.input}
          placeholder="현재 비밀번호"
          placeholderTextColor="#999999"
          secureTextEntry
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />

        <TextInput
          style={styles.input}
          placeholder="새 비밀번호 입력"
          placeholderTextColor="#999999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <View style={styles.passwordRow}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            placeholder="새 비밀번호 확인"
            placeholderTextColor="#999999"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity style={styles.changeButton} onPress={handlePasswordChange} disabled={changingPassword}>
            <Text style={styles.changeButtonText}>변경</Text>
          </TouchableOpacity>
        </View>

        {/* 💾 하단 변경사항 저장 버튼 */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveChanges}
          disabled={savingProfile || !profileLoaded}>
          <Text style={styles.saveButtonText}>변경사항 저장</Text>
        </TouchableOpacity>

      </ScrollView>
      </KeyboardAvoidingView>

      {/* 🛠️ 시안 디자인 완벽 반영 알림 모달 팝업 */}
      <Modal
        visible={alertVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <View style={popupStyles.overlay}>
          <View style={popupStyles.modalContainer}>
            
            {/* 상단 우측 X 닫기 버튼 */}
            <TouchableOpacity 
              style={popupStyles.closeButton} 
              onPress={handleCloseModal}
            >
              <Feather name="x" size={18} color="#666666" />
            </TouchableOpacity>

            {/* 원형 아이콘 패널 (성공 계열: 연두색 체크, 실패 계열: 연분홍색 경고) */}
            <View style={[
              popupStyles.iconCircle, 
              { backgroundColor: (alertType === 'success' || alertType === 'saveSuccess') ? '#E5ECD8' : '#FFE5E5' }
            ]}>
              <Feather 
                name={(alertType === 'success' || alertType === 'saveSuccess') ? "check" : "alert-circle"} 
                size={28} 
                color={(alertType === 'success' || alertType === 'saveSuccess') ? "#113B29" : "#D32F2F"} 
              />
            </View>

            {/* 🆕 회원 정보 변경사항 반영 완료 팝업 시안 대응 */}
            {alertType === 'saveSuccess' && (
              <Text style={popupStyles.titleText}>
                회원 정보 변경사항이{'\n'}정상적으로 반영되었습니다.
              </Text>
            )}

            {/* 비밀번호 변경 완료 팝업 */}
            {alertType === 'success' && (
              <Text style={popupStyles.titleText}>
                비밀번호 변경이 완료되었습니다.
              </Text>
            )}

            {/* 비밀번호 불일치 팝업 */}
            {alertType === 'error' && (
              <>
                <Text style={popupStyles.titleText}>
                  비밀번호가 일치하지 않습니다.
                </Text>
                <Text style={popupStyles.descText}>
                  다시 확인 후 시도해주세요.
                </Text>
              </>
            )}

            {/* 미입력 공백 예외 처리 팝업 */}
            {alertType === 'empty' && (
              <>
                <Text style={popupStyles.titleText}>
                  비밀번호를 입력해주세요.
                </Text>
                <Text style={popupStyles.descText}>
                  현재 비밀번호와 새 비밀번호, 확인란을 모두 입력해야 합니다.
                </Text>
              </>
            )}

            {/* 현재 비밀번호 불일치(백엔드 검증 실패) 팝업 */}
            {alertType === 'wrongCurrentPassword' && (
              <>
                <Text style={popupStyles.titleText}>
                  현재 비밀번호가 일치하지 않습니다.
                </Text>
                <Text style={popupStyles.descText}>
                  다시 확인 후 시도해주세요.
                </Text>
              </>
            )}

            {/* 회원정보 저장 실패 팝업 */}
            {alertType === 'saveError' && (
              <>
                <Text style={popupStyles.titleText}>
                  회원 정보 저장에 실패했습니다.
                </Text>
                <Text style={popupStyles.descText}>
                  잠시 후 다시 시도해주세요.
                </Text>
              </>
            )}

          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F6',
  },
  keyboardAvoider: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 55,
    paddingBottom: 15,
    paddingHorizontal: 16,
    backgroundColor: '#F9F9F6',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#113B29',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
    position: 'relative',
    alignSelf: 'center',
  },
  profileCircle: {
    width: 110,
    height: 110,
    backgroundColor: '#E5ECD8',
    borderRadius: 55,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D4E2C3',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 28,
    height: 28,
    backgroundColor: '#CBE7CB',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#EFF3EE',
    marginBottom: 24,
  },
  infoGroup: {
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 11,
    color: '#666666',
    marginBottom: 6,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#113B29',
  },
  infoInput: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#113B29',
    padding: 0,
  },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  verifiedBadge: {
    backgroundColor: '#E5ECD8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#113B29',
  },
  divider: {
    height: 1,
    backgroundColor: '#EFF3EE',
    marginVertical: 4,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    height: 48,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#EFF3EE',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#333333',
    marginBottom: 10,
  },
  passwordRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 28,
  },
  changeButton: {
    width: 64,
    height: 48,
    backgroundColor: '#CBE7CB',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeButtonText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#113B29',
  },
  saveButton: {
    height: 52,
    backgroundColor: '#CBE7CB',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#113B29',
  },
});

const popupStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 290,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#EFF3EE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  titleText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#113B29',
    textAlign: 'center',
    lineHeight: 20,
  },
  descText: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 16,
  },
});