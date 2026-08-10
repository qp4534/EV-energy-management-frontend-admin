import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BatteryLifecycle } from '@/components/battery-lifecycle';
import { BatterySohRing } from '@/components/battery-soh-ring';
import { StatusBadge } from '@/components/common/status-badge';
import { Brand, Spacing } from '@/constants/theme';
import { useBatteryPassport } from '@/hooks/use-battery-passport';
import { formatRul, getBatteryStatus } from '@/utils/format-battery';
import { maskName } from '@/utils/format-name';

export default function BatteryPassportScreen() {
  const { user, vehicle, passport, loading } = useBatteryPassport();
  const status = passport ? getBatteryStatus(passport.rul) : null;

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.banner}>
          <View style={styles.bannerLogoRow}>
            <Text style={styles.bannerLogoBolt}>⚡</Text>
            <Text style={styles.bannerLogoText}>MijungE</Text>
          </View>
          <Text style={styles.bannerTitle}>배터리 여권</Text>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {vehicle && passport && (
            <>
              <View style={styles.card}>
                <View style={styles.summaryRow}>
                  <View style={styles.summaryIcon}>
                    <Text style={styles.summaryIconText}>🔋</Text>
                  </View>
                  <View style={styles.summaryTextColumn}>
                    <Text style={styles.summaryText}>
                      {vehicle.nickname},{'\n'}
                      {user ? maskName(user.name) : ''}님의 대표차량
                    </Text>
                    {status && <StatusBadge status={status} label={`배터리 ${status}`} />}
                  </View>
                </View>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>배터리 상태</Text>
                <View style={styles.statusRow}>
                  <View style={styles.ringColumn}>
                    <BatterySohRing soh={passport.soh} />
                  </View>
                  <View style={styles.statusRight}>
                    <View style={styles.statusRightInner}>
                      {status && <StatusBadge status={status} />}
                      <Text style={styles.rulText}>예상 잔존 수명 {formatRul(passport.rul)}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.metricsRow}>
                  <MetricChip value={`${passport.temperatureC} °C`} label="온도" />
                  <MetricChip value={`${passport.voltage}V`} label="전압" />
                  <MetricChip value={`${passport.current}V`} label="전류" />
                </View>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>배터리 생애주기</Text>
                <BatteryLifecycle events={passport.lifecycle} />
              </View>
            </>
          )}

          {vehicle && !passport && !loading && (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>아직 배터리 진단 정보가 없습니다</Text>
              <Text style={styles.emptyDesc}>
                차량 진단(열화상 촬영 또는 센서 연동)이 완료되면{'\n'}배터리 여권이 여기에 표시됩니다.
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function MetricChip({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.metricChip}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
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
  banner: {
    backgroundColor: '#113B29',
    paddingTop: 55,
    paddingBottom: 25,
    paddingHorizontal: Spacing.four,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  bannerLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  bannerLogoBolt: {
    color: '#3CD070',
    fontSize: 18,
    fontWeight: '700',
    marginRight: 4,
  },
  bannerLogoText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
    opacity: 0.9,
  },
  bannerTitle: {
    fontSize: 25,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  content: {
    paddingHorizontal: Spacing.three,
    paddingVertical: 24,
    gap: 16,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Brand.border,
    backgroundColor: Brand.card,
    padding: 16,
    gap: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Brand.text,
  },
  emptyCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Brand.border,
    backgroundColor: Brand.card,
    padding: 24,
    alignItems: 'center',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Brand.text,
  },
  emptyDesc: {
    fontSize: 13,
    color: Brand.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  summaryIcon: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 16,
    backgroundColor: Brand.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryIconText: {
    fontSize: 32,
  },
  summaryTextColumn: {
    flex: 2,
    gap: 8,
    alignItems: 'flex-start',
  },
  summaryText: {
    fontSize: 23,
    fontWeight: '700',
    color: Brand.text,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  ringColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusRight: {
    flex: 2,
    alignItems: 'flex-start',
  },
  statusRightInner: {
    gap: 8,
    alignItems: 'center',
  },
  rulText: {
    fontSize: 20,
    fontWeight: '700',
    color: Brand.label,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  metricChip: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: Brand.background,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 2,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '700',
    color: Brand.label,
  },
  metricLabel: {
    fontSize: 11,
    color: Brand.label,
  },
});
