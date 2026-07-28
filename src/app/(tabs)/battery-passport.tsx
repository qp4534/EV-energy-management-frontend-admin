import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BatteryLifecycle } from '@/components/battery-lifecycle';
import { BatterySohRing } from '@/components/battery-soh-ring';
import { BrandMark } from '@/components/common/brand-mark';
import { StatusBadge } from '@/components/common/status-badge';
import { Brand } from '@/constants/theme';
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
                  <Text style={styles.summaryText}>
                    {vehicle.nickname},{'\n'}
                    {user ? maskName(user.name) : ''}님의 대표차량
                  </Text>
                </View>
                {status && <StatusBadge status={status} />}
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>배터리 상태</Text>
                <View style={styles.statusRow}>
                  <BatterySohRing soh={passport.soh} />
                  <View style={styles.statusRight}>
                    {status && <StatusBadge status={status} />}
                    <Text style={styles.rulText}>예상 잔존 수명 {formatRul(passport.rul)}</Text>
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
    paddingHorizontal: 24,
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
    padding: 24,
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
    fontSize: 15,
    fontWeight: '700',
    color: Brand.text,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  summaryIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Brand.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryIconText: {
    fontSize: 20,
  },
  summaryText: {
    fontSize: 15,
    fontWeight: '700',
    color: Brand.text,
    flex: 1,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  statusRight: {
    gap: 8,
    alignItems: 'flex-start',
  },
  rulText: {
    fontSize: 14,
    fontWeight: '700',
    color: Brand.text,
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
    color: Brand.text,
  },
  metricLabel: {
    fontSize: 11,
    color: Brand.textMuted,
  },
});
