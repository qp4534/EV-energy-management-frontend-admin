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
      createdAt: '2026-07-27',
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
