import * as chatApi from '@/api/chat';
import { BrandHeader } from '@/components/common/brand-header';
import { useAuthStore } from '@/store/auth-store';
import { useVehicleStore } from '@/store/vehicle-store';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Text, TouchableOpacity, View } from 'react-native';

import ChatInput from '@/components/chat/ChatInput';
import MessageList from '@/components/chat/MessageList';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
}

export default function GuideChatScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { vehicle } = useVehicleStore();

  const [messages, setMessages] = useState<Message[]>([]);
  // 백엔드가 conversationId를 발급해주지 않아서, 같은 대화로 이어지도록
  // 화면에 처음 진입할 때 프론트에서 하나 만들어 계속 재사용한다.
  const conversationIdRef = useRef(`conv-${Date.now()}-${Math.random().toString(36).slice(2)}`);

  // 차량 여부에 따른 초기 웰컴 메시지 세팅
  useEffect(() => {
    if (vehicle) {
      setMessages([
        { id: '1', sender: 'ai', text: '안녕하세요! 미정이 AI 충전 가이드 챗봇입니다. 무엇이 궁금하신가요?' }
      ]);
    }
  }, [vehicle]);

  const fetchAiChatbotResponse = async (userText: string) => {
    try {
      const answer = await chatApi.sendChatMessage(userText, vehicle?.id, conversationIdRef.current);
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', text: answer }]);
    } catch (e) {
      console.log("AI Chat API Error", e);
      setMessages(prev => [
        ...prev,
        { id: Date.now().toString(), sender: 'ai', text: '답변을 가져오지 못했습니다. 잠시 후 다시 시도해주세요.' },
      ]);
    }
  };

  const handleSendMessage = (text: string) => {
    const cleanText = text ? text.trim() : '';
    if (!cleanText) return; 
    
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', text: cleanText }]);  
    fetchAiChatbotResponse(cleanText);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
      style={{ flex: 1, backgroundColor: '#FAF9F5' }}
    >
      
      <BrandHeader title="AI 충전 가이드" showBack backRoute="/(tabs)/home" />

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
          <MessageList messages={messages} />
          <ChatInput onSend={handleSendMessage} />
        </>
      )}
    
    </KeyboardAvoidingView>
  );
}