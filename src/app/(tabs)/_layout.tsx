import { Ionicons } from '@expo/vector-icons';
import { Tabs, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useVehicle } from '@/hooks/use-vehicle';
import { usePushNotifications } from '@/hooks/use-push-notifications';
// npx expo install @expo/vector-icons 설치

export default function TabsLayout() {
  const segments = useSegments();
  const { fetchVehicles } = useVehicle();
  // tabBarStyle에 height/paddingBottom을 직접 지정하면 React Navigation이 자동으로 넣어주던
  // safe area 패딩이 꺼진다 - 안드로이드 제스처바/3버튼 내비게이션 높이만큼 직접 더해줘야
  // 탭바가 시스템 버튼에 가려지거나 겹치지 않는다.
  const insets = useSafeAreaInsets();

  useEffect(() => {
    fetchVehicles();
  }, []);

  // 로그인된 상태(이 레이아웃이 마운트된 상태)에서만 푸시 토큰을 등록한다.
  usePushNotifications();

  // 현재 화면이 guide-chat이나 지도(map)인지 확인 - 둘 다 자체적으로 화면 하단에
  // 떠 있는 UI(채팅 입력창 / 충전소 바텀시트)를 갖고 있어서, 앱의 플로팅 탭바까지 같이
  // 떠 있으면 서로 겹쳐서 바텀시트를 접었다 펼 때 탭바에 가려 탭이 안 되는 문제가 있었다.
  const lastSegment = segments[segments.length - 1];
  const hideTabBar = lastSegment === 'guide-chat' || lastSegment === 'map';

  return (
    <Tabs
      // 파일 등록 순서상 'vehicle'이 첫 탭이라 로그인 직후 기본으로 그쪽으로 가버렸다
      // - 홈 탭을 시작 화면으로 지정한다.
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: hideTabBar
          ? { display: 'none' }
          : [
              styles.tabBar,
              {
                height: 85 + insets.bottom,
                paddingBottom: (Platform.OS === 'ios' ? 25 : 15) + insets.bottom,
              },
            ],
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
          title: '', 
          tabBarIcon: ({ focused }) => (
            <View style={[styles.floatingHomeButton, focused && styles.activeHome]}>
              <Ionicons name="home" size={28} color={focused ? '#ffffff' : '#113B29'} />
            </View>
          ),
        }}
      />

      {/* <Tabs.Screen
        name="guide-chat"
        options={{
          title: 'AI 충전 가이드',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "chatbubble-ellipses" : "chatbubble-ellipses-outline"} size={24} color={color} />
          ),
        }}
      /> */}

      <Tabs.Screen
        name="guide-chat"
        options={{
          tabBarLabel: ({ color }) => (
            <Text style={{ color, fontSize: 11, fontWeight: '500', textAlign: 'center', lineHeight: 14,}}>
              {"AI 충전\n가이드"}
            </Text>
          ),
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
    backgroundColor: '#EDF2EC',
    borderTopWidth: 0,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
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
    top: -25, 
    borderWidth: 4,
    borderColor: '#EDF2EC', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  activeHome: {
    backgroundColor: '#113B29', 
  }
});