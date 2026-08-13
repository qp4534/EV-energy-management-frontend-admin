export function formatDate(iso: string): string {
  const date = new Date(iso);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

// 초 단위/타임존 오프셋까지 그대로 노출하던 화면들(ReportModal, report.tsx)을 위한 표시용
// 포맷 - 분 단위까지만 보여준다.
export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${formatDate(iso)} ${hours}:${minutes}`;
}
