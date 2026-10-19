-- ==============================================================
-- Smart Ledger 무인 자동화: 3분 중복 결제 방지 & 상호명 자동 카테고리 분류 트리거
-- Supabase 대시보드 -> SQL Editor -> [Run] 실행
-- ==============================================================

-- 1. 중복 방지 및 자동 카테고리 분류 함수
create or replace function public.process_transaction_automation()
returns trigger as $$
declare
  v_category_id uuid;
begin
  -- -------------------------------------------------------------
  -- [1단계] 정밀 중복 방지 (Deduplication)
  -- 1) 상호명(memo)이 있는 경우 (토스/카드 알림 자동화):
  --    최근 3분 이내 동일 금액 & 동일/유사 상호명이 이미 존재하면 중복 취소
  -- 2) 상호명(memo)이 없는 경우 (일반 수동 간편 입력):
  --    실수 연타(더블 클릭) 방지를 위해 10초 이내에 동일 건이 들어온 경우에만 취소
  -- -------------------------------------------------------------
  if NEW.memo is not null and trim(NEW.memo) <> '' then
    -- 상호명이 있는 알림 결제: 3분 타임 윈도우 중복 제거
    if exists (
      select 1 from public.transactions
      where amount = NEW.amount
        and type = NEW.type
        and memo is not null
        and trim(memo) <> ''
        and (
          memo = NEW.memo
          or NEW.memo like '%' || memo || '%'
          or memo like '%' || NEW.memo || '%'
        )
        and transacted_at >= (NEW.transacted_at - interval '3 minutes')
        and transacted_at <= (NEW.transacted_at + interval '3 minutes')
    ) then
      return null; -- 중복 결제 알림 드롭
    end if;
  else
    -- 상호명이 없는 수동 입력: 더블클릭 연타만 방지 (10초 타임 윈도우)
    if exists (
      select 1 from public.transactions
      where amount = NEW.amount
        and type = NEW.type
        and (memo is null or trim(memo) = '')
        and transacted_at >= (NEW.transacted_at - interval '10 seconds')
        and transacted_at <= (NEW.transacted_at + interval '10 seconds')
    ) then
      return null; -- 연타 더블클릭 드롭
    end if;
  end if;

  -- -------------------------------------------------------------
  -- [2단계] 상호명(memo) 기반 자동 카테고리 분류 (지출인 경우)
  -- -------------------------------------------------------------
  if NEW.type = 'expense' and (NEW.category_name is null or NEW.category_name = '' or NEW.category_name in ('기타', '기타지출')) then
    if NEW.memo ~* '(스타벅스|이디야|투썸|메가커피|빽다방|컴포즈|커피|카페|디저트|베이커리|파리바게|뚜레쥬르|배스킨|공차|설빙)' then
      NEW.category_name := '카페/간식';
    elsif NEW.memo ~* '(식당|식사|김밥|국밥|짜장|치킨|피자|버거|맥도날드|롯데리아|버거킹|배달의민족|요기요|쿠팡이츠|한식|중식|일식|고기|고깃집|돈까스|분식|마라탕|스시|우동|라면)' then
      NEW.category_name := '식비';
    elsif NEW.memo ~* '(cu|gs25|세븐일레븐|이마트24|미니스톱|마트|편의점|홈플러스|이마트|다이소|코스트코|노브랜드|하나로마트|슈퍼|마켓)' then
      NEW.category_name := '편의점/마트';
    elsif NEW.memo ~* '(교통|지하철|버스|택시|카카오t|카카오택시|티머니|코레일|srf|철도|주유|gs칼텍스|sk에너지|s-oil|오일|하이패스|주차|쏘카|그린카)' then
      NEW.category_name := '교통/차량';
    elsif NEW.memo ~* '(올리브영|쿠팡|네이버페이|무신사|지그재그|에이블리|백화점|쇼핑|유니클로|자라|스파오|패션|아울렛)' then
      NEW.category_name := '쇼핑/의류';
    elsif NEW.memo ~* '(병원|약국|의원|치과|안과|이비인후과|내과|한의원|건강|정형외과|피부과)' then
      NEW.category_name := '의료/건강';
    elsif NEW.memo ~* '(관리비|월세|도시가스|한전|전기세|수도세|kt|skt|lgu|알뜰폰|통신요금)' then
      NEW.category_name := '주거/통신';
    elsif NEW.memo ~* '(cgv|메가박스|롯데시네마|넷플릭스|유튜브|디즈니|노래방|볼링|골프|pc방|티켓|공연|전시)' then
      NEW.category_name := '문화/여가';
    else
      NEW.category_name := '기타지출';
    end if;
  end if;

  -- 카테고리 ID 매핑 (있을 경우)
  if NEW.category_name is not null then
    select id into v_category_id from public.categories where name = NEW.category_name limit 1;
    if v_category_id is not null then
      NEW.category_id := v_category_id;
    end if;
  end if;

  return NEW;
end;
$$ language plpgsql;

-- 2. 트리거 연결 (기존 트리거 삭제 후 생성)
drop trigger if exists trg_transaction_automation on public.transactions;
create trigger trg_transaction_automation
before insert on public.transactions
for each row execute function public.process_transaction_automation();
