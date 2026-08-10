import { apiClient, mockDelay, USE_MOCK } from '@/api/client';
import { useAuthStore } from '@/store/auth-store';
import { NotiType, Notification } from '@/types/notification';

type BackendCarDto = { carId: string; userId: string };

type BackendAnomalyLogDto = {
  anomalyId: string;
  abnormalType: string;
  triggerValue: string | null;
  detectedAt: string;
  riskLevel: NotiType;
  carId: string | null;
};

type BackendAiReportDto = {
  reportId: string;
  title: string;
  reportData: Record<string, unknown> | null;
  reportType: string | null;
  createdAt: string;
  carId: string | null;
  anomalyId: string | null;
  isRead: boolean;
};

function toNotificationFromReport(report: BackendAiReportDto, riskLevel?: NotiType): Notification {
  const body =
    report.reportData && typeof report.reportData.summary === 'string'
      ? (report.reportData.summary as string)
      : `${report.reportType ?? '리포트'}가 도착했습니다.`;
  return {
    id: report.reportId,
    title: report.title,
    body,
    isRead: report.isRead,
    createdAt: report.createdAt,
    type: riskLevel ?? '정상',
    hasReport: true,
  };
}

function toNotificationFromAnomaly(anomaly: BackendAnomalyLogDto): Notification {
  return {
    id: anomaly.anomalyId,
    title: `${anomaly.abnormalType} 감지`,
    body: anomaly.triggerValue ? `측정값: ${anomaly.triggerValue}` : '이상 징후가 감지되었습니다.',
    // ANOMALY_LOGS 테이블에 읽음 상태 컬럼이 없어 항상 false로 둔다.
    isRead: false,
    createdAt: anomaly.detectedAt,
    type: anomaly.riskLevel,
    hasReport: false,
  };
}

// anomaly-logs(원시 이상감지)와 ai-reports(발행된 리포트)를 하나의 알림 피드로 합친다.
// 이미 리포트가 나온 이상감지는 리포트 쪽 항목으로만 노출하고 중복 표시하지 않는다.
async function fetchMergedNotifications(): Promise<Notification[]> {
  const userId = useAuthStore.getState().user?.id;
  const [{ data: cars }, { data: anomalies }, { data: reports }] = await Promise.all([
    apiClient.get<BackendCarDto[]>('/api/cars'),
    apiClient.get<BackendAnomalyLogDto[]>('/api/anomaly-logs'),
    apiClient.get<BackendAiReportDto[]>('/api/ai-reports'),
  ]);

  // /api/cars와 마찬가지로 anomaly-logs·ai-reports도 로그인 사용자로 필터링되지 않아
  // 내 차량의 carId 집합으로 한 번 더 거른다.
  const myCarIds = new Set(cars.filter((car) => car.userId === userId).map((car) => car.carId));
  const myAnomalies = anomalies.filter((a) => a.carId && myCarIds.has(a.carId));
  const myReports = reports.filter((r) => r.carId && myCarIds.has(r.carId));

  const anomalyById = new Map(myAnomalies.map((a) => [a.anomalyId, a]));
  const reportedAnomalyIds = new Set(
    myReports.map((r) => r.anomalyId).filter((id): id is string => Boolean(id))
  );

  const fromReports = myReports.map((report) =>
    toNotificationFromReport(
      report,
      report.anomalyId ? anomalyById.get(report.anomalyId)?.riskLevel : undefined
    )
  );
  const fromAnomalies = myAnomalies
    .filter((a) => !reportedAnomalyIds.has(a.anomalyId))
    .map(toNotificationFromAnomaly);

  return [...fromReports, ...fromAnomalies].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getNotifications(): Promise<Notification[]> {
  if (!USE_MOCK) {
    return fetchMergedNotifications();
  }
  return mockDelay([
    {
      id: 'n1',
      title: '배터리 리포트 도착',
      body: '7월 배터리 리포트를 확인해보세요.',
      isRead: false,
      createdAt: '2026-08-01',
      type: '경고',
      hasReport: true
    },
    {
      id: 'n2',
      title: '배터리 고온 위험 긴급 알림',
      body: '현재 배터리 온도가 매우 높습니다. 즉시 안전한 곳에 주차하세요.',
      isRead: false,
      createdAt: '2026-07-27',
      type: '긴급',
      hasReport: false
    },
  ]);
}

export async function getNotification(id: string): Promise<Notification> {
  if (!USE_MOCK) {
    const list = await fetchMergedNotifications();
    const found = list.find((item) => item.id === id);
    if (!found) {
      throw new Error('NOTIFICATION_NOT_FOUND');
    }
    return found;
  }
  const list = await getNotifications();
  return list.find((item) => item.id === id) ?? list[0];
}
