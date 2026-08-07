import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  getTermContent,
  TERM_KEYS,
  TermIcon,
  TermKey,
  TermSection,
  TermTextBlock,
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
  if (icon === 'chart') {
    return (
      <SymbolView
        name={{ ios: 'chart.bar.fill', android: 'insights', web: 'insights' }}
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
  const { key, mode } = useLocalSearchParams<{ key: string; mode?: string }>();
  const isViewOnly = mode === 'view';
  const [activeKey, setActiveKey] = useState<TermKey>((key as TermKey) ?? TERMS[0].key);
  const setChecked = useSignupTermStore((state) => state.setChecked);

  const tabScrollRef = useRef<ScrollView>(null);
  const tabLayouts = useRef<Partial<Record<TermKey, { x: number; width: number }>>>({});
  const [tabRowWidth, setTabRowWidth] = useState(0);
  const [layoutTick, setLayoutTick] = useState(0);

  const content = getTermContent(activeKey);
  const activeIndex = TERM_KEYS.indexOf(activeKey);
  const isLast = activeIndex === TERM_KEYS.length - 1;

  useEffect(() => {
    const layout = tabLayouts.current[activeKey];
    if (!layout || !tabRowWidth) return;
    const target = Math.max(0, layout.x - (tabRowWidth - layout.width) / 2);
    tabScrollRef.current?.scrollTo({ x: target, animated: true });
  }, [activeKey, tabRowWidth, layoutTick]);

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
            <Feather name="chevron-left" size={24} color={Brand.text} />
          </Pressable>
          <Text style={styles.headerTitle}>이용약관 및 정책</Text>
        </View>

        <ScrollView
          ref={tabScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabRowContainer}
          contentContainerStyle={styles.tabRow}
          onLayout={(e) => setTabRowWidth(e.nativeEvent.layout.width)}>
          {TERMS.map((term) => {
            const active = term.key === activeKey;
            return (
              <Pressable
                key={term.key}
                onPress={() => setActiveKey(term.key)}
                onLayout={(e) => {
                  tabLayouts.current[term.key] = {
                    x: e.nativeEvent.layout.x,
                    width: e.nativeEvent.layout.width,
                  };
                  setLayoutTick((t) => t + 1);
                }}
                style={[styles.tabPill, active && styles.tabPillActive]}>
                <Text style={[styles.tabPillText, active && styles.tabPillTextActive]}>
                  {term.tabLabel}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
          <View style={styles.noticeRow}>
            {content.required ? (
              <View style={styles.requiredPill}>
                <Text style={styles.requiredPillText}>필수</Text>
              </View>
            ) : (
              <View style={styles.optionalPill}>
                <Text style={styles.optionalPillText}>선택</Text>
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

          {content.sections[0]?.type === 'article' && <View style={styles.divider} />}

          {content.sections.map((section, index) => {
            const prevSection = content.sections[index - 1];
            const showChapter =
              section.type === 'article' &&
              section.chapter &&
              (prevSection?.type !== 'article' || prevSection.chapter !== section.chapter);
            return <TermSectionView key={index} section={section} showChapter={!!showChapter} />;
          })}
        </ScrollView>

        <View style={styles.footer}>
          {isViewOnly ? (
            <Pressable style={styles.agreeButton} onPress={() => router.back()}>
              <Text style={styles.agreeButtonText}>확인</Text>
            </Pressable>
          ) : (
            <Pressable style={styles.agreeButton} onPress={handleAgreeContinue}>
              <Text style={styles.agreeButtonText}>{isLast ? '동의하고 계속하기' : '동의하고 다음 약관 보기'}</Text>
            </Pressable>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

function TermSectionView({ section, showChapter }: { section: TermSection; showChapter: boolean }) {
  if (section.type === 'paragraph') {
    return (
      <View style={styles.paragraphBlock}>
        <Text style={styles.paragraphText}>{section.body}</Text>
      </View>
    );
  }

  return (
    <View style={styles.articleBlock}>
      {showChapter && section.chapter && <Text style={styles.chapterLabel}>{section.chapter}</Text>}

      {!!section.title && (
        <View style={styles.articleHeadingRow}>
          <View style={styles.articleHeadingTag}>
            <Text style={styles.articleHeadingTagText}>{section.heading}</Text>
          </View>
          <Text style={styles.articleTitle}>{section.title}</Text>
        </View>
      )}
      {!section.title && (
        <View style={styles.articleHeadingTag}>
          <Text style={styles.articleHeadingTagText}>{section.heading}</Text>
        </View>
      )}

      {section.blocks.map((block, index) => (
        <TermBlockView key={index} block={block} />
      ))}
    </View>
  );
}

function TermBlockView({ block }: { block: TermTextBlock }) {
  if (block.kind === 'paragraph') {
    return <Text style={styles.articleBody}>{block.text}</Text>;
  }

  if (block.kind === 'bullets') {
    return (
      <View style={styles.plainBulletList}>
        {block.items.map((item, index) => (
          <View key={index} style={styles.plainBulletRow}>
            <Text style={styles.plainBulletDot}>•</Text>
            <Text style={styles.plainBulletText}>{item}</Text>
          </View>
        ))}
      </View>
    );
  }

  if (block.kind === 'iconBullets') {
    return (
      <View style={styles.bulletList}>
        {block.items.map((bullet, index) => (
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
    );
  }

  return (
    <View style={styles.tableBlock}>
      {block.rows.map((row, rowIndex) => (
        <View key={rowIndex} style={[styles.tableRow, rowIndex === 0 && styles.tableRowFirst]}>
          {row.map((cell, cellIndex) => (
            <View key={cellIndex} style={styles.tableCell}>
              <Text style={styles.tableLabel}>{block.columns[cellIndex]}</Text>
              <Text style={styles.tableValue}>{cell}</Text>
            </View>
          ))}
        </View>
      ))}
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
  tabRowContainer: {
    flexGrow: 0,
    flexShrink: 0,
    height: 56,
  },
  tabRow: {
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 8,
    paddingTop: 8,
    paddingBottom: 12,
  },
  tabPill: {
    height: 36,
    justifyContent: 'center',
    paddingHorizontal: 16,
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
  scrollArea: {
    flex: 1,
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
  optionalPill: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Brand.successBg,
  },
  optionalPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: Brand.successText,
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
  divider: {
    height: 1,
    backgroundColor: Brand.border,
  },
  articleBlock: {
    gap: 8,
  },
  chapterLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: Brand.primaryDark,
    marginTop: 6,
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
  plainBulletList: {
    gap: 6,
    marginTop: 2,
  },
  plainBulletRow: {
    flexDirection: 'row',
    gap: 6,
  },
  plainBulletDot: {
    fontSize: 13,
    lineHeight: 20,
    color: Brand.label,
  },
  plainBulletText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: Brand.textMuted,
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
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: Brand.border,
  },
  tableRowFirst: {
    borderTopWidth: 0,
  },
  tableCell: {
    gap: 4,
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
