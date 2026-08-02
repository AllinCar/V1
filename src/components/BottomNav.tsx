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

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 max-w-lg mx-auto pointer-events-none pb-[calc(env(safe-area-inset-bottom)+0.75rem)] px-6">
      <div className="w-full bg-black/90 border border-white/10 rounded-full py-1.5 px-4 backdrop-blur-2xl flex items-center justify-between pointer-events-auto relative">
        {/* 1. Home */}
        <button
          onClick={() => onChangeTab('home')}
          title={t.home}
          className="relative flex flex-col items-center justify-center p-2 rounded-full transition-all text-white/40 hover:text-white"
        >
          <Home
            className="w-5 h-5 transition-colors"
            style={{ color: activeTab === 'home' ? currentTheme.primaryHex : undefined }}
          />
          {activeTab === 'home' && (
            <span
              className="absolute -bottom-0.5 w-1 h-1 rounded-full animate-pulse"
              style={{ backgroundColor: currentTheme.primaryHex }}
            />
          )}
        </button>

        {/* 2. Services */}
        <button
          onClick={() => onChangeTab('services')}
          title={t.services}
          className="relative flex flex-col items-center justify-center p-2 rounded-full transition-all text-white/40 hover:text-white"
        >
          <Layers
            className="w-5 h-5 transition-colors"
            style={{ color: activeTab === 'services' ? currentTheme.primaryHex : undefined }}
          />
          {activeTab === 'services' && (
            <span
              className="absolute -bottom-0.5 w-1 h-1 rounded-full animate-pulse"
              style={{ backgroundColor: currentTheme.primaryHex }}
            />
          )}
        </button>

        {/* 3. Central AI Agent Concierge (Inline Voice Button) */}
        <button
          onClick={onOpenAIConcierge}
          className="w-11 h-11 rounded-full flex items-center justify-center text-black transition-transform hover:scale-105 active:scale-95 shrink-0"
          style={{
            backgroundColor: currentTheme.primaryHex,
          }}
          title={t.ai_concierge}
        >
          <Mic className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* 4. Cars */}
        <button
          onClick={() => onChangeTab('cars')}
          title={t.cars}
          className="relative flex flex-col items-center justify-center p-2 rounded-full transition-all text-white/40 hover:text-white"
        >
          <Car
            className="w-5 h-5 transition-colors"
            style={{ color: activeTab === 'cars' ? currentTheme.primaryHex : undefined }}
          />
          {activeTab === 'cars' && (
            <span
              className="absolute -bottom-0.5 w-1 h-1 rounded-full animate-pulse"
              style={{ backgroundColor: currentTheme.primaryHex }}
            />
          )}
        </button>

        {/* 5. Profile */}
        <button
          onClick={() => onChangeTab('profile')}
          title={t.profile}
          className="relative flex flex-col items-center justify-center p-2 rounded-full transition-all text-white/40 hover:text-white"
        >
          <User
            className="w-5 h-5 transition-colors"
            style={{ color: activeTab === 'profile' ? currentTheme.primaryHex : undefined }}
          />
          {activeTab === 'profile' && (
            <span
              className="absolute -bottom-0.5 w-1 h-1 rounded-full animate-pulse"
              style={{ backgroundColor: currentTheme.primaryHex }}
            />
          )}
        </button>
      </div>
    </div>
  );
};
