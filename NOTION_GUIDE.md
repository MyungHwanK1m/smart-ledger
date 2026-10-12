# 📘 스마트 원격 가계부 (Smart Ledger) - 다른 PC 및 모바일 사용 설명서

> **한 줄 요약:**  
> Supabase 클라우드 기반 24시간 실시간 연동 가계부입니다.  
> 집 PC 서버를 켤 필요 없이, **다른 PC(회사, 노트북)** 및 **스마트폰(안드로이드)** 어디서나 다운로드하여 바로 사용할 수 있습니다.

---

## 🔗 최신 v1.0.1 원클릭 다운로드 & 링크

| 구분 | 다운로드 / 접속 링크 | 설명 |
| :--- | :--- | :--- |
| **📱 스마트폰 앱 파일 (v1.0.1)** | [smart-ledger.apk 다운로드](https://github.com/MyungHwanK1m/smart-ledger/releases/download/v1.0.1/smart-ledger.apk) | 상단 노치/카메라 겹침 해결 & 폰트 개선 최신 APK |
| **🖥️ PC용 실행 프로그램 (v1.0.1)** | [SmartLedger.exe 다운로드](https://github.com/MyungHwanK1m/smart-ledger/releases/download/v1.0.1/SmartLedger.exe) | 설치 불필요, 더블클릭 즉시 실행 (포터블) |
| **📦 GitHub 전체 릴리즈** | [GitHub Releases v1.0.1](https://github.com/MyungHwanK1m/smart-ledger/releases/tag/v1.0.1) | 최신 빌드 파일 배포 페이지 |
| **💻 GitHub 소스코드** | [MyungHwanK1m/smart-ledger](https://github.com/MyungHwanK1m/smart-ledger) | 전체 소스코드 저장소 |
| **☁️ Supabase 클라우드** | [Supabase 콘솔 바로가기](https://supabase.com/dashboard/project/uyafrivmhhyzicbnkhet) | 24시간 가계부 데이터베이스 |

---

## 📱 1. 스마트폰(안드로이드)에서 사용하는 방법

1. 스마트폰 브라우저로 [smart-ledger.apk 다운로드 링크](https://github.com/MyungHwanK1m/smart-ledger/releases/download/v1.0.1/smart-ledger.apk)를 터치하여 다운로드합니다.
2. 다운로드가 완료되면 파일을 터치하여 **업데이트 / 설치**합니다. (출처를 알 수 없는 앱 설치 허용)
3. **v1.0.1 개선 사항:**
   * 스마트폰 상단 카메라 펀치홀 및 시간/배터리 아이콘 아래로 앱 헤더가 깔끔하게 분리되어 시인성이 대폭 향상되었습니다.
   * 고품질 한글 웹폰트(Pretendard)가 적용되어 글자가 깨지거나 뭉개지지 않고 선명하게 표시됩니다.
4. 스마트폰에서 입력한 지출은 집/회사 PC의 `SmartLedger.exe`에 **실시간으로 즉시 반영**됩니다.

---

## 🖥️ 2. 다른 PC에서 사용하는 방법 (회사, 노트북 등)

### 방법 ① 다운로드 후 더블클릭 (가장 추천 ⭐ / 3초 완료)
* 다른 PC에 Node.js나 개발 프로그램이 **전혀 없어도** 됩니다.
1. [SmartLedger.exe 다운로드 링크](https://github.com/MyungHwanK1m/smart-ledger/releases/download/v1.0.1/SmartLedger.exe)를 클릭합니다.
2. 다운로드된 **`SmartLedger.exe`**를 바탕화면에 두고 **더블클릭**합니다.
3. 내 Supabase 가계부 데이터와 실시간 연결되어 종합 대시보드가 열립니다.

### 방법 ② 개발 환경에서 직접 실행하고 싶을 때
```bash
git clone https://github.com/MyungHwanK1m/smart-ledger.git
cd smart-ledger
npm install
npm run dev
```

---

## 🔑 3. 클라우드 DB 접속 정보 (백업/보관용)

* **Supabase URL:** `https://uyafrivmhhyzicbnkhet.supabase.co`
* **Publishable Anon Key:** `sb_publishable_kAi4vM-5sUepIFbvX-UGXw_B7P8woef`
* **Region:** Northeast (Seoul)
* **7일 미사용 방지 자동화:** 매 3일마다 GitHub Actions(`.github/workflows/keep_alive.yml`)가 자동으로 가벼운 핑을 보내 무료 티어 DB가 잠들지 않도록 영구 유지합니다.
