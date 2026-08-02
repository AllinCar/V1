import React from 'react';
import { ThemeAccent, Car, WalletState } from '../types';
import { Wrench, UserCheck, Zap, ArrowLeft } from 'lucide-react';
import { Language, translations } from '../translations';

interface ProactiveServiceSectionProps {
  currentTheme: ThemeAccent;
  selectedCar: Car;
  walletState: WalletState;
  onOpenChargeFlow: () => void;
  onBookDriverDirectly: () => void;
  onBookServiceDirectly: () => void;
  isMapExpanded: boolean;
  lang?: Language;
}

export const ProactiveServiceSection: React.FC<ProactiveServiceSectionProps> = ({
  currentTheme,
  selectedCar,
  walletState,
  onOpenChargeFlow,
  onBookDriverDirectly,
  onBookServiceDirectly,
  isMapExpanded,
  lang = 'fa',
}) => {
  if (isMapExpanded) return null;
  const t = translations[lang];

  return (
    <div className="absolute inset-x-4 bottom-28 max-w-lg mx-auto z-20 transition-all duration-300">
      <div className="flex items-center justify-between mb-2 px-1">
        <p className="text-[10px] uppercase tracking-[0.18em] font-bold text-[#C5A059] flex items-center gap-1.5 dir-ltr">
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currentTheme.primaryHex }}></span>
          <span>{lang === 'fa' ? 'QUICK VIP SERVICES' : 'QUICK VIP SERVICES'}</span>
        </p>
        <span className="text-[10px] text-white/40">{lang === 'fa' ? 'سوایپ به چپ ◄' : 'Swipe ◄'}</span>
      </div>

      {/* Horizontal Scrollable Row for Minimal Side-by-Side Cards */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar scrollbar-none snap-x snap-mandatory">
        {/* Proactive Card 1: Battery / EV Fast Charge Offer */}
        <div
          onClick={onOpenChargeFlow}
          className="min-w-[210px] max-w-[230px] shrink-0 snap-start bg-black/80 hover:bg-black/95 rounded-2xl p-3 backdrop-blur-2xl cursor-pointer transition-all active:scale-[0.98] group flex flex-col justify-between border border-white/10"
        >
          <div className="flex items-center justify-between mb-2">
            <div
              className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"
              style={{ color: currentTheme.primaryHex }}
            >
              <Zap className="w-4 h-4" />
            </div>
            <span className="text-[10px] bg-white/10 text-[#C5A059] px-2 py-0.5 rounded-md font-mono">
              {walletState.remainingKwh} kWh
            </span>
          </div>
          <div>
            <h4 className="text-xs font-bold text-white leading-tight">{t.fastChargeReady}</h4>
            <p className="text-[10px] text-white/50 mt-1 line-clamp-1">
              {lang === 'fa'
                ? `باتری ${selectedCar.batteryPercent}٪ • ون سیار`
                : `Battery ${selectedCar.batteryPercent}% • Mobile Van`}
            </p>
          </div>
          <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-[#C5A059]">
            <span>{t.bookNow}</span>
            <ArrowLeft className={`w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform ${lang === 'en' ? 'rotate-180' : ''}`} />
          </div>
        </div>

        {/* Proactive Card 2: 10,000 km Service Reminder */}
        {selectedCar.kmsSinceLastService >= 10000 && (
          <div
            onClick={onBookServiceDirectly}
            className="min-w-[210px] max-w-[230px] shrink-0 snap-start bg-black/80 hover:bg-black/95 rounded-2xl p-3 backdrop-blur-2xl cursor-pointer transition-all active:scale-[0.98] group flex flex-col justify-between border border-white/10"
          >
            <div className="flex items-center justify-between mb-2">
              <div
                className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"
                style={{ color: currentTheme.primaryHex }}
              >
                <Wrench className="w-4 h-4" />
              </div>
              <span className="text-[10px] bg-red-500/20 text-red-300 px-2 py-0.5 rounded-md font-mono">
                10k km
              </span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-white leading-tight">{t.bmsAlertTitle}</h4>
              <p className="text-[10px] text-white/50 mt-1 line-clamp-1">{t.bmsAlertDesc}</p>
            </div>
            <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-white/80">
              <span>{t.bookNow}</span>
              <ArrowLeft className={`w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform ${lang === 'en' ? 'rotate-180' : ''}`} />
            </div>
          </div>
        )}

        {/* Proactive Card 3: Need a Driver? */}
        <div
          onClick={onBookDriverDirectly}
          className="min-w-[210px] max-w-[230px] shrink-0 snap-start bg-black/80 hover:bg-black/95 rounded-2xl p-3 backdrop-blur-2xl cursor-pointer transition-all active:scale-[0.98] group flex flex-col justify-between border border-white/10"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white/80 shrink-0 group-hover:scale-110 transition-transform">
              <UserCheck className="w-4 h-4" />
            </div>
            <span className="text-[10px] bg-white/10 text-white/70 px-2 py-0.5 rounded-md font-mono">
              {walletState.remainingDrivers} {t.creditServices}
            </span>
          </div>
          <div>
            <h4 className="text-xs font-bold text-white leading-tight">{t.chauffeurTitle}</h4>
            <p className="text-[10px] text-white/50 mt-1 line-clamp-1">{t.chauffeurDesc}</p>
          </div>
          <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-white/80">
            <span>{t.orderOnline}</span>
            <ArrowLeft className={`w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform ${lang === 'en' ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </div>
    </div>
  );
};

