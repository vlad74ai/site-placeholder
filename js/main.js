import { enhanceSidebar } from './ui/sidebar.js?v=map-w8-1';
import { topicHref } from './data/topic-pages.js?v=public-prune-1';
import { launchFeatures, publicPresentationSettings } from './data/launch-features.js';
import { enhanceSiteTools } from './ui/site-tools.js?v=map-w8-1';
import { semanticNodes } from './data/site-content.js';
import { nodeMinLevels, blockMinLevels, blockTextByLevel } from './data/layers.js';
import { homeOverview, entryPoints, relations, mapGroups } from './data/navigation.js';
import { primaryNavigation } from './data/primary-navigation.js';
import { enhancePrimaryNavigation } from './ui/header.js';
import { homepagePresentation } from './data/homepage.js?v=home-telegram-visible-2';
import { persistentDefaults, loadPersistentState, savePersistentState, resetPersistentStorage } from './core/storage.js?v=native-pages-2';
import { createAppState, difficultyLevels, difficultyLabels } from './core/state.js';
import { resolveEntry, buildHash, parseHash, validateArchitecture } from './core/routing.js';
import { buildSearchIndex } from './core/search.js';
import { buildViewModel } from './core/presentation.js';
import { renderContent, renderMap, renderHachuhaRoutes, syncSettingControls } from './ui/render.js?v=initial-layout-w7';
import { renderHomeOverview, syncHomeLevel } from './ui/home.js?v=initial-layout-w7';
import { initDeferredSiteSearch } from './ui/search.js';
import { createInteractions } from './ui/interactions.js?v=native-pages-2';

const architectureErrors = validateArchitecture({ semanticNodes, entryPoints, relations, mapGroups, homeOverview });
if (architectureErrors.length) {
  console.error('AI В ДЕЛО: architecture validation failed', architectureErrors);
} else {
  console.info('AI В ДЕЛО: semantic architecture validation passed');
}

const appState = createAppState(loadPersistentState());
const homeContainer = document.querySelector('[data-home-overview]');

function persist() {
  savePersistentState(appState.getState().persistent);
}

function currentLevel() {
  return publicPresentationSettings(appState.getState().persistent.settings).level || 'beginner';
}

function getViewModel() {
  return buildViewModel({
    semanticNodes,
    relations,
    mapGroups,
    nodeMinLevels,
    blockMinLevels,
    blockTextByLevel,
    state: appState.getState()
  });
}

function renderCurrent({ scroll = false, confirmView = false, preserveOverlays = false } = {}) {
  let model = getViewModel();

  tools?.refresh();
  syncSettingControls(document, model.settings, difficultyLabels);

  const rendered = renderContent(ui.refs.contentStage, ui.refs.workspace, model);
  renderHachuhaRoutes(ui.refs.hachuhaRoutes, model.helper?.suggestions || []);
  ui.syncHelper(model);

  if (model.status === 'home') {
    ui.showHome({ preserveOverlays });
    return;
  }

  ui.showWorkspace({ scroll });

  if (confirmView && rendered && model.node?.id) {
    appState.markViewed(model.node.id);
    persist();
    model = getViewModel();
    tools?.refresh();
    ui.syncHelper(model);
  }
}

function applyLocation({ scroll = false } = {}) {
  const locationState = parseHash(window.location.hash);
  if (!locationState.nodeId) {
    appState.clearCurrent();
    renderCurrent({ scroll: false, confirmView: false });
    return;
  }

  const destination = topicHref(locationState.nodeId, locationState);
  if (destination) { window.location.replace(destination); return; }
  appState.setCurrent({
    nodeId: locationState.nodeId,
    exampleId: locationState.exampleId,
    entryContext: locationState.entryContext
  });
  renderCurrent({ scroll, confirmView: true });
}

function navigateTo({ nodeId, exampleId = null, entryContext = null }) {
  const destination = topicHref(nodeId, { exampleId, entryContext });
  if (destination) { window.location.assign(destination); return; }
  const nextHash = buildHash({ nodeId, exampleId, entryContext });
  if (window.location.hash === nextHash) {
    applyLocation({ scroll: true });
  } else {
    window.location.hash = nextHash;
  }
}

function navigateHome() {
  const url = `${window.location.pathname}${window.location.search}`;
  history.pushState(null, '', url);
  appState.clearCurrent();
  renderCurrent({ scroll: false, confirmView: false });
}

function changeSetting(name, value) {
  appState.setSetting(name, value);
  persist();
  if (name === 'level') {
    syncHomeLevel(homeContainer, homepagePresentation, currentLevel());
  }
  renderCurrent({ scroll: false, confirmView: false, preserveOverlays: true });
}

function changeDepth(direction) {
  const current = currentLevel();
  const index = difficultyLevels.indexOf(current);
  const nextIndex = Math.max(0, Math.min(difficultyLevels.length - 1, index + direction));
  if (launchFeatures.adaptivePresentation) changeSetting('level', difficultyLevels[nextIndex]);
}

enhanceSidebar();
enhancePrimaryNavigation(document.querySelector('[data-primary-nav]'));
renderHomeOverview(homeContainer, homeOverview, homepagePresentation, currentLevel(), entryPoints);
const depthControls = document.querySelector('.depth-controls');
if (depthControls) depthControls.hidden = !launchFeatures.adaptivePresentation;

const tools = enhanceSiteTools({
  getPersistent: () => appState.getState().persistent,
  onSetting: changeSetting,
  onReset() {
    resetPersistentStorage(); appState.resetPersistent(persistentDefaults);
    syncHomeLevel(homeContainer, homepagePresentation, currentLevel());
    renderCurrent({ preserveOverlays: true });
  }
});

const ui = createInteractions({
  onCloseTools: () => tools?.close(),
  onHome: navigateHome,

  onOpenEntry(entryId) {
    const entry = resolveEntry(entryId, entryPoints);
    if (!entry) {
      console.warn(`AI В ДЕЛО: unknown entry ${entryId}`);
      return;
    }
    navigateTo({
      nodeId: entry.targetNodeId,
      exampleId: entry.exampleId || null,
      entryContext: entry.id
    });
  },

  onOpenNode(nodeId) {
    navigateTo({ nodeId });
  },

  onSetting(name, value) {
    changeSetting(name, value);
  },

  onPracticeService(serviceId) {
    if (appState.setSetting('aiService', serviceId)) persist();
  },

  onDepthChange(direction) {
    changeDepth(direction);
  },

  onIntroLevel(level) {
    appState.setSetting('level', level);
    appState.setEqualizerIntroSeen(true);
    persist();
    syncHomeLevel(homeContainer, homepagePresentation, currentLevel());
    renderCurrent({ scroll: false, confirmView: false });
  },

  onIntroSkip() {
    appState.setEqualizerIntroSeen(true);
    persist();
    renderCurrent({ scroll: false, confirmView: false });
  },

  onDismissHelper() {
    appState.dismissHelperForCurrentNode();
    renderCurrent({ scroll: false, confirmView: false });
  },

  onReset() {
    resetPersistentStorage();
    appState.resetPersistent(persistentDefaults);
    syncHomeLevel(homeContainer, homepagePresentation, currentLevel());
    renderCurrent({ scroll: false, confirmView: false });
  }
});

initDeferredSiteSearch({
  container: document.querySelector('[data-site-search]'),
  async loadIndex() {
    const { internalSearchDocuments } = await import('./data/internal-search.generated.js');
    return buildSearchIndex({ semanticNodes, primaryNavigation, homeOverview, entryPoints, internalDocuments: internalSearchDocuments });
  },
  onOpenNode(nodeId) {
    navigateTo({ nodeId });
  }
});


window.addEventListener('hashchange', () => applyLocation({ scroll: true }));
window.addEventListener('popstate', () => applyLocation({ scroll: false }));

applyLocation({ scroll: false });

console.log('ai-v-delo.ru prototype v0.5 homepage-layer routing loaded');

// Internal-page tools reuse the existing panels; consume the request once.
const toolURL = new URL(window.location.href);
const requestedTool = toolURL.searchParams.get('tool');
if (['map', 'equalizer'].includes(requestedTool)) {
  toolURL.searchParams.delete('tool');
  history.replaceState(null, '', toolURL.pathname + toolURL.search + toolURL.hash);
  if ((requestedTool === 'map' && launchFeatures.semanticMap) ||
      (requestedTool === 'equalizer' && launchFeatures.adaptivePresentation)) {
    document.querySelector(`[data-${requestedTool}-open]`)?.click();
  }
}
