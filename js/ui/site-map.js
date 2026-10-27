import { AF_ARTICLES, AF_DIRECTIONS, AF_LEGACY_DESTINATIONS } from '../data/af-public-content.js';
import { INTERNAL_PAGES } from '../data/internal-pages.js';
import { primaryNavigation } from '../data/primary-navigation.js';
import { TOPIC_PAGES } from '../data/topic-pages.js';

const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

// Read old page visits through their canonical destination, without migrating,
// clearing or manufacturing entries in the user's existing ledger.
function wasViewed(persistent, page) {
  if (persistent.viewed[page.id]?.viewed) return true;
  return Object.entries(persistent.viewed).some(([id, visit]) => visit?.viewed &&
    AF_LEGACY_DESTINATIONS[id.toLowerCase().replaceAll('_', '-')]?.split('#')[0] === page.href);
}

export function siteMapGroups() {
  const groups = AF_DIRECTIONS.map(direction => ({
    id: direction.id, label: `${direction.id.toUpperCase()}. ${direction.label}`,
    items: AF_ARTICLES.filter(article => article.letter === direction.id)
  }));
  groups.push({ id: 'overview', label: 'Обзорные страницы', items: [
    ...['BENEFITS-INDEX', 'LEARNING-OVERVIEW', 'BUSINESS-OVERVIEW'].map(id => INTERNAL_PAGES[id]),
    TOPIC_PAGES.ABOUT_SITE
  ].filter(page => page?.href) });
  groups.push({ id: 'materials', label: 'Материалы для скачивания', items:
    primaryNavigation.find(group => group.id === 'materials').items.filter(item => item.visible !== false && item.status === 'current' && item.download && item.href)
  });
  return groups;
}

export function renderToolMap(persistent, currentId = null, prefix = '') {
  return siteMapGroups().map(group => `<section class="site-map__group" data-map-direction="${group.id}"><h3>${escape(group.label)}</h3><div class="site-map__items">${group.items.map(item => {
    const viewed = !item.download && wasViewed(persistent, item), current = item.id === currentId;
    return `<a class="site-map__link${viewed ? ' is-viewed' : ''}${current ? ' is-current' : ''}" href="${escape(prefix + item.href)}" data-map-page="${item.id}"${current ? ' aria-current="page"' : ''}${item.download ? ` download="${escape(item.download)}" type="application/pdf"` : ''}><span class="site-map__mark" aria-hidden="true">${item.download ? '↓' : viewed ? '✓' : '·'}</span><span class="site-map__label">${escape(item.label)}${current ? '<small>Сейчас открыта</small>' : ''}</span>${viewed ? '<span class="sr-only"> — вы уже открывали эту страницу</span>' : ''}</a>`;
  }).join('')}</div></section>`).join('');
}

// Only the Map is nonmodal. The Equalizer keeps its existing modal lifecycle.
export function enhanceMapPanel({ dialog, getMarkup, beforeOpen }) {
  if (!dialog || typeof dialog.show !== 'function') return null;
  let origin = null;
  const root = document.documentElement;
  const triggers = [...document.querySelectorAll('[data-map-open]')];
  dialog.id ||= 'site-map-panel';
  for (const trigger of triggers) {
    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.setAttribute('aria-controls', dialog.id);
    trigger.setAttribute('aria-expanded', 'false');
  }
  function expanded(value) { triggers.forEach(trigger => trigger.setAttribute('aria-expanded', String(value))); }
  function refresh() {
    const body = dialog.querySelector('[data-map-groups]');
    const markup = getMarkup();
    if (body.innerHTML !== markup) body.innerHTML = markup;
  }
  function position() {
    if (!dialog.open) return;
    const viewport = window.visualViewport;
    const width = viewport?.width || innerWidth, height = viewport?.height || innerHeight;
    const vx = viewport?.offsetLeft || 0, vy = viewport?.offsetTop || 0;
    const desktop = matchMedia('(min-width: 981px)').matches;
    const rect = origin?.getBoundingClientRect();
    const visible = rect && rect.width > 0 && rect.bottom > 0 && rect.top < height;
    const anchor = visible ? rect : document.querySelector('[data-sidebar-toggle]').getBoundingClientRect();
    const sidebar = document.querySelector('.site-header');
    const reserved = root.dataset.sidebarPinned === 'false' ? 66 : sidebar.getBoundingClientRect().width;
    const left = desktop ? Math.min(reserved + 12, width - 292) : 12;
    const below = height - Math.max(0, anchor.bottom) - 20;
    const maxHeight = desktop ? Math.min(720, height - 24) : Math.min(640, below >= 240 ? below : Math.max(240, anchor.top - 20), height - 24);
    dialog.style.setProperty('--site-map-left', `${vx + left}px`);
    dialog.style.setProperty('--site-map-width', `${Math.min(440, width - left - 12)}px`);
    dialog.style.setProperty('--site-map-max-height', `${maxHeight}px`);
    const panelHeight = Math.min(dialog.getBoundingClientRect().height, maxHeight);
    const top = desktop ? anchor.bottom - panelHeight : below >= 240 ? anchor.bottom + 8 : anchor.top - panelHeight - 8;
    dialog.style.setProperty('--site-map-top', `${vy + Math.max(12, Math.min(top, height - panelHeight - 12))}px`);
  }
  function finish(restoreFocus = false) {
    const previous = origin;
    origin = null;
    expanded(false);
    if (restoreFocus && previous?.isConnected && previous.getClientRects().length) previous.focus({ preventScroll: true });
  }
  function close({ restoreFocus = false } = {}) {
    if (!dialog.open) return;
    const x = window.scrollX, y = window.scrollY;
    dialog.close();
    finish(restoreFocus);
    if (window.scrollX !== x || window.scrollY !== y) window.scrollTo(x, y);
  }
  function open(trigger = null) {
    beforeOpen();
    refresh();
    origin = trigger?.getClientRects().length ? trigger : triggers.find(link => link.getClientRects().length) || document.querySelector('[data-sidebar-toggle]');
    const x = window.scrollX, y = window.scrollY;
    // Give native focus placement a viewport-sized box before showing it.
    dialog.style.setProperty('--site-map-top', '12px');
    dialog.show();
    position();
    dialog.querySelector('h2').focus({ preventScroll: true });
    expanded(true);
    if (window.scrollX !== x || window.scrollY !== y) window.scrollTo(x, y);
    requestAnimationFrame(position); // collapsed sidebar may finish its focus-out peek
  }
  function outside(event) {
    if (!dialog.open || dialog.contains(event.target) || event.target.closest('[data-map-open]')) return;
    // Let the user's chosen control keep focus. Do not also dismiss the mobile
    // menu for this same click: that would move the reading page by its height.
    event.siteMapDismissed = true;
    const selected = document.activeElement;
    const keepFocus = selected && selected !== document.body && !dialog.contains(selected);
    close();
    if (keepFocus && selected.isConnected && document.activeElement !== selected) selected.focus({ preventScroll: true });
  }
  document.addEventListener('click', outside, true);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && dialog.open) {
      event.preventDefault(); event.stopImmediatePropagation(); close({ restoreFocus: true });
    }
  }, true);
  dialog.addEventListener('click', event => {
    if (event.target.closest('[data-map-close]')) close({ restoreFocus: true });
  });
  dialog.addEventListener('close', () => { if (!dialog.open && origin) finish(); });
  window.addEventListener('resize', position);
  window.addEventListener('scroll', position, { passive: true });
  window.visualViewport?.addEventListener('resize', position);
  window.visualViewport?.addEventListener('scroll', position);
  new ResizeObserver(position).observe(document.querySelector('.site-header'));
  refresh();
  return { open, close, refresh, toggle(trigger) { if (dialog.open) close({ restoreFocus: true }); else open(trigger); } };
}
