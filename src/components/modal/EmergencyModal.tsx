import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

interface EmergencyModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

export function EmergencyModal({ visible, onClose, title, message }: EmergencyModalProps) {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* 백드롭 영역 (투명도 0.4 배경) */}
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 28 }}>
        {/* 시안 전용 팝업 박스 컨테이너 */}
        <View style={{ 
          backgroundColor: 'white', 
          width: '100%', 
          borderRadius: 24, 
          padding: 24, 
          alignItems: 'center',
          position: 'relative',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 5
        }}>
          {/* 우측 상단 닫기(X) 버튼 */}
          <TouchableOpacity onPress={onClose} style={{ position: 'absolute', right: 20, top: 20, padding: 4 }}>
            <Feather name="x" size={20} color="#555555" />
          </TouchableOpacity>

          {/* 불꽃 아이콘 원형 배경 */}
          <View style={{ backgroundColor: '#FEE2E2', width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginTop: 12, marginBottom: 16 }}>
            <MaterialCommunityIcons name="fire" size={42} color="#DC2626" />
          </View>

          {/* 타이틀 및 설명 문구 - 실제로 이 팝업을 띄운 알림의 title/body를 그대로 보여준다 */}
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#DC2626', marginBottom: 12 }}>긴급 알림</Text>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#113B29', marginBottom: 8, textAlign: 'center' }}>{title}</Text>
          <Text style={{ fontSize: 14, color: '#4A6B53', textAlign: 'center', lineHeight: 22, marginBottom: 24, fontWeight: '500' }}>
            {message}
          </Text>

          {/* 하단 붉은색 확인하기 버튼 */}
          <TouchableOpacity 
            onPress={onClose}
            style={{ width: '100%', backgroundColor: '#FCA5A5', paddingVertical: 16, borderRadius: 16, alignItems: 'center' }}
          >
            <Text style={{ color: '#DC2626', fontWeight: 'bold', fontSize: 16 }}>확인하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}