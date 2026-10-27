import { initDeferredSiteSearch } from './search.js';
import { buildSearchIndex } from '../core/search.js';
import { primaryNavigation } from '../data/primary-navigation.js';
import { semanticNodes } from '../data/site-content.js';
import { homeOverview, entryPoints } from '../data/navigation.js';
import { topicHref } from '../data/topic-pages.js?v=public-prune-1';

export function enhanceInternalSearch() {
  initDeferredSiteSearch({ container: document.querySelector('[data-site-search]'), rootPrefix: '../',
    async loadIndex() {
      const { internalSearchDocuments } = await import('../data/internal-search.generated.js');
      return buildSearchIndex({ semanticNodes, primaryNavigation, homeOverview, entryPoints, internalDocuments: internalSearchDocuments });
    },
    onOpenNode(nodeId) { window.location.assign('../' + topicHref(nodeId)); }
  });
}
