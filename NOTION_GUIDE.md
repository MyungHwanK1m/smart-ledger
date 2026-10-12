# 📘 스마트 원격 가계부 (Smart Ledger) - 어디서나 사용 설명서

> **한 줄 요약:**  
> Supabase 클라우드 기반 24시간 실시간 연동 가계부입니다.  
> 집 PC 서버를 켤 필요 없이, **스마트폰(PWA 앱)** 및 **다른 PC(회사, 노트북)** 어디서나 바로 사용할 수 있습니다.

---

## 🔗 원클릭 바로가기 & 다운로드

| 구분 | 링크 | 설명 |
| :--- | :--- | :--- |
| **📱 스마트폰 PWA 앱 접속** | [https://myunghwank1m.github.io/smart-ledger/](https://myunghwank1m.github.io/smart-ledger/) | **보안 경고 0건**, 브라우저 접속 후 [홈 화면에 추가] 누르면 즉시 앱 설치 |
| **🖥️ PC용 실행 프로그램** | [SmartLedger.exe 다운로드](https://github.com/MyungHwanK1m/smart-ledger/releases/download/v1.0.1/SmartLedger.exe) | 설치 불필요, 더블클릭 즉시 실행 (윈도우 포터블) |
| **📦 GitHub 통합 릴리즈** | [GitHub Releases v1.0.1](https://github.com/MyungHwanK1m/smart-ledger/releases/tag/v1.0.1) | 최신 빌드 파일 배포 페이지 |
| **💻 GitHub 소스코드** | [MyungHwanK1m/smart-ledger](https://github.com/MyungHwanK1m/smart-ledger) | 전체 소스코드 저장소 |
| **☁️ Supabase 클라우드** | [Supabase 콘솔 바로가기](https://supabase.com/dashboard/project/uyafrivmhhyzicbnkhet) | 24시간 가계부 데이터베이스 |

---

## 📱 1. 스마트폰에서 앱으로 설치하고 쓰는 방법 (PWA ⭐)

> 💡 **보안 경고가 전혀 없는 정식 HTTPS 웹 앱(PWA) 방식입니다.**

1. 스마트폰(갤럭시/아이폰) 브라우저로 아래 주소에 접속합니다:  
   👉 **[https://myunghwank1m.github.io/smart-ledger/](https://myunghwank1m.github.io/smart-ledger/)**
2. 화면 상단의 **[앱 설치]** 버튼을 누르거나, 브라우저 메뉴(점 3개 `⋮` 또는 공유 버튼 `↑`)에서 **[홈 화면에 추가]** 또는 **[앱 설치]**를 터치합니다.
3. 스마트폰 바탕화면에 **"스마트가계부"** 전용 앱 아이콘이 바로 생성됩니다.
4. **사용 특징:**
   * 브라우저 주소창이나 테두리 없이 **네이티브 앱과 100% 동일한 전체화면**으로 구동됩니다.
   * 카메라 펀치홀, 시간, 배터리 아이콘 아래로 완벽히 분리되어 깔끔하게 보입니다.
   * 향후 기능이 업데이트되어도 재설치할 필요 없이 **자동으로 실시간 최신 버전으로 갱신**됩니다.

---

## 🖥️ 2. 다른 PC에서 사용하는 방법 (회사, 노트북 등)

### 방법 ① 다운로드 후 더블클릭 (가장 추천 ⭐ / 3초 완료)
* 다른 PC에 Node.js나 개발 프로그램이 **전혀 없어도** 됩니다.
1. [SmartLedger.exe 다운로드 링크](https://github.com/MyungHwanK1m/smart-ledger/releases/download/v1.0.1/SmartLedger.exe)를 클릭합니다.
2. 다운로드된 **`SmartLedger.exe`**를 바탕화면에 두고 **더블클릭**합니다.
3. 내 Supabase 가계부 데이터와 실시간 연결되어 종합 대시보드가 열립니다.

### 방법 ② 다른 PC에서도 브라우저로 보고 싶을 때
* 크롬/웨일/엣지 브라우저에서 [https://myunghwank1m.github.io/smart-ledger/](https://myunghwank1m.github.io/smart-ledger/) 접속!

---

## 🔑 3. 클라우드 DB 접속 정보 (보관용)

* **Supabase URL:** `https://uyafrivmhhyzicbnkhet.supabase.co`
* **Publishable Anon Key:** `sb_publishable_kAi4vM-5sUepIFbvX-UGXw_B7P8woef`
* **Region:** Northeast (Seoul)
* **7일 미사용 방지 자동화:** 매 3일마다 GitHub Actions(`.github/workflows/keep_alive.yml`)가 자동으로 가벼운 핑을 보내 무료 티어 DB가 잠들지 않도록 영구 유지합니다.
