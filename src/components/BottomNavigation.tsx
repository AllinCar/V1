import React from 'react';
import { motion, useReducedMotion, type Transition } from 'motion/react';
import { Home, Layers, Car, User, Mic, type LucideIcon } from 'lucide-react';
import type { NavTab, ThemeAccent } from '../types';
import { Language, translations } from '../translations';

type NavItemKey = NavTab;
export type BottomNavMode = 'dark' | 'light' | 'auto';

interface NavItemConfig {
  key: NavItemKey;
  label: string;
  Icon: LucideIcon;
  /** AI Concierge — rendered as the raised center action */
  accent?: boolean;
}

interface BottomNavigationProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
  onOpenAIConcierge: () => void;
  currentTheme: ThemeAccent;
  lang?: Language;
  mode?: BottomNavMode;
}

const ICON_SIZE = 22;
const MIC_SIZE = 22;

const itemSpring: Transition = {
  type: 'spring',
  stiffness: 520,
  damping: 32,
  mass: 0.7,
};

const dotSpring: Transition = {
  type: 'spring',
  stiffness: 600,
  damping: 40,
  mass: 0.7,
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
  const isLight = mode === 'light';
  const inactiveInk = isLight ? 'rgba(28,28,36,0.45)' : '#888888';
  const accent = currentTheme.primaryHex;
  const t = translations[lang];

  const navItems: NavItemConfig[] = [
    { key: 'home', label: t.home, Icon: Home },
    { key: 'services', label: t.services, Icon: Layers },
    { key: 'ai_concierge', label: t.ai_concierge, Icon: Mic, accent: true },
    { key: 'cars', label: t.cars, Icon: Car },
    { key: 'profile', label: t.profile, Icon: User },
  ];

  const renderItem = (item: NavItemConfig) => {
    if (item.accent) {
      return (
        <button
          key={item.key}
          onClick={onOpenAIConcierge}
          className="relative flex-1 flex items-center justify-center h-full"
          style={{ WebkitTapHighlightColor: 'transparent' }}
          title={item.label}
          aria-label={item.label}
        >
          <motion.span
            className="relative flex items-center justify-center rounded-full shadow-lg"
            style={{
              width: 52,
              height: 52,
              backgroundColor: accent,
              marginTop: -10,
            }}
            whileTap={reduceMotion ? undefined : { scale: 0.92 }}
            transition={reduceMotion ? { duration: 0 } : itemSpring}
          >
            <item.Icon
              color="#0a0a0a"
              style={{ width: MIC_SIZE, height: MIC_SIZE }}
              strokeWidth={2.25}
            />
          </motion.span>
        </button>
      );
    }

    const isActive = activeTab === item.key;

    return (
      <button
        key={item.key}
        onClick={() => onChangeTab(item.key)}
        className="relative flex-1 flex flex-col items-center justify-center h-full gap-1"
        style={{ WebkitTapHighlightColor: 'transparent' }}
        title={item.label}
        aria-label={item.label}
        aria-current={isActive ? 'page' : undefined}
      >
        <motion.span
          className="relative flex items-center justify-center"
          animate={
            reduceMotion
              ? { opacity: isActive ? 1 : 0.9 }
              : { scale: isActive ? 1.06 : 1 }
          }
          transition={reduceMotion ? { duration: 0 } : itemSpring}
          style={{ color: isActive ? accent : inactiveInk }}
        >
          <item.Icon
            style={{ width: ICON_SIZE, height: ICON_SIZE }}
            strokeWidth={isActive ? 2.2 : 1.9}
          />
        </motion.span>

        {/* Active indicator dot */}
        <span className="h-1.5 flex items-center justify-center">
          {isActive && (
            <motion.span
              layoutId="nav-active-dot"
              className="block rounded-full"
              style={{
                width: 5,
                height: 5,
                backgroundColor: accent,
              }}
              initial={reduceMotion ? false : { scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={reduceMotion ? { duration: 0 } : dotSpring}
            />
          )}
        </span>
      </button>
    );
  };

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 pointer-events-none flex justify-center px-5 pb-[max(env(safe-area-inset-bottom),0.75rem)]">
      <nav
        className="nav-capsule relative w-full max-w-sm pointer-events-auto flex items-center px-2"
        style={{ height: '3.25rem' }}
        data-theme={isLight ? 'light' : undefined}
        aria-label={t.navMainAria}
      >
        {navItems.map(renderItem)}
      </nav>
    </div>
  );
};
