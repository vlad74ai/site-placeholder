import { INTERNAL_PAGES } from '../data/internal-pages.js';
import { AF_DIRECTIONS, AF_LEGACY_DESTINATIONS } from '../data/af-public-content.js';

const levelRank = {
  beginner: 0,
  explorer: 1,
  practitioner: 2,
  specialist: 3
};

export function resolveEntry(entryId, entryPoints) {
  return entryPoints.find((entry) => entry.id === entryId) || null;
}

export function resolveNode(nodeId, semanticNodes) {
  return semanticNodes[nodeId] || null;
}

export function getSuggestions(nodeId, relations, semanticNodes, level = 'beginner') {
  const currentRank = levelRank[level] ?? 0;

  return relations
    .filter((relation) => relation.from === nodeId)
    .filter((relation) => semanticNodes[relation.to]?.availability !== 'draft')
    .filter((relation) => currentRank >= (levelRank[relation.minLevel] ?? 0))
    .sort((a, b) => (a.priority || 999) - (b.priority || 999))
    .map((relation) => ({
      id: relation.id,
      relation: relation.relation,
      label: relation.label || semanticNodes[relation.to]?.label || relation.to,
      targetNodeId: relation.to,
      availability: semanticNodes[relation.to]?.availability || 'missing'
    }));
}

export function validateArchitecture({ semanticNodes, entryPoints, relations, mapGroups, homeOverview = null }) {
  const errors = [];

  for (const [id, node] of Object.entries(semanticNodes)) {
    if (node.id !== id) errors.push(`Node key/id mismatch: ${id}`);
    if (!node.content?.title) errors.push(`Node ${id} has no content.title`);
    if (!node.content?.lead) errors.push(`Node ${id} has no neutral lead`);
  }

  for (const entry of entryPoints) {
    if (entry.href) {
      const [path, fragment] = entry.href.split('#');
      const registeredSection = Object.values(AF_LEGACY_DESTINATIONS).includes(entry.href)
        || AF_DIRECTIONS.some(direction => direction.href === entry.href);
      if (!Object.values(INTERNAL_PAGES).some(page => page.href === path)) {
        errors.push(`Entry ${entry.id} targets unregistered page ${entry.href}`);
      } else if (fragment !== undefined && !registeredSection) {
        errors.push(`Entry ${entry.id} targets unregistered section ${entry.href}`);
      }
      if (entry.targetNodeId || entry.exampleId) {
        errors.push(`Entry ${entry.id} mixes page and semantic node destinations`);
      }
      continue;
    }
    const node = semanticNodes[entry.targetNodeId];
    if (!node) {
      errors.push(`Entry ${entry.id} targets missing node ${entry.targetNodeId}`);
      continue;
    }
    if (entry.exampleId && !node.examples?.[entry.exampleId]) {
      errors.push(`Entry ${entry.id} targets missing example ${entry.targetNodeId}/${entry.exampleId}`);
    }
  }

  for (const directItem of homeOverview?.directItems || []) {
    const node = semanticNodes[directItem.targetNodeId];
    if (!node) errors.push(`Homepage direct route ${directItem.id} targets missing node ${directItem.targetNodeId}`);
  }

  for (const relation of relations) {
    if (!semanticNodes[relation.from]) errors.push(`Relation ${relation.id} has missing source ${relation.from}`);
    if (!semanticNodes[relation.to]) errors.push(`Relation ${relation.id} has missing target ${relation.to}`);
  }

  for (const group of mapGroups) {
    for (const nodeId of group.nodeIds) {
      if (!semanticNodes[nodeId]) errors.push(`Map group ${group.id} references missing node ${nodeId}`);
    }
  }

  return errors;
}

export function buildHash({ nodeId, exampleId = null, entryContext = null }) {
  if (!nodeId) return '';
  const params = new URLSearchParams();
  params.set('node', nodeId);
  if (exampleId) params.set('example', exampleId);
  if (entryContext) params.set('entry', entryContext);
  return `#${params.toString()}`;
}

export function parseHash(hash) {
  const raw = (hash || '').replace(/^#/, '');
  if (!raw) return { nodeId: null, exampleId: null, entryContext: null };

  const params = new URLSearchParams(raw);
  return {
    nodeId: params.get('node'),
    exampleId: params.get('example'),
    entryContext: params.get('entry')
  };
}
