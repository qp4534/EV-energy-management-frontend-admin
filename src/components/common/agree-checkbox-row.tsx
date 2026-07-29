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
  onPressDetail?: () => void;
};

export function AgreeCheckboxRow({
  label,
  checked,
  onToggle,
  bold = false,
  description,
  showChevron = false,
  onPressDetail,
}: AgreeCheckboxRowProps) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Pressable onPress={onToggle} style={styles.rowTap} hitSlop={4}>
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
        </Pressable>
        {showChevron && (
          <Pressable onPress={onPressDetail ?? onToggle} hitSlop={8} style={styles.chevron}>
            <SymbolView
              name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
              size={16}
              tintColor={Brand.textMuted}
            />
          </Pressable>
        )}
      </View>

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
  },
  rowTap: {
    flex: 1,
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
