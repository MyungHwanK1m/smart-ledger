import React, { useState } from 'react';
import { Download, X, Smartphone, ExternalLink } from 'lucide-react';
import {
  usePwaInstall,
  shouldOfferInstall,
  requestInstall,
  closeInstallGuide,
  openInExternalBrowser,
  platform,
  isMobilePlatform,
} from '../lib/pwa';

const DISMISS_KEY = 'pwa_banner_dismissed_at';
const DISMISS_DAYS = 7;

function isDismissedRecently(): boolean {
  try {
    const at = Number(localStorage.getItem(DISMISS_KEY));
    return !!at && Date.now() - at < DISMISS_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

/** 상단 설치 유도 배너 + 환경별 설치 안내 모달 */
export const PwaInstallPrompt: React.FC = () => {
  const pwa = usePwaInstall();
  const [dismissed, setDismissed] = useState(isDismissedRecently);

  // 모바일은 설치 팝업 지원 여부와 관계없이 안내, PC는 브라우저가 설치 가능하다고 알려줄 때만 배너 표시
  const showBanner =
    shouldOfferInstall(pwa) && !dismissed && (isMobilePlatform || pwa.canPrompt);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      // 저장 실패 시 이번 세션에서만 숨김
    }
  };

  const isInApp = platform === 'android-inapp' || platform === 'ios-inapp';

  return (
    <>
      {showBanner && (
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-4 py-2.5 shadow-md flex items-center justify-between gap-3 text-xs animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
              <Smartphone className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold block">스마트폰 앱으로 사용하기</span>
              <span className="text-[11px] text-indigo-100">
                {isInApp
                  ? '지금 브라우저에서는 설치가 안 돼요. 눌러서 방법 보기'
                  : '홈 화면에 설치하면 전체화면 앱으로 바로 실행'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => requestInstall()}
              className="px-3 py-1.5 rounded-xl bg-white text-indigo-700 font-bold text-xs shadow-xs hover:bg-indigo-50 active:scale-95 transition flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>앱 설치</span>
            </button>
            <button
              onClick={handleDismiss}
              className="p-1 rounded-lg text-indigo-200 hover:text-white transition"
              title="닫기"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {pwa.isGuideOpen && <InstallGuideModal />}
    </>
  );
};

/** 브라우저 설치 팝업을 띄울 수 없는 환경에서 보여주는 수동 설치 안내 */
const InstallGuideModal: React.FC = () => {
  const isKakao = /kakaotalk/i.test(navigator.userAgent);

  let title = '홈 화면에 앱 설치하기';
  let steps: string[] = [];
  let externalLabel: string | null = null;

  switch (platform) {
    case 'android-inapp':
      title = '앱 안의 브라우저에서는 설치할 수 없어요';
      externalLabel = 'Chrome으로 열기';
      steps = [
        '아래 [Chrome으로 열기]를 누르세요.',
        '안 열리면 오른쪽 위 ⋮ 메뉴 → [다른 브라우저로 열기]를 누르세요.',
        'Chrome에서 다시 [앱 설치] 버튼을 누르면 설치됩니다.',
      ];
      break;
    case 'ios-inapp':
      title = '앱 안의 브라우저에서는 설치할 수 없어요';
      externalLabel = isKakao ? 'Safari로 열기' : null;
      steps = [
        isKakao
          ? '아래 [Safari로 열기]를 누르세요.'
          : '오른쪽 아래(또는 위) 메뉴에서 [Safari로 열기]를 누르세요.',
        'Safari 하단의 공유 버튼(□↑)을 누르세요.',
        '[홈 화면에 추가] → [추가]를 누르면 설치됩니다.',
      ];
      break;
    case 'ios-safari':
      steps = [
        '화면 하단의 공유 버튼(□↑)을 누르세요.',
        '목록을 내려 [홈 화면에 추가]를 누르세요.',
        '오른쪽 위 [추가]를 누르면 홈 화면에 앱이 생깁니다.',
      ];
      break;
    case 'ios-other':
      steps = [
        '주소창 옆의 공유 버튼(□↑)을 누르세요.',
        '[홈 화면에 추가]를 누르세요.',
        '메뉴에 없다면 Safari에서 이 주소를 열고 같은 방법으로 추가하세요.',
      ];
      break;
    case 'samsung':
      steps = [
        '화면 하단의 메뉴(≡) 버튼을 누르세요.',
        '[현재 페이지 추가] → [홈 화면]을 누르세요.',
        '[추가]를 누르면 홈 화면에 앱이 생깁니다.',
      ];
      break;
    case 'android-chrome':
      steps = [
        '오른쪽 위 ⋮ 메뉴를 누르세요.',
        '[앱 설치] 또는 [홈 화면에 추가]를 누르세요.',
        '메뉴에 없다면 이미 설치된 상태예요. 홈 화면에서 "스마트가계부" 아이콘을 찾아 실행하세요.',
      ];
      break;
    default:
      steps = [
        'Chrome/Edge 주소창 오른쪽의 설치 아이콘(⊕)을 누르세요.',
        '아이콘이 없으면 브라우저 메뉴 → [앱 설치] 또는 [이 사이트를 앱으로 설치]를 누르세요.',
        'PC에서는 SmartLedger.exe 실행 파일을 써도 됩니다.',
      ];
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
      onClick={closeInstallGuide}
    >
      <div
        className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4 gap-3">
          <h3 className="text-base font-bold text-slate-800">{title}</h3>
          <button
            onClick={closeInstallGuide}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition shrink-0"
            title="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <ol className="space-y-2.5 mb-5">
          {steps.map((step, idx) => (
            <li key={idx} className="flex gap-2.5 text-sm text-slate-600">
              <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>

        {externalLabel ? (
          <button
            onClick={openInExternalBrowser}
            className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <ExternalLink className="w-4 h-4" />
            <span>{externalLabel}</span>
          </button>
        ) : (
          <button
            onClick={closeInstallGuide}
            className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition"
          >
            확인
          </button>
        )}
      </div>
    </div>
  );
};
