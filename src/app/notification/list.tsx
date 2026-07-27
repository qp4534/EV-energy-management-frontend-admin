import { useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';

import { getNotifications } from '@/api/notification';
import { Header } from '@/components/common/header';
import { NotificationItem } from '@/components/notification-item';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { Notification } from '@/types/notification';

export default function NotificationListScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    getNotifications().then(setNotifications);
  }, []);

  return (
    <ThemedView style={styles.container}>
      <Header title="알림" showBack />
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <NotificationItem notification={item} />}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: Spacing.three,
    gap: Spacing.two,
  },
});
