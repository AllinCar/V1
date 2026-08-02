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
        text: lang === 'fa'
          ? `درود جناب مهندسی علی احمدی! من خادم و دستیار هوشمند اختصاصی شما در آلین‌کار هستم. آماده‌ام هر فرمایشی برای خودروی ${selectedCar.name} (${selectedCar.batteryPercent}٪ شارژ) داشته باشید، فوراً انجام دهم. چه کاری می‌توانم برایتان انجام دهم؟`
          : `Greetings Eng. Ali Ahmadi! I am your personal AI Concierge at Alincar. Ready to manage any requests for your vehicle ${selectedCar.name} (${selectedCar.batteryPercent}% charge). How may I assist you today?`,
      },
    ]);
  }, [lang, selectedCar.name, selectedCar.batteryPercent]);

  const [inputMessage, setInputMessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isListening, setIsListening] = React.useState(false);

  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

      // If action is requested, execute it automatically or offer direct tap
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

  const startVoiceDictation = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      // Speech recognition not supported natively in this browser window, simulate speech tap
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        handleSendMessage(t.aiVoiceVanRequest);
      }, 2000);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'fa-IR';
      recognition.interimResults = false;

      setIsListening(true);
      recognition.start();

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        handleSendMessage(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    } catch (e) {
      setIsListening(false);
      handleSendMessage(t.aiVoiceUrgentCharge);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 overlay scrim-enter">
      <div className="sheet w-full max-w-md h-[92vh] sm:h-[84vh] sm:rounded-[36px] rounded-t-[36px] flex flex-col overflow-hidden relative dir-rtl" style={{ borderColor: 'color-mix(in oklab, var(--color-ok) 25%, transparent)' }}>
        {/* Background ambient radial glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-ok/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Header */}
        <div className="p-4 px-6 border-b border-white/[0.07] bg-obsidian/90 backdrop-blur-md flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-black shadow-lg"
                style={{ backgroundColor: currentTheme.primaryHex, boxShadow: `0 6px 20px ${currentTheme.primaryHex}55` }}
              >
                <Bot className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-ok border-2 border-surface-2 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
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
                {isListening ? t.listening : t.readyAssist}
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
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-ok to-ok-2 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.5)]">
              <Sparkles className="w-8 h-8 text-black animate-pulse" />
            </div>
          </div>
          <h4 className="text-xs font-light text-ink-3 mt-3 tracking-wide dir-ltr">
            <span className="italic font-serif text-ok">Voxa AI</span> is here to assist
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
                    : 'panel-subtle text-ink-2 rounded-tr-none border-white/[0.07]'
                }`}
              >
                {msg.sender === 'concierge' && (
                  <div className="flex items-center gap-1.5 text-[10px] text-ok mb-1 font-mono uppercase tracking-wider">
                    <Bot className="w-3.5 h-3.5 text-ok" />
                    <span>Aria Voice Concierge</span>
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
        <div className="px-4 py-2 bg-obsidian/90 border-t border-white/[0.07] flex items-center gap-2 overflow-x-auto no-scrollbar z-10">
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
        <div className="p-3.5 px-4 bg-obsidian border-t border-white/[0.07] flex items-center gap-2.5 z-10">
          <button
            onClick={startVoiceDictation}
            className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition shadow-lg ${
              isListening
                ? 'bg-ok text-black animate-pulse shadow-ok/50'
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
            className="flex-1 bg-surface-1 border border-white/[0.09] rounded-full px-4 py-2.5 text-xs text-ink placeholder-ink-4 focus:outline-none focus:border-ok/50"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim()}
            className="w-11 h-11 rounded-full text-black font-bold flex items-center justify-center disabled:opacity-30 transition shadow-md shrink-0"
            style={{ backgroundColor: currentTheme.primaryHex }}
          >
            <Send className="w-4 h-4 transform rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
};
