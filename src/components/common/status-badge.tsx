import { StyleSheet, Text, View } from 'react-native';

import { Brand } from '@/constants/theme';

type StatusBadgeProps = {
  status: '경고' | '정상';
  label?: string;
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const isWarning = status === '경고';

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: isWarning ? Brand.warningBg : Brand.successBg },
      ]}>
      <Text style={[styles.text, { color: isWarning ? Brand.warningText : Brand.successText }]}>
        {label ?? status}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  text: {
    fontSize: 13,
    fontWeight: '700',
  },
});
