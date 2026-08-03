import { mockDelay } from '@/api/client';
import { Report } from '@/types/report';

export async function getReports(): Promise<Report[]> {
  return mockDelay([
    {
      id: 'r1',
      title: '7월 배터리 리포트',
      summary: 'SOH 96.4% · 전월 대비 0.8%p 감소',
      createdAt: '2026-08-01',
    },
  ]);
}
