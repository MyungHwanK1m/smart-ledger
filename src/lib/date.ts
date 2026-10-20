// ==========================================
// 날짜 유틸 (기기 로컬 시간대 기준)
// transacted_at은 실제 시각(UTC ISO)으로 저장되므로,
// 화면 표시/집계용 날짜는 반드시 로컬 시간대로 변환해서 사용한다.
// ==========================================

const pad = (n: number) => String(n).padStart(2, '0');

/** 로컬 시간대 기준 'YYYY-MM-DD' */
export function toLocalDateKey(input: string | Date = new Date()): string {
  const d = typeof input === 'string' ? new Date(input) : input;
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** 'YYYY-MM-DD'를 로컬 자정 Date로 파싱 */
export function parseLocalDateKey(dateKey: string): Date {
  const [y, m, d] = dateKey.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/**
 * 선택한 날짜(dateKey)에 timeSource(기본: 현재)의 시각을 붙여 transacted_at(ISO)을 만든다.
 * 오늘 날짜 + 기본값이면 결과는 현재 시각과 같다.
 */
export function buildTransactedAt(dateKey: string, timeSource: Date = new Date()): string {
  const base = parseLocalDateKey(dateKey);
  base.setHours(
    timeSource.getHours(),
    timeSource.getMinutes(),
    timeSource.getSeconds(),
    timeSource.getMilliseconds()
  );
  return base.toISOString();
}

/** 'YYYY-MM' 월의 로컬 시간대 기준 [시작, 익월 시작) ISO 범위 */
export function getLocalMonthRange(yearMonth: string): { start: string; end: string } {
  const [year, month] = yearMonth.split('-').map(Number);
  return {
    start: new Date(year, month - 1, 1).toISOString(),
    end: new Date(year, month, 1).toISOString(),
  };
}
