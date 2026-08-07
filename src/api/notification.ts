import { apiClient, mockDelay, USE_MOCK } from '@/api/client';
import { Notification } from '@/types/notification';

export async function getNotifications(): Promise<Notification[]> {
  if (!USE_MOCK) {
    const { data } = await apiClient.get<Notification[]>('/notifications');
    return data;
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
    const { data } = await apiClient.get<Notification>(`/notifications/${id}`);
    return data;
  }
  const list = await getNotifications();
  return list.find((item) => item.id === id) ?? list[0];
}
