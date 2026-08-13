import { ActivityIndicator, Linking, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Markdown from 'react-native-markdown-display';

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
            {/* AI 답변은 굵게 표시, 제목, 목록 같은 마크다운 문법으로 오기 때문에(FastApiChatClient
                응답 원문 그대로) 마크다운 파서를 거쳐 렌더링한다. 사용자 메시지, 에러 메시지는
                마크다운을 쓸 이유가 없으니 그대로 일반 텍스트로 둔다. */}
            {m.sender === 'ai' && !m.isError ? (
              <Markdown
                style={{
                  body: { fontSize: 14, color: '#1F2937', fontWeight: '500', lineHeight: 20 },
                  heading1: { fontSize: 17, fontWeight: '700', marginTop: 8, marginBottom: 4 },
                  heading2: { fontSize: 16, fontWeight: '700', marginTop: 8, marginBottom: 4 },
                  heading3: { fontSize: 15, fontWeight: '700', marginTop: 8, marginBottom: 4 },
                  strong: { fontWeight: '700' },
                  bullet_list: { marginVertical: 4 },
                  ordered_list: { marginVertical: 4 },
                  list_item: { marginVertical: 2 },
                  hr: { backgroundColor: '#B8D9B8', height: 1, marginVertical: 8 },
                  code_inline: { fontFamily: 'monospace', fontSize: 13 },
                }}
              >
                {m.text}
              </Markdown>
            ) : (
              <Text style={{ fontSize: 14, color: m.isError ? '#B3261E' : '#1F2937', fontWeight: '500', lineHeight: 20 }}>
                {m.text}
              </Text>
            )}

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
