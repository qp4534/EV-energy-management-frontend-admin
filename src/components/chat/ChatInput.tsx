import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  // guide-chat 화면은 자체 입력창이 하단 탭바와 겹치는 걸 막기 위해 _layout.tsx에서
  // 탭바를 아예 숨긴다(hideTabBar). 그러면서 탭바가 대신 더해주던 안드로이드
  // 제스처바/내비게이션 바 높이(insets.bottom)도 같이 사라져서, 이 입력창이 직접
  // 더해줘야 시스템 버튼에 안 가려진다.
  const insets = useSafeAreaInsets();
  const [input, setInput] = useState<string>('');

  const handleSend = () => {
    if (!input.trim() || disabled) return;
    onSend(input);
    setInput('');
  };

  const suggestions = ['근처 충전소 탐색', '내 배터리 화재 위험도 지표'];

  return (
    <View>
      {/* 💡 제안어 칩셋 영역 */}
      <View style={{ flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 4, flexWrap: 'wrap' }}>
        {suggestions.map((sug, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => !disabled && onSend(sug)}
            disabled={disabled}
            style={{
              backgroundColor: '#FFFFFF', 
              paddingHorizontal: 14, 
              paddingVertical: 8, 
              borderRadius: 999, 
              marginRight: 8, 
              marginBottom: 8, 
              borderWidth: 1, 
              borderColor: '#E5E7EB' 
            }}
          >
            <Text style={{ fontSize: 12, color: '#4B5563', fontWeight: '500' }}>{sug}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 📥 하단 입력 및 전송 영역 */}
      <View 
        style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: (Platform.OS === 'ios' ? 24 : 16) + insets.bottom,
          backgroundColor: '#FAF9F5',
          borderTopWidth: 1, 
          borderColor: '#E5E7EB' 
        }}
      >
        {/* 인풋창 */}
        <View 
          style={{ 
            flex: 1, 
            flexDirection: 'row', 
            alignItems: 'center', 
            backgroundColor: '#FFFFFF', 
            height: 50, 
            paddingHorizontal: 16, 
            borderRadius: 999, 
            borderWidth: 1, 
            borderColor: '#E5E7EB', 
            ...Platform.select({ 
              ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3 }, 
              android: { elevation: 2 } 
            }) 
          }}
        >
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="충전 관련 궁금한 점을 물어보세요"
            placeholderTextColor="#A0A0A0"
            editable={!disabled}
            style={{
              flex: 1,
              height: '100%',
              fontSize: 14,
              color: '#1F2937',
              paddingVertical: 0,
              margin: 0
            }}
          />
        </View>

        {/* 전송 버튼 */}
        <TouchableOpacity
          onPress={handleSend}
          disabled={disabled || !input.trim()}
          style={{
            backgroundColor: '#CBE6CB',
            width: 50,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 999,
            marginLeft: 8,
            opacity: disabled ? 0.5 : 1,
            ...Platform.select({
              ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3 },
              android: { elevation: 2 }
            })
          }}
        >
          <Feather name="send" size={16} color="#113B29" />
        </TouchableOpacity>
      </View>
    </View>
  );
}