import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';

import { getReports } from '@/api/report';
import { useBottomTabInset } from '@/hooks/use-bottom-tab-inset';
import { Report } from '@/types/report';
import { formatDate } from '@/utils/format-date';

export default function ReportListScreen() {
  const router = useRouter();
  const bottomInset = useBottomTabInset();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getReports()
      .then(setReports)
      .catch((error) => console.error('보고서 목록을 조회하는 중 오류 발생:', error))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#F9F9F6' }}>
      <StatusBar barStyle="dark-content" />

      <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 50, paddingBottom: 16, paddingHorizontal: 20, backgroundColor: '#F9F9F6' }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
          <Feather name="chevron-left" size={24} color="#113B29" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#113B29', marginLeft: 12 }}>보고서</Text>
      </View>

      {isLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#113B29" />
        </View>
      ) : reports.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <Feather name="file-text" size={40} color="#CCCCCC" />
          <Text style={{ fontSize: 13, color: '#999999' }}>아직 발행된 보고서가 없습니다.</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 20, paddingBottom: bottomInset, gap: 12 }}>
          {reports.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 16,
                padding: 18,
                borderWidth: 1,
                borderColor: '#EAEFEA',
              }}
              onPress={() => router.push(`/(tabs)/home/report?id=${item.id}`)}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#E5EAC4', alignItems: 'center', justifyContent: 'center' }}>
                  <Feather name="file-text" size={16} color="#113B29" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#222222' }} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={{ fontSize: 12, color: '#999999', marginTop: 2 }}>{formatDate(item.createdAt)}</Text>
                </View>
                <Feather name="chevron-right" size={18} color="#BBBBBB" />
              </View>
              <Text style={{ fontSize: 13, color: '#666666', lineHeight: 18, marginTop: 10 }} numberOfLines={2}>
                {item.summary}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
