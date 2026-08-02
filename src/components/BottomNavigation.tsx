import React from 'react';
import { motion, useReducedMotion, type Transition } from 'motion/react';
import { Home, Layers, Car, User, Mic, type LucideIcon } from 'lucide-react';
import type { NavTab, ThemeAccent } from '../types';
import type { Language } from '../translations';

type NavItemKey = Exclude<NavTab, 'ai_concierge'>;
export type BottomNavMode = 'dark' | 'light' | 'auto';

interface NavItemConfig {
  key: NavItemKey;
  label: string;
  Icon: LucideIcon;
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

const fabSpring: Transition = {
  type: 'spring',
  stiffness: 480,
  damping: 28,
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
    { key: 'cars', label: lang === 'fa' ? 'خودروها' : 'Cars', Icon: Car },
    { key: 'profile', label: lang === 'fa' ? 'پروفایل' : 'Profile', Icon: User },
  ];

  const aiLabel = lang === 'fa' ? 'دستیار' : 'AI';

  const leftItems = navItems.slice(0, 2);
  const rightItems = navItems.slice(2);

  const renderItem = (item: NavItemConfig) => {
    const isActive = activeTab === item.key;
    const activeInk = currentTheme.primaryHex;

    return (
      <button
        key={item.key}
        onClick={() => onChangeTab(item.key)}
        className="relative flex-1 flex flex-col items-center justify-center gap-1 h-12 rounded-2xl"
        style={{ WebkitTapHighlightColor: 'transparent' }}
        title={item.label}
      >
        {/* Minimal compact pill behind the icon only */}
        <span className="relative w-10 h-9 flex items-center justify-center">
          {isActive && (
            <motion.span
              layoutId="ios-nav-active-pill"
              className="absolute inset-[3px] rounded-full"
              style={{ backgroundColor: `${activeInk}14` }}
              transition={reduceMotion ? { duration: 0 } : pillSpring}
            />
          )}

          <motion.span
            className="relative flex items-center justify-center transition-colors duration-200"
            animate={
              reduceMotion
                ? { opacity: isActive ? 1 : 0.45 }
                : { scale: isActive ? 1.08 : 1, opacity: isActive ? 1 : 0.45 }
            }
            transition={reduceMotion ? { duration: 0 } : itemSpring}
            style={{ color: isActive ? activeInk : dimInk }}
          >
            <item.Icon
              className="drop-shadow-sm"
              style={{ width: ICON_SIZE, height: ICON_SIZE }}
              strokeWidth={isActive ? 2.3 : 2.1}
            />
          </motion.span>
        </span>

        {/* Label */}
        <motion.span
          className="relative text-[9px] font-medium leading-none transition-colors duration-200"
          animate={{ opacity: reduceMotion || isActive ? 1 : 0.45 }}
          transition={{ duration: 0.2 }}
          style={{ color: isActive ? activeInk : dimInk }}
        >
          {item.label}
        </motion.span>
      </button>
    );
  };

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 pointer-events-none flex justify-center px-4">
      <div
        className="nav-ios relative w-full max-w-md pointer-events-auto rounded-[28px] px-2.5 mb-1.5 flex items-center justify-between"
        style={{ height: 'calc(3.5rem + max(env(safe-area-inset-bottom), 0.625rem))' }}
        data-theme={isLight ? 'light' : undefined}
      >
        {/* Glossy top sheen */}
        <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-white/[0.10] via-white/[0.03] to-transparent rounded-t-[28px] pointer-events-none" />

        {/* Left group */}
        <div className="flex-1 flex items-center">
          {leftItems.map(renderItem)}
        </div>

        {/* Central AI Concierge — elevated floating action */}
        <motion.button
          onClick={onOpenAIConcierge}
          className="relative shrink-0 -mt-2.5 mx-1.5 z-10 flex flex-col items-center justify-center gap-1"
          whileHover={reduceMotion ? undefined : { scale: 1.05 }}
          whileTap={reduceMotion ? undefined : { scale: 0.94 }}
          transition={reduceMotion ? { duration: 0 } : fabSpring}
          title={aiLabel}
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <span
            className="w-[52px] h-[52px] rounded-[18px] flex items-center justify-center text-black"
            style={{
              backgroundColor: currentTheme.primaryHex,
              border: '1px solid color-mix(in oklab, white 28%, transparent)',
              boxShadow: `0 14px 30px ${currentTheme.primaryHex}59, 0 2px 8px ${currentTheme.primaryHex}40`,
            }}
          >
            <Mic className="w-[24px] h-[24px] stroke-[2.4]" />
          </span>
          <span
            className="text-[9px] font-bold leading-none"
            style={{ color: isLight ? 'var(--nav-ink)' : 'var(--nav-ink-dim)' }}
          >
            {aiLabel}
          </span>
        </motion.button>

        {/* Right group */}
        <div className="flex-1 flex items-center">
          {rightItems.map(renderItem)}
        </div>
      </div>
    </div>
  );
};
