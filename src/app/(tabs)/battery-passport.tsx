import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BatteryLifecycle } from '@/components/battery-lifecycle';
import { BatterySohRing } from '@/components/battery-soh-ring';
import { BrandMark } from '@/components/common/brand-mark';
import { StatusBadge } from '@/components/common/status-badge';
import { Brand, Spacing } from '@/constants/theme';
import { useBatteryPassport } from '@/hooks/use-battery-passport';
import { formatRul, getBatteryStatus } from '@/utils/format-battery';
import { maskName } from '@/utils/format-name';

export default function BatteryPassportScreen() {
  const { user, vehicle, passport } = useBatteryPassport();
  const status = passport ? getBatteryStatus(passport.rul) : null;

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.banner}>
          <BrandMark tone="light" size="small" />
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
    backgroundColor: Brand.primaryDark,
    paddingHorizontal: Spacing.three,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 8,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: '800',
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
