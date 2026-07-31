import { Feather } from '@expo/vector-icons';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

interface ReportModalProps {
  visible: boolean;
  onClose: () => void;
  onDetailPress: () => void; // 자세히 보기 버튼 클릭 시 동작
  vehicleModel: string;
  plateNumber: string;
  summaryText: string;
}

export function ReportModal({ 
  visible, 
  onClose, 
  onDetailPress, 
  vehicleModel, 
  plateNumber, 
  summaryText 
}: ReportModalProps) {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* 백드롭 영역 */}
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, zIndex: 50 }}>
        {/* 팝업 박스 컨테이너 (둥근 모서리 16) */}
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
            보고서 알림
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
              <Text style={{ fontSize: 11, color: '#999999', marginBottom: 4 }}>• 상태 단계 : 경고 (배터리 이상 징후)</Text>
              <Text style={{ fontSize: 11, color: '#999999' }}>• 차량 번호 : {plateNumber}</Text>
            </View>
          </View>
          
          {/* 자세히 보기 버튼 */}
          <TouchableOpacity 
            onPress={onDetailPress}
            style={{ width: '100%', backgroundColor: '#DCECD8', paddingVertical: 14, borderRadius: 12, alignItems: 'center' }}
          >
            <Text style={{ color: '#113B29', fontWeight: 'bold', fontSize: 14 }}>자세히 보기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}