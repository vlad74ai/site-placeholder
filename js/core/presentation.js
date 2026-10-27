import { isPublicTopic } from '../data/public-topic-registry.js';
import { getSuggestions } from './routing.js';
import { launchFeatures, publicPresentationSettings } from '../data/launch-features.js';

const detailRank = { core: 0, normal: 1, detailed: 2 };
const selectedDetailRank = { short: 0, normal: 1, detailed: 2 };
const levelRank = { beginner: 0, explorer: 1, practitioner: 2, specialist: 3 };

function blockVisibleAtLevel(nodeId, blockId, level, blockMinLevels = {}) {
  const currentRank = levelRank[level] ?? 0;
  const minLevel = blockMinLevels[nodeId]?.[blockId];
  const minRank = levelRank[minLevel] ?? 0;
  return currentRank >= minRank;
}

function applyBlockTextOverride(block, nodeId, level, blockTextByLevel = {}) {
  const key = `${nodeId}.${block.id}`;
  const text = blockTextByLevel[level]?.[key];
  return text ? { ...block, text } : block;
}

function filterBlocks(
  blocks = [],
  detail = 'normal',
  nodeId = '',
  level = 'beginner',
  blockMinLevels = {},
  blockTextByLevel = {}
) {
  const maxRank = selectedDetailRank[detail] ?? 1;
  return blocks
    .filter((block) => (detailRank[block.detail || 'core'] ?? 0) <= maxRank)
    .filter((block) => blockVisibleAtLevel(nodeId, block.id, level, blockMinLevels))
    .map((block) => applyBlockTextOverride(block, nodeId, level, blockTextByLevel));
}

function selectLead(node, level) {
  if (!level) return node.content.lead;
  return node.variants?.lead?.[level] || node.content.lead;
}

function selectExample(node, exampleId, detail, level, blockMinLevels, blockTextByLevel) {
  if (!exampleId) return null;
  const example = node.examples?.[exampleId];
  if (!example) return null;
  return {
    id: example.id,
    label: example.label,
    blocks: filterBlocks(
      example.blocks,
      detail,
      node.id,
      level,
      blockMinLevels,
      blockTextByLevel
    )
  };
}

function nodeVisibleAtLevel(nodeId, level, nodeMinLevels = {}) {
  const currentRank = levelRank[level] ?? 0;
  const minRank = levelRank[nodeMinLevels[nodeId]] ?? 0;
  return currentRank >= minRank;
}

export function buildViewModel({
  semanticNodes,
  relations,
  mapGroups,
  nodeMinLevels = {},
  blockMinLevels = {},
  blockTextByLevel = {},
  state
}) {
  const { persistent, session } = state;
  const nodeId = session.currentNodeId;
  const node = nodeId ? semanticNodes[nodeId] : null;
  const settings = publicPresentationSettings(persistent.settings);
  const level = settings.level || 'beginner';

  const map = mapGroups.map((group) => ({
    id: group.id,
    label: group.label,
    items: group.nodeIds
      .filter((id) => nodeVisibleAtLevel(id, level, nodeMinLevels))
      .map((id) => semanticNodes[id])
      .filter(Boolean)
      .filter((item) => item.availability !== 'draft' && isPublicTopic(item.id))
      .map((item) => ({
        id: item.id,
        label: item.label,
        availability: item.availability,
        viewed: Boolean(persistent.viewed[item.id]?.viewed),
        current: item.id === nodeId
      }))
  })).filter((group) => group.items.length > 0);

  if (!node) {
    return {
      status: nodeId ? 'missing' : 'home',
      missingNodeId: nodeId,
      settings,
      map,
      equalizerIntroSeen: persistent.equalizerIntroSeen
    };
  }

  // Old quick-start examples predate the approved full articles and must
  // never be prepended without separate editorial integration.
  const example = launchFeatures.contextualEntryExamples ? selectExample(
    node, session.currentExampleId, settings.detail, level, blockMinLevels, blockTextByLevel
  ) : null;
  const suggestions = getSuggestions(
    node.id,
    relations,
    semanticNodes,
    level
  );
  const helperDismissed = session.helperDismissedForNode === node.id;

  return {
    status: node.availability === 'preview' ? 'preview' : 'ready',
    node: {
      id: node.id,
      label: node.label,
      availability: node.availability,
      coreMeaning: node.coreMeaning,
      title: node.content.title,
      lead: selectLead(node, level),
      leadLinks: node.content.leadLinks || [],
      blocks: filterBlocks(
        node.content.blocks,
        settings.detail,
        node.id,
        level,
        blockMinLevels,
        blockTextByLevel
      ),
      example,
      artifacts: node.artifacts || []
    },
    session: {
      exampleId: session.currentExampleId,
      entryContext: session.entryContext
    },
    settings,
    map,
    suggestions,
    helper: {
      enabled: launchFeatures.hachuha && settings.helper !== 'off',
      mode: settings.helper,
      dismissed: helperDismissed,
      suggestions
    },
    showEqualizerIntro: !persistent.equalizerIntroSeen,
    equalizerIntroSeen: persistent.equalizerIntroSeen
  };
}
