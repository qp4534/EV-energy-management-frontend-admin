import { apiClient, mockDelay, USE_MOCK } from '@/api/client';
import { NotiType, Notification } from '@/types/notification';

type BackendNotificationDto = {
  notificationId: string;
  riskLevel: NotiType;
  title: string;
  body: string | null;
  isRead: boolean;
  createdAt: string;
  userId: string;
  carId: string | null;
  reportId: string | null;
};

function toNotification(dto: BackendNotificationDto): Notification {
  return {
    id: dto.notificationId,
    title: dto.title,
    body: dto.body ?? '',
    isRead: dto.isRead,
    createdAt: dto.createdAt,
    type: dto.riskLevel,
    hasReport: dto.reportId != null,
  };
}

export async function getNotifications(): Promise<Notification[]> {
  if (!USE_MOCK) {
    // 백엔드가 이미 user_id로 스코핑해서 로그인한 본인 알림만 내려준다.
    const { data } = await apiClient.get<BackendNotificationDto[]>('/api/notifications');
    return data.map(toNotification);
  }
  return mockDelay([
    {
      id: 'n1',
      title: '배터리 리포트 도착',
      body: '7월 배터리 리포트를 확인해보세요.',
      isRead: false,
      createdAt: '2026-08-01',
      type: '경고',
      hasReport: true
    },
    {
      id: 'n2',
      title: '배터리 고온 위험 긴급 알림',
      body: '현재 배터리 온도가 매우 높습니다. 즉시 안전한 곳에 주차하세요.',
      isRead: false,
      createdAt: '2026-07-27',
      type: '긴급',
      hasReport: false
    },
  ]);
}

export async function getNotification(id: string): Promise<Notification> {
  if (!USE_MOCK) {
    const { data } = await apiClient.get<BackendNotificationDto>(`/api/notifications/${id}`);
    return toNotification(data);
  }
  const list = await getNotifications();
  return list.find((item) => item.id === id) ?? list[0];
}

export async function markNotificationAsRead(id: string): Promise<void> {
  if (!USE_MOCK) {
    await apiClient.patch(`/api/notifications/${id}/read`);
    return;
  }
  await mockDelay(undefined);
}
