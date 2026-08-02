let installed = false;

/**
 * iOS PWA (Add to Home Screen) viewport fix.
 *
 * In standalone mode WebKit can resolve the CSS viewport height short by the
 * bottom safe-area inset, so `position: fixed; bottom: 0` elements (the bottom
 * nav dock) sit above the home indicator leaving a visible gap at the bottom
 * of the screen. We measure the real geometry with DOM probes and publish it
 * as CSS custom properties so the app shell fills the full physical screen and
 * the nav dock stays pinned to the true bottom edge.
 *
 * Exposes:
 *   --app-height        real viewport height in px (html/body/#root/.app-shell)
 *   --nav-bottom-shift  px offset (0 or negative) the dock needs to reach the
 *                       physical bottom edge
 */
export function applyIOSStandaloneViewportFix() {
  if (installed || typeof window === 'undefined' || typeof document === 'undefined') return;
  installed = true;

  const isStandalone =
    (window.navigator as { standalone?: boolean }).standalone === true ||
    (typeof window.matchMedia === 'function' &&
      window.matchMedia('(display-mode: standalone)').matches);

  if (!isStandalone) return;

  const setVars = () => {
    try {
      const root = document.documentElement;

      // Bottom safe-area inset, measured instead of parsed so env() latency
      // (cold-start race on iOS) can never leave us with a stale zero.
      const insetProbe = document.createElement('div');
      insetProbe.style.cssText =
        'position:fixed;left:0;bottom:0;width:1px;height:env(safe-area-inset-bottom,0px);visibility:hidden;pointer-events:none;';
      document.body.appendChild(insetProbe);
      const insetBottom = insetProbe.offsetHeight || 0;
      insetProbe.remove();

      // Where the fixed-position viewport's bottom edge actually lands.
      const bottomProbe = document.createElement('div');
      bottomProbe.style.cssText =
        'position:fixed;left:0;bottom:0;width:1px;height:1px;visibility:hidden;pointer-events:none;';
      document.body.appendChild(bottomProbe);
      const fixedBottomY = bottomProbe.getBoundingClientRect().bottom;
      bottomProbe.remove();

      const vv = window.visualViewport;
      const physicalHeight = Math.round(vv && vv.height ? vv.height : window.innerHeight);

      root.style.setProperty('--app-height', `${physicalHeight}px`);

      const shift = Math.max(0, Math.round(physicalHeight - fixedBottomY));
      root.style.setProperty('--nav-bottom-shift', shift > 0 ? `-${shift}px` : '0px');
    } catch {
      /* measurement must never crash the app */
    }
  };

  setVars();

  window.addEventListener('resize', setVars);
  window.addEventListener('orientationchange', setVars);
  window.visualViewport?.addEventListener('resize', setVars);
  window.visualViewport?.addEventListener('scroll', setVars);

  // env()/safe-area values can populate late on a cold start, so re-measure.
  window.setTimeout(setVars, 100);
  window.setTimeout(setVars, 300);
  window.setTimeout(setVars, 800);
}
