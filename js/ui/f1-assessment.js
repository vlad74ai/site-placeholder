import { loadPersistentState, savePersistentState } from '../core/storage.js?v=native-pages-2';

// These are independent skill areas, not a single ranked score.
export const F1_GROUP_SIZES = Object.freeze({
  tasks: 5,
  continuation: 6,
  processes: 6,
  business: 6
});

export function f1GroupProgress(groupId, selections) {
  const total = F1_GROUP_SIZES[groupId];
  if (!total) return null;
  const checked = new Set(Array.isArray(selections) ? selections : []);
  let count = 0;
  for (let i = 1; i <= total; i++) {
    if (checked.has(groupId + '-' + i)) count++;
  }
  return { count, total };
}

export function enhanceF1Assessment(root = document) {
  const main = root.querySelector('main[data-page-id="F-P1"]');
  if (!main) return false;
  const groups = Array.from(main.querySelectorAll('[data-f1-assessment-group]'));
  const inputs = Array.from(main.querySelectorAll('input[type="checkbox"][data-f1-skill]'));
  const known = new Set(inputs.map(input => input.value));
  if (groups.length !== 4 || inputs.length !== 23 || known.size !== 23) return false;

  function updateProgress() {
    const selections = inputs.filter(input => input.checked).map(input => input.value);
    for (const group of groups) {
      const data = f1GroupProgress(group.dataset.f1AssessmentGroup, selections);
      if (!data) continue;
      const output = group.querySelector('[data-f1-count]');
      const progress = group.querySelector('progress[data-f1-progress]');
      if (output) output.textContent = 'Отмечено ' + data.count + ' из ' + data.total;
      if (progress) {
        progress.max = data.total;
        progress.value = data.count;
      }
      // The overview repeats these four independent values without combining scores.
      const overview = main.querySelector('[data-f1-summary-group="' + group.dataset.f1AssessmentGroup + '"]');
      const summaryCount = overview?.querySelector('[data-f1-summary-count]');
      const summaryProgress = overview?.querySelector('progress[data-f1-summary-progress]');
      if (summaryCount) summaryCount.textContent = data.count + ' из ' + data.total;
      if (summaryProgress) {
        summaryProgress.max = data.total;
        summaryProgress.value = data.count;
      }
    }
  }

  function restore() {
    const state = loadPersistentState();
    const selected = new Set(state.selfAssessment?.fP1 || []);
    for (const input of inputs) input.checked = selected.has(input.value);
    updateProgress();
  }

  function save() {
    const state = loadPersistentState();
    state.selfAssessment.fP1 = inputs.filter(input => input.checked).map(input => input.value);
    savePersistentState(state);
    updateProgress();
  }

  main.addEventListener('change', event => {
    if (inputs.includes(event.target)) save();
  });
  main.querySelector('[data-f1-reset]')?.addEventListener('click', () => {
    for (const input of inputs) input.checked = false;
    save();
  });
  root.addEventListener('ai-v-delo:reset', () => {
    for (const input of inputs) input.checked = false;
    updateProgress();
  });
  window.addEventListener('storage', event => {
    if (event.key === 'ai-v-delo.v03' || event.key === 'ai-v-delo.memory-optout') restore();
  });
  restore();
  return true;
}

if (typeof document !== 'undefined') enhanceF1Assessment();
