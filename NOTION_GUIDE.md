# 📘 스마트 원격 가계부 (Smart Ledger) - 어디서나 사용 가이드

> **프로젝트 개요:**  
> Supabase 클라우드 기반으로 24시간 동작하는 개인 가계부 시스템입니다.  
> 집 PC 서버를 켤 필요 없이, **다른 PC(회사, 노트북)** 및 **스마트폰(안드로이드)** 어디서나 실시간 동기화되어 사용할 수 있습니다.

---

## 🔗 핵심 링크 모음

* **GitHub 저장소:** [https://github.com/MyungHwanK1m/smart-ledger](https://github.com/MyungHwanK1m/smart-ledger)
* **PC 실행 파일 (.exe) 다운로드:** [https://github.com/MyungHwanK1m/smart-ledger/releases/tag/v1.0.0](https://github.com/MyungHwanK1m/smart-ledger/releases/tag/v1.0.0)
* **모바일 APK 다운로드 (GitHub Actions):** [https://github.com/MyungHwanK1m/smart-ledger/actions](https://github.com/MyungHwanK1m/smart-ledger/actions)
* **Supabase 클라우드 콘솔:** [https://supabase.com/dashboard/project/uyafrivmhhyzicbnkhet](https://supabase.com/dashboard/project/uyafrivmhhyzicbnkhet)

---

## 🖥️ 1. 다른 PC에서 사용하는 방법

### 방법 ① 다운로드 후 즉시 실행 (가장 추천 ⭐ / 3초 완료)
개발 프로그램(Node.js 등) 설치가 전혀 필요 없습니다.

1. 인터넷 브라우저로 [GitHub Releases](https://github.com/MyungHwanK1m/smart-ledger/releases/tag/v1.0.0)에 접속합니다.
2. **`SmartLedger 1.0.0.exe`** 파일을 다운로드합니다.
3. 다운로드된 파일을 **더블클릭**하면 바로 가계부 프로그램이 실행됩니다.
   * *Supabase 클라우드 설정이 이미 내장되어 있어 로그인/설정 없이 내 가계부 데이터가 그대로 연동됩니다.*

### 방법 ② 개발 환경에서 실행하고 싶을 때 (소스코드 클론)
Node.js가 설치된 다른 PC에서 직접 코드를 실행/수정하고 싶을 때:

```bash
# 1. 저장소 복제
git clone https://github.com/MyungHwanK1m/smart-ledger.git
cd smart-ledger

# 2. 패키지 설치
npm install

# 3. 로컬 실행
npm run dev

# (선택) 새 PC에서 exe 다시 빌드하기
npm run build:exe
```

---

## 📱 2. 스마트폰에서 사용하는 방법

### 안드로이드 순수 앱 (.apk 설치)
1. [GitHub Actions](https://github.com/MyungHwanK1m/smart-ledger/actions) 페이지로 접속합니다.
2. 가장 최근의 **Build Android APK** 성공 건(초록색 체크)을 클릭합니다.
3. 하단 **Artifacts** 섹션의 **`smart-ledger-apk`**를 클릭하여 다운로드합니다.
4. 압축을 풀면 나오는 `app-debug.apk` 파일을 스마트폰으로 옮겨 설치(출처를 알 수 없는 앱 허용)합니다.
5. 스마트폰 바탕화면에 **스마트 가계부** 앱 아이콘이 생성되며 24시간 사용 가능합니다.

---

## 🔑 3. 클라우드 환경 설정 정보 (보관용)

만약 설정을 다시 구성해야 할 경우 필요한 원본 정보입니다:

* **Supabase URL:** `https://uyafrivmhhyzicbnkhet.supabase.co`
* **Publishable Anon Key:** `sb_publishable_kAi4vM-5sUepIFbvX-UGXw_B7P8woef`
* **Region:** Northeast (Seoul)
* **무중단 핑:** 매 3일마다 GitHub Actions(`.github/workflows/keep_alive.yml`)가 자동으로 핑을 보내 7일 미사용 수면(Pause)을 방지합니다.
