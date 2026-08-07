import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';

import { getNotifications } from '@/api/notification';
import { getReports } from '@/api/report';
import { ReportModal } from '@/components/modal/ReportModal';

import { useVehicleStore } from '@/store/vehicle-store';
import { Notification, NotiType } from '@/types/notification';
import { Report } from '@/types/report';

export default function NotificationListScreen() {
  const router = useRouter();
  const { vehicle, isRegistered } = useVehicleStore();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isReportModalVisible, setIsReportModalVisible] = useState<boolean>(false);
  const [activeReport, setActiveReport] = useState<(Report & { type?: NotiType }) | null>(null);

  // 전체 및 '긴급', '경고', '주의', '정상' 단계별 탭 상태 스위치
  const [activeTab, setActiveTab] = useState<'전체' | NotiType>('전체');

  useEffect(() => {
    async function loadNotifications() {
      // 차량이 등록되지 않은 상태라면 API 호출을 막고 로딩을 종료
      if (!isRegistered) {
        setNotifications([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const [notiList, reportList] = await Promise.all([
          getNotifications(),
          getReports()
        ]);
        
        setNotifications(notiList);
        
        if (reportList && reportList.length > 0) {
          setActiveReport({
            ...reportList[0],
            type: '경고'
          });
        }
      } catch (error) {
        console.error('알림 내역을 조회하는 중 오류 발생:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadNotifications();
  }, [isRegistered]);

  const notiStyleMap: Record<NotiType, { color: string; icon: any }> = {
    '긴급': { color: '#FF4D4D', icon: 'alert-octagon' },
    '경고': { color: '#FFA500', icon: 'alert-triangle' },
    '주의': { color: '#FFD700', icon: 'info' },
    '정상': { color: '#3CD070', icon: 'check-circle' },
  };

  // 선택된 단계 탭에 따라 리스트 필터링 ('전체'가 아니면 item.type과 매핑)
  const filteredNotifications = notifications.filter(item => {
    if (activeTab === '전체') return true;
    return item.type === activeTab;
  });

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#F4F6F3', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#113B29" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F9F9F6' }}>
      <StatusBar barStyle="dark-content" />
      
      {/* 상단 네비 바 헤더 */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 50, paddingBottom: 16, paddingHorizontal: 20, backgroundColor: '#F9F9F6' }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
          <Feather name="chevron-left" size={24} color="#113B29" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#113B29', marginLeft: 12 }}>알림 내역</Text>
      </View>

      {/* 단계별 (전체, 긴급, 경고, 주의, 정상) 스크롤 탭 바 */}
      <View style={{ backgroundColor: '#F9F9F6', borderBottomWidth: 1, borderBottomColor: '#EAEFEA' }}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={{ paddingHorizontal: 20, gap: 20 }}
        >
          {(['전체', '긴급', '경고', '주의', '정상'] as const).map((tab) => (
            <TouchableOpacity 
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={{ 
                paddingVertical: 12, 
                borderBottomWidth: 2, 
                borderBottomColor: activeTab === tab ? '#113B29' : 'transparent' 
              }}
            >
              <Text style={{ 
                fontSize: 14, 
                fontWeight: activeTab === tab ? 'bold' : '500', 
                color: activeTab === tab ? '#113B29' : '#888888' 
              }}>
                {tab === '전체' ? '전체 알림' : tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredNotifications.length === 0 ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <Text style={{ color: '#999999', fontSize: 14 }}>{activeTab} 상태의 알림이 없습니다.</Text>
          </View>
        ) : (
          filteredNotifications.map((item) => {
            const typeKey = item.type || '정상';
            const design = notiStyleMap[typeKey];

            return (
              <TouchableOpacity 
                key={item.id}
                style={{ 
                  backgroundColor: item.isRead ? '#FFFFFF' : '#F4F9F4', 
                  padding: 18, 
                  borderBottomWidth: 1, 
                  borderBottomColor: '#EAEFEA',
                  opacity: item.isRead ? 0.75 : 1
                }}
                onPress={() => {
                  if (typeKey === '경고') {
                    setIsReportModalVisible(true);
                  }
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                  <Feather name={design.icon} size={18} color={design.color} />
                  <Text style={{ fontSize: 14, fontWeight: item.isRead ? '500' : 'bold', color: '#222222', marginLeft: 8, flex: 1 }}>
                    {item.title}
                  </Text>
                  <Text style={{ color: '#999999', fontSize: 11 }}>{item.createdAt}</Text>
                </View>
                <Text style={{ color: '#666666', fontSize: 13, lineHeight: 18, marginLeft: 26 }}>
                  {item.body}
                </Text>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      <ReportModal
        visible={isReportModalVisible}
        onClose={() => setIsReportModalVisible(false)}
        onDetailPress={() => {
          setIsReportModalVisible(false);
          router.push('/(tabs)/home/report');
        }}
        vehicleModel={vehicle?.model || '아이오닉5'}
        plateNumber={vehicle?.plateNumber || '차량 번호 미등록'}
        reportData={activeReport}
      />
    </View>
  );
}