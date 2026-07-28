import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';

type NotiType = '긴급' | '경고' | '주의' | '정상';

interface NotiItem {
  id: string;
  type: NotiType;
  title: string;
  desc: string;
  time: string;
  hasReport: boolean;
}

export default function NotificationListScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<string>('ALL');

  const listData: NotiItem[] = [
    { id: '1', type: '경고', title: '배터리 이상 징후 감지', desc: '배터리 정밀 진단 권장', time: '07:25', hasReport: false },
    { id: '2', type: '긴급', title: '배터리 온도 위험 감지', desc: '충전 중단 권장, 배터리 화재 위험성 높음', time: '어제', hasReport: true },
    { id: '3', type: '주의', title: '열화상 미세 이상 감지', desc: '충전 중 온도 편차 관찰됨', time: '07/21', hasReport: false },
    { id: '4', type: '정상', title: '전기 진단 완료', desc: '모든 항목 정상 범위 판정', time: '07/18', hasReport: false },
  ];

  // 배지 스타일 매핑 함수 수정 (인라인 스타일 객체 반환)
  const getBadgeStyle = (type: NotiType) => {
    switch(type) {     
      case '긴급': return { bg: '#FEE2E2', text: '#DC2626' };
      case '경고': return { bg: '#FFEDD5', text: '#EA580C' }; 
      case '주의': return { bg: '#FEF08A', text: '#854D0E' }; 
      case '정상': return { bg: '#DCFCE7', text: '#16A34A' };
    }
  };

  const filtered = filter === 'ALL' ? listData : listData.filter(d => d.type === filter);

  return (
    // 전체 배경 (보고서 상세 화면과 일치하는 미색 테마)
    <View style={{ flex: 1, backgroundColor: '#FAF9F5', paddingTop: 56, paddingHorizontal: 20 }}>
      
      {/* 1. 헤더 영역 */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 8 }}>
          <Feather name="chevron-left" size={24} color="#113B29" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#113B29' }}>알림 목록</Text>
      </View>

      {/* 2. 필터 칩(Chip) 영역 */}
      <View style={{ flexDirection: 'row', marginBottom: 16, flexWrap: 'wrap' }}>
        {['ALL', '긴급', '경고', '주의', '정상'].map((f) => {
          const isSelected = filter === f;
          return (
            <TouchableOpacity 
              key={f} 
              onPress={() => setFilter(f)}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 6,
                borderRadius: 20,
                marginRight: 8,
                marginBottom: 8,
                backgroundColor: isSelected ? '#113B29' : 'white',
                borderWidth: isSelected ? 0 : 1,
                borderColor: '#E5E7EB',
              }}
            >
              <Text style={{ 
                fontSize: 12, 
                fontWeight: 'bold', 
                color: isSelected ? 'white' : '#6B7280' 
              }}>
                {f}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 3. 알림 리스트 영역 */}
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        {filtered.map((item) => {
          const badge = getBadgeStyle(item.type);
          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => {
                if (item.hasReport) {
                  router.navigate('/(tabs)/home/report');
                } else {
                  // 웹 브라우저용 alert 대신 모바일 환경에 맞는 Alert.alert 사용 권장
                  Alert.alert('알림', `${item.title} 단발성 알림 내역입니다.`);
                }
              }}
              style={{
                backgroundColor: 'white',
                borderRadius: 16,
                padding: 16,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: '#EDF2EC',
                // 부드러운 그림자 효과
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.04,
                shadowRadius: 2,
                elevation: 1,
              }}
            >
              {/* 상단 배지 및 시간 */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <View style={{ backgroundColor: badge.bg, paddingHorizontal: 10, paddingVertical: 2, borderRadius: 12 }}>
                  <Text style={{ color: badge.text, fontSize: 11, fontWeight: 'bold' }}>{item.type}</Text>
                </View>
                <Text style={{ fontSize: 12, color: '#9CA3AF' }}>{item.time}</Text>
              </View>

              {/* 제목 및 설명 */}
              <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#1F2937', marginBottom: 4 }}>
                {item.title}
              </Text>
              <Text style={{ fontSize: 13, color: '#6B7280', lineHeight: 18 }}>
                {item.desc}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}