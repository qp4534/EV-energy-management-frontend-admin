import { apiClient, mockDelay, USE_MOCK } from '@/api/client';
import { Report } from '@/types/report';

type BackendAiReportDto = {
  reportId: string;
  title: string;
  reportData: Record<string, unknown> | null;
  reportType: string | null;
  createdAt: string;
};

function toReport(dto: BackendAiReportDto): Report {
  const summaryFromData =
    dto.reportData && typeof dto.reportData.summary === 'string'
      ? (dto.reportData.summary as string)
      : undefined;
  return {
    id: dto.reportId,
    title: dto.title,
    summary: summaryFromData ?? dto.reportType ?? '',
    createdAt: dto.createdAt,
  };
}

export async function getReports(): Promise<Report[]> {
  if (!USE_MOCK) {
    // 백엔드가 이미 role 기준으로 스코핑해서 이용자에게는 본인 차량 보고서만 내려준다.
    const { data } = await apiClient.get<BackendAiReportDto[]>('/api/ai-reports');
    return data.map(toReport);
  }
  return mockDelay([
    {
      id: 'r1',
      title: '7월 배터리 리포트',
      summary: 'SOH 96.4% · 전월 대비 0.8%p 감소',
      createdAt: '2026-08-01',
    },
  ]);
}

export async function getReport(id: string): Promise<Report> {
  if (!USE_MOCK) {
    const { data } = await apiClient.get<BackendAiReportDto>(`/api/ai-reports/${id}`);
    return toReport(data);
  }
  const list = await getReports();
  return list.find((item) => item.id === id) ?? list[0];
}
