import { useVehicleStore } from '@/store/vehicle-store';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function ReportScreen() {
  const router = useRouter();

  // 👤 전역 상태 저장소 데이터 매핑
  const { vehicle } = useVehicleStore();
  const currentVehicleModel = vehicle?.model || '차량 미등록'; // 현재 차량 모델명 (없으면 기본값)

  // 🤖 [AI 연동 영역 가변 데이터 상태 정의]
  // 백엔드 API 연동 시, 아래 상태값들을 API 응답 데이터로 대체 예정
  const [reportTime, setReportTime] = useState<string>("2026/07/15 13:30");
  const [batteryTemperature, setBatteryTemperature] = useState<number>(50);
  const [aiAnalysisReason, setAiAnalysisReason] = useState<string>(
    "최근 7일 평균 대비 충전 중 배터리 온도가 12°C 높게 유지되고 있으며, 동일 시간대 급속 충전 사용 빈도가 증가한 점이 이번 판정에 가장 크게 반영됐어요."
  );

  return (
    // 전체 배경
    <View style={{ flex: 1, backgroundColor: '#FAF9F5', paddingTop: 56, paddingHorizontal: 20 }}>
      
      {/* 1. 헤더 영역 (뒤로가기 + 타이틀) */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 32 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 8 }}>
          <Feather name="chevron-left" size={24} color="#113B29" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#113B29' }}>보고서 상세보기</Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* 2. 상단 배터리 이상 징후 알림 영역 */}
        <View style={{ alignItems: 'center', marginBottom: 32, marginTop: 8 }}>
          {/* 배터리 아이콘 원형 배경 */}
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
            배터리 이상 징후가 감지됐어요.
          </Text>
          <Text style={{ fontSize: 14, color: '#708679', textAlign: 'center', lineHeight: 20, fontWeight: '500' }}>
            차량 배터리 온도가 평소보다 높게 감지되었습니다.{"\n"}
            차량 충전 환경을 확인해 주시기 바랍니다.
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
            <Text style={{ color: '#113B29', fontSize: 16, fontWeight: 'bold' }}>{reportTime}</Text>
          </View>
          
          {/* 차량명 행 */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
            <Text style={{ color: '#8FA196', fontSize: 14, fontWeight: '500' }}>차량</Text>
            <Text style={{ color: '#113B29', fontSize: 16, fontWeight: 'bold' }}>{currentVehicleModel}</Text>
          </View>
          
          {/* 배터리 온도 행 */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14 }}>
            <Text style={{ color: '#8FA196', fontSize: 14, fontWeight: '500' }}>배터리 온도</Text>
            <Text style={{ color: '#113B29', fontSize: 16, fontWeight: 'bold' }}>{batteryTemperature} °C</Text>
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
            {aiAnalysisReason}
          </Text>
        </View>
        
      </ScrollView>
    </View>
  );
}