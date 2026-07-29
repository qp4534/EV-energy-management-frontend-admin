import { router, useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  getTermContent,
  TERM_KEYS,
  TermIcon,
  TermKey,
  TermSection,
  TERMS,
} from '@/constants/terms-content';
import { Brand } from '@/constants/theme';
import { useSignupTermStore } from '@/store/signup-term-store';

const CARD_BG = '#F6F3E7';
const NOTICE_BG = '#F1EEE1';

function BulletIcon({ icon }: { icon: TermIcon }) {
  if (icon === 'flame') {
    return (
      <SymbolView
        name={{ ios: 'flame.fill', android: 'local_fire_department', web: 'local_fire_department' }}
        size={14}
        tintColor={Brand.label}
      />
    );
  }
  if (icon === 'battery') {
    return (
      <SymbolView
        name={{ ios: 'battery.100', android: 'battery_full', web: 'battery_full' }}
        size={14}
        tintColor={Brand.label}
      />
    );
  }
  if (icon === 'location') {
    return (
      <SymbolView
        name={{ ios: 'mappin.circle.fill', android: 'location_on', web: 'location_on' }}
        size={14}
        tintColor={Brand.label}
      />
    );
  }
  return (
    <SymbolView
      name={{ ios: 'ellipsis.circle.fill', android: 'more_horiz', web: 'more_horiz' }}
      size={14}
      tintColor={Brand.label}
    />
  );
}

export default function TermDetailScreen() {
  const { key } = useLocalSearchParams<{ key: string }>();
  const [activeKey, setActiveKey] = useState<TermKey>((key as TermKey) ?? TERMS[0].key);
  const setChecked = useSignupTermStore((state) => state.setChecked);

  const content = getTermContent(activeKey);
  const activeIndex = TERM_KEYS.indexOf(activeKey);
  const isLast = activeIndex === TERM_KEYS.length - 1;

  const handleAgreeContinue = () => {
    setChecked(activeKey, true);
    const nextKey = TERM_KEYS[activeIndex + 1];
    if (nextKey) {
      setActiveKey(nextKey);
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backButton}>
            <SymbolView
              name={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }}
              size={20}
              tintColor={Brand.text}
            />
          </Pressable>
          <Text style={styles.headerTitle}>이용약관 및 정책</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabRow}>
          {TERMS.map((term) => {
            const active = term.key === activeKey;
            return (
              <Pressable
                key={term.key}
                onPress={() => setActiveKey(term.key)}
                style={[styles.tabPill, active && styles.tabPillActive]}>
                <Text style={[styles.tabPillText, active && styles.tabPillTextActive]}>
                  {term.tabLabel}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.noticeRow}>
            {content.required && (
              <View style={styles.requiredPill}>
                <Text style={styles.requiredPillText}>필수</Text>
              </View>
            )}
            <View style={styles.agreedAtPill}>
              <SymbolView
                name={{ ios: 'clock', android: 'schedule', web: 'schedule' }}
                size={12}
                tintColor={Brand.textMuted}
              />
              <Text style={styles.agreedAtText}>{content.agreedAtNotice}</Text>
            </View>
          </View>

          {content.sections.map((section, index) => (
            <TermSectionView key={index} section={section} />
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <Pressable style={styles.agreeButton} onPress={handleAgreeContinue}>
            <Text style={styles.agreeButtonText}>{isLast ? '동의하고 계속하기' : '동의하고 다음 약관 보기'}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

function TermSectionView({ section }: { section: TermSection }) {
  if (section.type === 'paragraph') {
    return (
      <View style={styles.paragraphBlock}>
        <Text style={styles.paragraphText}>{section.body}</Text>
      </View>
    );
  }

  if (section.type === 'table') {
    return (
      <View style={styles.tableBlock}>
        {section.rows.map((row, index) => (
          <View key={row.label} style={[styles.tableRow, index === 0 && styles.tableRowFirst]}>
            <Text style={styles.tableLabel}>{row.label}</Text>
            <Text style={styles.tableValue}>{row.value}</Text>
          </View>
        ))}
      </View>
    );
  }

  return (
    <View style={styles.articleBlock}>
      <View style={styles.articleHeadingRow}>
        <View style={styles.articleHeadingTag}>
          <Text style={styles.articleHeadingTagText}>{section.heading}</Text>
        </View>
        <Text style={styles.articleTitle}>{section.title}</Text>
      </View>

      {section.body && <Text style={styles.articleBody}>{section.body}</Text>}

      {section.bullets && (
        <View style={styles.bulletList}>
          {section.bullets.map((bullet, index) => (
            <View key={index} style={styles.bulletCard}>
              {bullet.icon && (
                <View style={styles.bulletIconWrap}>
                  <BulletIcon icon={bullet.icon} />
                </View>
              )}
              <Text style={styles.bulletText}>{bullet.text}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Brand.background,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Brand.text,
  },
  tabRow: {
    paddingHorizontal: 20,
    gap: 8,
    paddingBottom: 12,
  },
  tabPill: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: '#F1F1EA',
  },
  tabPillActive: {
    backgroundColor: Brand.primaryDark,
  },
  tabPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: Brand.textMuted,
  },
  tabPillTextActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 20,
  },
  noticeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  requiredPill: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Brand.warningBg,
  },
  requiredPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: Brand.warningText,
  },
  agreedAtPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: NOTICE_BG,
  },
  agreedAtText: {
    fontSize: 12,
    fontWeight: '600',
    color: Brand.textMuted,
  },
  articleBlock: {
    gap: 8,
  },
  articleHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  articleHeadingTag: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: Brand.successBg,
  },
  articleHeadingTagText: {
    fontSize: 12,
    fontWeight: '800',
    color: Brand.successText,
  },
  articleTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Brand.text,
  },
  articleBody: {
    fontSize: 13,
    lineHeight: 20,
    color: Brand.textMuted,
  },
  bulletList: {
    gap: 8,
    marginTop: 2,
  },
  bulletCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 14,
    backgroundColor: CARD_BG,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  bulletIconWrap: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  bulletText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: Brand.text,
  },
  paragraphBlock: {
    gap: 4,
  },
  paragraphText: {
    fontSize: 13,
    lineHeight: 20,
    color: Brand.textMuted,
  },
  tableBlock: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Brand.border,
    overflow: 'hidden',
  },
  tableRow: {
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: Brand.border,
  },
  tableRowFirst: {
    borderTopWidth: 0,
  },
  tableLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: Brand.label,
  },
  tableValue: {
    fontSize: 13,
    lineHeight: 19,
    color: Brand.text,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  agreeButton: {
    borderRadius: 999,
    backgroundColor: Brand.primaryDark,
    paddingVertical: 16,
    alignItems: 'center',
  },
  agreeButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
