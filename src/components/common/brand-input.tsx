import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, TextInputProps, View } from 'react-native';

import { Brand } from '@/constants/theme';

type BrandInputProps = TextInputProps & {
  icon?: 'envelope' | 'lock';
};

export function BrandInput({ icon, style, secureTextEntry, ...rest }: BrandInputProps) {
  const [isHidden, setIsHidden] = useState(secureTextEntry);

  return (
    <View style={styles.container}>
      {icon && (
        <SymbolView
          name={{
            ios: icon === 'envelope' ? 'envelope' : 'lock',
            android: icon === 'envelope' ? 'mail' : 'lock',
            web: icon === 'envelope' ? 'mail' : 'lock',
          }}
          size={18}
          tintColor={Brand.textMuted}
        />
      )}
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={Brand.textMuted}
        secureTextEntry={secureTextEntry && isHidden}
        {...rest}
      />
      {secureTextEntry && (
        <Pressable onPress={() => setIsHidden((value) => !value)} hitSlop={8}>
          <SymbolView
            name={{
              ios: isHidden ? 'eye.slash' : 'eye',
              android: isHidden ? 'visibility_off' : 'visibility',
              web: isHidden ? 'visibility_off' : 'visibility',
            }}
            size={18}
            tintColor={Brand.textMuted}
          />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: Brand.border,
    borderRadius: 10,
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: Brand.text,
  },
});
