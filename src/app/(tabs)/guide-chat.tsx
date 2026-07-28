import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // 🔗 router 사용을 위한 import 추가
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
}

export default function GuideChatScreen() {
  const router = useRouter(); // 🔗 router 객체 선언
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'ai', text: '안녕하세요! 미정이 AI 충전 가이드 챗봇입니다. 무엇이 궁금하신가요?' }
  ]);
  const [input, setInput] = useState<string>('');

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
      style={{ flex: 1, backgroundColor: '#FAF9F5' }}
    >
      
      {/* 🟢 1. 상단 딥그린 헤더 바 (보내주신 구조와 100% 완벽 동기화) */}
      <View 
        style={{ 
          backgroundColor: '#113B29', 
          paddingTop: 55, 
          paddingBottom: 25, 
          paddingHorizontal: 24,
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
          zIndex: 10,
        }}
      >
        {/* 1층: 로고 영역 */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
          <Text style={{ color: '#3CD070', fontSize: 18, fontWeight: 'bold', marginRight: 4 }}>⚡</Text>
          <Text style={{ color: '#ffffff', fontSize: 15, fontWeight: 'bold', letterSpacing: 0.5, opacity: 0.9 }}>
            MijungE
          </Text>
        </View>

        {/* 2층: 뒤로가기 버튼 + 메인 타이틀 (가로로 묶기) */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity 
            onPress={() => router.push('/(tabs)/home')} // 🔗 뒤로가기 정상 작동
            style={{ 
              marginRight: 6,   // 타이틀 텍스트와의 간격
              marginLeft: -6,   // 화살표 아이콘 왼쪽 여백을 깎아서 1층 로고와 수직 라인을 맞춥니다
            }}
          >
            <Ionicons name="chevron-back" size={26} color="white" />
          </TouchableOpacity>
          
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ color: '#ffffff', fontSize: 25, fontWeight: 'bold', letterSpacing: -0.5, marginRight: 6 }}>
              AI 충전 가이드
            </Text>
            <Feather name="file-text" size={18} color="white" style={{ opacity: 0.9, marginTop: 4 }} />
          </View>
        </View>
      </View>

      {/* 💬 2. 채팅 메시지 리스트 */}
      <ScrollView 
        style={{ flex: 1, paddingHorizontal: 16 }}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 16 }}
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

      {/* 💡 3. 제안어 칩셋 탭 */}
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
        backgroundColor: 'transparent'
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
            style={{ flex: 1, fontSize: 14, color: '#1F2937', paddingVertical: 0 }} 
          />
        </View>
        
        {/* 둥근 초록색 전송 버튼 */}
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

    </KeyboardAvoidingView>
  );
}