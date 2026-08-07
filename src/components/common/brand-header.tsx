import { Spacing } from '@/constants/theme';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type BrandHeaderProps = {
  title: string;
  showBack?: boolean;
  backRoute?: string;
  rightIcon?: 'file' | 'bell' | 'none';
  onRightPress?: () => void;
};

export function BrandHeader({
  title,
  showBack = false,
  backRoute,
  rightIcon = 'none',
  onRightPress,
}: BrandHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (backRoute) {
      router.push(backRoute as any);
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      {/* 🟢 상단 로고 바 (알림 버튼 분기 포함) */}
      <View style={styles.logoRow}>
        <View style={styles.logoLeft}>
          <Text style={styles.logoEmoji}>⚡</Text>
          <Text style={styles.logoText}>MijungE</Text>
        </View>

        {/* 홈 화면처럼 상단 로고 옆에 알림 아이콘이 붙는 경우 */}
        {rightIcon === 'bell' && (
          <Pressable onPress={onRightPress} hitSlop={Spacing.two}>
            <Feather name="bell" size={22} color="white" style={styles.iconOpacity} />
          </Pressable>
        )}
      </View>

      {/* 🟢 하단 타이틀 및 액션 바 (파일 버튼 분기 포함) */}
      <View style={styles.contentRow}>
        <View style={styles.leftSection}>
          {showBack && (
            <Pressable onPress={handleBack} hitSlop={Spacing.two} style={styles.backButton}>
              <Ionicons name="chevron-back" size={26} color="white" />
            </Pressable>
          )}
          <Text style={styles.mainTitle} numberOfLines={1}>
            {title}
          </Text>
        </View>

        {/* 가이드 화면처럼 타이틀 옆에 파일 아이콘이 붙는 경우 */}
        {rightIcon === 'file' && (
          <Pressable onPress={onRightPress} hitSlop={Spacing.two} style={styles.rightButton}>
            <Feather name="file-text" size={20} color="white" style={styles.iconOpacity} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#113B29',
    paddingTop: 55,
    paddingBottom: 25,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    zIndex: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  logoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoEmoji: {
    color: '#3CD070',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 4,
  },
  logoText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    opacity: 0.9,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: 6,
    marginLeft: -6,
  },
  mainTitle: {
    color: '#ffffff',
    fontSize: 25,
    fontWeight: 'bold',
    letterSpacing: -0.5,
    flex: 1,
  },
  rightButton: {
    padding: 4,
  },
  iconOpacity: {
    opacity: 0.9,
  },
});