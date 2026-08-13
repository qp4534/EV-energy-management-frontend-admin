import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { getBatteryPassport } from '@/api/battery';
import { getReport, getReports } from '@/api/report';
import { useBottomTabInset } from '@/hooks/use-bottom-tab-inset';
import { useVehicleStore } from '@/store/vehicle-store';
import { formatDateTime } from '@/utils/format-date';

import { Report } from '@/types/report';

export default function ReportScreen() {
  const router = useRouter();
  const { vehicle } = useVehicleStore();
  const bottomInset = useBottomTabInset();
  // 보고서 목록(마이페이지)에서 특정 보고서를 지정해서 들어온 경우엔 그 보고서를,
  // 없으면(홈 화면 팝업 "자세히 보기") 기존처럼 최신 보고서를 보여준다.
  const { id } = useLocalSearchParams<{ id?: string }>();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [report, setReport] = useState<Report | null>(null);
  const [batteryInfo, setBatteryInfo] = useState<any>(null);

  useEffect(() => {
    async function loadReportDetail() {
      try {
        setIsLoading(true);
        const [reportResult, batteryData] = await Promise.all([
          id ? getReport(id) : getReports().then((list) => list[0] ?? null),
          getBatteryPassport(vehicle?.id || 'default'),
        ]);

        setReport(reportResult);
        setBatteryInfo(batteryData);
      } catch (error) {
        console.error('보고서 상세를 불러오는 중 에러 발생:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadReportDetail();
  }, [vehicle, id]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#F9FBF7', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#113B29" />
      </View>
    );
  }

  // 데이터 매핑
  const displayTitle = report?.title || '배터리 리포트'; 
  const displaySummary = report?.summary || '진단 내역이 존재하지 않습니다.'; 
  const formattedDate = report?.createdAt ? formatDateTime(report.createdAt) : '0000-00-00';
  
  const currentVehicleModel = vehicle?.model || '등록된 차량 없음';
  const currentBatteryTemp = batteryInfo?.temperatureC ? `${batteryInfo.temperatureC} °C` : '-- °C';

  return (
    // 전체 배경
    <View style={{ flex: 1, backgroundColor: '#FAF9F5', paddingTop: 56, paddingHorizontal: 20 }}>
      
      {/* 1. 헤더 영역 (뒤로가기 + 타이틀) */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 32 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 8 }}>
          <Feather name="chevron-left" size={24} color="#113B29" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#113B29' }}>보고서 상세보기</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomInset }}
      >
        {/* 2. 상단 배터리 이상 징후 알림 영역 */}
        <View style={{ alignItems: 'center', marginBottom: 32, marginTop: 8 }}>
          <View style={{ 
            backgroundColor: '#E5EAC4', 
            width: 96, 
            height: 96, 
            borderRadius: 48, 
            alignItems: 'center', 
            justifyContent: 'center', 
            marginBottom: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 1 
          }}>
            <Feather name="battery-charging" size={36} color="#113B29" />
          </View>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#113B29', textAlign: 'center', marginBottom: 8 }}>
            {displayTitle}
          </Text>
          <Text style={{ fontSize: 14, color: '#708679', textAlign: 'center', lineHeight: 20, fontWeight: '500' }}>
            차량 배터리 상태 진단 결과가 업데이트 되었습니다.
          </Text>
        </View>

        {/* 3. 발생 정보 카드 영역(AI연동 예정) */}
        <View style={{ 
          backgroundColor: 'white', 
          borderRadius: 24, 
          padding: 20, 
          borderWidth: 1, 
          borderColor: '#EDF2EC', 
          marginBottom: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
          elevation: 1 
        }}>
          {/* 발생시각 행 */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
            <Text style={{ color: '#8FA196', fontSize: 14, fontWeight: '500' }}>발생시각</Text>
            <Text style={{ color: '#113B29', fontSize: 16, fontWeight: 'bold' }}>{formattedDate}</Text>
          </View>
          
          {/* 차량명 행 */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
            <Text style={{ color: '#8FA196', fontSize: 14, fontWeight: '500' }}>차량</Text>
            <Text style={{ color: '#113B29', fontSize: 16, fontWeight: 'bold' }}>{currentVehicleModel}</Text>
          </View>
          
          {/* 배터리 온도 행 */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14 }}>
            <Text style={{ color: '#8FA196', fontSize: 14, fontWeight: '500' }}>배터리 온도</Text>
            <Text style={{ color: '#113B29', fontSize: 16, fontWeight: 'bold' }}>{currentBatteryTemp}</Text>
          </View>
        </View>

        {/* 4. AI 분석 근거 카드 영역(AI연동 예정) */}
        <View style={{ 
          backgroundColor: 'white',
          borderRadius: 24, 
          padding: 20, 
          borderWidth: 1, 
          borderColor: '#EDF2EC', 
          marginBottom: 24,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
          elevation: 1 
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Feather name="zap" size={16} color="#113B29" />
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#113B29', marginLeft: 6 }}>AI 분석 근거</Text>
          </View>
          <Text style={{ color: '#556B5C', fontSize: 14, lineHeight: 24, fontWeight: '500' }}>
            {displaySummary}
          </Text>
        </View>
        
      </ScrollView>
    </View>
  );
}