import React from 'react';
import { Transaction } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { Trash2, Edit2, TrendingDown, TrendingUp, Calendar } from 'lucide-react';

interface MobileRecentFeedProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onEdit: (tx: Transaction) => void;
}

export const MobileRecentFeed: React.FC<MobileRecentFeedProps> = ({
  transactions,
  onDelete,
  onEdit,
}) => {
  const grouped = transactions.reduce<Record<string, Transaction[]>>((acc, tx) => {
    const dateKey = tx.transacted_at.slice(0, 10);
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(tx);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const formatDateLabel = (dateStr: string) => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const d = new Date(dateStr);
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()];

    if (dateStr === todayStr) {
      return `오늘 (${month}월 ${day}일, ${dayOfWeek})`;
    }
    return `${month}월 ${day}일 (${dayOfWeek})`;
  };

  return (
    <div className="flex flex-col h-full max-w-md mx-auto bg-white rounded-3xl p-4 shadow-sm border border-slate-100 overflow-y-auto">
      {/* 상단 미니 서머리 */}
      <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-2xl mb-4 border border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <TrendingDown className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block">총 지출</span>
            <span className="text-sm font-bold text-rose-600">{totalExpense.toLocaleString()}원</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block">총 수입</span>
            <span className="text-sm font-bold text-emerald-600">{totalIncome.toLocaleString()}원</span>
          </div>
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <Calendar className="w-12 h-12 mb-3 stroke-1 text-slate-300" />
          <p className="text-sm font-medium">이번 달 등록된 내역이 없습니다.</p>
          <p className="text-xs text-slate-400 mt-1">[기록하기] 탭에서 지출을 등록해보세요.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {sortedDates.map(dateKey => {
            const list = grouped[dateKey];
            const dayExpense = list
              .filter(t => t.type === 'expense')
              .reduce((sum, t) => sum + t.amount, 0);

            return (
              <div key={dateKey} className="space-y-2">
                <div className="flex justify-between items-center px-1 text-xs font-bold text-slate-500">
                  <span>{formatDateLabel(dateKey)}</span>
                  {dayExpense > 0 && (
                    <span className="text-rose-500 font-semibold">
                      -{dayExpense.toLocaleString()}원
                    </span>
                  )}
                </div>

                <div className="space-y-1.5">
                  {list.map(tx => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/70 hover:bg-slate-100/80 transition border border-slate-100"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                            tx.type === 'expense'
                              ? 'bg-rose-50 text-rose-600'
                              : 'bg-emerald-50 text-emerald-600'
                          }`}
                        >
                          <CategoryIcon name={tx.category_name} className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-sm text-slate-800">{tx.category_name}</span>
                            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-slate-200/70 text-slate-600">
                              {tx.payment_method}
                            </span>
                          </div>
                          {tx.memo && (
                            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{tx.memo}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono font-bold text-sm ${
                            tx.type === 'expense' ? 'text-rose-600' : 'text-emerald-600'
                          }`}
                        >
                          {tx.type === 'expense' ? '-' : '+'}
                          {tx.amount.toLocaleString()}원
                        </span>
                        <div className="flex items-center gap-1 opacity-60 hover:opacity-100 transition">
                          <button
                            onClick={() => onEdit(tx)}
                            className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-white"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('이 내역을 삭제하시겠습니까?')) {
                                onDelete(tx.id);
                              }
                            }}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-white"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
