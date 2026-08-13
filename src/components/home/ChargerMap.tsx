import { Charger } from '@/types/charger';
import { Feather } from '@expo/vector-icons';
import { Platform, Text, View } from 'react-native';

// 웹 브라우저 튕김 방지용 네이티브 지도 동적 컴포넌트 처리
let MapView: any = View;
let Marker: any = View;
let PROVIDER_GOOGLE: string | undefined;
if (Platform.OS !== 'web') {
  try {
    const Maps = require('react-native-maps');
    MapView = Maps.default;
    Marker = Maps.Marker;
    PROVIDER_GOOGLE = Maps.PROVIDER_GOOGLE;
  } catch (e) {
    console.error('네이티브 지도 라이브러리를 로드하지 못했습니다.', e);
  }
}

interface ChargerMapProps {
  mapRef: React.RefObject<any>;
  currentLocation: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  stations: Charger[];
}

export default function ChargerMap({ mapRef, currentLocation, stations }: ChargerMapProps) {
  if (Platform.OS === 'web') {
    return (
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#E2EFE0', justifyContent: 'center', alignItems: 'center' }}>
        <Feather name="map" size={64} color="#A3C9A8" style={{ opacity: 0.5 }} />
        <Text style={{ color: '#7FA885', fontSize: 13, marginTop: 12, fontWeight: 'bold' }}>
          모바일 기기(Expo Go)에서 지도가 표시됩니다.
        </Text>
      </View>
    );
  }

  return (
    <MapView
      ref={mapRef}
      provider={PROVIDER_GOOGLE}
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      initialRegion={currentLocation}
      showsUserLocation={true}
      showsMyLocationButton={true}
    >
      {stations.map((station) => (
        <Marker
          key={station.id}
          coordinate={{ 
            latitude: station.latitude, 
            longitude: station.longitude 
          }}
          title={station.name}
          description={station.isAvailable ? '이용 가능' : '이용 불가'}
          pinColor={station.isAvailable ? '#3CD070' : '#FF924A'}
        />
      ))}
    </MapView>
  );
}