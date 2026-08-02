import React from 'react';
import { ThemeAccent, Car, WalletState } from '../types';
import { Mic, Send, X, Bot, Sparkles, Zap } from 'lucide-react';
import { Language, translations } from '../translations';

interface AIConciergeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeAccent;
  selectedCar: Car;
  walletState: WalletState;
  onExecuteAction: (action: string, params?: any) => void;
  lang?: Language;
}

interface ChatMessage {
  id: string;
  sender: 'concierge' | 'user';
  text: string;
  suggestedAction?: string;
  actionParams?: any;
}

export const AIConciergeModal: React.FC<AIConciergeModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  selectedCar,
  walletState,
  onExecuteAction,
  lang = 'fa',
}) => {
  const t = translations[lang];
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);

  React.useEffect(() => {
    setMessages([
      {
        id: '1',
        sender: 'concierge',
        text: t.welcomeMessage
          .replace('{car}', selectedCar.name)
          .replace('{pct}', String(selectedCar.batteryPercent)),
      },
    ]);
  }, [lang, selectedCar.name, selectedCar.batteryPercent, t.welcomeMessage]);

  const [inputMessage, setInputMessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isListening, setIsListening] = React.useState(false);
  const [voiceHint, setVoiceHint] = React.useState<string | null>(null);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const mediaStreamRef = React.useRef<MediaStream | null>(null);
  const recognitionRef = React.useRef<any>(null);

  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  React.useEffect(() => {
    return () => {
      recognitionRef.current?.stop?.();
      mediaRecorderRef.current?.stop?.();
      mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: query,
          carState: selectedCar,
          walletState,
        }),
      });

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'concierge',
        text: data.reply || t.aiRequestRecorded,
        suggestedAction: data.suggestedAction,
        actionParams: data.actionParams,
      };

      setMessages((prev) => [...prev, botMsg]);

      if (data.suggestedAction && data.suggestedAction !== 'NONE') {
        onExecuteAction(data.suggestedAction, data.actionParams);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'concierge',
          text: t.aiDispatchPreparing,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const stopMediaTracks = () => {
    mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
    mediaStreamRef.current = null;
    mediaRecorderRef.current = null;
  };

  const ensureMicPermission = async (): Promise<MediaStream | null> => {
    if (!window.isSecureContext) {
      setVoiceHint(t.voiceNeedsHttps);
      return null;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      setVoiceHint(t.voiceUnsupported);
      return null;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      return stream;
    } catch {
      setVoiceHint(t.micDenied);
      return null;
    }
  };

  const startMediaRecorderFallback = (stream: MediaStream) => {
    try {
      const mimeType = MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : MediaRecorder.isTypeSupported('audio/mp4')
        ? 'audio/mp4'
        : '';
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };
      recorder.onstop = () => {
        stopMediaTracks();
        setIsListening(false);
        if (chunks.length > 0) {
          handleSendMessage(t.voiceRecordedFallback);
        }
      };

      recorder.start();
      setIsListening(true);
      setVoiceHint(t.listening);
      // Auto-stop after ~6s for a practical mobile dictation burst
      window.setTimeout(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
          mediaRecorderRef.current.stop();
        }
      }, 6000);
    } catch {
      stopMediaTracks();
      setIsListening(false);
      setVoiceHint(t.voiceUnsupported);
    }
  };

  const startVoiceDictation = async () => {
    setVoiceHint(null);

    if (isListening) {
      recognitionRef.current?.stop?.();
      if (mediaRecorderRef.current?.state === 'recording') {
        mediaRecorderRef.current.stop();
      } else {
        stopMediaTracks();
        setIsListening(false);
      }
      return;
    }

    const stream = await ensureMicPermission();
    if (!stream) return;

    const SpeechRecognitionCtor =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      // iOS / many mobile browsers: record audio instead of live STT
      startMediaRecorderFallback(stream);
      return;
    }

    // Permission granted — release the stream so SpeechRecognition can use the mic
    stopMediaTracks();

    try {
      const recognition = new SpeechRecognitionCtor();
      recognitionRef.current = recognition;
      recognition.lang = lang === 'fa' ? 'fa-IR' : 'en-US';
      recognition.interimResults = false;
      recognition.continuous = false;
      recognition.maxAlternatives = 1;

      setIsListening(true);
      setVoiceHint(t.listening);
      recognition.start();

      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        setIsListening(false);
        if (transcript) handleSendMessage(transcript);
      };

      recognition.onerror = async () => {
        recognitionRef.current = null;
        setIsListening(false);
        const retryStream = await ensureMicPermission();
        if (retryStream) startMediaRecorderFallback(retryStream);
      };

      recognition.onend = () => {
        recognitionRef.current = null;
        if (mediaRecorderRef.current?.state !== 'recording') {
          setIsListening(false);
        }
      };
    } catch {
      const retryStream = await ensureMicPermission();
      if (retryStream) startMediaRecorderFallback(retryStream);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 overlay scrim-enter">
      <div className="sheet w-full max-w-md h-[92vh] sm:h-[84vh] sm:rounded-[36px] rounded-t-[36px] flex flex-col overflow-hidden relative dir-rtl" style={{ borderColor: 'color-mix(in oklab, var(--color-ok) 25%, transparent)' }}>
        {/* Background ambient radial glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-ok/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Header */}
        <div className="p-4 px-6 border-b border-divider bg-obsidian/90 backdrop-blur-md flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-on-accent shadow-lg"
                style={{ backgroundColor: 'var(--accent-primary)', boxShadow: '0 6px 20px color-mix(in oklab, var(--accent-primary) 40%, transparent)' }}
              >
                <Bot className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-ok border-2 border-surface-2 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-on-accent animate-pulse"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-ink tracking-tight">{t.aiConciergeTitle}</h3>
                <span className="text-[9px] bg-ok/10 text-ok border border-ok/30 px-2 py-0.5 rounded-full font-mono uppercase">
                  {t.activeVoice}
                </span>
              </div>
              <p className="text-[10px] text-ok/70 mt-0.5">
                {voiceHint || (isListening ? t.listening : t.readyAssist)}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="icon-btn w-8 h-8 rounded-full">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Central Voxa/Aria Animated Mesh Orb Banner */}
        <div className="relative py-6 px-4 flex flex-col items-center justify-center bg-gradient-to-b from-ok/10 via-transparent to-transparent border-b border-ok/20">
          <div className="relative w-28 h-28 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-ok/20 blur-xl animate-pulse"></div>
            <div className="absolute w-24 h-24 rounded-full border border-ok/30 animate-spin" style={{ animationDuration: '10s' }}></div>
            <div className="absolute w-20 h-20 rounded-full border border-dashed border-ok/40 animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }}></div>
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-ok to-ok-2 flex items-center justify-center shadow-[0_0_30px_var(--accent-glow)]">
              <Sparkles className="w-8 h-8 text-on-accent animate-pulse" />
            </div>
          </div>
          <h4 className="text-xs font-light text-ink-3 mt-3 tracking-wide">
            {t.voxaAssist}
          </h4>
          <p className="text-[10px] text-ok/70 mt-0.5 font-sans">
            {t.aiBannerSubtitle.replace('{car}', selectedCar.name).replace('{pct}', String(selectedCar.batteryPercent))}
          </p>
        </div>

        {/* Chat Stream Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 z-10 no-scrollbar">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed border ${
                  msg.sender === 'user'
                    ? 'bg-ok/10 text-ink rounded-tl-none border-ok/25'
                    : 'panel-subtle text-ink-2 rounded-tr-none border-divider'
                }`}
              >
                {msg.sender === 'concierge' && (
                  <div className="flex items-center gap-1.5 text-[10px] text-ok mb-1 font-mono uppercase tracking-wider">
                    <Bot className="w-3.5 h-3.5 text-ok" />
                    <span>{t.ariaVoiceName}</span>
                  </div>
                )}
                <p className="font-sans">{msg.text}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-ok/80 panel-subtle p-3 rounded-2xl w-max border border-ok/25">
              <span className="w-2 h-2 rounded-full bg-ok animate-ping"></span>
              <span>{t.aiAnalyzing}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Preset Quick Action Pills (Voxa Style) */}
        <div className="px-4 py-2 bg-obsidian/90 border-t border-divider flex items-center gap-2 overflow-x-auto no-scrollbar z-10">
          <button
            onClick={() => handleSendMessage(t.aiQuickVanMsg)}
            className="text-[11px] bg-surface-2 hover:bg-surface-3 text-ok px-3 py-1.5 rounded-full border border-ok/25 shrink-0 transition flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 text-ok" />
            <span>{t.quickVan}</span>
          </button>
          <button
            onClick={() => handleSendMessage(t.aiQuickBmsMsg)}
            className="text-[11px] bg-surface-2 hover:bg-surface-3 text-ok px-3 py-1.5 rounded-full border border-ok/25 shrink-0 transition flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-ok" />
            <span>{t.quickBms}</span>
          </button>
          <button
            onClick={() => handleSendMessage(t.aiQuickDriverMsg)}
            className="text-[11px] bg-surface-2 hover:bg-surface-3 text-ok px-3 py-1.5 rounded-full border border-ok/25 shrink-0 transition flex items-center gap-1.5"
          >
            <span>🤵 {t.quickDriver}</span>
          </button>
        </div>

        {/* Bottom Control Bar */}
        <div className="p-3.5 px-4 bg-obsidian border-t border-divider flex items-center gap-2.5 z-10">
          <button
            onClick={startVoiceDictation}
            className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition shadow-lg ${
              isListening
                ? 'bg-ok text-on-accent animate-pulse shadow-ok/50'
                : 'bg-surface-2 border border-ok/25 text-ok hover:bg-surface-3'
            }`}
            title={t.typeMessage}
          >
            <Mic className="w-5 h-5" />
          </button>

          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={isListening ? t.listening : t.typeMessage}
            className="flex-1 bg-surface-1 border border-border rounded-full px-4 py-2.5 text-xs text-ink placeholder-ink-4 focus:outline-none focus:border-ok/50"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim()}
            className="w-11 h-11 rounded-full text-on-accent font-bold flex items-center justify-center disabled:opacity-30 transition shadow-md shrink-0"
            style={{ backgroundColor: 'var(--accent-primary)' }}
          >
            <Send className="w-4 h-4 transform rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
};
