import { Ionicons } from '@expo/vector-icons';
import { Tabs, useSegments } from 'expo-router';
import { Platform, StyleSheet, View } from 'react-native';
// npx expo install @expo/vector-icons 설치

export default function TabsLayout() {
  const segments = useSegments();

  // 현재 활성화된 화면이 'guide-chat' 인지 확인
  // segments 배열의 마지막 요소가 'guide-chat'인지 체크
  const isGuideChatActive = segments[segments.length - 1] === 'guide-chat';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        // guide-chat 화면일 때만 tabBarStyle을 숨김({ display: 'none' }) 처리
        tabBarStyle: isGuideChatActive ? { display: 'none' } : styles.tabBar,
        tabBarActiveTintColor: '#113B29', 
        tabBarInactiveTintColor: '#888888',
        tabBarShowLabel: true,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
      }}
    >
      <Tabs.Screen
        name="vehicle"
        options={{
          title: '차량 등록',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "car" : "car-outline"} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="battery-passport"
        options={{
          title: '배터리 여권',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "battery-charging" : "battery-charging-outline"} size={24} color={color} />
          ),
        }}
      />
      
      {/* 중앙 홈 버튼 */}
      <Tabs.Screen
        name="home"
        options={{
          title: '', // 홈은 라벨을 비워둠
          tabBarIcon: ({ focused }) => (
            <View style={[styles.floatingHomeButton, focused && styles.activeHome]}>
              <Ionicons name="home" size={28} color={focused ? '#ffffff' : '#113B29'} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="guide-chat"
        options={{
          title: 'AI 충전 가이드',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "chatbubble-ellipses" : "chatbubble-ellipses-outline"} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="mypage"
        options={{
          title: '마이페이지',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "person" : "person-outline"} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 85,
    backgroundColor: '#EDF2EC', // 시안 하단 탭바의 연녹색/아이보리 배경
    borderTopWidth: 0,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingBottom: Platform.OS === 'ios' ? 25 : 15,
    paddingTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 10,
  },
  floatingHomeButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -25, // 위로 툭 튀어나오는 플로팅 효과
    borderWidth: 4,
    borderColor: '#EDF2EC', // 탭바 배경색과 맞춰서 자연스럽게
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  activeHome: {
    backgroundColor: '#113B29', // 활성화 시 딥그린으로 채워짐
  }
});