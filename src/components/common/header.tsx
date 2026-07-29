import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Spacing } from '@/constants/theme';

type HeaderProps = {
  title: string;
  showBack?: boolean;
  titleColor?: string;
  align?: 'center' | 'left';
  backgroundColor?: string;
};

export function Header({ 
  title, 
  showBack = false, 
  titleColor = '#113B29', 
  align = 'center', 
  backgroundColor = '#F9F9F6' 
}: HeaderProps) {

  // 왼쪽 정렬 헤더 레이아웃
  if (align === 'left') {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        {showBack && (
          <Pressable 
            onPress={() => router.back()} 
            hitSlop={Spacing.two}
            style={styles.backButton}
          >
            <Feather name="chevron-left" size={24} color={titleColor} />
          </Pressable>
        )}
        <Text
          style={[styles.titleLeft, { color: titleColor }]}
          numberOfLines={1}
        >
          {title}
        </Text>
      </View>
    );
  }

  // 중앙 정렬 헤더 레이아웃 
  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* 왼쪽 백버튼 영역 */}
      <View style={styles.side}>
        {showBack && (
          <Pressable 
            onPress={() => router.back()} 
            hitSlop={Spacing.two}
            style={styles.backButton}
          >
            <Feather name="chevron-left" size={24} color={titleColor} />
          </Pressable>
        )}
      </View>

      {/* 중앙 타이틀 영역 */}
      <View style={styles.titleContainer}>
        <Text
          style={[styles.title, { color: titleColor }]}
          numberOfLines={1}
        >
          {title}
        </Text>
      </View>

      {/* 오른쪽 대칭용 빈 영역 */}
      <View style={styles.side} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60, 
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 4,
  },
  side: {
    width: 32, 
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18, 
    fontWeight: '700', 
    textAlign: 'center',
  },
  titleLeft: {
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 4,
  },
});

