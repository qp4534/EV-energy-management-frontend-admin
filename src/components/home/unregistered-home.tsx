import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export function UnregisteredHome() {
  const router = useRouter();

  return (
    <View>
      <View style={{ backgroundColor: '#ffffff', borderRadius: 16, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: '#EAEFEA', marginBottom: 20 }}>
        <View style={{ width: 96, height: 96, backgroundColor: '#F5F9F4', borderRadius: 48, justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
          <MaterialCommunityIcons name="car-multiple" size={48} color="#8FBC8F" /> 
        </View>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#222222', textAlign: 'center', marginBottom: 8, lineHeight: 22 }}>
          환영합니다!{'\n'}차량을 가지고 계신가요?
        </Text> 
        <Text style={{ fontSize: 12, color: '#666666', textAlign: 'center', marginBottom: 20, lineHeight: 18 }}>
          지금 차량 종류와 차량 번호를 등록하시면 차량 화재 감지 및 배터리 관리 서비스를 이용할 수 있습니다.
        </Text> 
        
        <TouchableOpacity 
          onPress={() => router.push('/(tabs)/vehicle')} 
          style={{ width: '100%', backgroundColor: '#B2D8B2', paddingVertical: 14, borderRadius: 12, alignItems: 'center' }}
        >
          <Text style={{ color: '#113B29', fontWeight: 'bold', fontSize: 14 }}>차량 등록하기</Text> 
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingHorizontal: 4 }}>
        <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#222222' }}>이용 가능 서비스</Text> 
      </View>
      
      {['화재 위험 감지', 'AI 충전 가이드', '배터리 진단'].map((service, idx) => (
        <View key={idx} style={{ backgroundColor: '#ffffff', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#EAEFEA', marginBottom: 10 }}>
          <Feather name="plus-circle" size={18} color="#113B29" /> 
          <Text style={{ fontSize: 14, fontWeight: '500', color: '#444444', marginLeft: 12 }}>{service}</Text> 
        </View>
      ))}
    </View>
  );
}