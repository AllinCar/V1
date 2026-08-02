export type Theme = 'dark' | 'light';

export const THEME_STORAGE_KEY = 'aleencar.theme';

export function isTheme(value: unknown): value is Theme {
  return value === 'dark' || value === 'light';
}

export function readStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(stored) ? stored : null;
  } catch {
    return null;
  }
}

export function systemTheme(): Theme {
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  return 'dark';
}

/** Resolve the initial theme: stored preference → pre-paint attribute → system. */
export function getInitialTheme(): Theme {
  const stored = readStoredTheme();
  if (stored) return stored;

  const attr = document.documentElement.getAttribute('data-theme');
  if (isTheme(attr)) return attr;

  return systemTheme();
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;

  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute('content', theme === 'dark' ? '#090a0b' : '#f5f7f8');
  }
}

/** Brief transition class so token colors interpolate smoothly on switch. */
export function enableThemeTransition(duration = 380) {
  const root = document.documentElement;
  root.classList.add('theme-anim');
  window.setTimeout(() => root.classList.remove('theme-anim'), duration);
}
