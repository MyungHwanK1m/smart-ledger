# 스마트 원격 가계부 (Smart Ledger)

Supabase 기반 실시간 연동 원격 가계부 애플리케이션입니다.
- **모바일 (PWA):** 계산기형 숫자 키패드 중심의 3초 간편 지출/수입 등록 및 최근 내역 타임라인.
- **PC 대시보드:** 월별 종합 지출/수입 통계, 카테고리별 도넛 차트, 일별 소비 추이 바 차트, 엑셀(CSV) 내보내기, 거래 내역 관리.
- **실시간(Realtime) 동기화:** 폰에서 등록하면 PC 대시보드에 즉시 반영.
- **보안:** 4자리 PIN 번호 잠금 기능 내장.
- **7일 비활성화 수면 방지:** GitHub Actions 스케줄러 포함.

---

## 1. 초기 셋업 (Supabase SQL 실행)

1. Supabase 대시보드에 접속합니다:
   - [Supabase SQL Editor 바로가기](https://supabase.com/dashboard/project/uyafrivmhhyzicbnkhet/sql/new)
2. 프로젝트 루트의 `schema.sql` 파일 내용을 복사하여 붙여넣고 우측 하단 **[Run]** 버튼을 클릭합니다.
3. 테이블(`transactions`, `categories`, `budgets`) 생성 및 기본 카테고리 시드 데이터가 즉시 주입됩니다.

---

## 2. 로컬 실행 방법

터미널에서 다음 명령어를 실행합니다:

```bash
# 의존성 설치 (기존 설치 완료됨)
npm run dev
```

브라우저에서 `http://localhost:3000` 접속!

---

## 3. 스마트폰에서 접속하는 방법

### 방법 A: 같은 집 Wi-Fi 공유기 사용 시 (로컬 테스트)
1. PC에서 `ipconfig` 명령어로 IPv4 주소 확인 (예: `192.168.0.15`)
2. `package.json`의 dev 스크립트를 `vite --host`로 실행
3. 스마트폰 브라우저에서 `http://192.168.0.15:3000` 접속

### 방법 B: Vercel 무료 배포 (영구 사용 & PWA 앱 설치 추천 ⭐)
1. 이 프로젝트를 본인의 GitHub 저장소에 푸시합니다.
2. [Vercel](https://vercel.com)에 로그인 후 GitHub 저장소를 연결하여 배포합니다.
3. 환경 변수에 다음 2가지를 입력합니다:
   - `VITE_SUPABASE_URL`: `https://uyafrivmhhyzicbnkhet.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `sb_publishable_kAi4vM-5sUepIFbvX-UGXw_B7P8woef`
4. 배포된 URL을 스마트폰 브라우저(Safari/Chrome)로 접속한 뒤 **[홈 화면에 추가]**를 누르면 스마트폰 앱처럼 설치됩니다.
