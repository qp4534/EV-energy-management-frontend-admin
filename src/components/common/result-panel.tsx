import { SymbolView } from 'expo-symbols';
import { Fragment, PropsWithChildren } from 'react';
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
  const [title, ...rest] = message.split('\n');
  const subtitle = rest.join('\n');

  return (
    <Fragment>
      <View style={styles.container}>
        <View style={styles.iconCircle}>
          <SymbolView
            name={{ ios: 'checkmark', android: 'check', web: 'check' }}
            size={45}
            tintColor={Brand.primaryDark}
          />
        </View>

        <View style={styles.messageGroup}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>

        {children && <View style={styles.infoBox}>{children}</View>}

        <Pressable onPress={onPrimaryPress} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>{primaryLabel}</Text>
        </Pressable>
      </View>

      {secondaryLabel && onSecondaryPress && (
        <Pressable style={styles.secondaryLinkRow} onPress={onSecondaryPress}>
          <Text style={styles.secondaryLink}>{secondaryLabel}</Text>
        </Pressable>
      )}
    </Fragment>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Brand.border,
    backgroundColor: Brand.card,
    padding: 24,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Brand.resultCheckBg,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Brand.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  messageGroup: {
    gap: 4,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: Brand.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: Brand.label,
    textAlign: 'center',
  },
  infoBox: {
    width: '100%',
    borderRadius: 12,
    backgroundColor: Brand.resultInfoBg,
    padding: 30,
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
  secondaryLinkRow: {
    alignSelf: 'flex-end',
    marginTop: 16,
  },
  secondaryLink: {
    fontSize: 13,
    fontWeight: '700',
    color: Brand.primaryDark,
    textDecorationLine: 'underline',
  },
});
