import { enhanceSidebar } from './ui/sidebar.js?v=map-w8-1';
import { loadPersistentState, savePersistentState, resetPersistentStorage, persistentDefaults } from './core/storage.js?v=native-pages-2';
import { difficultyLevels, difficultyLabels } from './core/state.js';
import { buildSiteModel, enhanceSiteTools } from './ui/site-tools.js?v=map-w8-1';
import { renderTopicReading, renderTopicExits } from './ui/render.js?v=public-prune-1';
import { enhancePrimaryNavigation } from './ui/header.js';
import { enhanceTOC } from './ui/internal-toc.js?v=native-pages-2';
import { createInteractions } from './ui/interactions.js?v=native-pages-2';
import { topicHref } from './data/topic-pages.js?v=public-prune-1';
import { launchFeatures } from './data/launch-features.js';

const nodeId = document.querySelector('[data-topic-id]')?.dataset.topicId;
const params = new URLSearchParams(location.search);
let persistent = loadPersistentState();
const article = document.querySelector('[data-topic-article]');
const tocList = document.querySelector('[data-topic-toc]');
const exits = document.querySelector('[data-topic-exits]');
let toc;
let tools;

function render() {
  const model = buildSiteModel(persistent, nodeId, params.get('example'), params.get('entry'));
  if (!model.node) return;
  const reading = renderTopicReading(model);
  article.innerHTML = reading.article;
  tocList.innerHTML = reading.toc;
  exits.innerHTML = renderTopicExits(model);
  const index = difficultyLevels.indexOf(model.settings.level);
  document.querySelector('[data-depth-label]').textContent = difficultyLabels[model.settings.level];
  document.querySelector('[data-depth-down]').disabled = index <= 0;
  document.querySelector('[data-depth-up]').disabled = index >= difficultyLevels.length - 1;
  toc?.refresh();
  tools?.refresh();
}
function changeSetting(key, value) {
  persistent.settings[key] = value;
  savePersistentState(persistent);
  render();
}
function markViewed() {
  const now = new Date().toISOString();
  persistent.viewed[nodeId] = { viewed: true, first_viewed_at: persistent.viewed[nodeId]?.first_viewed_at || now, last_viewed_at: now };
  savePersistentState(persistent);
}

// The generated document already reads without JS. Settings enhance its body.
render();
markViewed();
enhanceSidebar();
toc = enhanceTOC(document.querySelector('.internal-layout'));
tools = enhanceSiteTools({ getPersistent: () => persistent, currentId: nodeId, prefix: '../', onSetting: changeSetting,
  onReset() { resetPersistentStorage(); persistent = structuredClone(persistentDefaults); render(); } });
enhancePrimaryNavigation(document.querySelector('[data-primary-nav]'));
createInteractions({ onCloseTools: () => tools?.close(),
  onOpenNode(id) { window.location.assign('../' + topicHref(id)); },
  onPracticeService(id) { persistent.settings.aiService = id; savePersistentState(persistent); tools?.refresh(); },
  onDepthChange(direction) {
    if (!launchFeatures.adaptivePresentation) return;
    const next = Math.max(0, Math.min(difficultyLevels.length - 1, difficultyLevels.indexOf(persistent.settings.level) + direction));
    changeSetting('level', difficultyLevels[next]);
  }
});
document.querySelector('[data-topic-controls]').hidden = !launchFeatures.adaptivePresentation;
import('./ui/internal-search.js?v=public-prune-1').then(({ enhanceInternalSearch }) => enhanceInternalSearch())
  .catch(error => console.warn('Search enhancement unavailable', error));
window.addEventListener('storage', () => { persistent = loadPersistentState(); render(); });
