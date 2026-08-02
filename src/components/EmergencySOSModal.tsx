import React from 'react';
import { ThemeAccent, Car } from '../types';
import { ShieldAlert, Mic, CheckCircle2, X, Radio, Square } from 'lucide-react';
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
  const [voiceHint, setVoiceHint] = React.useState<string | null>(null);
  const [gpsLabel, setGpsLabel] = React.useState<string | null>(null);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const mediaStreamRef = React.useRef<MediaStream | null>(null);
  const chunksRef = React.useRef<BlobPart[]>([]);
  const t = translations[lang];

  React.useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    if (isRecordingVoice) {
      timer = setInterval(() => {
        setVoiceSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setVoiceSeconds(0);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRecordingVoice]);

  React.useEffect(() => {
    if (!isOpen) return;

    if (!window.isSecureContext || !('geolocation' in navigator)) {
      setGpsLabel(t.sosGpsFallback);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLabel(
          `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`
        );
      },
      () => setGpsLabel(t.sosGpsFallback),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 10000 }
    );
  }, [isOpen, t.sosGpsFallback]);

  React.useEffect(() => {
    return () => {
      mediaRecorderRef.current?.stop?.();
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  if (!isOpen) return null;

  const stopTracks = () => {
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;
    mediaRecorderRef.current = null;
  };

  const finishDispatch = () => {
    setIsRecordingVoice(false);
    setIsDispatched(true);
    onConfirmSOS('voice_triage');
  };

  const startVoiceTriage = async () => {
    setVoiceHint(null);

    if (isRecordingVoice) {
      if (mediaRecorderRef.current?.state === 'recording') {
        mediaRecorderRef.current.stop();
      } else {
        stopTracks();
        finishDispatch();
      }
      return;
    }

    if (!window.isSecureContext) {
      setVoiceHint(t.voiceNeedsHttps);
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setVoiceHint(t.voiceUnsupported);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      chunksRef.current = [];

      const mimeType = MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : MediaRecorder.isTypeSupported('audio/mp4')
        ? 'audio/mp4'
        : '';
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        stopTracks();
        finishDispatch();
      };

      recorder.start();
      setIsRecordingVoice(true);
      setVoiceHint(t.listening);

      window.setTimeout(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
          mediaRecorderRef.current.stop();
        }
      }, 8000);
    } catch {
      stopTracks();
      setIsRecordingVoice(false);
      setVoiceHint(t.micDenied);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 overlay scrim-enter">
      <div className="sheet w-full max-w-lg sm:rounded-3xl p-5 space-y-5 relative overflow-hidden sheet-enter" style={{ borderColor: 'color-mix(in oklab, var(--color-danger) 35%, transparent)' }}>
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-danger/20 blur-3xl pointer-events-none animate-pulse"></div>

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
                {t.sosEvSupport.replace('{car}', selectedCar.name)}
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
              {t.sosDispatchedTitle}
            </h4>
            <p className="text-xs text-ink-3 max-w-xs mx-auto leading-relaxed">
              {t.sosDispatchedDesc}
            </p>
            <button
              onClick={onClose}
              className="btn-accent px-6 py-2.5 text-xs mx-auto"
              style={{ backgroundColor: 'var(--color-ok)' }}
            >
              {t.sosGotIt}
            </button>
          </div>
        ) : (
          <div className="space-y-4 relative z-10">
            <div className="panel-subtle p-3.5 rounded-2xl text-xs space-y-1">
              <div className="flex items-center justify-between text-[11px] text-ink-4">
                <span>{t.sosTargetVehicle}</span>
                <strong className="text-ink">{selectedCar.name}</strong>
              </div>
              <div className="flex items-center justify-between gap-3 text-[11px] text-ink-4">
                <span>{t.sosGpsLocation}</span>
                <strong className="text-ok text-left truncate max-w-[60%]">
                  {gpsLabel || t.gpsLocating}
                </strong>
              </div>
            </div>

            <div className="panel-subtle p-4 rounded-2xl space-y-3">
              <div className="flex items-center gap-2">
                <Mic className={`w-4 h-4 ${isRecordingVoice ? 'text-danger animate-pulse' : 'text-danger'}`} />
                <span className="text-xs font-bold text-ink">{t.voiceTriage}</span>
              </div>
              <p className="text-[11px] text-ink-3 leading-relaxed">
                {t.sosVoiceHelp}
              </p>
              {voiceHint && (
                <p className={`text-[11px] ${isRecordingVoice ? 'text-danger' : 'text-danger-2'}`}>
                  {isRecordingVoice ? `${voiceHint} (${voiceSeconds}s)` : voiceHint}
                </p>
              )}

              <button
                onClick={startVoiceTriage}
                className="w-full py-3 rounded-xl bg-danger text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 hover:brightness-110 transition active:scale-[0.99]"
              >
                {isRecordingVoice ? (
                  <>
                    <Square className="w-4 h-4" />
                    <span>{t.stopRecording}</span>
                  </>
                ) : (
                  <>
                    <Radio className="w-4 h-4 animate-ping" />
                    <span>{t.sendEmergencyMessage}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
