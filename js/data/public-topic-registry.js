// Editorial publication gate. Semantic knowledge nodes remain in site-content.js
// even when parked; a node's availability is NOT proof of page acceptance.
// Do not change this registry while designing future A-F navigation without
// checking the actual accepted article and the published link impact.
export const PUBLIC_TOPIC_IDS = Object.freeze([
  'WHAT_IS_AI','AI_CAPABILITIES','AI_MECHANICS','AI_REQUEST_UNDERSTANDING',
  'TASK_CONTEXT','VERIFY_RESULT','VISUAL_CONTEXT_SUPPORT','UNDERSTAND_AI_WORK',
  'DECISION_SUPPORT','OWN_TASK','AI_WORK_USE','DECOMPOSE_WORK','ABOUT_SITE'
]);
// Historical standalone URLs remain as noindex handoff pages. These IDs are
// parked, not deleted from the semantic model or historic Git snapshots.
export const PARKED_TOPIC_DESTINATIONS = Object.freeze({
  FEEDBACK_CONTROL: 'DECOMPOSE_WORK',
  SLIDE9_WORK_MODEL: 'AI_WORK_USE',
  PROCESS_IMPROVEMENT: 'AI_WORK_USE',
  AUTOMATION: 'DECOMPOSE_WORK',
  SKILLS_MAP: 'AI_REQUEST_UNDERSTANDING',
  SKILL_ADOPTION: 'OWN_TASK',
  THREE_WAVES: 'AI_CAPABILITIES',
  LEARNING_OPTIONS: 'UNDERSTAND_AI_WORK',
  MATERIALS: 'OWN_TASK'
});
const published = new Set(PUBLIC_TOPIC_IDS);
export const isPublicTopic = id => published.has(id);
export const isParkedTopic = id => Object.hasOwn(PARKED_TOPIC_DESTINATIONS,id);
export function publicDestinationFor(id) {
  return isPublicTopic(id) ? id : (PARKED_TOPIC_DESTINATIONS[id] || null);
}
