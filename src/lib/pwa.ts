// ==========================================
// PWA 설치 상태 관리
// beforeinstallprompt는 React가 마운트되기 전에 발생할 수 있으므로,
// 이 모듈을 main.tsx에서 가장 먼저 import해 이벤트를 즉시 잡아 둔다.
// ==========================================
import { useSyncExternalStore } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/** 설치 안내 방식을 정하기 위한 실행 환경 */
export type InstallPlatform =
  | 'native' // Capacitor APK / Electron EXE (설치 안내 불필요)
  | 'ios-safari'
  | 'ios-other' // iOS의 Chrome 등
  | 'ios-inapp' // iOS 카카오톡/네이버 등 인앱 브라우저
  | 'android-inapp' // 안드로이드 카카오톡/네이버 등 인앱 브라우저
  | 'samsung'
  | 'android-chrome'
  | 'desktop';

interface PwaState {
  canPrompt: boolean; // 브라우저 설치 팝업을 바로 띄울 수 있음
  isInstalled: boolean; // 홈 화면 앱으로 실행 중이거나 방금 설치됨
  isGuideOpen: boolean;
}

const IN_APP_PATTERN = /kakaotalk|naver\(inapp|naver\/|instagram|fban|fbav|line\/|daumapps|everytimeapp|whale\/.*inapp/i;

function detectPlatform(): InstallPlatform {
  const ua = navigator.userAgent;
  const w = window as any;
  if (w.Capacitor?.isNativePlatform?.() || /electron/i.test(ua) || location.protocol === 'file:') {
    return 'native';
  }
  const isIOS = /iphone|ipad|ipod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isInApp = IN_APP_PATTERN.test(ua);
  if (isIOS) {
    if (isInApp) return 'ios-inapp';
    return /crios|fxios|edgios/i.test(ua) ? 'ios-other' : 'ios-safari';
  }
  if (/android/i.test(ua)) {
    if (isInApp || /; wv\)/.test(ua)) return 'android-inapp';
    if (/samsungbrowser/i.test(ua)) return 'samsung';
    return 'android-chrome';
  }
  return 'desktop';
}

function detectStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    (navigator as any).standalone === true
  );
}

export const platform: InstallPlatform = detectPlatform();
export const isMobilePlatform = platform !== 'desktop' && platform !== 'native';

let deferredPrompt: BeforeInstallPromptEvent | null = null;
let state: PwaState = {
  canPrompt: false,
  isInstalled: detectStandalone(),
  isGuideOpen: false,
};
const listeners = new Set<() => void>();

function setState(patch: Partial<PwaState>) {
  state = { ...state, ...patch };
  listeners.forEach(l => l());
}

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e as BeforeInstallPromptEvent;
  setState({ canPrompt: true });
});

window.addEventListener('appinstalled', () => {
  deferredPrompt = null;
  setState({ canPrompt: false, isInstalled: true, isGuideOpen: false });
});

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function usePwaInstall(): PwaState {
  return useSyncExternalStore(subscribe, () => state);
}

/** 설치 안내가 필요한 환경인지 (이미 설치됨/네이티브 앱이면 false) */
export function shouldOfferInstall(s: PwaState): boolean {
  return platform !== 'native' && !s.isInstalled;
}

/**
 * 설치 버튼 동작: 브라우저 설치 팝업을 띄울 수 있으면 띄우고,
 * 불가능한 환경(인앱 브라우저, 삼성 인터넷, iOS, 이전에 거절함 등)이면 안내 모달을 연다.
 */
export async function requestInstall(): Promise<void> {
  if (!deferredPrompt) {
    setState({ isGuideOpen: true });
    return;
  }
  const promptEvent = deferredPrompt;
  deferredPrompt = null;
  setState({ canPrompt: false });
  await promptEvent.prompt();
  const { outcome } = await promptEvent.userChoice;
  if (outcome === 'accepted') {
    setState({ isInstalled: true });
  }
}

export function closeInstallGuide() {
  setState({ isGuideOpen: false });
}

/** 인앱 브라우저에서 기본 브라우저(크롬/사파리)로 현재 페이지 열기 */
export function openInExternalBrowser() {
  const url = location.href;
  if (/kakaotalk/i.test(navigator.userAgent)) {
    location.href = `kakaotalk://web/openExternal?url=${encodeURIComponent(url)}`;
    return;
  }
  if (platform === 'android-inapp') {
    const target = url.replace(/^https?:\/\//, '');
    location.href = `intent://${target}#Intent;scheme=https;package=com.android.chrome;end`;
  }
}
