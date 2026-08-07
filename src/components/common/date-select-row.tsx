import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BaseModal } from '@/components/common/base-modal';
import { Brand } from '@/constants/theme';

type DateSelectRowProps = {
  year: number | null;
  month: number | null;
  day: number | null;
  onChange: (value: { year: number; month: number; day: number }) => void;
};

type PickerField = 'year' | 'month' | 'day';

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 100 }, (_, i) => CURRENT_YEAR - i);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

export function DateSelectRow({ year, month, day, onChange }: DateSelectRowProps) {
  const [openField, setOpenField] = useState<PickerField | null>(null);

  const options = openField === 'year' ? YEARS : openField === 'month' ? MONTHS : DAYS;

  const handleSelect = (value: number) => {
    if (openField === 'year') onChange({ year: value, month: month ?? 1, day: day ?? 1 });
    if (openField === 'month')
      onChange({ year: year ?? CURRENT_YEAR, month: value, day: day ?? 1 });
    if (openField === 'day') onChange({ year: year ?? CURRENT_YEAR, month: month ?? 1, day: value });
    setOpenField(null);
  };

  return (
    <View style={styles.row}>
      <View style={styles.unitGroup}>
        <DateBox label={year ? `${year}` : '선택'} onPress={() => setOpenField('year')} />
        <Text style={styles.unitLabel}>년</Text>
      </View>
      <View style={styles.unitGroup}>
        <DateBox label={month ? `${month}` : '선택'} onPress={() => setOpenField('month')} />
        <Text style={styles.unitLabel}>월</Text>
      </View>
      <View style={styles.unitGroup}>
        <DateBox label={day ? `${day}` : '선택'} onPress={() => setOpenField('day')} />
        <Text style={styles.unitLabel}>일</Text>
      </View>

      <BaseModal visible={openField !== null} onClose={() => setOpenField(null)}>
        <ScrollView style={styles.optionList}>
          {options.map((value) => (
            <Pressable key={value} style={styles.optionRow} onPress={() => handleSelect(value)}>
              <Text style={styles.optionText}>{value}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </BaseModal>
    </View>
  );
}

function DateBox({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable style={styles.box} onPress={onPress}>
      <Text style={styles.boxText}>{label}</Text>
      <SymbolView
        name={{ ios: 'chevron.down', android: 'expand_more', web: 'expand_more' }}
        size={14}
        tintColor={Brand.textMuted}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  unitGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  unitLabel: {
    fontSize: 13,
    color: Brand.textMuted,
  },
  box: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Brand.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: Brand.card,
  },
  boxText: {
    fontSize: 14,
    color: Brand.text,
  },
  optionList: {
    maxHeight: 280,
    width: 160,
  },
  optionRow: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 15,
    color: Brand.text,
  },
});
