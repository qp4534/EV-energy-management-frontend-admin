import { DemandLevel } from '@/api/demand';
import { Charger } from '@/types/charger';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { ChargerListItem } from '../charger-list-item';

interface StationBottomSheetProps {
  stations: Charger[];
  isLoading: boolean;
demand?: DemandLevel | null; // 충전소별 혼잡도 배지 계산에 같이 쓰임 (charger-list-item 참고)
  onSelectStation?: (station: Charger) => void;
}

export default function StationBottomSheet({
  stations,
  isLoading,
  demand,
  onSelectStation,
}: StationBottomSheetProps) {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  return (
    <View 
      style={{ 
        position: 'absolute', 
        bottom: isOpen ? 0 : 70,
        left: 0, 
        right: 0, 
        backgroundColor: '#ffffff', 
        borderTopLeftRadius: 24, 
        borderTopRightRadius: 24, 
        paddingHorizontal: 20, 
        paddingTop: 12, 
        paddingBottom: isOpen ? 90 : 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
      }}
    >
      {/* 토글 버튼 및 주변 충전소 표시 */}
      <TouchableOpacity 
        activeOpacity={0.8}
        onPress={() => setIsOpen(!isOpen)}
        style={{ alignItems: 'center', width: '100%', paddingBottom: 10 }}
      >
        <View style={{ width: 40, height: 4, backgroundColor: '#113B29', borderRadius: 2, marginBottom: 10 }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center', paddingHorizontal: 4 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#113B29', flex: 1 }}>
            주변 충전소 ({stations.length}개)
          </Text>
          {/* 열리고 닫힘을 알려주는 화살표 아이콘 */}
          <Feather name={isOpen ? "chevron-down" : "chevron-up"} size={20} color="#113B29" />
        </View>
      </TouchableOpacity>
    
      {/* 리스트 본문 (열려있을 때만 보임) */}
      {isLoading ? (
        <ActivityIndicator size="small" color="#113B29" style={{ marginVertical: 20 }} />
      ) : (
        isOpen && (
          <ScrollView 
            showsVerticalScrollIndicator={false} 
            style={{ maxHeight: 200 }}
            contentContainerStyle={{ paddingBottom: 10 }} 
          >
            {stations.map((item, idx) => (
              <ChargerListItem
                key={item.id}
                charger={item}
                isLast={idx === stations.length - 1}
                demand={demand}
                onPress={() => onSelectStation?.(item)}
              />
            ))}
          </ScrollView>
        )
      )}
    </View>
  );
}