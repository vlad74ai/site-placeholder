const STATE_KEY = 'ai-v-delo.v03';
const MEMORY_OPTOUT_KEY = 'ai-v-delo.memory-optout';
const SESSION_STATE_KEY = 'ai-v-delo.session.v1';

export const persistentDefaults = {
  settings: {
    level: 'beginner',
    detail: 'normal',
    helper: 'normal',
    mapVisible: true,
    memory: true,
    aiService: null
  },
  viewed: {},
  selfAssessment: { fP1: [] },
  equalizerIntroSeen: true
};

function cloneDefaults() {
  return JSON.parse(JSON.stringify(persistentDefaults));
}

function safeLocalStorage() {
  try {
    const testKey = '__ai_v_delo_storage_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return window.localStorage;
  } catch (error) {
    console.warn('AI В ДЕЛО: localStorage unavailable; continuing in session-only mode.', error);
    return null;
  }
}

function safeSessionStorage() {
  try { return window.sessionStorage; } catch { return null; }
}

function normalize(raw) {
  const base = cloneDefaults();
  if (!raw || typeof raw !== 'object') return base;

  const settings = raw.settings && typeof raw.settings === 'object' ? raw.settings : {};
  const allowedLevels = ['beginner', 'explorer', 'practitioner', 'specialist'];
  const allowedDetails = ['short', 'normal', 'detailed'];
  const allowedHelpers = ['off', 'minimal', 'normal', 'active'];
  const allowedAiServices = ['chatgpt', 'gemini', 'claude', 'grok', 'qwen'];

  if (allowedLevels.includes(settings.level)) base.settings.level = settings.level;
  if (allowedDetails.includes(settings.detail)) base.settings.detail = settings.detail;
  if (allowedHelpers.includes(settings.helper)) base.settings.helper = settings.helper;
  if (typeof settings.mapVisible === 'boolean') base.settings.mapVisible = settings.mapVisible;
  if (typeof settings.memory === 'boolean') base.settings.memory = settings.memory;
  if (allowedAiServices.includes(settings.aiService)) base.settings.aiService = settings.aiService;

  if (raw.viewed && typeof raw.viewed === 'object' && !Array.isArray(raw.viewed)) {
    base.viewed = raw.viewed;
  }

  if (Array.isArray(raw.selfAssessment?.fP1)) {
    const valid = /^(?:tasks-[1-5]|continuation-[1-6]|processes-[1-6]|business-[1-6])$/;
    base.selfAssessment.fP1 = Array.from(new Set(raw.selfAssessment.fP1.filter(id => typeof id === 'string' && valid.test(id))));
  }

  // Equalizer onboarding is no longer required. The site starts in the
  // beginner presentation mode and visitors can change it at any time.
  base.equalizerIntroSeen = true;

  return base;
}

export function loadPersistentState() {
  const storage = safeLocalStorage();
  const session = safeSessionStorage();

  try {
    if (storage?.getItem(MEMORY_OPTOUT_KEY) === '1') {
      const state = normalize(JSON.parse(session?.getItem(SESSION_STATE_KEY) || 'null'));
      state.settings.memory = false;
      return state;
    }

    if (!storage) return normalize(JSON.parse(session?.getItem(SESSION_STATE_KEY) || 'null'));

    const raw = storage.getItem(STATE_KEY);
    if (!raw) return cloneDefaults();
    return normalize(JSON.parse(raw));
  } catch (error) {
    console.warn('AI В ДЕЛО: failed to read saved state; using defaults.', error);
    return cloneDefaults();
  }
}

export function savePersistentState(persistentState) {
  const storage = safeLocalStorage();
  const session = safeSessionStorage();

  try {
    if (!persistentState.settings.memory) {
      // Multiple native documents keep opt-out settings only in this tab session.
      session?.setItem(SESSION_STATE_KEY, JSON.stringify(normalize(persistentState)));
      storage?.removeItem(STATE_KEY);
      storage?.setItem(MEMORY_OPTOUT_KEY, '1');
      return Boolean(storage || session);
    }

    if (!storage) {
      session?.setItem(SESSION_STATE_KEY, JSON.stringify(normalize(persistentState)));
      return Boolean(session);
    }
    session?.removeItem(SESSION_STATE_KEY);

    storage.removeItem(MEMORY_OPTOUT_KEY);
    storage.setItem(STATE_KEY, JSON.stringify(normalize(persistentState)));
    return true;
  } catch (error) {
    console.warn('AI В ДЕЛО: failed to save state; continuing without blocking the page.', error);
    return false;
  }
}

export function resetPersistentStorage() {
  const storage = safeLocalStorage();
  const session = safeSessionStorage();

  try {
    storage?.removeItem(STATE_KEY);
    storage?.removeItem(MEMORY_OPTOUT_KEY);
    session?.removeItem(SESSION_STATE_KEY);
    return Boolean(storage || session);
  } catch (error) {
    console.warn('AI В ДЕЛО: failed to reset saved state.', error);
    return false;
  }
}
