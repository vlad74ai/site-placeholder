import { entryPointsMarkup } from './entry-markup.js';
import { icon } from './icons.js';

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function renderDirectItems(items = []) {
  return items.map((item) => {
    const inner = `<span class="home-direct__copy">
        <strong>${escapeHtml(item.title)}</strong>
        <span>${escapeHtml(item.description || '')}</span>
      </span>
      <span class="home-direct__arrow" aria-hidden="true">→</span>`;
    if (item.href) return `<a class="home-direct" href="${escapeHtml(item.href)}">${inner}</a>`;
    return `<button class="home-direct" type="button" data-open-node="${escapeHtml(item.targetNodeId)}">${inner}</button>`;
  }).join('');
}

function renderDisclosureSummary(title, summary, ordinal) {
  return `<summary class="home-disclosure__summary">
    <span class="home-disclosure__ordinal" aria-hidden="true">§${ordinal}</span>
    <span class="home-disclosure__summary-copy">
      <strong>${escapeHtml(title)}</strong>
      <span>${escapeHtml(summary)}</span>
    </span>
    ${icon('chevron-down', 'home-disclosure__toggle')}
  </summary>`;
}

// Entrances stay the same at any detail setting. Depth changes on the destination page.
function itemsForLevel(group) {
  return group.items || [];
}

function renderDirectGroups(presentation, level) {
  return (presentation.directGroups || []).map((group, index) => {
    const items = itemsForLevel(group, level);
    return `<details class="home-disclosure home-disclosure--${escapeHtml(group.id)}" data-home-disclosure data-home-group="${escapeHtml(group.id)}">
      ${renderDisclosureSummary(group.title, group.summary, index + 1)}
      <div class="home-disclosure__body">
        <div class="home-direct-list" data-home-group-items>${renderDirectItems(items)}</div>
      </div>
    </details>`;
  }).join('');
}

export function syncHomeLevel(container, presentation = {}, level = 'beginner') {
  if (!container) return;
  const groups = new Map((presentation.directGroups || []).map((group) => [group.id, group]));
  container.querySelectorAll('[data-home-group]').forEach((section) => {
    const group = groups.get(section.dataset.homeGroup);
    const itemsContainer = section.querySelector('[data-home-group-items]');
    if (!group || !itemsContainer) return;
    itemsContainer.innerHTML = renderDirectItems(itemsForLevel(group, level));
  });
  const disclosures = container.querySelector('.home-disclosures');
  if (disclosures) disclosures.dataset.homeLevel = level;
}

export function homeOverviewMarkup(overview, presentation = {}, level = 'beginner', entries = []) {

  const intro = presentation.intro || {};
  const start = { ...(overview.start || {}), ...(presentation.start || {}) };

  return `
    <div class="home-columns home-columns--light">
      <section class="home-intro" aria-label="Введение">
        <div class="home-head">
          <p class="home-kicker">${escapeHtml(intro.kicker || 'Место для открытий и практики')}</p>
          <h1 id="hero-title">${presentation.title === 'ИИ для личных и рабочих задач'
            ? 'ИИ для <em>личных</em><br>и рабочих задач'
            : escapeHtml(presentation.title || overview.title)}</h1>
          <p class="home-intro__welcome">${escapeHtml(intro.welcome || intro.storyLead)}</p>
        </div>
        ${intro.equalizer ? `<section class="home-equalizer" aria-labelledby="home-equalizer-title">
          <h2 id="home-equalizer-title">${escapeHtml(intro.equalizer.title)}</h2>
          <p>${escapeHtml(intro.equalizer.meaning)}</p>
          <p>${escapeHtml(intro.equalizer.practice)}</p>
          <a class="home-equalizer__download" href="${escapeHtml(intro.equalizer.fileHref)}" download="AI-V-DELO_Equalizer.pdf" type="application/pdf">${escapeHtml(intro.equalizer.downloadLabel)}</a>
        </section>` : ''}
        <div class="home-intro__bottom">
          <a class="home-intro__telegram" href="${escapeHtml(intro.telegramHref)}" target="_blank" rel="noopener noreferrer"><svg class="home-intro__telegram-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M21.5 4.5 18.3 19.7c-.24 1.08-.87 1.35-1.76.84l-4.86-3.58-2.35 2.26c-.26.26-.48.48-.99.48l.35-4.96 9.02-8.14c.39-.35-.09-.55-.6-.21L5.97 13.41l-4.8-1.5c-1.04-.32-1.06-1.04.22-1.54L20.14 3.14c.87-.32 1.63.21 1.36 1.36Z"/></svg><span>AI В ДЕЛО в Telegram ↗</span></a>
          <button class="home-start-hint" type="button" data-home-start-hint aria-controls="home-start" aria-expanded="false">${escapeHtml(intro.startActionLabel || 'Открыть быстрый старт →')}</button>
        </div>
      </section>
      <div class="home-navigation">
        <div class="home-navigation__head">
          <div class="site-search" data-site-search>
            <div class="site-search__field">
              ${icon('search', 'site-search__icon')}
              <input type="search" data-search-input placeholder="Поиск по сайту" aria-label="Поиск по сайту" role="combobox" aria-autocomplete="list" aria-haspopup="listbox" aria-expanded="false" aria-controls="site-search-results" autocomplete="off">
              <button class="site-search__clear" type="button" data-search-clear aria-label="Очистить поиск" hidden>×</button>
            </div>
            <div class="site-search__panel" id="site-search-results" data-search-results role="listbox" aria-label="Результаты поиска" hidden></div>
          </div>
        </div>
        <section class="home-navigation__panel" aria-label="Направления">
          <span class="home-navigation__kicker">Выберите направление</span>
          <div class="home-disclosures" data-home-level="${escapeHtml(level)}">
          ${renderDirectGroups(presentation, level)}
          <details id="home-start" class="home-disclosure home-disclosure--start" data-home-disclosure>
            ${renderDisclosureSummary(start.title, start.summary, 5)}
            <div class="home-disclosure__body home-disclosure__body--start">
              <p>${escapeHtml(start.text)}</p>
              <div class="home-featured-entry" data-home-featured-entry aria-label="Быстрый старт">${entryPointsMarkup(entries.filter(entry => entry.featured))}</div>
              <div class="entry-grid" data-entry-grid aria-label="Знакомые вопросы и ситуации, с которых можно начать">${entryPointsMarkup(entries.filter(entry => !entry.featured))}</div>
            </div>
          </details>
          </div>
        </section>
      </div>
    </div>`;

}

// Enhance the generated HTML without replacing focused/open native elements.
export function renderHomeOverview(container, overview, presentation = {}, level = 'beginner', entries = []) {
  if (!container || !overview || container.dataset.homeEnhanced) return;
  if (!container.querySelector('#hero-title')) container.innerHTML = homeOverviewMarkup(overview, presentation, level, entries);
  container.dataset.homeEnhanced = 'true';
  const disclosures = [...container.querySelectorAll('[data-home-disclosure]')];
  const startDisclosure = container.querySelector('#home-start');
  const startHint = container.querySelector('[data-home-start-hint]');
  startHint.addEventListener('click', () => {
    disclosures.forEach(disclosure => { if (disclosure !== startDisclosure) disclosure.open = false; });
    startDisclosure.open = true;
    const summary = startDisclosure.querySelector('summary');
    summary.focus({ preventScroll: true });
    // Native 'nearest' scrolling leaves §5 low in the viewport on small screens.
    // Let details above collapse, then align the chosen section below the sticky header.
    requestAnimationFrame(() => {
      const header = document.querySelector('.site-header');
      const headerOffset = window.matchMedia('(max-width: 980px)').matches && header &&
        ['sticky', 'fixed'].includes(getComputedStyle(header).position)
        ? header.getBoundingClientRect().height : 0;
      const targetTop = window.scrollY + summary.getBoundingClientRect().top - headerOffset - 12;
      window.scrollTo({
        top: Math.max(0, Math.round(targetTop)),
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
      });
    });
  });
  disclosures.forEach((disclosure) => {
    disclosure.addEventListener('toggle', () => {
      if (disclosure === startDisclosure) startHint.setAttribute('aria-expanded', String(disclosure.open));
      if (!disclosure.open) return;
      disclosures.forEach((other) => {
        if (other !== disclosure) other.open = false;
      });
    });
  });
}
