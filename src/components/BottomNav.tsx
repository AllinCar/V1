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
    { tab: 'home', icon: <Home className="w-5 h-5" strokeWidth={2.2} /> },
    { tab: 'services', icon: <Layers className="w-5 h-5" strokeWidth={2.2} /> },
    { tab: 'cars', icon: <Car className="w-5 h-5" strokeWidth={2.2} /> },
    { tab: 'profile', icon: <User className="w-5.5 h-5.5" strokeWidth={2.2} /> },
  ];

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 max-w-lg mx-auto pointer-events-none px-4">
      <div className="relative w-full bg-black/70 border border-white/15 rounded-[30px] px-2.5 pb-[calc(max(env(safe-area-inset-bottom),0.75rem))] pt-1.5 mb-1.5 backdrop-blur-2xl shadow-[0_16px_50px_rgba(0,0,0,0.7)] flex items-center justify-between pointer-events-auto">
        {/* Glossy sheen */}
        <div className="absolute inset-x-0 top-0 h-9 bg-gradient-to-b from-white/15 via-white/5 to-transparent rounded-t-[30px] pointer-events-none" />
        {/* Left nav items */}
        <div className="flex-1 flex items-center justify-around">
          {navItems.slice(0, 2).map(({ tab, icon }) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => onChangeTab(tab)}
                title={t[tab]}
                className="relative flex flex-col items-center gap-0.5 py-0.5 rounded-2xl transition-all active:scale-95 w-12"
              >
                <span
                  className="w-9 h-9 flex items-center justify-center rounded-xl transition-colors duration-200"
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
          className="relative shrink-0 mx-1 flex flex-col items-center justify-center gap-0.5 transition-transform hover:scale-105 active:scale-95"
          title={t.ai_concierge}
        >
          <span
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-black ring-4 ring-black/70 transition-transform"
            style={{
              backgroundColor: currentTheme.primaryHex,
              boxShadow: `0 10px 30px ${currentTheme.primaryHex}66`,
            }}
          >
            <Mic className="w-5.5 h-5.5 stroke-[2.5]" />
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
                className="relative flex flex-col items-center gap-0.5 py-0.5 rounded-2xl transition-all active:scale-95 w-12"
              >
                <span
                  className="w-9 h-9 flex items-center justify-center rounded-xl transition-colors duration-200"
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
