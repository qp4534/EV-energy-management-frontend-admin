export function formatSoh(soh: number): string {
  return `${soh.toFixed(1)}%`;
}

export function formatRul(rulYears: number): string {
  return `${rulYears}년`;
}

const WARNING_RUL_THRESHOLD_YEARS = 5;

export function getBatteryStatus(rulYears: number): '경고' | '정상' {
  return rulYears < WARNING_RUL_THRESHOLD_YEARS ? '경고' : '정상';
}
