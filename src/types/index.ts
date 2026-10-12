export type TransactionType = 'expense' | 'income';

export type PaymentMethod = '토스' | '카카오페이' | '신용카드' | '체크카드' | '계좌이체' | '현금' | '기타';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  icon: string;
  color: string;
  order_num: number;
  created_at?: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category_id?: string | null;
  category_name: string;
  payment_method: PaymentMethod;
  memo: string;
  transacted_at: string;
  created_at?: string;
}

export interface Budget {
  id: string;
  month: string; // 'YYYY-MM'
  target_amount: number;
  created_at?: string;
}

export interface MonthlyStats {
  totalExpense: number;
  totalIncome: number;
  netSavings: number;
  dailyAverageExpense: number;
  categoryBreakdown: {
    categoryName: string;
    amount: number;
    color: string;
    percentage: number;
  }[];
  dailyTrend: {
    day: string; // 'YYYY-MM-DD' or 'DD일'
    expense: number;
    income: number;
  }[];
}
