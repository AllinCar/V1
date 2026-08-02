import React from 'react';
import { NavTab, ThemeAccent } from '../types';
import { Home, Layers, Mic, Car, User } from 'lucide-react';
import { Language, translations } from '../translations';

interface BottomNavProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
  onOpenAIConcierge: () => void;
  currentTheme: ThemeAccent;
  lang?: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  onOpenAIConcierge,
  currentTheme,
  lang = 'fa',
}) => {
  const t = translations[lang];

  const shortLabels: Record<Exclude<NavTab, 'ai_concierge'>, string> = {
    home: lang === 'fa' ? 'نقشه' : 'Map',
    services: lang === 'fa' ? 'خدمات' : 'Services',
    cars: lang === 'fa' ? 'خودروها' : 'Cars',
    profile: lang === 'fa' ? 'پروفایل' : 'Profile',
  };

  const navItems: { tab: Exclude<NavTab, 'ai_concierge'>; icon: React.ReactNode }[] = [
    { tab: 'home', icon: <Home className="w-5.5 h-5.5" strokeWidth={2.2} /> },
    { tab: 'services', icon: <Layers className="w-5.5 h-5.5" strokeWidth={2.2} /> },
    { tab: 'cars', icon: <Car className="w-5.5 h-5.5" strokeWidth={2.2} /> },
    { tab: 'profile', icon: <User className="w-5.5 h-5.5" strokeWidth={2.2} /> },
  ];

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 max-w-lg mx-auto pointer-events-none">
      <div className="w-full bg-black/90 border-t border-x border-white/10 rounded-t-[28px] px-2.5 pb-[calc(max(env(safe-area-inset-bottom),0.5rem))] pt-2 backdrop-blur-2xl shadow-[0_-8px_40px_rgba(0,0,0,0.8)] flex items-center justify-between pointer-events-auto relative">
        {/* Left nav items */}
        <div className="flex-1 flex items-center justify-around">
          {navItems.slice(0, 2).map(({ tab, icon }) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => onChangeTab(tab)}
                title={t[tab]}
                className="relative flex flex-col items-center gap-1 py-1 rounded-2xl transition-all active:scale-95 w-14"
              >
                <span
                  className="w-10 h-10 flex items-center justify-center rounded-2xl transition-colors duration-200"
                  style={{
                    backgroundColor: isActive ? `${currentTheme.primaryHex}1F` : 'transparent',
                    color: isActive ? currentTheme.primaryHex : 'rgba(255,255,255,0.45)',
                  }}
                >
                  {icon}
                </span>
                <span
                  className="text-[10px] font-semibold leading-none transition-colors duration-200"
                  style={{
                    color: isActive ? currentTheme.primaryHex : 'rgba(255,255,255,0.45)',
                  }}
                >
                  {shortLabels[tab]}
                </span>
                {isActive && (
                  <span
                    className="absolute -top-0.5 w-1 h-1 rounded-full animate-pulse"
                    style={{ backgroundColor: currentTheme.primaryHex }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Central AI Agent Concierge (Elevated FAB) */}
        <button
          onClick={onOpenAIConcierge}
          className="relative shrink-0 -mt-8 mx-1 flex flex-col items-center justify-center gap-1 transition-transform hover:scale-105 active:scale-95"
          title={t.ai_concierge}
        >
          <span
            className="w-14 h-14 rounded-[22px] flex items-center justify-center text-black ring-4 ring-black/70 transition-transform"
            style={{
              backgroundColor: currentTheme.primaryHex,
              boxShadow: `0 10px 30px ${currentTheme.primaryHex}66`,
            }}
          >
            <Mic className="w-6 h-6 stroke-[2.5]" />
          </span>
          <span className="text-[9px] font-bold leading-none text-white/60">{lang === 'fa' ? 'دستیار' : 'AI'}</span>
        </button>

        {/* Right nav items */}
        <div className="flex-1 flex items-center justify-around">
          {navItems.slice(2).map(({ tab, icon }) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => onChangeTab(tab)}
                title={t[tab]}
                className="relative flex flex-col items-center gap-1 py-1 rounded-2xl transition-all active:scale-95 w-14"
              >
                <span
                  className="w-10 h-10 flex items-center justify-center rounded-2xl transition-colors duration-200"
                  style={{
                    backgroundColor: isActive ? `${currentTheme.primaryHex}1F` : 'transparent',
                    color: isActive ? currentTheme.primaryHex : 'rgba(255,255,255,0.45)',
                  }}
                >
                  {icon}
                </span>
                <span
                  className="text-[10px] font-semibold leading-none transition-colors duration-200"
                  style={{
                    color: isActive ? currentTheme.primaryHex : 'rgba(255,255,255,0.45)',
                  }}
                >
                  {shortLabels[tab]}
                </span>
                {isActive && (
                  <span
                    className="absolute -top-0.5 w-1 h-1 rounded-full animate-pulse"
                    style={{ backgroundColor: currentTheme.primaryHex }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
