import { apiClient, mockDelay, USE_MOCK } from '@/api/client';

export async function registerDeviceToken(expoPushToken: string, platform: string): Promise<void> {
  if (!USE_MOCK) {
    await apiClient.post('/api/device-tokens', { expoPushToken, platform });
    return;
  }
  await mockDelay(undefined);
}

export async function unregisterDeviceToken(expoPushToken: string): Promise<void> {
  if (!USE_MOCK) {
    await apiClient.delete(`/api/device-tokens/${encodeURIComponent(expoPushToken)}`);
    return;
  }
  await mockDelay(undefined);
}
