import { SymbolView } from 'expo-symbols';
import { StyleSheet, Text, View } from 'react-native';

const ACCENT = '#2ED9A3';
const SUBTITLE_COLOR = '#7FA08F';

export function SplashContent() {
  return (
    <View style={styles.content}>
      <SymbolView
        name={{ ios: 'bolt.fill', android: 'bolt', web: 'bolt' }}
        size={32}
        tintColor={ACCENT}
      />
      <Text style={styles.title}>MijungE</Text>
      <Text style={styles.subtitle}>@EV energy management platform</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 4,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: SUBTITLE_COLOR,
  },
});
