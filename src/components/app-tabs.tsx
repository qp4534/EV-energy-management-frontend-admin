import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.backgroundElement}
      labelStyle={{ selected: { color: colors.text } }}>
      <NativeTabs.Trigger name="home">
        <NativeTabs.Trigger.Label>홈</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="house.fill" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="vehicle">
        <NativeTabs.Trigger.Label>차량</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="car.fill" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="battery-passport">
        <NativeTabs.Trigger.Label>배터리 여권</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="battery.100" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="guide-chat">
        <NativeTabs.Trigger.Label>충전 가이드</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="bubble.left.and.bubble.right.fill" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="mypage">
        <NativeTabs.Trigger.Label>마이페이지</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="person.fill" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
