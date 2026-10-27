import { loadPersistentState, savePersistentState, resetPersistentStorage, persistentDefaults } from '../core/storage.js?v=native-pages-2';
import { enhanceSiteTools } from './site-tools.js?v=map-w8-1';

// Optional tool host. Its loading/failure cannot block the article's Copy or TOC.
export function enhanceInternalTools() {
  let persistent = loadPersistentState();
  const pageId = document.querySelector('main[data-page-id]')?.dataset.pageId;
  const now = new Date().toISOString();
  if (pageId) {
    persistent.viewed[pageId] = { viewed: true, first_viewed_at: persistent.viewed[pageId]?.first_viewed_at || now, last_viewed_at: now };
    savePersistentState(persistent);
  }
  const tools = enhanceSiteTools({ getPersistent: () => persistent, currentId: pageId, prefix: '../',
    onSetting(key, value) {
      // Merge with the latest persisted state so other page enhancements keep their values.
      persistent = loadPersistentState();
      persistent.settings[key] = value;
      savePersistentState(persistent);
    },
    onReset() {
      resetPersistentStorage();
      persistent = structuredClone(persistentDefaults);
      document.dispatchEvent(new Event('ai-v-delo:reset'));
    }
  });
  window.addEventListener('storage', () => { persistent = loadPersistentState(); tools?.refresh(); });
  return tools;
}
