import React from 'react';
import { ThemeAccent, Car } from '../types';
import { ShieldAlert, Mic, CheckCircle2, X, Radio } from 'lucide-react';
import { Language, translations } from '../translations';

interface EmergencySOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeAccent;
  selectedCar: Car;
  onConfirmSOS: (mode: 'voice_triage' | 'human_callback') => void;
  lang?: Language;
}

export const EmergencySOSModal: React.FC<EmergencySOSModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  selectedCar,
  onConfirmSOS,
  lang = 'fa',
}) => {
  const [isRecordingVoice, setIsRecordingVoice] = React.useState(false);
  const [voiceSeconds, setVoiceSeconds] = React.useState(0);
  const [isDispatched, setIsDispatched] = React.useState(false);
  const t = translations[lang];

  React.useEffect(() => {
    let timer: any;
    if (isRecordingVoice) {
      timer = setInterval(() => {
        setVoiceSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setVoiceSeconds(0);
    }
    return () => clearInterval(timer);
  }, [isRecordingVoice]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 overlay scrim-enter">
      <div className="sheet w-full max-w-lg sm:rounded-3xl p-5 space-y-5 relative overflow-hidden sheet-enter" style={{ borderColor: 'color-mix(in oklab, var(--color-danger) 35%, transparent)' }}>
        {/* Subtle pulsing red emergency background glow */}
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-danger/20 blur-3xl pointer-events-none animate-pulse"></div>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.07] pb-3 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-danger/15 border border-danger/40 flex items-center justify-center text-danger animate-pulse">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-ink flex items-center gap-2">
                <span>{t.sosTitle}</span>
              </h3>
              <p className="text-[11px] text-danger-2/90 mt-0.5">
                {lang === 'fa' ? `تخصص ویژه خودروی برقی ${selectedCar.name}` : `Specialized EV support for ${selectedCar.name}`}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="icon-btn w-8 h-8 rounded-xl">
            <X className="w-4 h-4" />
          </button>
        </div>

        {isDispatched ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-ok/20 border-2 border-ok flex items-center justify-center mx-auto text-ok animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-extrabold text-ink">
              {lang === 'fa' ? 'درخواست امداد اضطراری با موفقیت ثبت شد!' : 'Emergency SOS Request Dispatched!'}
            </h4>
            <p className="text-xs text-ink-3 max-w-xs mx-auto leading-relaxed">
              {lang === 'fa'
                ? 'تیم پشتیبانی و ون امداد سنگین آلین‌کار در کمتر از ۲۰ ثانیه با شما تماس می‌گیرند. موقعیت دقیق شما ارسال گردید.'
                : 'Alincar support team and heavy rescue unit will contact you within 20 seconds. Precise GPS transmitted.'}
            </p>
            <button
              onClick={onClose}
              className="btn-accent px-6 py-2.5 text-xs mx-auto"
              style={{ backgroundColor: 'var(--color-ok)' }}
            >
              {lang === 'fa' ? 'متوجه شدم' : 'Got it'}
            </button>
          </div>
        ) : (
          <div className="space-y-4 relative z-10">
            <div className="panel-subtle p-3.5 rounded-2xl text-xs space-y-1">
              <div className="flex items-center justify-between text-[11px] text-ink-4">
                <span>{lang === 'fa' ? 'خودروی ثبت شده:' : 'Target Vehicle:'}</span>
                <strong className="text-ink">{selectedCar.name}</strong>
              </div>
              <div className="flex items-center justify-between text-[11px] text-ink-4">
                <span>{lang === 'fa' ? 'موقعیت مکانی:' : 'GPS Location:'}</span>
                <strong className="text-ok">
                  {lang === 'fa' ? 'ارسال خودکار GPS روی نقشه' : 'Auto GPS Transmitted'}
                </strong>
              </div>
            </div>

            {/* Emergency Option A: Voice Triage */}
            <div className="panel-subtle p-4 rounded-2xl space-y-3">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-danger" />
                <span className="text-xs font-bold text-ink">{t.voiceTriage}</span>
              </div>
              <p className="text-[11px] text-ink-3 leading-relaxed">
                {lang === 'fa'
                  ? 'صدا یا پیام اضطراری خود را ضبط کنید تا AI بلافاصله نوع خطر و قطعات مورد نیاز امداد را ارزیابی کند.'
                  : 'Record a voice message for AI to immediately assess the fault & dispatch emergency team.'}
              </p>

              <button
                onClick={() => {
                  setIsDispatched(true);
                  onConfirmSOS('voice_triage');
                }}
                className="w-full py-3 rounded-xl bg-danger text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 hover:brightness-110 transition active:scale-[0.99]"
              >
                <Radio className="w-4 h-4 animate-ping" />
                <span>{t.sendEmergencyMessage}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
