import { searchSite } from '../core/search.js';
import { createSearchStatistics } from '../core/search-statistics.js';

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function initSiteSearch({ container, index = [], onOpenNode, rootPrefix = '' }) {
  if (!container) return null;

  const input = container.querySelector('[data-search-input]');
  const clearButton = container.querySelector('[data-search-clear]');
  const panel = container.querySelector('[data-search-results]');
  if (!input || !panel) return null;
  input.setAttribute('role', 'combobox');
  input.setAttribute('aria-autocomplete', 'list');
  input.setAttribute('aria-haspopup', 'listbox');
  container.hidden = false;

  let currentResults = [];
  let composing = false;
  const statistics = createSearchStatistics({
    snapshot:() => window.__aiVDeloStatistics?.searchSnapshot(),
    send:(...args) => window.__aiVDeloStatistics?.trackSearch(...args)
  });

  function close() {
    statistics.cancel();
    panel.hidden = true;
    input.setAttribute('aria-expanded', 'false');
  }

  function open() {
    panel.hidden = false;
    input.setAttribute('aria-expanded', 'true');
  }

  function render(query) {
    const value = query.trim();
    clearButton.hidden = !value;

    if (value.length < 2) {
      currentResults = [];
      close();
      return;
    }

    currentResults = searchSite(index, value, 7);
    if (!currentResults.length) {
      panel.innerHTML = '<div class="site-search__empty">Ничего не найдено. Попробуйте сформулировать короче.</div>';
      open();
      return;
    }

    panel.innerHTML = currentResults.map((result, indexValue) => `
      <button class="site-search__result" type="button" role="option" data-search-result="${indexValue}" ${result.nodeId ? `data-search-node="${escapeHtml(result.nodeId)}"` : ''}>
        <span class="site-search__result-copy">
          <strong>${escapeHtml(result.title)}</strong>
          ${result.description ? `<span>${escapeHtml(result.description)}</span>` : ''}
        </span>
        <span class="site-search__result-meta">${escapeHtml(result.source || 'Раздел')}</span>
      </button>`).join('');
    open();
  }

  function choose(result) {
    if (!result) return;
    statistics.flush(); // Explicit selection confirms the current query, even before the pause.
    input.value = '';
    currentResults = [];
    clearButton.hidden = true;
    close();
    if (result.href) window.location.assign(rootPrefix + result.href);
    else onOpenNode?.(result.nodeId);
  }

  function onInput(event) {
    render(input.value); // Existing immediate rendering/ranking is unchanged.
    if (composing || event?.isComposing) statistics.cancel();
    else statistics.schedule(input.value, currentResults.length);
  }
  input.addEventListener('input', onInput);
  input.addEventListener('compositionstart', () => { composing = true; statistics.cancel(); });
  input.addEventListener('compositionend', () => { composing = false; onInput(); });
  input.addEventListener('focus', () => {
    if (input.value.trim().length >= 2) render(input.value);
  });
  input.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      close();
      return;
    }
    if (event.key === 'Enter' && currentResults[0]) {
      event.preventDefault();
      choose(currentResults[0]);
      return;
    }
    if (event.key === 'Enter' && !composing) statistics.flush();
    if (event.key === 'ArrowDown') {
      const first = panel.querySelector('[data-search-result]');
      if (first) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  panel.addEventListener('click', event => {
    const result = event.target.closest('[data-search-result]');
    if (!result) return;
    choose(currentResults[Number(result.dataset.searchResult)]);
  });

  panel.addEventListener('keydown', event => {
    const result = event.target.closest('[data-search-result]');
    if (!result) return;
    const buttons = [...panel.querySelectorAll('[data-search-result]')];
    const position = buttons.indexOf(result);
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      buttons[Math.min(position + 1, buttons.length - 1)]?.focus();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (position <= 0) input.focus();
      else buttons[position - 1]?.focus();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      input.focus();
      close();
    }
  });

  clearButton.addEventListener('click', () => {
    input.value = '';
    currentResults = [];
    clearButton.hidden = true;
    close();
    input.focus();
  });

  document.addEventListener('click', event => {
    if (!container.contains(event.target)) close();
  });

  return { close };
}

// Load the article corpus only when search is used. Preserve text typed while
// the module is in flight and keep one set of listeners after initialization.
export function initDeferredSiteSearch({ container, loadIndex, ...options }) {
  const input = container?.querySelector('[data-search-input]');
  if (!input) return null;
  let ready = false;
  let pending = null;
  let dismissed = false;
  function start() {
    if (ready) return Promise.resolve();
    if (!pending) {
      pending = Promise.resolve().then(loadIndex).then(index => {
        initSiteSearch({ container, index, ...options });
        ready = true;
        input.removeEventListener('focus', onFocus);
        input.removeEventListener('input', onInput);
        input.removeEventListener('keydown', onKey);
        if (!dismissed && document.activeElement === input) {
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }).catch(error => {
        pending = null;
        console.error('AI В ДЕЛО: search index could not be loaded; focus or type to retry', error);
      });
    }
    return pending;
  }
  function onFocus() { dismissed = false; start(); }
  function onInput() { dismissed = false; start(); }
  function onKey(event) {
    if (event.key === 'Escape') { dismissed = true; return; }
    if (['Enter', 'ArrowDown'].includes(event.key)) {
      event.preventDefault();
      start().then(() => {
        if (ready && !dismissed && document.activeElement === input) {
          input.dispatchEvent(new KeyboardEvent('keydown', { key: event.key, bubbles: true, cancelable: true }));
        }
      });
    }
  }
  input.addEventListener('focus', onFocus);
  input.addEventListener('input', onInput);
  input.addEventListener('keydown', onKey);
  // Account for a restored/autofocused field without fetching on ordinary loads.
  if (document.activeElement === input) onFocus();
  return { load: start };
}
