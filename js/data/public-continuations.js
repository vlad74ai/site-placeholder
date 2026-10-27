// Curated public exits. Archived/parked semantic nodes remain in the internal
// knowledge graph but are excluded as standalone reader destinations.
// Do not mistake a node for an accepted explanatory article.
import { isPublicTopic } from './public-topic-registry.js';

export const publicContinuationRouteIds = Object.freeze({
  WHAT_IS_AI: ['what-cap', 'what-request', 'what-verify'],
  AI_CAPABILITIES: ['cap-start', 'cap-visual', 'cap-verify', 'cap-work'],
  AI_MECHANICS: ['mechanics-context', 'mechanics-verify', 'mechanics-own'],
  AI_REQUEST_UNDERSTANDING: ['request-context', 'request-practice', 'request-mechanics'],
  TASK_CONTEXT: ['context-verify', 'context-own'],
  VERIFY_RESULT: ['verify-decision', 'verify-own', 'verify-work'],
  UNDERSTAND_AI_WORK: ['understand-own', 'understand-context', 'understand-verify', 'understand-work'],
  VISUAL_CONTEXT_SUPPORT: ['visual-context', 'visual-verify', 'visual-own'],
  DECISION_SUPPORT: ['decision-verify', 'decision-own'],
  OWN_TASK: ['own-context', 'own-work'],
  AI_WORK_USE: ['work-decompose', 'work-verify', 'work-own'],
  DECOMPOSE_WORK: ['decompose-own', 'decompose-work', 'decompose-verify'],
  ABOUT_SITE: ['about-capabilities', 'about-own-task', 'about-what']
});

const editorialRoutes = Object.freeze([
  { id: 'decompose-work', from: 'DECOMPOSE_WORK', to: 'AI_WORK_USE',
    relation: 'BACK_TO', label: 'Как продолжать работу над одной задачей' },
  { id: 'decompose-verify', from: 'DECOMPOSE_WORK', to: 'VERIFY_RESULT',
    relation: 'RELATED_TO', label: 'Почему промежуточные результаты нужно проверять' },
  { id: 'about-capabilities', from: 'ABOUT_SITE', to: 'AI_CAPABILITIES',
    relation: 'RELATED_TO', label: 'Посмотреть возможности ИИ' },
  { id: 'about-own-task', from: 'ABOUT_SITE', to: 'OWN_TASK',
    relation: 'APPLY_TO', label: 'Разобрать свою знакомую задачу' },
  { id: 'about-what', from: 'ABOUT_SITE', to: 'WHAT_IS_AI',
    relation: 'RELATED_TO', label: 'Что такое ИИ' }
]);

export function getPublicContinuationRoutes(nodeId, relations) {
  if (!isPublicTopic(nodeId)) throw new Error('No published article for: ' + nodeId);
  const ids = publicContinuationRouteIds[nodeId];
  if (!ids) throw new Error('Missing editorial continuation selection: ' + nodeId);
  const byId = new Map([...relations, ...editorialRoutes].map(route => [route.id, route]));
  const selected = ids.map(id => {
    const route = byId.get(id);
    if (!route || route.from !== nodeId || !isPublicTopic(route.to))
      throw new Error('Invalid public continuation: ' + nodeId + '/' + id);
    return { id: route.id, relation: route.relation, label: route.label, targetNodeId: route.to };
  });
  if (selected.length < 2 || selected.length > 4 ||
      new Set(selected.map(route => route.targetNodeId)).size !== selected.length)
    throw new Error('Public exits must have 2-4 distinct accepted destinations: ' + nodeId);
  return selected;
}
