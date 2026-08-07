import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface ChatInputProps {
  onSend: (text: string) => void;
}

export default function ChatInput({ onSend }: ChatInputProps) {
  const [input, setInput] = useState<string>('');

  const handleSend = () => {
    if (!input.trim()) return;
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
            onPress={() => onSend(sug)} 
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
          paddingBottom: Platform.OS === 'ios' ? 24 : 16, 
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
          style={{ 
            backgroundColor: '#CBE6CB', 
            width: 50, 
            height: 50, 
            justifyContent: 'center', 
            alignItems: 'center', 
            borderRadius: 999, 
            marginLeft: 8, 
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