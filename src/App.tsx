import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Transaction, Category, TransactionType, PaymentMethod } from './types';
import {
  supabase,
  getTransactionsByMonth,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getCategories,
  getBudgetByMonth,
  setBudgetForMonth,
} from './lib/supabase';
import { Header } from './components/Header';
import { MobileQuickInput } from './components/MobileQuickInput';
import { MobileRecentFeed } from './components/MobileRecentFeed';
import { DesktopDashboard } from './components/DesktopDashboard';
import { TransactionModal } from './components/TransactionModal';
import { PinLockModal } from './components/PinLockModal';
import { PwaInstallPrompt } from './components/PwaInstallPrompt';
import { PlusCircle, ListOrdered, Loader2 } from 'lucide-react';

export const App: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState<string>(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  });

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budget, setBudget] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRealtimeConnected, setIsRealtimeConnected] = useState<boolean>(false);

  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>(() => {
    return window.innerWidth < 1024 ? 'mobile' : 'desktop';
  });
  const [mobileTab, setMobileTab] = useState<'input' | 'feed'>('input');

  const [savedPin, setSavedPin] = useState<string | null>(() => {
    return localStorage.getItem('smart_ledger_pin');
  });
  const [isLocked, setIsLocked] = useState<boolean>(() => {
    return !!localStorage.getItem('smart_ledger_pin');
  });

  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && viewMode === 'mobile') {
        setViewMode('desktop');
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [viewMode]);

  useEffect(() => {
    async function initCategories() {
      try {
        const catList = await getCategories();
        setCategories(catList);
      } catch (err) {
        console.error('카테고리 로드 에러:', err);
      }
    }
    initCategories();
  }, []);

  // 가장 최근 조회 요청 번호: 월을 빠르게 넘길 때 늦게 도착한 이전 달 응답이 덮어쓰지 않도록 함
  const latestRequestRef = useRef(0);

  // showSpinner=false면 화면을 유지한 채 조용히 갱신 (입력 폼/필터 상태가 초기화되지 않도록)
  const fetchMonthData = useCallback(
    async (showSpinner: boolean) => {
      const requestId = ++latestRequestRef.current;
      if (showSpinner) setLoading(true);
      try {
        const [txList, budgetAmount] = await Promise.all([
          getTransactionsByMonth(currentMonth),
          getBudgetByMonth(currentMonth),
        ]);
        if (requestId !== latestRequestRef.current) return;
        setTransactions(txList);
        setBudget(budgetAmount);
      } catch (err) {
        console.error('데이터 조회 오류:', err);
      } finally {
        if (requestId === latestRequestRef.current) setLoading(false);
      }
    },
    [currentMonth]
  );

  const refreshData = useCallback(() => fetchMonthData(false), [fetchMonthData]);

  useEffect(() => {
    fetchMonthData(true);
  }, [fetchMonthData]);

  useEffect(() => {
    const channel = supabase
      .channel('public:transactions')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'transactions' },
        () => {
          refreshData();
        }
      )
      .subscribe(status => {
        setIsRealtimeConnected(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refreshData]);

  const handleCreateTx = async (txData: {
    type: TransactionType;
    amount: number;
    category_name: string;
    category_id?: string;
    payment_method: PaymentMethod;
    memo: string;
    transacted_at: string;
  }) => {
    await createTransaction(txData);
    await refreshData();
  };

  const handleUpdateTx = async (txData: Partial<Transaction>) => {
    if (!txData.id) return;
    await updateTransaction(txData.id, txData);
    await refreshData();
  };

  const handleDeleteTx = async (id: string) => {
    try {
      await deleteTransaction(id);
    } catch {
      alert('삭제 중 오류가 발생했습니다.');
      return;
    }
    await refreshData();
  };

  const handleSetBudget = async (amount: number) => {
    await setBudgetForMonth(currentMonth, amount);
    setBudget(amount);
  };

  const handleSavePin = (pin: string) => {
    localStorage.setItem('smart_ledger_pin', pin);
    setSavedPin(pin);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* PWA 설치 유도 배너 */}
      <PwaInstallPrompt />

      {/* 헤더 */}
      <Header
        currentMonth={currentMonth}
        onChangeMonth={setCurrentMonth}
        viewMode={viewMode}
        onToggleViewMode={() => setViewMode(prev => (prev === 'mobile' ? 'desktop' : 'mobile'))}
        onLock={() => setIsLocked(true)}
        isRealtimeConnected={isRealtimeConnected}
      />

      <main className="flex-1 py-3 sm:py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-2" />
            <p className="text-sm font-semibold">데이터를 동기화하는 중...</p>
          </div>
        ) : viewMode === 'mobile' ? (
          <div className="px-3 pb-24 max-w-md mx-auto">
            {mobileTab === 'input' ? (
              <MobileQuickInput
                categories={categories}
                onSubmit={handleCreateTx}
              />
            ) : (
              <MobileRecentFeed
                transactions={transactions}
                onDelete={handleDeleteTx}
                onEdit={tx => {
                  setEditingTx(tx);
                  setIsTxModalOpen(true);
                }}
              />
            )}

            {/* 모바일 하단 내비게이션 바 (Safe Area 대응) */}
            <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-100 pt-2 px-6 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] flex justify-around items-center shadow-lg">
              <button
                onClick={() => setMobileTab('input')}
                className={`flex flex-col items-center gap-1 transition active:scale-95 ${
                  mobileTab === 'input'
                    ? 'text-indigo-600 font-bold'
                    : 'text-slate-400 font-medium hover:text-slate-600'
                }`}
              >
                <PlusCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-[11px]">기록하기</span>
              </button>
              <button
                onClick={() => setMobileTab('feed')}
                className={`flex flex-col items-center gap-1 transition active:scale-95 ${
                  mobileTab === 'feed'
                    ? 'text-indigo-600 font-bold'
                    : 'text-slate-400 font-medium hover:text-slate-600'
                }`}
              >
                <ListOrdered className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-[11px]">내역 조회</span>
              </button>
            </nav>
          </div>
        ) : (
          <DesktopDashboard
            transactions={transactions}
            categories={categories}
            budget={budget}
            onSetBudget={handleSetBudget}
            onAddTransaction={() => {
              setEditingTx(null);
              setIsTxModalOpen(true);
            }}
            onEditTransaction={tx => {
              setEditingTx(tx);
              setIsTxModalOpen(true);
            }}
            onDeleteTransaction={handleDeleteTx}
            currentMonth={currentMonth}
          />
        )}
      </main>

      <TransactionModal
        isOpen={isTxModalOpen}
        onClose={() => {
          setIsTxModalOpen(false);
          setEditingTx(null);
        }}
        onSave={async data => {
          if (editingTx) {
            await handleUpdateTx(data);
          } else {
            await handleCreateTx(data as any);
          }
        }}
        transaction={editingTx}
        categories={categories}
      />

      <PinLockModal
        isOpen={isLocked}
        onSuccess={() => setIsLocked(false)}
        savedPin={savedPin}
        onSavePin={handleSavePin}
      />
    </div>
  );
};
