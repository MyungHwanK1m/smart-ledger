import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Smartphone,
  Monitor,
  Lock,
  ReceiptText,
} from 'lucide-react';

interface HeaderProps {
  currentMonth: string; // 'YYYY-MM'
  onChangeMonth: (newMonth: string) => void;
  viewMode: 'mobile' | 'desktop';
  onToggleViewMode: () => void;
  onLock: () => void;
  isRealtimeConnected: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentMonth,
  onChangeMonth,
  viewMode,
  onToggleViewMode,
  onLock,
  isRealtimeConnected,
}) => {
  const [year, month] = currentMonth.split('-').map(Number);

  const handlePrevMonth = () => {
    const prevDate = new Date(year, month - 2, 1);
    const newY = prevDate.getFullYear();
    const newM = String(prevDate.getMonth() + 1).padStart(2, '0');
    onChangeMonth(`${newY}-${newM}`);
  };

  const handleNextMonth = () => {
    const nextDate = new Date(year, month, 1);
    const newY = nextDate.getFullYear();
    const newM = String(nextDate.getMonth() + 1).padStart(2, '0');
    onChangeMonth(`${newY}-${newM}`);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* 로고 & 타이틀 */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
            <ReceiptText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-black text-slate-800 text-base sm:text-lg tracking-tight leading-none">
              스마트 가계부
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  isRealtimeConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'
                }`}
              />
              <span className="text-[10px] text-slate-400 font-semibold">
                {isRealtimeConnected ? 'Supabase 실시간 연동' : '오프라인'}
              </span>
            </div>
          </div>
        </div>

        {/* 연월 선택기 */}
        <div className="flex items-center bg-slate-100/90 rounded-2xl p-1 shadow-inner">
          <button
            onClick={handlePrevMonth}
            className="p-1 rounded-xl hover:bg-white text-slate-500 hover:text-slate-800 transition"
            title="이전 달"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-3 text-xs sm:text-sm font-bold text-slate-800 font-mono">
            {year}년 {month}월
          </span>
          <button
            onClick={handleNextMonth}
            className="p-1 rounded-xl hover:bg-white text-slate-500 hover:text-slate-800 transition"
            title="다음 달"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 우측 도구: 뷰 모드 토글 & 잠금 버튼 */}
        <div className="flex items-center gap-2">
          {/* 모바일/PC 수동 토글 버튼 */}
          <button
            onClick={onToggleViewMode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold transition shadow-sm"
            title="화면 뷰 전환"
          >
            {viewMode === 'mobile' ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden sm:inline">PC 대시보드</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden sm:inline">모바일 간편입력</span>
              </>
            )}
          </button>

          {/* PIN 잠금 */}
          <button
            onClick={onLock}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            title="가계부 잠금"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
