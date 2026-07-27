import { Link } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { Notification } from '@/types/notification';
import { formatDate } from '@/utils/format-date';

type NotificationItemProps = {
  notification: Notification;
};

export function NotificationItem({ notification }: NotificationItemProps) {
  return (
    <Link href={`/notification/${notification.id}`} asChild>
      <Pressable>
        <ThemedView
          type={notification.isRead ? 'backgroundElement' : 'backgroundSelected'}
          style={styles.container}>
          <ThemedText type="smallBold">{notification.title}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {notification.body}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {formatDate(notification.createdAt)}
          </ThemedText>
        </ThemedView>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.half,
  },
});
