// Deliberately parser-blocking and independent of the application module graph.
// The shared generator places this in <head>, before CSS and body can paint.
(() => {
  const root = document.documentElement;
  let pinned = true;
  try { pinned = sessionStorage.getItem('ai-v-delo-sidebar-pinned-v1') !== 'false'; } catch { /* private storage */ }
  root.dataset.sidebarPinned = String(pinned);
  root.dataset.sidebarMobileOpen = 'false';
  root.dataset.sidebarReady = 'true';
})();
