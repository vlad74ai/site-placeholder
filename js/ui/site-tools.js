import { renderToolMap, enhanceMapPanel } from './site-map.js?v=w8-1';
export { renderToolMap } from './site-map.js?v=w8-1';
import { semanticNodes } from '../data/site-content.js';
import { relations, mapGroups } from '../data/navigation.js';
import { nodeMinLevels, blockMinLevels, blockTextByLevel } from '../data/layers.js';
import { INTERNAL_PAGES } from '../data/internal-pages.js';
import { buildViewModel } from '../core/presentation.js';
import { difficultyLabels } from '../core/state.js';
import { syncSettingControls } from './render.js?v=public-prune-1';
import { utilityNavigation } from '../data/primary-navigation.js';
import { launchFeatures, publicPresentationSettings } from '../data/launch-features.js';


export function readingToolLinks(prefix = '../') {
  return `<div class="reading-tools" aria-label="Инструменты во время чтения">${utilityNavigation.filter(item => item.visible !== false && ['map', 'equalizer'].includes(item.action)).map(item =>
    `<a class="reading-tool" href="${prefix}index.html?tool=${item.action}" data-${item.action}-open aria-label="${item.label}" title="${item.label}"><span class="ui-icon ui-icon--${item.icon}" aria-hidden="true"></span></a>`).join('')}</div>`;
}

export function buildSiteModel(persistent, nodeId = null, exampleId = null, entryContext = null) {
  return buildViewModel({ semanticNodes, relations, mapGroups, nodeMinLevels, blockMinLevels,
    blockTextByLevel, state: { persistent, session: { currentNodeId: nodeId,
      currentExampleId: exampleId, entryContext, helperDismissedForNode: null } } });
}

// The Equalizer retains its native modal focus/scroll lifecycle.
export function enhanceSiteTools({ getPersistent, onSetting, onReset, currentId = null, prefix = '' }) {
  const dialogs = { equalizer: document.querySelector('[data-equalizer-drawer]') };
  if (!dialogs.equalizer || typeof dialogs.equalizer.showModal !== 'function') return null;
  const mapPanel = enhanceMapPanel({ dialog: document.querySelector('[data-map-drawer]'),
    getMarkup: () => renderToolMap(getPersistent(), currentId, prefix),
    beforeOpen() { closeEqualizer(); document.dispatchEvent(new Event('site-tool-opening')); refresh(); }
  });
  let active = null;
  let origin = null;

  function refresh() {
    const persistent = getPersistent();
    mapPanel?.refresh();
    syncSettingControls(document, publicPresentationSettings(persistent.settings), difficultyLabels);
    for (const key of ['level', 'detail', 'helper']) {
      dialogs.equalizer.querySelectorAll(`[data-${key}]`).forEach(button => {
        button.setAttribute('aria-pressed', String(button.dataset[key] === persistent.settings[key]));
      });
    }
    document.querySelectorAll('.site-header [data-map-open]').forEach(link => { link.hidden = !launchFeatures.semanticMap || (launchFeatures.adaptivePresentation && !persistent.settings.mapVisible); });
    const note = dialogs.equalizer.querySelector('[data-fixed-article-note]');
    if (note) note.hidden = !INTERNAL_PAGES[currentId];
  }

  function finishClose() {
    if (!active) return;
    const previous = origin;
    active = null; origin = null;
    document.documentElement.classList.remove('site-tool-open');
    document.querySelectorAll('[data-equalizer-open]').forEach(link => link.setAttribute('aria-expanded', 'false'));
    if (previous?.trigger?.isConnected) previous.trigger.focus({ preventScroll: true });
    if (previous) window.scrollTo(previous.x, previous.y);
  }
  function closeEqualizer() {
    if (!active) return;
    const dialog = active;
    dialog.close();
    finishClose();
  }
  function close() { mapPanel?.close(); closeEqualizer(); }
  function open(name, trigger = null) {
    if (name === 'map') { if (launchFeatures.semanticMap) mapPanel?.toggle(trigger); return; }
    const dialog = dialogs[name];
    if ((name === 'equalizer' && !launchFeatures.adaptivePresentation) || (name === 'map' && !launchFeatures.semanticMap)) return;
    if (!dialog || active === dialog) return;
    close();
    document.dispatchEvent(new Event('site-tool-opening'));
    refresh();
    origin = { trigger, x: window.scrollX, y: window.scrollY };
    active = dialog;
    dialog.showModal();
    document.documentElement.classList.add('site-tool-open');
    trigger?.setAttribute('aria-expanded', 'true');
    dialog.querySelector('h2').focus({ preventScroll: true });
  }
  for (const [name, dialog] of Object.entries(dialogs)) {
    dialog.querySelector('h2').tabIndex = -1;
    dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
    dialog.addEventListener('close', () => { if (active === dialog && !dialog.open) finishClose(); });
    dialog.addEventListener('keydown', event => {
      if (event.key !== 'Tab') return;
      const stops = [...dialog.querySelectorAll('a[href], button:not([disabled]), input:not([disabled])')].filter(el => el.getClientRects().length);
      if (!stops.length) return;
      if (event.shiftKey && (document.activeElement === stops[0] || document.activeElement === dialog.querySelector('h2'))) {
        event.preventDefault(); stops.at(-1).focus();
      } else if (!event.shiftKey && document.activeElement === stops.at(-1)) {
        event.preventDefault(); stops[0].focus();
      }
    });
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const r = dialog.getBoundingClientRect();
      if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) close();
    });
    document.querySelectorAll(`[data-${name}-open]`).forEach(link => {
      link.setAttribute('aria-haspopup', 'dialog'); link.setAttribute('aria-controls', dialog.id ||= `site-${name}-dialog`);
      link.setAttribute('aria-expanded', 'false');
    });
  }
  document.addEventListener('click', event => {
    const target = event.target.closest('button, a');
    if (!target || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const name = target.matches('[data-map-open]') ? 'map' : target.matches('[data-equalizer-open]') ? 'equalizer' : null;
    if (name) { event.preventDefault(); open(name, target); return; }
    if (!active?.contains(target)) return;
    if (target.matches('[data-map-close], [data-equalizer-close]')) { close(); return; }
    for (const key of ['level', 'detail', 'helper']) {
      if (target.hasAttribute(`data-${key}`)) { onSetting(key, target.dataset[key]); refresh(); return; }
    }
    if (target.matches('[data-reset-site]') && window.confirm('Сбросить просмотренное и настройки сайта на этом устройстве?')) {
      onReset(); refresh();
    }
  });
  dialogs.equalizer.addEventListener('change', event => {
    if (event.target.matches('[data-map-setting]')) onSetting('mapVisible', event.target.checked);
    if (event.target.matches('[data-memory-setting]')) onSetting('memory', event.target.checked);
    refresh();
  });
  window.addEventListener('pagehide', close);
  refresh();
  return { open, close, refresh };
}
