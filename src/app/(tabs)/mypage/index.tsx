import * as authApi from '@/api/auth';
import { BrandHeader } from '@/components/common/brand-header';
import { useAuthStore } from '@/store/auth-store';
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Modal, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function MyPageIndexScreen() {
  const router = useRouter();
  // Zustand 스토어에서 유저 데이터와 액션 함수 가져오기
  const { user, updateUser, logout, withdraw } = useAuthStore();

  // 알림 설정 ON/OFF 토글 상태. 로그인 응답엔 없어서 마운트 시 /api/auth/me로 채운다.
  const [isPushEnabled, setIsPushEnabled] = useState<boolean>(user?.pushEnabled ?? true);
  const [pushToggling, setPushToggling] = useState(false);

  useEffect(() => {
    authApi.getMe().then((me) => {
      updateUser(me);
      setIsPushEnabled(me.pushEnabled ?? true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTogglePush = async () => {
    const next = !isPushEnabled;
    setIsPushEnabled(next);
    setPushToggling(true);
    try {
      const updated = await authApi.updateProfile({ pushEnabled: next });
      updateUser(updated);
    } catch {
      // 저장 실패 시 토글을 원래대로 되돌린다.
      setIsPushEnabled(!next);
    } finally {
      setPushToggling(false);
    }
  };

  // 🛠️ 커스텀 모달(팝업) 제어 상태
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'logout' | 'deleteAccount'>('logout');
  // 회원 탈퇴는 백엔드가 현재 비밀번호 확인을 요구한다.
  const [withdrawPassword, setWithdrawPassword] = useState('');
  const [withdrawError, setWithdrawError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // 모달을 열어주는 함수
  const openModal = (type: 'logout' | 'deleteAccount') => {
    setModalType(type);
    setWithdrawPassword('');
    setWithdrawError('');
    setModalVisible(true);
  };

  // 모달에서 '확인(로그아웃/탈퇴)'을 눌렀을 때 실행될 로직
  const handleConfirm = async () => {
    if (modalType === 'logout') {
      setSubmitting(true);
      try {
        // 서버 로그아웃은 최선의 노력으로만 시도한다. 네트워크 오류로 실패해도
        // 로컬 세션은 정리해서 사용자가 앱에 갇히지 않게 한다.
        await authApi.logout();
      } catch {
        // ignore
      } finally {
        setSubmitting(false);
      }
      setModalVisible(false);
      logout();
      router.replace('/(auth)/login');
      return;
    }

    if (!withdrawPassword) {
      setWithdrawError('비밀번호를 입력해주세요.');
      return;
    }

    setSubmitting(true);
    try {
      await authApi.deleteAccount(withdrawPassword);
      setSubmitting(false);
      setModalVisible(false);
      withdraw();
      router.replace('/(auth)/login');
    } catch {
      setSubmitting(false);
      setWithdrawError('비밀번호가 일치하지 않습니다.');
    }
  };

  const isLogoutType = modalType === 'logout';

  return (
    <View style={{ flex: 1, backgroundColor: '#F9F9F6' }}>
      <StatusBar barStyle="light-content" />
      
      <BrandHeader title="마이페이지" />

      <ScrollView 
        style={{ flex: 1, paddingHorizontal: 24 }} 
        contentContainerStyle={{ paddingBottom: 120, paddingTop: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 🟡 유저 프로필 영역 */}
        <View style={{ alignItems: 'center', marginTop: 32, marginBottom: 32 }}>
          <View
            style={{
              width: 96,
              height: 96,
              backgroundColor: '#E5ECD8',
              borderRadius: 48,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#D4E2C3',
              marginBottom: 12,
              overflow: 'hidden',
            }}
          >
            {user?.profileImageUrl ? (
              <Image
                source={{ uri: user.profileImageUrl }}
                style={{ width: 96, height: 96 }}
                contentFit="cover"
              />
            ) : (
              <Feather name="user" size={48} color="#113B29" />
            )}
          </View>
          {/* 회원가입/로그인 시 입력한 유저 이름 연동 */}
          <Text style={{ color: '#113B29', fontSize: 16, fontWeight: 'bold' }}>
            {user?.name ? `${user.name}님` : '사용자님'} 
          </Text>
        </View>

        {/* ⚪ 메뉴 카드 리스트 섹션 */}
        
        {/* 1. 회원정보 수정 */}
        <TouchableOpacity 
          onPress={() => router.push('/(tabs)/mypage/edit-profile')}
          style={styles.menuCard}
        >
          <Text style={styles.menuText}>회원정보 수정</Text>
          <Feather name="chevron-right" size={20} color="#113B29" />
        </TouchableOpacity>

        {/* 2. 차량 관리 */}
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/mypage/vehicle-manage')}
          style={styles.menuCard}
        >
          <Text style={styles.menuText}>차량 관리</Text>
          <Feather name="chevron-right" size={20} color="#113B29" />
        </TouchableOpacity>

        {/* 2-1. 공지사항 */}
        <TouchableOpacity
          onPress={() => router.push('/notice/list')}
          style={styles.menuCard}
        >
          <Text style={styles.menuText}>공지사항</Text>
          <Feather name="chevron-right" size={20} color="#113B29" />
        </TouchableOpacity>

        {/* 2-2. 보고서 */}
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/mypage/reports')}
          style={styles.menuCard}
        >
          <Text style={styles.menuText}>보고서</Text>
          <Feather name="chevron-right" size={20} color="#113B29" />
        </TouchableOpacity>

        {/* 3. 알림 설정 */}
        <View style={styles.menuCard}>
          <Text style={styles.menuText}>알림 설정</Text>
          <TouchableOpacity
            onPress={handleTogglePush}
            disabled={pushToggling}
            style={{
              backgroundColor: isPushEnabled ? '#CBE7CB' : '#EAEAEA',
              paddingHorizontal: 16,
              paddingVertical: 6,
              borderRadius: 12,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Text style={{ fontSize: 11, fontWeight: 'bold', color: isPushEnabled ? '#113B29' : '#888888' }}>
              {isPushEnabled ? 'ON' : 'OFF'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 4. 로그아웃 (팝업 연동) */}
        <TouchableOpacity 
          onPress={() => openModal('logout')} 
          style={styles.menuCard}
        >
          <Text style={styles.menuText}>로그아웃</Text>
        </TouchableOpacity>

        {/* 5. 회원 탈퇴 (팝업 연동) */}
        <TouchableOpacity 
          onPress={() => openModal('deleteAccount')} 
          style={styles.menuCard}
        >
          <Text style={[styles.menuText, { color: '#D32F2F' }]}>회원 탈퇴</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* 🛠️ 팝업 디자인 모달 */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={popupStyles.overlay}>
          <View style={popupStyles.modalContainer}>
            
            {/* 상단 우측 X 닫기 버튼 */}
            <TouchableOpacity 
              style={popupStyles.closeButton} 
              onPress={() => setModalVisible(false)}
            >
              <Feather name="x" size={18} color="#666666" />
            </TouchableOpacity>

            {/* 원형 아이콘 패널 (로그아웃: 연두색, 탈퇴: 연분홍색) */}
            <View style={[popupStyles.iconCircle, { backgroundColor: isLogoutType ? '#E5ECD8' : '#FFE5E5' }]}>
              <Feather 
                name={isLogoutType ? "log-out" : "alert-circle"} 
                size={28} 
                color={isLogoutType ? "#113B29" : "#D32F2F"} 
              />
            </View>

            {/* 타이틀 문구 */}
            <Text style={popupStyles.titleText}>
              {isLogoutType ? '로그아웃 하시겠어요?' : '정말 탈퇴하시겠어요?'}
            </Text>
            
            {/* 서브 설명 문구 */}
            <Text style={popupStyles.descText}>
              {isLogoutType
                ? '로그아웃하시면 배터리 긴급 알림을\n받아 보실 수 없습니다.'
                : '등록된 차량 정보와 배터리 진단 이력이\n모두 삭제되며 복구 하실 수 없습니다.'}
            </Text>

            {/* 회원 탈퇴는 현재 비밀번호 확인이 필요하다 */}
            {!isLogoutType && (
              <View style={{ width: '100%', marginBottom: 12 }}>
                <TextInput
                  style={popupStyles.passwordInput}
                  placeholder="현재 비밀번호"
                  placeholderTextColor="#999999"
                  secureTextEntry
                  value={withdrawPassword}
                  onChangeText={(value) => {
                    setWithdrawPassword(value);
                    setWithdrawError('');
                  }}
                />
                {withdrawError ? <Text style={popupStyles.errorText}>{withdrawError}</Text> : null}
              </View>
            )}

            {/* 하단 취소 / 확인 버튼 */}
            <View style={popupStyles.buttonRow}>
              <TouchableOpacity
                style={popupStyles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={popupStyles.cancelButtonText}>취소</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[popupStyles.confirmButton, { backgroundColor: isLogoutType ? '#CBE7CB' : '#FFAAAA' }]}
                onPress={handleConfirm}
                disabled={submitting}
              >
                <Text style={[popupStyles.confirmButtonText, { color: isLogoutType ? '#113B29' : '#D32F2F' }]}>
                  {isLogoutType ? '로그아웃' : '탈퇴하기'}
                </Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>
    </View>
  );
}

// 기존 디자인 스타일 유지
const styles = StyleSheet.create({
  menuCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EFF3EE',
  },
  menuText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  }
});

// 🛠️ 팝업 스타일
const popupStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 300,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#EFF3EE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
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
    marginBottom: 16,
    marginTop: 8,
  },
  titleText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#113B29',
    marginBottom: 8,
  },
  descText: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  passwordInput: {
    width: '100%',
    height: 44,
    borderWidth: 1,
    borderColor: '#EFF3EE',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 13,
    color: '#333333',
  },
  errorText: {
    fontSize: 11,
    color: '#D32F2F',
    marginTop: 6,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    height: 44,
    backgroundColor: '#F1F5EE',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#113B29',
  },
  confirmButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
});