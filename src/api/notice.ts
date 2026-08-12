import { apiClient, mockDelay, USE_MOCK } from '@/api/client';
import { Notice } from '@/types/notice';

type BackendNoticeDto = {
  noticeId: string;
  title: string;
  content: string;
  isPinned: boolean;
  createdAt: string;
  userId: string;
  isRead: boolean;
  isImportant: boolean;
  targetRole: string | null;
  viewCount: number;
  updatedAt: string | null;
};

function toNotice(dto: BackendNoticeDto): Notice {
  return {
    id: dto.noticeId,
    title: dto.title,
    content: dto.content,
    createdAt: dto.createdAt,
    isPinned: dto.isPinned,
    isImportant: dto.isImportant,
  };
}

export async function getNotices(): Promise<Notice[]> {
  if (!USE_MOCK) {
    // 백엔드가 이미 role 기준으로 스코핑해서 이용자에게 공개된 공지(전체/이용자 대상)만 내려준다.
    const { data } = await apiClient.get<BackendNoticeDto[]>('/api/notices');
    return data.map(toNotice);
  }
  return mockDelay([
    {
      id: 'n1',
      title: '서비스 점검 안내',
      content: '8월 15일 새벽 2시~4시 서비스 점검이 예정되어 있습니다. 이용에 참고 부탁드립니다.',
      createdAt: '2026-08-01',
      isPinned: true,
      isImportant: true,
    },
  ]);
}

export async function getNotice(id: string): Promise<Notice> {
  if (!USE_MOCK) {
    const { data } = await apiClient.get<BackendNoticeDto>(`/api/notices/${id}`);
    return toNotice(data);
  }
  const list = await getNotices();
  return list.find((item) => item.id === id) ?? list[0];
}
