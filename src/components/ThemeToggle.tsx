import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Moon, Sun } from 'lucide-react';
import type { Theme } from '../theme/theme';
import { Language, translations } from '../translations';

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
  onSelect?: (theme: Theme) => void;
  variant?: 'icon' | 'switch';
  lang?: Language;
  className?: string;
}

const ICON_SPRING = { type: 'spring' as const, stiffness: 480, damping: 34, mass: 0.8 };
const SEGMENT_SPRING = { type: 'spring' as const, stiffness: 520, damping: 36, mass: 0.7 };

/** Animated Sun/Moon icon — quick toggle for the top app bar. */
export const ThemeToggleIcon: React.FC<{ theme: Theme; onToggle: () => void; label: string; className?: string }> = ({
  theme,
  onToggle,
  label,
  className,
}) => (
  <button
    onClick={onToggle}
    className={`icon-btn rounded-full group ${className ?? ''}`}
    title={label}
    aria-label={label}
    aria-pressed={theme === 'light'}
  >
    <span className="relative flex items-center justify-center w-4 h-4">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          className="absolute flex items-center justify-center"
          initial={{ rotate: -100, opacity: 0, scale: 0.4 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 100, opacity: 0, scale: 0.4 }}
          transition={ICON_SPRING}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-ok" />
          ) : (
            <Moon className="w-4 h-4 text-ok" />
          )}
        </motion.span>
      </AnimatePresence>
    </span>
  </button>
);

/** Premium segmented Light/Dark control — Settings panel. */
export const ThemeToggleSwitch: React.FC<{
  theme: Theme;
  onSelect: (theme: Theme) => void;
  lightLabel: string;
  darkLabel: string;
}> = ({ theme, onSelect, lightLabel, darkLabel }) => {
  const options = [
    { value: 'light' as Theme, label: lightLabel, Icon: Sun },
    { value: 'dark' as Theme, label: darkLabel, Icon: Moon },
  ];

  return (
    <div
      className="relative grid grid-cols-2 gap-1 rounded-2xl border border-border bg-surface-1 p-1"
      role="radiogroup"
      aria-label="theme"
    >
      {options.map(({ value, label, Icon }) => {
        const isActive = theme === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onSelect(value)}
            className={`relative flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold transition-colors duration-200 ${
              isActive ? 'text-on-accent' : 'text-ink-4 hover:text-ink-2'
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="theme-switch-segment"
                className="absolute inset-0 rounded-xl bg-accent shadow-md"
                transition={SEGMENT_SPRING}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <Icon className="w-4 h-4" strokeWidth={2.2} />
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  theme,
  onToggle,
  onSelect,
  variant = 'icon',
  lang = 'fa',
  className,
}) => {
  const t = translations[lang];
  const label = theme === 'dark' ? t.themeSwitchToLight : t.themeSwitchToDark;

  if (variant === 'switch') {
    return (
      <ThemeToggleSwitch
        theme={theme}
        onSelect={(next) => (onSelect ? onSelect(next) : onToggle())}
        lightLabel={t.themeLightLabel}
        darkLabel={t.themeDarkLabel}
      />
    );
  }

  return <ThemeToggleIcon theme={theme} onToggle={onToggle} label={label} className={className} />;
};
