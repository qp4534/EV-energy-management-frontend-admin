import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { getNotification, markNotificationAsRead } from '@/api/notification';
import { NotiType, Notification } from '@/types/notification';
import { formatDate } from '@/utils/format-date';

const NOTI_STYLE: Record<NotiType, { color: string; background: string; icon: any; label: string }> = {
  '긴급': { color: '#FF4D4D', background: '#FFE9E9', icon: 'alert-octagon', label: '긴급' },
  '경고': { color: '#FFA500', background: '#FFF3E0', icon: 'alert-triangle', label: '경고' },
  '주의': { color: '#D4A400', background: '#FFF9E0', icon: 'info', label: '주의' },
  '정상': { color: '#3CD070', background: '#E9F9EF', icon: 'check-circle', label: '정상' },
};

export default function NotificationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [notification, setNotification] = useState<Notification | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    getNotification(id)
      .then((found) => {
        setNotification(found);
        if (!found.isRead) {
          markNotificationAsRead(id).catch(() => {});
        }
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  const design = NOTI_STYLE[notification?.type ?? '정상'];

  return (
    <View style={styles.container}>
      {/* 상단 네비 바 헤더 - 알림 목록 화면과 동일한 스타일 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="chevron-left" size={24} color="#113B29" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>알림</Text>
      </View>

      {isLoading ? (
        <View style={styles.centerFill}>
          <ActivityIndicator size="large" color="#113B29" />
        </View>
      ) : !notification ? (
        <View style={styles.centerFill}>
          <Feather name="bell-off" size={40} color="#CCCCCC" />
          <Text style={styles.emptyText}>알림을 찾을 수 없습니다.</Text>
        </View>
      ) : (
        <View style={styles.content}>
          <View style={styles.card}>
            <View style={[styles.typeChip, { backgroundColor: design.background }]}>
              <Feather name={design.icon} size={13} color={design.color} />
              <Text style={[styles.typeChipText, { color: design.color }]}>{design.label}</Text>
            </View>

            <Text style={styles.title}>{notification.title}</Text>
            <Text style={styles.date}>{formatDate(notification.createdAt)}</Text>

            <View style={styles.divider} />

            <Text style={styles.body}>{notification.body}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: '#F9F9F6',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#113B29',
    marginLeft: 12,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#EAEFEA',
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 5,
    marginBottom: 14,
  },
  typeChipText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222222',
    lineHeight: 25,
  },
  date: {
    fontSize: 12,
    color: '#999999',
    marginTop: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#EFF3EE',
    marginVertical: 16,
  },
  body: {
    fontSize: 14,
    color: '#4A4A4A',
    lineHeight: 22,
  },
  centerFill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  emptyText: {
    fontSize: 13,
    color: '#999999',
  },
});
