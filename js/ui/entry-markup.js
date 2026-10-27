import { topicHref } from '../data/topic-pages.js?v=public-prune-1';
function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}


export function entryPointsMarkup(entryPoints) {
  return [...entryPoints]
    .sort((a, b) => a.order - b.order)
    .map((entry) => {
      // Prefer a concrete accepted HTML-first article over a generic topic.
      // Native anchors retain open-in-new-tab, keyboard and ordinary browser navigation.
      const href = entry.href || topicHref(entry.targetNodeId, {
        exampleId: entry.exampleId || null, entryContext: entry.id
      });
      if (!href) throw new Error('Quick start has no available page: ' + entry.id);
      return `<a class="entry-card${entry.featured ? ' entry-card--featured' : ''}" href="${escapeHtml(href)}">
      <span class="entry-card__number">${String(entry.order).padStart(2, '0')}</span>
      <span class="entry-card__body">
        <strong>${escapeHtml(entry.title)}</strong>
        <span>${escapeHtml(entry.subtitle)}</span>
      </span>
      <span class="entry-card__arrow" aria-hidden="true">→</span>
    </a>`;
    }).join('');
}
