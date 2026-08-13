import { registerDeviceToken } from '@/api/device-token';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';

// 앱이 켜져 있는 동안(포그라운드)에도 배너/목록에 알림이 뜨도록 설정. 안 해두면 포그라운드일 땐
// 조용히 무시된다. 웹은 이 모듈이 서버 사이드 렌더링(Node) 시점에도 로드되는데, 그 환경엔
// localStorage가 없어서 expo-notifications 내부가 매 렌더마다 에러를 던진다 - 웹은 어차피
// 원격 푸시를 안 쓰므로(useEffect에서도 web을 건너뜀) 아예 호출하지 않는다.
if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

// Android 8+는 채널이 없으면 소리/진동 없이 "Miscellaneous"라는 기본 채널로만 뜬다.
async function ensureAndroidChannel() {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync('default', {
    name: '기본 알림',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    sound: 'default',
  });
}

// Expo Go에선 SDK 53부터 Android 원격 푸시가 아예 지원 안 되므로(EAS dev build 필요),
// 웹이나 Expo Go에서 이 훅이 조용히 아무것도 안 하고 넘어가도 정상이다.
export function usePushNotifications() {
  const router = useRouter();
  const hasRegisteredRef = useRef(false);

  useEffect(() => {
    if (Platform.OS === 'web' || hasRegisteredRef.current) return;
    hasRegisteredRef.current = true;

    async function register() {
      try {
        await ensureAndroidChannel();

        const current = await Notifications.getPermissionsAsync();
        let status = current.status;
        if (status !== 'granted') {
          const requested = await Notifications.requestPermissionsAsync();
          status = requested.status;
        }
        if (status !== 'granted') return;

        const projectId =
          Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
        const { data: expoPushToken } = await Notifications.getExpoPushTokenAsync({ projectId });

        await registerDeviceToken(expoPushToken, Platform.OS);
      } catch (error) {
        // 알림 등록 실패는 앱 사용 자체를 막을 이유가 없어서 조용히 로그만 남긴다.
        console.warn('푸시 알림 등록에 실패했습니다:', error);
      }
    }

    register();

    // 알림을 탭해서 앱을 열었을 때, 그 알림의 상세 화면으로 이동
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const notificationId = response.notification.request.content.data?.notificationId;
      if (typeof notificationId === 'string') {
        router.push(`/notification/${notificationId}`);
      }
    });

    return () => subscription.remove();
  }, [router]);
}
