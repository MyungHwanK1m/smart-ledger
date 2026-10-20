import React, { useState, useEffect } from 'react';
import { Lock, KeyRound, Delete } from 'lucide-react';

interface PinLockModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  savedPin: string | null;
  onSavePin: (pin: string) => void;
}

export const PinLockModal: React.FC<PinLockModalProps> = ({
  isOpen,
  onSuccess,
  savedPin,
  onSavePin,
}) => {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState<'enter' | 'set' | 'confirm'>(savedPin ? 'enter' : 'set');
  const [errorMsg, setErrorMsg] = useState('');

  // 열릴 때마다 상태 초기화: PIN 설정 직후 'confirm' 단계가 남아 있으면
  // 다음 잠금 때 틀린 번호로 새 PIN을 재설정해 잠금을 우회할 수 있었음
  useEffect(() => {
    if (!isOpen) return;
    setStep(savedPin ? 'enter' : 'set');
    setPin('');
    setConfirmPin('');
    setErrorMsg('');
  }, [isOpen, savedPin]);

  if (!isOpen) return null;

  const handleNumberClick = (num: string) => {
    if (pin.length >= 4) return;
    const newPin = pin + num;
    setPin(newPin);
    setErrorMsg('');

    if (newPin.length === 4) {
      handlePinComplete(newPin);
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
    setErrorMsg('');
  };

  const handlePinComplete = (enteredPin: string) => {
    if (step === 'enter') {
      if (enteredPin === savedPin) {
        setPin('');
        onSuccess();
      } else {
        setErrorMsg('PIN 번호가 일치하지 않습니다.');
        setTimeout(() => setPin(''), 500);
      }
    } else if (step === 'set') {
      setConfirmPin(enteredPin);
      setPin('');
      setStep('confirm');
    } else if (step === 'confirm') {
      if (enteredPin === confirmPin) {
        onSavePin(enteredPin);
        setPin('');
        onSuccess();
      } else {
        setErrorMsg('비밀번호가 일치하지 않습니다. 다시 입력해주세요.');
        setPin('');
        setStep('set');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 mx-auto mb-4 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner">
          {savedPin ? <Lock className="w-8 h-8" /> : <KeyRound className="w-8 h-8" />}
        </div>

        <h2 className="text-xl font-bold text-slate-800 mb-1">
          {step === 'enter' && '보안 PIN 입력'}
          {step === 'set' && '새 PIN 번호 설정'}
          {step === 'confirm' && 'PIN 번호 재입력 확인'}
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          {step === 'enter' && '가계부 잠금을 해제하려면 4자리 PIN을 입력하세요'}
          {step === 'set' && '사용하실 4자리 숫자 비밀번호를 입력해주세요'}
          {step === 'confirm' && '확인을 위해 동일한 번호를 다시 입력해주세요'}
        </p>

        {/* PIN 도트 표시 */}
        <div className="flex justify-center gap-4 mb-6">
          {[0, 1, 2, 3].map(idx => (
            <div
              key={idx}
              className={`w-4 h-4 rounded-full transition-all duration-200 ${
                pin.length > idx ? 'bg-indigo-600 scale-110 shadow-sm' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

        {errorMsg && (
          <p className="text-sm text-red-500 font-medium mb-4 animate-shake">
            {errorMsg}
          </p>
        )}

        {/* 숫자 키패드 */}
        <div className="grid grid-cols-3 gap-3 max-w-[260px] mx-auto">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
            <button
              key={num}
              onClick={() => handleNumberClick(num)}
              className="h-14 rounded-2xl bg-slate-50 hover:bg-slate-100 active:bg-indigo-50 active:text-indigo-600 font-semibold text-xl text-slate-700 transition flex items-center justify-center shadow-sm border border-slate-100"
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => setPin('')}
            className="h-14 rounded-2xl text-xs font-semibold text-slate-400 hover:text-slate-600 flex items-center justify-center"
          >
            초기화
          </button>
          <button
            onClick={() => handleNumberClick('0')}
            className="h-14 rounded-2xl bg-slate-50 hover:bg-slate-100 active:bg-indigo-50 active:text-indigo-600 font-semibold text-xl text-slate-700 transition flex items-center justify-center shadow-sm border border-slate-100"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="h-14 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-500 flex items-center justify-center transition border border-slate-100"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
