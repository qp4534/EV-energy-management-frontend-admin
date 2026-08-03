import { BrandHeader } from '@/components/common/brand-header';
import { useAuthStore } from '@/store/auth-store';
import { useVehicleStore } from '@/store/vehicle-store';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
}

export default function GuideChatScreen() {
  const router = useRouter(); 
  
  const { user } = useAuthStore();
  const { vehicle } = useVehicleStore(); 

  const userName = user?.name || '사용자';
  const vehicleName = vehicle?.model || '차량'; 

  // 초기 메세지 구성
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');

  // 차량 여부에 따른 초기 웰컴 메시지 세팅
  useEffect(() => {
    if (vehicle) {
      setMessages([
        { id: '1', sender: 'ai', text: '안녕하세요! 미정이 AI 충전 가이드 챗봇입니다. 무엇이 궁금하신가요?' }
      ]);
    }
  }, [vehicle]);
  
  // AI 챗봇 API 연동 시뮬레이션 함수
  const fetchAiChatbotResponse = async (userText: string) => {
    try {
      // API 응답을 시뮬레이션하기 위해 약간의 딜레이 후 AI 메시지 추가
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          id: Date.now().toString(), 
          sender: 'ai', 
          text: `[AI 챗봇 연동 완료] 입력하신 "${userText}" 분석에 따른 최적의 배터리 충전 가이드라인입니다.` 
        }]);
      }, 500);
    } catch (e) {
      console.log("AI Chat API Error", e);
    }
  };

  const handleSendMessage = (text: string) => {
    const cleanText = text ? text.trim() : '';
    if (!cleanText) return; // 빈 메시지 전송 방지
    
    // 1. 유저 메시지 먼저 화면에 추가
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', text: cleanText }]);  
    // 2. AI 응답 함수 호출
    fetchAiChatbotResponse(cleanText);
    // 3. 입력창 초기화
    setInput('');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
      style={{ flex: 1, backgroundColor: '#FAF9F5' }}
    >
      
      <BrandHeader 
        title="AI 충전 가이드" 
        showBack 
        backRoute="/(tabs)/home" 
      />

      {/* 🛑 차량이 없을 경우 보여줄 UI 분기 */}
      {!vehicle ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 }}>
          <Feather name="alert-circle" size={48} color="#999999" style={{ marginBottom: 16 }} />
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#222222', textAlign: 'center', marginBottom: 8 }}>
            등록된 차량이 없습니다.
          </Text>
          <Text style={{ fontSize: 13, color: '#666666', textAlign: 'center', marginBottom: 24, lineHeight: 18 }}>
            AI 맞춤형 충전 가이드를 이용하시려면{"\n"}먼저 차량을 등록해 주세요!
          </Text>
          
          <TouchableOpacity 
            onPress={() => router.push('/(tabs)/vehicle')} 
            style={{ 
              backgroundColor: '#113B29', 
              paddingHorizontal: 24, 
              paddingVertical: 12, 
              borderRadius: 12 
            }}
          >
            <Text style={{ color: '#ffffff', fontSize: 14, fontWeight: 'bold' }}>차량 등록하러 가기</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* 💬 채팅 메시지 리스트 */}
          <ScrollView 
            style={{ flex: 1, paddingHorizontal: 16 }}
            contentContainerStyle={{ paddingTop: 16, paddingBottom: 16 }}
            showsVerticalScrollIndicator={false}
          >
            {messages.map(m => (
              <View key={m.id} style={{ flexDirection: 'row', marginBottom: 16, justifyContent: m.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                <View 
                  style={{ 
                    padding: 16, 
                    borderRadius: 16, 
                    maxWidth: '80%', 
                    backgroundColor: m.sender === 'user' ? '#FFFFFF' : '#CBE6CB',
                    borderWidth: m.sender === 'user' ? 1 : 0,
                    borderColor: '#E5E7EB',
                    borderTopRightRadius: m.sender === 'user' ? 0 : 16,
                    borderTopLeftRadius: m.sender === 'user' ? 16 : 0,
                    ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 }, android: { elevation: 1 } })
                  }}
                >
                  <Text style={{ fontSize: 14, color: '#1F2937', fontWeight: '500', lineHeight: 20 }}>{m.text}</Text>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* 💡 제안어 칩셋 탭 */}
          <View style={{ flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 4, flexWrap: 'wrap' }}>
            {['근처 완속 충전소 탐색', '내 배터리 화재 위험도 지표'].map((sug, i) => (
              <TouchableOpacity 
                key={i} 
                onPress={() => handleSendMessage(sug)} 
                style={{ 
                  backgroundColor: '#FFFFFF', 
                  paddingHorizontal: 14, 
                  paddingVertical: 8, 
                  borderRadius: 999, 
                  marginRight: 8, 
                  marginBottom: 8, 
                  borderWidth: 1, 
                  borderColor: '#E5E7EB',
                }}
              >
                <Text style={{ fontSize: 12, color: '#4B5563', fontWeight: '500' }}>{sug}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* 📥 4. 하단 입력창 및 전송 버튼 영역 */}
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            paddingHorizontal: 16, 
            paddingTop: 8, 
            paddingBottom: Platform.OS === 'ios' ? 24 : 16, 
            backgroundColor: '#FAF9F5', 
            borderTopWidth: 1,
            borderColor: '#E5E7EB',
          }}>
            {/* 인풋창 */}
            <View style={{ 
              flex: 1, 
              flexDirection: 'row', 
              alignItems: 'center', 
              backgroundColor: '#FFFFFF', 
              height: 50, 
              paddingHorizontal: 16, 
              borderRadius: 999, 
              borderWidth: 1, 
              borderColor: '#E5E7EB',
              ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3 }, android: { elevation: 2 } })
            }}>
              <TextInput 
                value={input} 
                onChangeText={setInput} 
                placeholder="충전 관련 궁금한 점을 물어보세요" 
                placeholderTextColor="#A0A0A0"
                style={{ 
                  flex: 1, 
                  height: '100%', 
                  fontSize: 14, 
                  color: '#1F2937', 
                  paddingVertical: 0,
                  margin: 0,
                }} 
              />
            </View>
            
            {/* 전송 버튼 */}
            <TouchableOpacity 
              onPress={() => handleSendMessage(input)} 
              style={{ 
                backgroundColor: '#CBE6CB', 
                width: 50, 
                height: 50, 
                justifyContent: 'center', 
                alignItems: 'center', 
                borderRadius: 999, 
                marginLeft: 8,
                ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3 }, android: { elevation: 2 } })
              }}
            >
              <Feather name="send" size={16} color="#113B29" />
            </TouchableOpacity>
          </View>
        </>
      )}
    
    </KeyboardAvoidingView>
  );
}