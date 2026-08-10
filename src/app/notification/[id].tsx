import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

import { getNotification, markNotificationAsRead } from '@/api/notification';
import { Header } from '@/components/common/header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { Notification } from '@/types/notification';
import { formatDate } from '@/utils/format-date';

export default function NotificationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [notification, setNotification] = useState<Notification | null>(null);

  useEffect(() => {
    if (!id) return;
    getNotification(id).then((found) => {
      setNotification(found);
      if (!found.isRead) {
        markNotificationAsRead(id).catch(() => {});
      }
    });
  }, [id]);

  return (
    <ThemedView style={styles.container}>
      <Header title="알림" showBack />
      {notification && (
        <ThemedView style={styles.content}>
          <ThemedText type="subtitle">{notification.title}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {formatDate(notification.createdAt)}
          </ThemedText>
          <ThemedText type="default">{notification.body}</ThemedText>
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.two,
  },
});
