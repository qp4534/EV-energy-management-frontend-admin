import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';

import { getNotices } from '@/api/notice';
import { Notice } from '@/types/notice';
import { formatDate } from '@/utils/format-date';

export default function NoticeListScreen() {
  const router = useRouter();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getNotices()
      .then((list) => {
        // 상단 고정 공지가 먼저 오도록 정렬 (같은 그룹 안에서는 최신순 그대로 유지)
        setNotices([...list].sort((a, b) => Number(b.isPinned) - Number(a.isPinned)));
      })
      .catch((error) => console.error('공지사항을 조회하는 중 오류 발생:', error))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#F9F9F6' }}>
      <StatusBar barStyle="dark-content" />

      <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 50, paddingBottom: 16, paddingHorizontal: 20, backgroundColor: '#F9F9F6' }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
          <Feather name="chevron-left" size={24} color="#113B29" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#113B29', marginLeft: 12 }}>공지사항</Text>
      </View>

      {isLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#113B29" />
        </View>
      ) : notices.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <Feather name="file-text" size={40} color="#CCCCCC" />
          <Text style={{ fontSize: 13, color: '#999999' }}>등록된 공지사항이 없습니다.</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {notices.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={{
                backgroundColor: '#FFFFFF',
                padding: 18,
                borderBottomWidth: 1,
                borderBottomColor: '#EAEFEA',
              }}
              onPress={() => router.push(`/notice/${item.id}`)}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4, gap: 6 }}>
                {item.isPinned && <Feather name="bookmark" size={14} color="#113B29" />}
                {item.isImportant && (
                  <View style={{ backgroundColor: '#FFE9E9', paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4 }}>
                    <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#FF4D4D' }}>중요</Text>
                  </View>
                )}
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#222222', flex: 1 }} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={{ color: '#999999', fontSize: 11 }}>{formatDate(item.createdAt)}</Text>
              </View>
              <Text style={{ color: '#666666', fontSize: 13, lineHeight: 18 }} numberOfLines={2}>
                {item.content}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
