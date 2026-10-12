import React, { useState, useEffect, useCallback } from 'react';
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
import { PlusCircle, ListOrdered, Loader2 } from 'lucide-react';

export const App: React.FC = () => {
  // ê¸°ë³¸ ?°ì›” ?¤ì • (?„ì¬ ?œì : 2026??10??
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

  // ë·?ëª¨ë“œ ë°?ëª¨ë°”????(?”ë©´ ?¬ê¸° ê¸°ë°˜ ?ë™ ê°ì?)
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>(() => {
    return window.innerWidth < 1024 ? 'mobile' : 'desktop';
  });
  const [mobileTab, setMobileTab] = useState<'input' | 'feed'>('input');

  // PIN ë³´ì•ˆ ? ê¸ˆ ?íƒœ
  const [savedPin, setSavedPin] = useState<string | null>(() => {
    return localStorage.getItem('smart_ledger_pin');
  });
  const [isLocked, setIsLocked] = useState<boolean>(() => {
    return !!localStorage.getItem('smart_ledger_pin');
  });

  // ê±°ë˜ ?˜ì • ëª¨ë‹¬ ?íƒœ
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  // ?”ë©´ ë¦¬ì‚¬?´ì¦ˆ ê°ì?
  useEffect(() => {
    const handleResize = () => {
      // ?¬ìš©?ê? ?˜ë™?¼ë¡œ ë°”ê¾¸ì§€ ?Šì? ê²½ìš°???œí•´ ?ë™ ë°˜ì˜
      if (window.innerWidth >= 1024 && viewMode === 'mobile') {
        setViewMode('desktop');
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [viewMode]);

  // ì¹´í…Œê³ ë¦¬ ë¶ˆëŸ¬?¤ê¸°
  useEffect(() => {
    async function initCategories() {
      try {
        const catList = await getCategories();
        setCategories(catList);
      } catch (err) {
        console.error('ì¹´í…Œê³ ë¦¬ ë¡œë“œ ?ëŸ¬:', err);
      }
    }
    initCategories();
  }, []);

  // ê±°ë˜ ?´ì—­ ë°??ˆì‚° ë¶ˆëŸ¬?¤ê¸°
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [txList, budgetAmount] = await Promise.all([
        getTransactionsByMonth(currentMonth),
        getBudgetByMonth(currentMonth),
      ]);
      setTransactions(txList);
      setBudget(budgetAmount);
    } catch (err) {
      console.error('?°ì´??ì¡°íšŒ ?¤ë¥˜:', err);
    } finally {
      setLoading(false);
    }
  }, [currentMonth]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Supabase Realtime ?¤ì‹œê°??™ê¸°??êµ¬ë…
  useEffect(() => {
    const channel = supabase
      .channel('public:transactions')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'transactions' },
        payload => {
          console.log('?¤ì‹œê°?ë³€ê²?ê°ì?:', payload);
          // ë³€ê²?ê°ì? ??ì¦‰ì‹œ ëª©ë¡ ë¦¬í”„?ˆì‹œ
          getTransactionsByMonth(currentMonth).then(setTransactions);
        }
      )
      .subscribe(status => {
        setIsRealtimeConnected(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentMonth]);

  // ?¸ë“¤??ëª¨ìŒ
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
    await loadData();
  };

  const handleUpdateTx = async (txData: Partial<Transaction>) => {
    if (!txData.id) return;
    await updateTransaction(txData.id, txData);
    await loadData();
  };

  const handleDeleteTx = async (id: string) => {
    await deleteTransaction(id);
    await loadData();
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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1. ?ë‹¨ ê¸€ë¡œë²Œ ?¤ë” */}
      <Header
        currentMonth={currentMonth}
        onChangeMonth={setCurrentMonth}
        viewMode={viewMode}
        onToggleViewMode={() => setViewMode(prev => (prev === 'mobile' ? 'desktop' : 'mobile'))}
        onLock={() => setIsLocked(true)}
        isRealtimeConnected={isRealtimeConnected}
      />

      {/* 2. ë©”ì¸ ì»¨í…ì¸??ì—­ */}
      <main className="flex-1 py-4 sm:py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-2" />
            <p className="text-sm font-semibold">?°ì´?°ë? ?™ê¸°?”í•˜??ì¤?..</p>
          </div>
        ) : viewMode === 'mobile' ? (
          /* ================= ëª¨ë°”??ë·?================= */
          <div className="px-4 pb-20">
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

            {/* ëª¨ë°”???˜ë‹¨ ?´ë¹„ê²Œì´??ë°?*/}
            <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-100 py-2 px-6 flex justify-around items-center shadow-lg">
              <button
                onClick={() => setMobileTab('input')}
                className={`flex flex-col items-center gap-1 transition ${
                  mobileTab === 'input'
                    ? 'text-indigo-600 font-bold'
                    : 'text-slate-400 font-medium hover:text-slate-600'
                }`}
              >
                <PlusCircle className="w-6 h-6" />
                <span className="text-[11px]">ê¸°ë¡?˜ê¸°</span>
              </button>
              <button
                onClick={() => setMobileTab('feed')}
                className={`flex flex-col items-center gap-1 transition ${
                  mobileTab === 'feed'
                    ? 'text-indigo-600 font-bold'
                    : 'text-slate-400 font-medium hover:text-slate-600'
                }`}
              >
                <ListOrdered className="w-6 h-6" />
                <span className="text-[11px]">?´ì—­ ì¡°íšŒ</span>
              </button>
            </nav>
          </div>
        ) : (
          /* ================= PC ?°ìŠ¤?¬íƒ‘ ë·?================= */
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

      {/* ê±°ë˜ ?´ì—­ ì¶”ê? / ?˜ì • ëª¨ë‹¬ */}
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

      {/* ë³´ì•ˆ PIN ? ê¸ˆ ëª¨ë‹¬ */}
      <PinLockModal
        isOpen={isLocked}
        onSuccess={() => setIsLocked(false)}
        savedPin={savedPin}
        onSavePin={handleSavePin}
      />
    </div>
  );
};
