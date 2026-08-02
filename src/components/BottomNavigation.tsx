import React from 'react';
import { motion, useReducedMotion, type Transition } from 'motion/react';
import { Home, Layers, Car, User, Mic, type LucideIcon } from 'lucide-react';
import type { NavTab, ThemeAccent } from '../types';
import type { Language } from '../translations';

type NavItemKey = NavTab;
export type BottomNavMode = 'dark' | 'light' | 'auto';

interface NavItemConfig {
  key: NavItemKey;
  label: string;
  Icon: LucideIcon;
  /** AI Concierge — always rendered in the theme accent color */
  accent?: boolean;
}

interface BottomNavigationProps {
  /** Currently active tab / route key */
  activeTab: NavTab;
  /** Navigation callback — same routing contract as before */
  onChangeTab: (tab: NavTab) => void;
  /** Opens the central AI Concierge action */
  onOpenAIConcierge: () => void;
  /** App accent used for active states and the FAB */
  currentTheme: ThemeAccent;
  lang?: Language;
  /** 'auto' resolves to dark while the host app is dark-only */
  mode?: BottomNavMode;
}

const ICON_SIZE = 22;

const itemSpring: Transition = {
  type: 'spring',
  stiffness: 520,
  damping: 32,
  mass: 0.7,
};

const pillSpring: Transition = {
  type: 'spring',
  stiffness: 600,
  damping: 44,
  mass: 0.8,
};

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onChangeTab,
  onOpenAIConcierge,
  currentTheme,
  lang = 'fa',
  mode = 'auto',
}) => {
  const reduceMotion = useReducedMotion();

  // The host app is dark-only today; light material is opt-in for future themes.
  const isLight = mode === 'light';
  const dimInk = isLight ? 'rgba(28,28,36,0.55)' : 'rgba(244,244,246,0.45)';

  const navItems: NavItemConfig[] = [
    { key: 'home', label: lang === 'fa' ? 'نقشه' : 'Map', Icon: Home },
    { key: 'services', label: lang === 'fa' ? 'خدمات' : 'Services', Icon: Layers },
    { key: 'ai_concierge', label: lang === 'fa' ? 'دستیار' : 'AI', Icon: Mic, accent: true },
    { key: 'cars', label: lang === 'fa' ? 'خودروها' : 'Cars', Icon: Car },
    { key: 'profile', label: lang === 'fa' ? 'پروفایل' : 'Profile', Icon: User },
  ];

  const renderItem = (item: NavItemConfig) => {
    const accent = item.accent;
    const isActive = !accent && activeTab === item.key;
    const itemInk = accent ? currentTheme.primaryHex : dimInk;
    const isDimmed = !accent && !isActive;

    return (
      <button
        key={item.key}
        onClick={() => (accent ? onOpenAIConcierge() : onChangeTab(item.key))}
        className="relative flex-1 flex flex-col items-center justify-center gap-1 h-12 rounded-2xl"
        style={{ WebkitTapHighlightColor: 'transparent' }}
        title={item.label}
      >
        {/* Minimal compact pill behind the icon only */}
        <span className="relative w-10 h-9 flex items-center justify-center">
          {(accent || isActive) && (
            <motion.span
              layoutId={accent ? 'ios-nav-ai-pill' : 'ios-nav-active-pill'}
              className="absolute inset-[3px] rounded-full"
              style={{ backgroundColor: `${itemInk}14` }}
              transition={reduceMotion ? { duration: 0 } : pillSpring}
            />
          )}

          <motion.span
            className="relative flex items-center justify-center transition-colors duration-200"
            animate={
              reduceMotion
                ? { opacity: isDimmed ? 0.45 : 1 }
                : { scale: isActive ? 1.08 : 1, opacity: isDimmed ? 0.45 : 1 }
            }
            transition={reduceMotion ? { duration: 0 } : itemSpring}
            style={{ color: itemInk }}
          >
            <item.Icon
              className="drop-shadow-sm"
              style={{ width: ICON_SIZE, height: ICON_SIZE }}
              strokeWidth={accent || isActive ? 2.3 : 2.1}
            />
          </motion.span>
        </span>

        {/* Label */}
        <motion.span
          className="relative text-[9px] font-medium leading-none transition-colors duration-200"
          animate={{ opacity: isDimmed ? 0.45 : 1 }}
          transition={{ duration: 0.2 }}
          style={{ color: itemInk }}
        >
          {item.label}
        </motion.span>
      </button>
    );
  };

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 pointer-events-none flex justify-center px-4">
      <div
        className="nav-ios relative w-full max-w-md pointer-events-auto rounded-[24px] px-1.5 mb-1.5 flex items-center"
        style={{ height: 'calc(3.5rem + max(env(safe-area-inset-bottom), 0.625rem))' }}
        data-theme={isLight ? 'light' : undefined}
      >
        {navItems.map(renderItem)}
      </div>
    </div>
  );
};
