import { SymbolView } from 'expo-symbols';
import { PropsWithChildren } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Brand } from '@/constants/theme';

type ResultPanelProps = PropsWithChildren<{
  message: string;
  primaryLabel: string;
  onPrimaryPress: () => void;
  secondaryLabel?: string;
  onSecondaryPress?: () => void;
}>;

export function ResultPanel({
  message,
  primaryLabel,
  onPrimaryPress,
  secondaryLabel,
  onSecondaryPress,
  children,
}: ResultPanelProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <SymbolView
          name={{ ios: 'checkmark', android: 'check', web: 'check' }}
          size={28}
          tintColor={Brand.primaryDark}
        />
      </View>

      <Text style={styles.message}>{message}</Text>

      {children && <View style={styles.infoBox}>{children}</View>}

      <Pressable onPress={onPrimaryPress} style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>{primaryLabel}</Text>
      </Pressable>

      {secondaryLabel && onSecondaryPress && (
        <Pressable onPress={onSecondaryPress}>
          <Text style={styles.secondaryLink}>{secondaryLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 16,
    paddingVertical: 24,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    fontSize: 15,
    fontWeight: '600',
    color: Brand.text,
    textAlign: 'center',
  },
  infoBox: {
    width: '100%',
    borderRadius: 12,
    backgroundColor: Brand.background,
    borderWidth: 1,
    borderColor: Brand.border,
    padding: 16,
    gap: 4,
    alignItems: 'center',
  },
  primaryButton: {
    width: '100%',
    borderRadius: 999,
    backgroundColor: Brand.primary,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Brand.primaryDark,
  },
  secondaryLink: {
    fontSize: 13,
    color: Brand.textMuted,
    textDecorationLine: 'underline',
  },
});
