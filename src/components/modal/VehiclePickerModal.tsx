import { Feather } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';

interface VehicleItem {
  id: string;
  nickname?: string;
  model: string;
  plateNumber: string;
}

interface VehiclePickerModalProps {
  visible: boolean;
  onClose: () => void;
  vehicles: VehicleItem[];
  currentVehicleId?: string;
  onSelectVehicle: (id: string) => void;
  onRegisterNewVehicle: () => void;
}

export function VehiclePickerModal({
  visible,
  onClose,
  vehicles,
  currentVehicleId,
  onSelectVehicle,
  onRegisterNewVehicle,
}: VehiclePickerModalProps) {
  // 원래 index.tsx에 있던 absolute 레이아웃 조건을 그대로 유지합니다.
  if (!visible) return null;

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, zIndex: 50 }}>
      <View style={{ backgroundColor: '#ffffff', width: '100%', borderRadius: 16, padding: 20, position: 'relative' }}>
        
        {/* 닫기 X 버튼 */}
        <TouchableOpacity
          onPress={onClose}
          style={{ position: 'absolute', right: 16, top: 16, padding: 10, zIndex: 9999 }}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
          <Feather name="x" size={20} color="#AAAAAA" />
        </TouchableOpacity>

        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#113B29', marginBottom: 14 }}>
          차량 선택
        </Text>

        {/* 차량 리스트 렌더링 */}
        {vehicles.map((v) => {
          const isCurrent = v.id === currentVehicleId;
          return (
            <TouchableOpacity
              key={v.id}
              onPress={() => onSelectVehicle(v.id)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: isCurrent ? '#EDF4E6' : '#F7F9F6',
                borderWidth: 1,
                borderColor: isCurrent ? '#B2D8B2' : '#EAEFEA',
                borderRadius: 12,
                paddingVertical: 12,
                paddingHorizontal: 16,
                marginBottom: 10,
              }}
            >
              <View>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#222222' }}>
                  {v.nickname || v.model}
                </Text>
                <Text style={{ fontSize: 12, color: '#999999', marginTop: 2 }}>
                  {v.plateNumber} ({v.model})
                </Text>
              </View>
              {isCurrent && <Feather name="check" size={18} color="#113B29" />}
            </TouchableOpacity>
          );
        })}

        {/* 새 차량 등록하기 버튼 */}
        <TouchableOpacity
          onPress={onRegisterNewVehicle}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: '#B2D8B2',
            borderStyle: 'dashed',
            borderRadius: 12,
            paddingVertical: 12,
            marginTop: 4,
          }}
        >
          <Feather name="plus" size={16} color="#113B29" />
          <Text style={{ color: '#113B29', fontWeight: 'bold', fontSize: 13, marginLeft: 6 }}>
            새 차량 등록하기
          </Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}