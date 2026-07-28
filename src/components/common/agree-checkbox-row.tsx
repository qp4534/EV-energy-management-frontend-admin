import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Brand } from '@/constants/theme';

type AgreeCheckboxRowProps = {
  label: string;
  checked: boolean;
  onToggle: () => void;
  bold?: boolean;
  description?: string;
  showChevron?: boolean;
};

export function AgreeCheckboxRow({
  label,
  checked,
  onToggle,
  bold = false,
  description,
  showChevron = false,
}: AgreeCheckboxRowProps) {
  return (
    <View style={styles.container}>
      <Pressable onPress={onToggle} style={styles.row}>
        <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
          {checked && (
            <SymbolView
              name={{ ios: 'checkmark', android: 'check', web: 'check' }}
              size={12}
              tintColor={Brand.primaryDark}
            />
          )}
        </View>
        <Text style={[styles.label, bold && styles.labelBold]}>{label}</Text>
        {showChevron && (
          <SymbolView
            name={{ ios: 'chevron.down', android: 'expand_more', web: 'expand_more' }}
            size={16}
            tintColor={Brand.textMuted}
            style={styles.chevron}
          />
        )}
      </Pressable>

      {description && <Text style={styles.description}>{description}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Brand.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: Brand.primary,
    borderColor: Brand.primary,
  },
  label: {
    flex: 1,
    fontSize: 14,
    color: Brand.text,
  },
  labelBold: {
    fontWeight: '700',
    fontSize: 15,
  },
  chevron: {
    marginLeft: 'auto',
  },
  description: {
    fontSize: 12,
    color: Brand.textMuted,
    paddingLeft: 28,
    lineHeight: 18,
  },
});
