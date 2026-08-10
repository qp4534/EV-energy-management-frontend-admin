import { Charger } from '@/types/charger';
import { HomeChargingGuide } from '@/utils/home-charging-guide';
import { Vehicle } from '@/types/vehicle';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

type RegisteredHomeProps = {
  vehicle: Vehicle | null;
  currentVehicleName: string;
  currentPlateNumber: string;
  chargingGuide: HomeChargingGuide;
  estimatedLife: string | null;
  batterySohProgress: number | null;
  nearbyStations: Charger[];
  handleSwitchVehicle: () => void;
};

export function RegisteredHome({
  vehicle,
  currentVehicleName,
  currentPlateNumber,
  chargingGuide,
  estimatedLife,
  batterySohProgress,
  nearbyStations,
  handleSwitchVehicle
}: RegisteredHomeProps) {
  const router = useRouter();
  const guideColors = {
    normal: { background: '#EDF4D9', foreground: '#4F6128', meta: '#718143' },
    caution: { background: '#FFF4CC', foreground: '#725A00', meta: '#8A721D' },
    warning: { background: '#FFE3C2', foreground: '#8A4300', meta: '#A45C18' },
    emergency: { background: '#FFE0E0', foreground: '#A61B1B', meta: '#B84A4A' },
    muted: { background: '#F0F2EF', foreground: '#4E5751', meta: '#737C76' },
  }[chargingGuide.tone];

  return (
    <View>
      {/* 1. 차량 관리 카드 */}
      <View style={{ backgroundColor: '#ffffff', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#EAEFEA', marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#222222', marginRight: 8 }}>
              {currentVehicleName}
            </Text> 

            <View style={{ backgroundColor: '#C2E0C2', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 }}>
              <Text style={{ color: '#113B29', fontSize: 10, fontWeight: 'bold' }}>{vehicle?.nickname || '대표 차량'}</Text> 
            </View>
            
            <TouchableOpacity 
              onPress={handleSwitchVehicle}
              style={{ backgroundColor: '#EFEFEF', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, marginLeft: 4 }}
            >
              <Text style={{ color: '#666666', fontSize: 10, fontWeight: 'bold' }}>다른 차량</Text> 
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            onPress={() => router.push('/(tabs)/vehicle')}
            style={{ backgroundColor: '#113B29', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 }}
          >
            <Text style={{ color: '#ffffff', fontSize: 10, fontWeight: 'bold' }}>+ 등록</Text> 
          </TouchableOpacity>
        </View>

        <View style={{ width: '100%', height: 140, backgroundColor: '#EFEFEF', borderRadius: 12, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ alignItems: 'center' }}>
            <MaterialCommunityIcons name="car-side" size={48} color="#BBBBBB" /> 
            <Text style={{ color: '#999999', fontSize: 11, marginTop: 4 }}>
              (이미지 준비중)
            </Text> 
          </View>
        </View>
      </View>

      {/* 2. AI 충전 가이드 카드 */}
      <View style={{ backgroundColor: '#ffffff', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#EAEFEA', marginBottom: 16 }}>
        <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#999999', marginBottom: 8 }}>AI 충전가이드</Text> 
        <View style={{ backgroundColor: guideColors.background, padding: 16, borderRadius: 12 }}>
          <Text style={{ color: guideColors.foreground, fontSize: 14, fontWeight: '700', lineHeight: 21 }}>
            {chargingGuide.headline}
          </Text>
          {chargingGuide.message && (
            <Text style={{ color: guideColors.foreground, fontSize: 13, fontWeight: '600', lineHeight: 20, marginTop: 4 }}>
              {chargingGuide.message}
            </Text>
          )}
          {chargingGuide.meta && (
            <Text style={{ color: guideColors.meta, fontSize: 11, lineHeight: 16, marginTop: 8 }}>
              {chargingGuide.meta}
            </Text>
          )}
        </View>
      </View>

      {/* 3. 배터리 진단 카드 */}
      <View style={{ backgroundColor: '#ffffff', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#EAEFEA', marginBottom: 16 }}>
        <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#999999', marginBottom: 4 }}>배터리 진단</Text>
        {estimatedLife !== null && batterySohProgress !== null ? (
          <>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#222222', marginBottom: 10 }}>
              예상 잔존 수명 {estimatedLife}년 (SOH: {Math.round(batterySohProgress * 100)}%)
            </Text>
            <View style={{ width: '100%', height: 8, backgroundColor: '#F0F4E8', borderRadius: 4, overflow: 'hidden' }}>
              <View style={{ width: `${batterySohProgress * 100}%`, height: '100%', backgroundColor: '#B2D8B2', borderRadius: 4 }} />
            </View>
          </>
        ) : (
          <Text style={{ fontSize: 13, color: '#999999', lineHeight: 18 }}>
            아직 진단 정보가 없습니다. 차량 진단이 완료되면 여기에 표시됩니다.
          </Text>
        )}
      </View>

      {/* 🟢 4. 주변 충전소 카드 */}
      <TouchableOpacity 
        onPress={() => router.push('/(tabs)/home/map')}
        activeOpacity={0.7}
        style={{ 
          backgroundColor: '#ffffff', 
          borderRadius: 16, 
          padding: 20, 
          borderWidth: 1, 
          borderColor: '#EAEFEA', 
          marginBottom: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 3,
          elevation: 2,
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#999999' }}>주변 충전소</Text> 
          <Feather name="chevron-right" size={16} color="#113B29" /> 
        </View>

        {nearbyStations.slice(0, 2).map((station, idx) => {
          const distanceDisplay = station.distanceKm < 1 
            ? `${Math.round(station.distanceKm * 1000)}m` 
            : `${station.distanceKm}km`;

          return (
            <View 
              key={station.id || idx} 
              style={{ 
                borderBottomWidth: idx === 0 ? 1 : 0, 
                borderBottomColor: '#F5F5F5', 
                paddingBottom: idx === 0 ? 10 : 0, 
                marginBottom: idx === 0 ? 10 : 0, 
                flexDirection: 'row', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Feather 
                  name="map-pin" 
                  size={14} 
                  color={station.isAvailable ? "#113B29" : "#AAAAAA"} 
                />
                <Text style={{ fontSize: 13, color: '#333333', marginLeft: 8 }}>{station.name}</Text>
              </View>
              <Text style={{ fontSize: 12, color: '#999999' }}>{distanceDisplay}</Text>
            </View>
          );
        })}
      </TouchableOpacity>
    </View>
  );
}
