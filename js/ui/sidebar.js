// Left navigation experiment. The canonical header and links remain unchanged.
// State is per-tab so preferences do not outlive the current browser session.
const KEY = 'ai-v-delo-sidebar-pinned-v1';

export function enhanceSidebar(header = document.querySelector('.site-header')) {
  if (!header || header.dataset.sidebarEnhanced) return;
  const nav = header.querySelector('[data-primary-nav]');
  const inner = header.querySelector('.site-header__inner');
  if (!nav || !inner) return;
  header.dataset.sidebarEnhanced = 'true';
  const root = document.documentElement;
  const desktop = window.matchMedia('(min-width: 981px)');
  let pinned = true;
  try { pinned = sessionStorage.getItem(KEY) !== 'false'; } catch { /* private storage */ }
  root.dataset.sidebarPinned = String(pinned);
  root.dataset.sidebarMobileOpen = 'false';

  for (const group of nav.querySelectorAll('[data-menu-group]')) {
    const summary = group.querySelector('summary');
    if (!summary) continue;
    const node = [...summary.childNodes].find(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
    if (!node) continue;
    const label = node.textContent.trim();
    const text = document.createElement('span');
    text.className = 'sidebar-nav-label';
    text.textContent = label;
    node.replaceWith(text);
    summary.setAttribute('aria-label', label);
    const emblem = document.createElement('span');
    emblem.className = 'ui-icon sidebar-nav-emblem';
    emblem.setAttribute('aria-hidden', 'true');
    emblem.dataset.sidebarIcon = group.dataset.menuGroup;
    summary.prepend(emblem);
  }
  for (const link of header.querySelectorAll('.header-action')) {
    const caption = link.querySelector('span:last-child')?.textContent?.trim();
    if (caption) {
      link.title = caption;
      link.setAttribute('aria-label', caption);
    }
  }

  const toggle = header.querySelector('[data-sidebar-toggle]') || document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'sidebar-toggle';
  toggle.dataset.sidebarToggle = '';
  if (!toggle.firstElementChild) toggle.innerHTML = '<span class="sidebar-toggle__symbol" aria-hidden="true"></span><span class="sidebar-toggle__label"></span>';
  if (toggle.parentElement !== inner) inner.insertBefore(toggle, nav);
  let hoverTimer;
  const openGroups = () => [...nav.querySelectorAll('details[open]')];
  const closeGroups = () => openGroups().forEach(group => { group.open = false; });

  function sync() {
    root.dataset.sidebarPinned = String(pinned);
    const mobileOpen = root.dataset.sidebarMobileOpen === 'true';
    const expanded = desktop.matches ? pinned : mobileOpen;
    toggle.setAttribute('aria-expanded', String(expanded));
    toggle.setAttribute('aria-label', desktop.matches
      ? (pinned ? 'Свернуть меню' : 'Развернуть меню')
      : (mobileOpen ? 'Закрыть меню' : 'Открыть меню'));
    toggle.title = toggle.getAttribute('aria-label');
    toggle.querySelector('.sidebar-toggle__label').textContent = desktop.matches
      ? (pinned ? 'Свернуть меню' : 'Развернуть меню') : (mobileOpen ? 'Закрыть' : 'Меню');
  }

  function showPeek(event) {
    // The Map button launches its own panel: peeking on pointer focus would
    // move the bottom action between pointerdown and click on a collapsed rail.
    if (event?.target?.closest('[data-map-open]') || document.querySelector('[data-map-drawer][open]')) {
      clearTimeout(hoverTimer);
      return;
    }
    if (!desktop.matches || pinned) return;
    header.classList.add('sidebar-peeking');
  }
  function hidePeek() {
    header.classList.remove('sidebar-peeking');
  }

  toggle.addEventListener('click', () => {
    clearTimeout(hoverTimer);
    if (desktop.matches) {
      pinned = !pinned;
      if (!pinned) closeGroups();
      hidePeek();
      try { sessionStorage.setItem(KEY, String(pinned)); } catch { /* private storage */ }
    } else {
      root.dataset.sidebarMobileOpen = String(root.dataset.sidebarMobileOpen !== 'true');
      if (root.dataset.sidebarMobileOpen === 'false') closeGroups();
    }
    sync();
  });

  header.addEventListener('mouseenter', () => {
    if (!desktop.matches || pinned) return;
    clearTimeout(hoverTimer);
    hoverTimer = setTimeout(showPeek, 420);
  });
  header.addEventListener('mouseleave', () => {
    clearTimeout(hoverTimer);
    if (!desktop.matches || pinned) return;
    hidePeek();
    closeGroups();
  });
  header.addEventListener('focusin', showPeek);
  header.addEventListener('focusout', () => {
    if (!desktop.matches || pinned) return;
    queueMicrotask(() => {
      if (!header.contains(document.activeElement)) { hidePeek(); closeGroups(); }
    });
  });
  nav.addEventListener('click', event => {
    if (desktop.matches && !pinned && event.target.closest('summary')) {
      clearTimeout(hoverTimer);
      showPeek();
    }
    if (!desktop.matches && event.target.closest('.primary-nav__panel a')) {
      root.dataset.sidebarMobileOpen = 'false';
      sync();
    }
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || document.querySelector('[data-map-drawer][open]')) return;
    if (!desktop.matches && root.dataset.sidebarMobileOpen === 'true') {
      root.dataset.sidebarMobileOpen = 'false';
      closeGroups();
      sync();
      toggle.focus();
    } else if (desktop.matches && !pinned && header.classList.contains('sidebar-peeking')) {
      hidePeek();
      closeGroups();
      toggle.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!desktop.matches && root.dataset.sidebarMobileOpen === 'true' && !header.contains(event.target) && !event.target.closest('[data-map-drawer]') && !event.siteMapDismissed) {
      root.dataset.sidebarMobileOpen = 'false';
      closeGroups();
      sync();
    }
  });
  desktop.addEventListener('change', () => {
    clearTimeout(hoverTimer);
    hidePeek();
    root.dataset.sidebarMobileOpen = 'false';
    closeGroups();
    sync();
  });

  root.dataset.sidebarReady = 'true';
  sync();
  root.dataset.sidebarInteractive = 'true';
}

