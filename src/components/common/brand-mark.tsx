import { SymbolView } from 'expo-symbols';
import { StyleSheet, Text, View } from 'react-native';

import { Brand } from '@/constants/theme';

type BrandMarkProps = {
  size?: 'small' | 'large';
  tone?: 'dark' | 'light';
};

export function BrandMark({ size = 'large', tone = 'dark' }: BrandMarkProps) {
  const iconSize = size === 'large' ? 28 : 20;
  const color = tone === 'light' ? '#FFFFFF' : Brand.primaryDark;

  return (
    <View style={styles.row}>
      <SymbolView
        name={{ ios: 'bolt.fill', android: 'bolt', web: 'bolt' }}
        size={iconSize}
        tintColor={color}
      />
      <Text style={[styles.text, size === 'large' && styles.large, { color }]}>MijungE</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: '800',
    color: Brand.primaryDark,
  },
  large: {
    fontSize: 24,
  },
});
