import * as chatApi from '@/api/chat';
import { BrandHeader } from '@/components/common/brand-header';
import { useAuthStore } from '@/store/auth-store';
import { useVehicleStore } from '@/store/vehicle-store';
import { ChatSource } from '@/types/chat';
import { Feather } from '@expo/vector-icons';
import { isAxiosError } from 'axios';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Text, TouchableOpacity, View } from 'react-native';

import ChatInput from '@/components/chat/ChatInput';
import MessageList from '@/components/chat/MessageList';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  sources?: ChatSource[];
  isError?: boolean;
}

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  sender: 'ai',
  text: '안녕하세요! 미정이 AI 충전 가이드 챗봇입니다. 무엇이 궁금하신가요?',
};

function createConversationId() {
  return `conv-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function chatErrorMessage(error: unknown): string {
  if (isAxiosError<{ message?: string }>(error)) {
    if (error.response?.status === 401) {
      return '로그인 정보가 만료되었습니다. 다시 로그인한 뒤 이용해주세요.';
    }
    if (error.code === 'ECONNABORTED') {
      return '답변 생성 시간이 길어지고 있습니다. 잠시 후 다시 질문해주세요.';
    }
    return error.response?.data?.message ?? '현재 챗봇에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.';
  }
  return '현재 챗봇에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.';
}

export default function GuideChatScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { vehicle } = useVehicleStore();

  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  // 백엔드가 conversationId를 발급해주지 않아서, 같은 대화로 이어지도록 프론트에서 하나
  // 만들어 재사용한다. "대화 초기화"를 누르면 새 id를 발급해 완전히 새 대화로 취급한다.
  const [conversationId, setConversationId] = useState(createConversationId);

  // 차량 여부에 따른 초기 웰컴 메시지 세팅
  useEffect(() => {
    if (vehicle) {
      setMessages([WELCOME_MESSAGE]);
    }
  }, [vehicle]);

  const resetConversation = () => {
    setMessages([WELCOME_MESSAGE]);
    setConversationId(createConversationId());
  };

  const fetchAiChatbotResponse = async (userText: string) => {
    setIsSending(true);
    try {
      const { answer, sources } = await chatApi.sendChatMessage(userText, vehicle?.id, conversationId);
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', text: answer, sources }]);
    } catch (e) {
      setMessages(prev => [
        ...prev,
        { id: Date.now().toString(), sender: 'ai', text: chatErrorMessage(e), isError: true },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleSendMessage = (text: string) => {
    const cleanText = text ? text.trim() : '';
    if (!cleanText || isSending) return;

    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', text: cleanText }]);
    fetchAiChatbotResponse(cleanText);
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
        rightIcon={vehicle ? 'refresh' : 'none'}
        onRightPress={resetConversation}
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
          <MessageList messages={messages} isSending={isSending} />
          <ChatInput onSend={handleSendMessage} disabled={isSending} />
        </>
      )}
    
    </KeyboardAvoidingView>
  );
}