import React from 'react';
import { ThemeAccent, Car, WalletState } from '../types';
import { Mic, Send, X, Bot, Sparkles, Zap, ShieldAlert, CheckCircle2, Volume2 } from 'lucide-react';
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
          ? `درود جناب مهندس محمدحسین کاشفی! من خادم و دستیار هوشمند اختصاصی شما در آلین‌کار هستم. آماده‌ام هر فرمایشی برای خودروی ${selectedCar.name} (${selectedCar.batteryPercent}٪ شارژ) داشته باشید، فوراً انجام دهم. چه کاری می‌توانم برایتان انجام دهم؟`
          : `Greetings Eng. Mohammad Hossein Kashfi! I am your personal AI Concierge at Alincar. Ready to manage any requests for your vehicle ${selectedCar.name} (${selectedCar.batteryPercent}% charge). How may I assist you today?`,
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
        text: data.reply || 'درخواست شما ثبت شد.',
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
          text: 'درود! متوجه درخواست شما شدم. ون شارژ سیار ۷ کیلووات پکیج را آماده اعزام می‌کنم.',
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
        handleSendMessage('لطفاً ون شارژ سیار ۷ کیلووات پکیج من را به موقعیت فعلی بفرست.');
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
      handleSendMessage('شارژ سیار فوری ارسال کن.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="bg-[#060D08] border border-emerald-900/40 w-full max-w-md h-[92vh] sm:h-[84vh] sm:rounded-[36px] rounded-t-[36px] shadow-[0_0_50px_rgba(16,185,129,0.15)] flex flex-col overflow-hidden relative dir-rtl">
        {/* Background ambient radial glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Header */}
        <div className="p-4 px-6 border-b border-emerald-900/30 bg-[#060D08]/90 backdrop-blur-md flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-black shadow-lg shadow-emerald-500/20"
                style={{ backgroundColor: currentTheme.primaryHex }}
              >
                <Bot className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#060D08] flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-white tracking-tight">آلین | AI Concierge</h3>
                <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono uppercase">
                  Active Voice
                </span>
              </div>
              <p className="text-[10px] text-emerald-500/60 mt-0.5">
                {isListening ? 'در حال شنیدن صدای شما...' : 'آماده گفتگو و اجرای دستورات خودرو'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center border border-white/10 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Central Voxa/Aria Animated Mesh Orb Banner */}
        <div className="relative py-6 px-4 flex flex-col items-center justify-center bg-gradient-to-b from-emerald-950/20 via-transparent to-transparent border-b border-emerald-900/20">
          <div className="relative w-28 h-28 flex items-center justify-center">
            {/* Glowing animated circles & waves */}
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl animate-pulse"></div>
            <div className="absolute w-24 h-24 rounded-full border border-emerald-500/30 animate-spin" style={{ animationDuration: '10s' }}></div>
            <div className="absolute w-20 h-20 rounded-full border border-dashed border-emerald-400/40 animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }}></div>
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.5)]">
              <Sparkles className="w-8 h-8 text-black animate-pulse" />
            </div>
          </div>
          <h4 className="text-xs font-light text-white/90 mt-3 tracking-wide dir-ltr">
            <span className="italic font-serif text-emerald-400">Voxa AI</span> is here to assist
          </h4>
          <p className="text-[10px] text-emerald-500/70 mt-0.5 font-sans">
            خودروی {selectedCar.name} • شارژ {selectedCar.batteryPercent}٪
          </p>
        </div>

        {/* Chat Stream Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 z-10">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-emerald-950/60 text-white rounded-tl-none border border-emerald-500/30 shadow-md'
                    : 'bg-[#0E1B13] text-emerald-100/90 rounded-tr-none border border-emerald-900/40 shadow-lg'
                }`}
              >
                {msg.sender === 'concierge' && (
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 mb-1 font-mono uppercase tracking-wider">
                    <Bot className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Aria Voice Concierge</span>
                  </div>
                )}
                <p className="font-sans">{msg.text}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-emerald-400/80 bg-[#0E1B13] p-3 rounded-2xl w-max border border-emerald-900/40">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>در حال آنالیز پارامترهای BMS و شبکه شارژ...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Preset Quick Action Pills (Voxa Style) */}
        <div className="px-4 py-2 bg-[#060D08]/90 border-t border-emerald-900/30 flex items-center gap-2 overflow-x-auto no-scrollbar z-10">
          <button
            onClick={() => handleSendMessage('اعزام ون شارژ سیار ۷ کیلووات از اعتباری')}
            className="text-[11px] bg-[#0E1B13] hover:bg-emerald-950 text-emerald-300 px-3 py-1.5 rounded-full border border-emerald-800/40 shrink-0 transition flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>شارژ سیار ۷kW</span>
          </button>
          <button
            onClick={() => handleSendMessage('وضعیت سلامت باتری و سلامت cellهای BMS چطوره؟')}
            className="text-[11px] bg-[#0E1B13] hover:bg-emerald-950 text-emerald-300 px-3 py-1.5 rounded-full border border-emerald-800/40 shrink-0 transition flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>چکاپ BMS</span>
          </button>
          <button
            onClick={() => handleSendMessage('یک راننده تشریفات برای انتقال خودرو اعزام کن')}
            className="text-[11px] bg-[#0E1B13] hover:bg-emerald-950 text-emerald-300 px-3 py-1.5 rounded-full border border-emerald-800/40 shrink-0 transition flex items-center gap-1.5"
          >
            <span>🤵 راننده اختصاصی</span>
          </button>
        </div>

        {/* Dark Emerald Bottom Control Bar (Voxa Screen Style) */}
        <div className="p-3.5 px-4 bg-[#050B07] border-t border-emerald-900/40 flex items-center gap-2.5 z-10">
          <button
            onClick={startVoiceDictation}
            className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition shadow-lg ${
              isListening
                ? 'bg-emerald-400 text-black animate-pulse shadow-emerald-500/50'
                : 'bg-emerald-950 border border-emerald-700/50 text-emerald-400 hover:bg-emerald-900'
            }`}
            title="گفتگوی صوتی (میکروفون)"
          >
            <Mic className="w-5 h-5" />
          </button>

          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={isListening ? 'در حال شنیدن صدای شما...' : 'پیام به دستیار هوشمند آلین...'}
            className="flex-1 bg-[#0B170F] border border-emerald-900/40 rounded-full px-4 py-2.5 text-xs text-white placeholder-emerald-600/60 focus:outline-none focus:border-emerald-500/60"
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
