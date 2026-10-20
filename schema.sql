-- ==============================================================
-- Smart Ledger (원격 가계부) Supabase 초기 데이터베이스 스키마
-- Supabase 대시보드 -> SQL Editor -> [New Query]에 붙여넣고 [Run] 실행
-- ==============================================================

-- 1. 카테고리 테이블 (categories)
create table if not exists public.categories (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    type text not null check (type in ('expense', 'income')),
    icon text default 'Tag',
    color text default '#6b7280',
    order_num integer default 0,
    created_at timestamptz default now()
);

-- 2. 거래 내역 테이블 (transactions)
create table if not exists public.transactions (
    id uuid default gen_random_uuid() primary key,
    type text not null check (type in ('expense', 'income')),
    amount integer not null check (amount > 0),
    category_id uuid references public.categories(id) on delete set null,
    category_name text not null,
    payment_method text not null default '기타',
    memo text default '',
    transacted_at timestamptz not null default now(),
    created_at timestamptz default now()
);

-- 3. 월별 예산 테이블 (budgets)
create table if not exists public.budgets (
    id uuid default gen_random_uuid() primary key,
    month text not null unique, -- 형식: 'YYYY-MM'
    target_amount integer not null default 0,
    created_at timestamptz default now()
);

-- 4. 인덱스 생성 (조회 성능 최적화)
create index if not exists idx_transactions_transacted_at on public.transactions (transacted_at desc);
create index if not exists idx_transactions_type on public.transactions (type);
create index if not exists idx_transactions_category_name on public.transactions (category_name);

-- 5. Row Level Security (RLS) 활성화 및 누구나/익명 키 접근 허용 정책
alter table public.categories enable row level security;
alter table public.transactions enable row level security;
alter table public.budgets enable row level security;

-- 기존 정책이 있을 경우 삭제 후 재생성
drop policy if exists "Allow all operations on categories" on public.categories;
create policy "Allow all operations on categories" on public.categories for all using (true) with check (true);

drop policy if exists "Allow all operations on transactions" on public.transactions;
create policy "Allow all operations on transactions" on public.transactions for all using (true) with check (true);

drop policy if exists "Allow all operations on budgets" on public.budgets;
create policy "Allow all operations on budgets" on public.budgets for all using (true) with check (true);

-- 6. Supabase Realtime (실시간 동기화) 활성화
do $$
begin
  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' and tablename = 'transactions'
  ) then
    alter publication supabase_realtime add table public.transactions;
  end if;
  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' and tablename = 'categories'
  ) then
    alter publication supabase_realtime add table public.categories;
  end if;
end $$;

-- 7. 기본 카테고리 초기 데이터 (Seed Data)
-- name에 unique 제약이 없어 on conflict로는 중복을 막을 수 없으므로,
-- 같은 이름/유형이 없을 때만 넣는다 (스크립트를 여러 번 실행해도 안전)
insert into public.categories (name, type, icon, color, order_num)
select v.name, v.type, v.icon, v.color, v.order_num
from (values
  -- 지출 카테고리
  ('식비', 'expense', 'UtensilsCrossed', '#ef4444', 1),
  ('카페/간식', 'expense', 'Coffee', '#f97316', 2),
  ('편의점/마트', 'expense', 'ShoppingCart', '#eab308', 3),
  ('교통/차량', 'expense', 'Car', '#3b82f6', 4),
  ('쇼핑/의류', 'expense', 'ShoppingBag', '#ec4899', 5),
  ('주거/통신', 'expense', 'Home', '#8b5cf6', 6),
  ('의료/건강', 'expense', 'HeartPulse', '#10b981', 7),
  ('문화/여가', 'expense', 'Film', '#06b6d4', 8),
  ('경조사/선물', 'expense', 'Gift', '#f43f5e', 9),
  ('기타지출', 'expense', 'MoreHorizontal', '#6b7280', 10),
  -- 수입 카테고리
  ('급여', 'income', 'Wallet', '#10b981', 1),
  ('부수입', 'income', 'TrendingUp', '#3b82f6', 2),
  ('용돈', 'income', 'Coins', '#f59e0b', 3),
  ('금융수익', 'income', 'PiggyBank', '#8b5cf6', 4),
  ('기타수입', 'income', 'MoreHorizontal', '#6b7280', 5)
) as v(name, type, icon, color, order_num)
where not exists (
  select 1 from public.categories c
  where c.name = v.name and c.type = v.type
);
