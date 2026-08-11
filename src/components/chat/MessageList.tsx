import { ActivityIndicator, Linking, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { ChatSource } from '@/types/chat';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  sources?: ChatSource[];
  isError?: boolean;
}

interface MessageListProps {
  messages: Message[];
  isSending?: boolean;
}

export default function MessageList({ messages, isSending = false }: MessageListProps) {
  return (
    <ScrollView
      style={{ flex: 1, paddingHorizontal: 16 }}
      contentContainerStyle={{ paddingTop: 16, paddingBottom: 16 }}
      showsVerticalScrollIndicator={false}
    >
      {messages.map(m => (
        <View
          key={m.id}
          style={{
            flexDirection: 'row',
            marginBottom: 16,
            justifyContent: m.sender === 'user' ? 'flex-end' : 'flex-start'
          }}
        >
          <View
            style={{
              padding: 16,
              borderRadius: 16,
              maxWidth: '80%',
              backgroundColor: m.isError ? '#FFE5E5' : m.sender === 'user' ? '#FFFFFF' : '#CBE6CB',
              borderWidth: m.sender === 'user' ? 1 : 0,
              borderColor: '#E5E7EB',
              borderTopRightRadius: m.sender === 'user' ? 0 : 16,
              borderTopLeftRadius: m.sender === 'user' ? 16 : 0,
              ...Platform.select({
                ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
                android: { elevation: 1 }
              })
            }}
          >
            <Text style={{ fontSize: 14, color: m.isError ? '#B3261E' : '#1F2937', fontWeight: '500', lineHeight: 20 }}>
              {m.text}
            </Text>

            {/* AI 답변의 근거가 된 자료 목록 (RAG 출처) */}
            {m.sources && m.sources.length > 0 && (
              <View style={{ marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#B8D9B8' }}>
                <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#4B5563', marginBottom: 4 }}>
                  참고 자료
                </Text>
                {m.sources.slice(0, 3).map((source, idx) => {
                  const label = `${source.title}${source.clause ? ` · ${source.clause}` : ''}`;
                  const key = source.chunkId ?? `${source.title}-${idx}`;
                  if (source.url) {
                    return (
                      <TouchableOpacity key={key} onPress={() => Linking.openURL(source.url as string)}>
                        <Text style={{ fontSize: 11, color: '#113B29', textDecorationLine: 'underline', marginBottom: 2 }}>
                          {label}
                        </Text>
                      </TouchableOpacity>
                    );
                  }
                  return (
                    <Text key={key} style={{ fontSize: 11, color: '#4B5563', marginBottom: 2 }}>
                      {label}
                    </Text>
                  );
                })}
              </View>
            )}
          </View>
        </View>
      ))}

      {isSending && (
        <View style={{ flexDirection: 'row', marginBottom: 16, justifyContent: 'flex-start' }}>
          <View
            style={{
              paddingVertical: 14,
              paddingHorizontal: 16,
              borderRadius: 16,
              borderTopLeftRadius: 0,
              backgroundColor: '#CBE6CB',
            }}
          >
            <ActivityIndicator size="small" color="#113B29" />
          </View>
        </View>
      )}
    </ScrollView>
  );
}
