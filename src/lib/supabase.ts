import { createClient } from '@supabase/supabase-js';
import { Transaction, Category, Budget } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase URL 또는 Anon Key가 설정되지 않았습니다. .env 파일을 확인해주세요.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ==========================================
// 거래 내역 (Transactions) API
// ==========================================

export async function getTransactionsByMonth(yearMonth: string): Promise<Transaction[]> {
  // yearMonth format: 'YYYY-MM'
  const startDate = `${yearMonth}-01T00:00:00.000Z`;
  
  // 익월 1일 계산
  const [year, month] = yearMonth.split('-').map(Number);
  const nextMonthDate = new Date(Date.UTC(year, month, 1));
  const endDate = nextMonthDate.toISOString();

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .gte('transacted_at', startDate)
    .lt('transacted_at', endDate)
    .order('transacted_at', { ascending: false });

  if (error) {
    console.error('거래 내역 조회 실패:', error);
    throw error;
  }
  return data || [];
}

export async function createTransaction(transaction: Omit<Transaction, 'id' | 'created_at'>): Promise<Transaction> {
  const { data, error } = await supabase
    .from('transactions')
    .insert([transaction])
    .select()
    .single();

  if (error) {
    console.error('거래 내역 생성 실패:', error);
    throw error;
  }
  return data;
}

export async function updateTransaction(id: string, updates: Partial<Transaction>): Promise<Transaction> {
  const { data, error } = await supabase
    .from('transactions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('거래 내역 수정 실패:', error);
    throw error;
  }
  return data;
}

export async function deleteTransaction(id: string): Promise<void> {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('거래 내역 삭제 실패:', error);
    throw error;
  }
}

// ==========================================
// 카테고리 (Categories) API
// ==========================================

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('order_num', { ascending: true });

  if (error) {
    console.error('카테고리 목록 조회 실패:', error);
    throw error;
  }
  return data || [];
}

// ==========================================
// 예산 (Budgets) API
// ==========================================

export async function getBudgetByMonth(yearMonth: string): Promise<number> {
  const { data, error } = await supabase
    .from('budgets')
    .select('target_amount')
    .eq('month', yearMonth)
    .maybeSingle();

  if (error) {
    console.error('예산 조회 실패:', error);
    return 0;
  }
  return data?.target_amount || 0;
}

export async function setBudgetForMonth(yearMonth: string, amount: number): Promise<void> {
  const { error } = await supabase
    .from('budgets')
    .upsert({ month: yearMonth, target_amount: amount }, { onConflict: 'month' });

  if (error) {
    console.error('예산 설정 실패:', error);
    throw error;
  }
}
