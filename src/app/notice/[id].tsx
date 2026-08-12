import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { getNotice } from '@/api/notice';
import { Notice } from '@/types/notice';
import { formatDate } from '@/utils/format-date';

export default function NoticeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [notice, setNotice] = useState<Notice | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    getNotice(id)
      .then(setNotice)
      .catch((error) => console.error('공지사항을 조회하는 중 오류 발생:', error))
      .finally(() => setIsLoading(false));
  }, [id]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="chevron-left" size={24} color="#113B29" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>공지사항</Text>
      </View>

      {isLoading ? (
        <View style={styles.centerFill}>
          <ActivityIndicator size="large" color="#113B29" />
        </View>
      ) : !notice ? (
        <View style={styles.centerFill}>
          <Feather name="file-text" size={40} color="#CCCCCC" />
          <Text style={styles.emptyText}>공지사항을 찾을 수 없습니다.</Text>
        </View>
      ) : (
        <View style={styles.content}>
          <View style={styles.card}>
            {(notice.isPinned || notice.isImportant) && (
              <View style={styles.badgeRow}>
                {notice.isPinned && (
                  <View style={styles.badge}>
                    <Feather name="bookmark" size={11} color="#113B29" />
                    <Text style={styles.badgeText}>상단 고정</Text>
                  </View>
                )}
                {notice.isImportant && (
                  <View style={[styles.badge, { backgroundColor: '#FFE9E9' }]}>
                    <Text style={[styles.badgeText, { color: '#FF4D4D' }]}>중요</Text>
                  </View>
                )}
              </View>
            )}

            <Text style={styles.title}>{notice.title}</Text>
            <Text style={styles.date}>{formatDate(notice.createdAt)}</Text>

            <View style={styles.divider} />

            <Text style={styles.body}>{notice.content}</Text>
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
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 14,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5ECD8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#113B29',
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
