import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * (tabs)/_layout.tsx의 플로팅 탭바는 position: 'absolute'라 화면 콘텐츠 쪽에서 알아서
 * 탭바 높이만큼 하단 여백을 잡아줘야 한다(안 그러면 스크롤 맨 아래 내용이 탭바에 가려짐).
 * 탭바 자체의 height 계산식(85 + insets.bottom)과 반드시 맞춰서 써야 한다.
 */
export function useBottomTabInset(): number {
  const insets = useSafeAreaInsets();
  const tabBarHeight = 85 + insets.bottom;
  return tabBarHeight + (Platform.OS === 'ios' ? 16 : 24);
}
