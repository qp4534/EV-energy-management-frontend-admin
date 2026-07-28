// import { Pressable, StyleSheet } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';

// import { ThemedText } from '@/components/themed-text';
// import { ThemedView } from '@/components/themed-view';
// import { Spacing } from '@/constants/theme';
// import { useAuth } from '@/hooks/use-auth';

// export default function MypageIndexScreen() {
//   const { user, logout } = useAuth();

//   return (
//     <ThemedView style={styles.container}>
//       <SafeAreaView style={styles.safeArea}>
//         <ThemedText type="title">마이페이지</ThemedText>
//         {user && (
//           <ThemedText type="small" themeColor="textSecondary">
//             {user.name} · {user.email}
//           </ThemedText>
//         )}

//         <Pressable onPress={logout}>
//           <ThemedView type="backgroundElement" style={styles.button}>
//             <ThemedText type="link">로그아웃</ThemedText>
//           </ThemedView>
//         </Pressable>
//       </SafeAreaView>
//     </ThemedView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   safeArea: {
//     flex: 1,
//     paddingHorizontal: Spacing.four,
//     paddingTop: Spacing.four,
//     gap: Spacing.three,
//   },
//   button: {
//     alignSelf: 'flex-start',
//     borderRadius: Spacing.five,
//     paddingHorizontal: Spacing.four,
//     paddingVertical: Spacing.two,
//   },
// });

import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';

export default function MyPageIndexScreen() {
  const router = useRouter();
  
  // 알림 설정 ON/OFF 토글 상태
  const [isPushEnabled, setIsPushEnabled] = useState<boolean>(true);

  return (
    <View style={{ flex: 1, backgroundColor: '#F9F9F6' }}>
      <StatusBar barStyle="light-content" />
      
      {/* 🟢 상단 딥그린 헤더 바 (시안처럼 파고드는 형태의 얇은 라운드 바 형태) */}
      <View 
        style={{ 
          backgroundColor: '#113B29', 
          paddingTop: 55, 
          paddingBottom: 25, 
          paddingHorizontal: 24,
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
        }}
      >
        <Text style={{ color: '#ffffff', fontSize: 15, fontWeight: 'bold', letterSpacing: 1, opacity: 0.9, marginBottom: 4 }}>
          MijungE
        </Text>
        <Text style={{ color: '#ffffff', fontSize: 25, fontWeight: 'bold' }}>
          마이페이지
        </Text>
      </View>

      <ScrollView 
        style={{ flex: 1, paddingHorizontal: 24 }} 
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 🟡 유저 프로필 영역 (헤더 밖 배경 위에 배치 - 시안 완벽 반영) */}
        <View style={{ alignItems: 'center', marginTop: 32, marginBottom: 32 }}>
          {/* 연두색 원형 아바타 패널 */}
          <View 
            style={{ 
              width: 96, 
              height: 96, 
              backgroundColor: '#E5ECD8', // 시안의 연두빛 도는 아바타 배경색
              borderRadius: 48, 
              justifyContent: 'center', 
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#D4E2C3',
              marginBottom: 12
            }}
          >
            <Feather name="user" size={48} color="#113B29" />
          </View>
          <Text style={{ color: '#113B29', fontSize: 16, fontWeight: 'bold' }}>
            홍길*님
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

        {/* 3. 알림 설정 (시안의 [ON]/[OFF] 커스텀 버튼 칩 스타일 레이아웃) */}
        <View style={styles.menuCard}>
          <Text style={styles.menuText}>알림 설정</Text>
          <TouchableOpacity 
            onPress={() => setIsPushEnabled(!isPushEnabled)}
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

        {/* 4. 로그아웃 */}
        <TouchableOpacity 
          onPress={() => alert('로그아웃 팝업 연동')}
          style={styles.menuCard}
        >
          <Text style={styles.menuText}>로그아웃</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = {
  menuCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EFF3EE',
  },
  menuText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#333333',
  }
};