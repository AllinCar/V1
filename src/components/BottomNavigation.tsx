import React from 'react';
import { createPortal } from 'react-dom';
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

const ICON_SIZE = 20;
const MIC_SIZE = 22;

const itemSpring: Transition = {
  type: 'spring',
  stiffness: 520,
  damping: 34,
  mass: 0.65,
};

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onChangeTab,
  onOpenAIConcierge,
  currentTheme,
  lang = 'fa',
  mode = 'dark',
}) => {
  const reduceMotion = useReducedMotion();
  const accent = currentTheme.primaryHex;
  const t = translations[lang];
  const inactive = 'var(--color-ink-4)';

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
            className="relative flex items-center justify-center rounded-[1.1rem] shadow-md"
            style={{
              width: 50,
              height: 50,
              backgroundColor: accent,
              marginTop: -14,
              boxShadow: `0 8px 24px ${accent}55`,
            }}
            whileTap={reduceMotion ? undefined : { scale: 0.92 }}
            whileHover={reduceMotion ? undefined : { scale: 1.04 }}
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
        className="relative flex-1 flex items-center justify-center h-full z-10"
        style={{ WebkitTapHighlightColor: 'transparent' }}
        title={item.label}
        aria-label={item.label}
        aria-current={isActive ? 'page' : undefined}
      >
        {isActive && (
          <motion.span
            layoutId="nav-active-pill"
            className="absolute inset-y-1.5 inset-x-1 rounded-xl"
            style={{ background: 'var(--color-surface-3)' }}
            transition={reduceMotion ? { duration: 0 } : itemSpring}
          />
        )}
        <motion.span
          className="relative flex items-center justify-center"
          animate={reduceMotion ? undefined : { scale: isActive ? 1.05 : 1 }}
          transition={reduceMotion ? { duration: 0 } : itemSpring}
          style={{ color: isActive ? accent : inactive }}
        >
          <item.Icon
            style={{ width: ICON_SIZE, height: ICON_SIZE }}
            strokeWidth={isActive ? 2.35 : 1.85}
          />
        </motion.span>
      </button>
    );
  };

  const dock = (
    <div className="bottom-nav-dock">
      <nav
        className="nav-capsule relative w-full max-w-sm pointer-events-auto flex items-center px-1.5 mb-1"
        style={{ height: '3.5rem' }}
        data-theme={mode === 'light' ? 'light' : undefined}
        aria-label={t.navMainAria}
      >
        {navItems.map(renderItem)}
      </nav>
    </div>
  );

  // Portal to <body> so iOS PWA never traps fixed nav inside overflow shells
  if (typeof document === 'undefined') return dock;
  return createPortal(dock, document.body);
};
