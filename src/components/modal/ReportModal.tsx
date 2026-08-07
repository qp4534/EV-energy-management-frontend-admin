import { NotiType } from '@/types/notification';
import { Report } from '@/types/report';
import { Feather } from '@expo/vector-icons';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

interface ReportModalProps {
  visible: boolean;
  onClose: () => void;
  onDetailPress: () => void; // 자세히 보기 버튼 클릭 시 동작
  vehicleModel: string;
  plateNumber: string;
  reportData: Report & { type?: NotiType } | null;
}

export function ReportModal({ 
  visible, 
  onClose, 
  onDetailPress, 
  vehicleModel, 
  plateNumber, 
  reportData 
}: ReportModalProps) {

  // 보고서 데이터가 없으면 기본 메시지로 대체
  const reportTitle = reportData?.title || "보고서 제목 없음";
  const summaryText = reportData?.summary || "보고서 요약 내용이 없습니다.";
  const createdAt = reportData?.createdAt || "날짜 정보 없음";
  const statusType = reportData?.type || "경고";

  return (
    <Modal transparent={true} visible={visible} animationType="fade" onRequestClose={onClose}>

      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, zIndex: 50 }}>
        <View style={{ backgroundColor: '#ffffff', width: '100%', borderRadius: 16, padding: 20, alignItems: 'center', position: 'relative' }}>
          
          {/* X 닫기 버튼 */}
          <TouchableOpacity 
            onPress={onClose} 
            style={{ position: 'absolute', right: 16, top: 16, padding: 10, zIndex: 9999 }}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          >
            <Feather name="x" size={20} color="#AAAAAA" />
          </TouchableOpacity>

          {/* 타이틀 */}
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#113B29', width: '100%', textAlign: 'left', marginBottom: 14 }}>
            {reportTitle}
          </Text>
          
          {/* 내부 카드 영역 */}
          <View style={{ width: '100%', backgroundColor: '#F7F9F6', borderWidth: 1, borderColor: '#DEE5DC', borderRadius: 12, padding: 16, marginBottom: 20 }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#113B29', textAlign: 'center', marginBottom: 10 }}>
              보고서가 도착했습니다.
            </Text>
            <Text style={{ fontSize: 12, color: '#666666', lineHeight: 18, marginBottom: 14, textAlign: 'center', fontStyle: 'italic' }}>
              {summaryText}
            </Text>
            
            {/* 세부 데이터 리스트 */}
            <View style={{ borderTopWidth: 1, borderTopColor: '#E2E8E0', paddingTop: 12 }}>
              <Text style={{ fontSize: 11, color: '#999999', marginBottom: 4 }}>• 대상 차량 : {vehicleModel}</Text>
              <Text style={{ fontSize: 11, color: '#999999', marginBottom: 4 }}>• 상태 단계 : {statusType}</Text>
              <Text style={{ fontSize: 11, color: '#999999' }}>• 차량 번호 : {plateNumber}</Text>
              <Text style={{ fontSize: 11, color: '#999999' }}>• 발행 일시 : {createdAt}</Text>
            </View>
          </View>
          
          {/* 자세히 보기 버튼 */}
          <TouchableOpacity onPress={onDetailPress} style={{ width: '100%', backgroundColor: '#DCECD8', paddingVertical: 14, borderRadius: 12, alignItems: 'center' }}>
            <Text style={{ color: '#113B29', fontWeight: 'bold', fontSize: 14 }}>자세히 보기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}