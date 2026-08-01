import React from 'react';
import { ThemeAccent, Car } from '../types';
import { ShieldAlert, PhoneCall, Mic, CheckCircle2, X, AlertTriangle, Radio } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-rose-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-rose-500/40 w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-5 relative overflow-hidden">
        {/* Subtle pulsing red emergency background glow */}
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-rose-500/20 blur-3xl pointer-events-none animate-pulse"></div>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 animate-pulse">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <span>{t.sosTitle}</span>
              </h3>
              <p className="text-[11px] text-rose-300 mt-0.5">
                {lang === 'fa' ? `تخصص ویژه خودروی برقی ${selectedCar.name}` : `Specialized EV support for ${selectedCar.name}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center border border-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isDispatched ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-extrabold text-white">
              {lang === 'fa' ? 'درخواست امداد اضطراری با موفقیت ثبت شد!' : 'Emergency SOS Request Dispatched!'}
            </h4>
            <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
              {lang === 'fa'
                ? 'تیم پشتیبانی و ون امداد سنگین آلین‌کار در کمتر از ۲۰ ثانیه با شما تماس می‌گیرند. موقعیت دقیق شما ارسال گردید.'
                : 'Alincar support team and heavy rescue unit will contact you within 20 seconds. Precise GPS transmitted.'}
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-lg"
            >
              {lang === 'fa' ? 'متوجه شدم' : 'Got it'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>{lang === 'fa' ? 'خودروی ثبت شده:' : 'Target Vehicle:'}</span>
                <strong className="text-white">{selectedCar.name}</strong>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>{lang === 'fa' ? 'موقعیت مکانی:' : 'GPS Location:'}</span>
                <strong className="text-emerald-400">
                  {lang === 'fa' ? 'ارسال خودکار GPS روی نقشه' : 'Auto GPS Transmitted'}
                </strong>
              </div>
            </div>

            {/* Emergency Option A: Voice Triage */}
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mic className="w-4 h-4 text-rose-400" />
                  <span className="text-xs font-bold text-white">{t.voiceTriage}</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {lang === 'fa'
                  ? 'صدا یا پیام اضطراری خود را ضبط کنید تا AI بلافاصله نوع خطر و قطعات مورد نیاز امداد را ارزیابی کند.'
                  : 'Record a voice message for AI to immediately assess the fault & dispatch emergency team.'}
              </p>

              <button
                onClick={() => {
                  setIsDispatched(true);
                  onConfirmSOS('voice_triage');
                }}
                className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2"
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
