// 프로필 사진/차량 사진 업로드가 공통으로 쓰는 helper. 실제 파일 바이트는 백엔드를 거치지
// 않고 발급받은 presigned URL로 클라이언트가 S3에 직접 PUT한다 (Authorization 헤더가 붙으면
// S3가 서명 불일치로 거부하므로 apiClient가 아닌 순수 fetch를 사용).
export function guessImageContentType(uri: string): string {
  const ext = uri.split('.').pop()?.toLowerCase();
  if (ext === 'png') return 'image/png';
  if (ext === 'webp') return 'image/webp';
  return 'image/jpeg';
}

export async function putImageToPresignedUrl(
  uploadUrl: string,
  localUri: string,
  contentType: string
): Promise<void> {
  const file = await fetch(localUri);
  const blob = await file.blob();
  const response = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': contentType },
    body: blob,
  });
  if (!response.ok) {
    // fetch는 4xx/5xx에도 정상적으로 resolve하므로, 상태 코드를 직접 확인하지 않으면
    // S3 업로드가 실패해도 모르고 넘어가서 존재하지 않는 URL을 그대로 저장하게 된다.
    throw new Error(`S3 업로드 실패 (${response.status})`);
  }
}
