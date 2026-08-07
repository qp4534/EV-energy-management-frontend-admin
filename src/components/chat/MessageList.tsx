import { Platform, ScrollView, Text, View } from 'react-native';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
}

interface MessageListProps {
  messages: Message[];
}

export default function MessageList({ messages }: MessageListProps) {
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
              backgroundColor: m.sender === 'user' ? '#FFFFFF' : '#CBE6CB',
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
            <Text style={{ fontSize: 14, color: '#1F2937', fontWeight: '500', lineHeight: 20 }}>
              {m.text}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}