export const difficultyLevels = ['beginner', 'explorer', 'practitioner', 'specialist'];
export const difficultyLabels = {
  beginner: 'Новичок',
  explorer: 'Исследователь',
  practitioner: 'Практик',
  specialist: 'Специалист'
};

export function createAppState(initialPersistent) {
  const state = {
    persistent: JSON.parse(JSON.stringify(initialPersistent)),
    session: {
      currentNodeId: null,
      currentExampleId: null,
      entryContext: null,
      helperDismissedForNode: null
    }
  };

  function getState() {
    return state;
  }

  function setCurrent({ nodeId = null, exampleId = null, entryContext = null } = {}) {
    const changedNode = state.session.currentNodeId !== nodeId;
    state.session.currentNodeId = nodeId;
    state.session.currentExampleId = exampleId;
    state.session.entryContext = entryContext;
    if (changedNode) state.session.helperDismissedForNode = null;
  }

  function clearCurrent() {
    setCurrent({ nodeId: null, exampleId: null, entryContext: null });
  }

  function markViewed(nodeId, now = new Date().toISOString()) {
    const previous = state.persistent.viewed[nodeId];
    state.persistent.viewed[nodeId] = {
      viewed: true,
      first_viewed_at: previous?.first_viewed_at || now,
      last_viewed_at: now
    };
  }

  function setSetting(name, value) {
    if (!(name in state.persistent.settings)) return false;
    state.persistent.settings[name] = value;
    return true;
  }

  function setEqualizerIntroSeen(value = true) {
    state.persistent.equalizerIntroSeen = Boolean(value);
  }

  function dismissHelperForCurrentNode() {
    state.session.helperDismissedForNode = state.session.currentNodeId;
  }

  function resetPersistent(nextPersistent) {
    state.persistent = JSON.parse(JSON.stringify(nextPersistent));
    state.session.helperDismissedForNode = null;
  }

  return {
    getState,
    setCurrent,
    clearCurrent,
    markViewed,
    setSetting,
    setEqualizerIntroSeen,
    dismissHelperForCurrentNode,
    resetPersistent
  };
}
