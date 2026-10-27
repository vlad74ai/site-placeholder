import { AF_LEGACY_DESTINATIONS } from './af-public-content.js';
import { semanticNodes } from './site-content.js';
import { isPublicTopic, publicDestinationFor } from './public-topic-registry.js';

// Stable HTML destinations for the existing semantic topics. Copy stays in site-content.
export const TOPIC_PAGES = Object.freeze(Object.fromEntries(
  Object.values(semanticNodes).filter(node => node.availability !== 'draft' && isPublicTopic(node.id)).map(node => [node.id, {
    id: node.id,
    label: node.label,
    href: AF_LEGACY_DESTINATIONS[node.id.toLowerCase().replaceAll('_', '-')] || `pages/${node.id.toLowerCase().replaceAll('_', '-')}.html`
  }])
));

export function topicHref(nodeId, { exampleId = null, entryContext = null } = {}) {
  const href = TOPIC_PAGES[publicDestinationFor(nodeId)]?.href;
  if (!href) return null;
  const params = new URLSearchParams();
  if (exampleId) params.set('example', exampleId);
  if (entryContext) params.set('entry', entryContext);
  const [pathname, fragment] = href.split('#');
  return pathname + (params.size ? '?' + params : '') + (fragment ? '#' + fragment : '');
}
