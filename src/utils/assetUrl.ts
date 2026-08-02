/**
 * Resolve a path under `public/` so it works with Vite's `base`
 * (e.g. `/V1/` on GitHub Pages, `/` in local/dev).
 */
export function assetUrl(path: string): string {
  const base = import.meta.env.BASE_URL || '/';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  const normalizedPath = path.replace(/^\/+/, '');
  return `${normalizedBase}${normalizedPath}`;
}
