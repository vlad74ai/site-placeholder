import { isPublicTopic } from '../data/public-topic-registry.js';
import { launchFeatures } from '../data/launch-features.js';

const SKIP_KEYS = new Set(['id', 'type', 'detail', 'relation', 'kind', 'availability', 'status']);

function normalize(value = '') {
  return String(value)
    .toLowerCase()
    .replaceAll('ё', 'е')
    .replace(/[«»“”„"'`’]/g, ' ')
    .replace(/[^a-zа-я0-9]+/giu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(value = '') {
  return normalize(value).split(' ').filter(token => token.length > 1);
}

function tokenStem(token) {
  if (token.length <= 4) return token;
  return token.slice(0, 4);
}

function collectStrings(value, target = [], key = '') {
  if (value == null || SKIP_KEYS.has(key)) return target;
  if (typeof value === 'string') {
    if (value.trim()) target.push(value.trim());
    return target;
  }
  if (Array.isArray(value)) {
    value.forEach(item => collectStrings(item, target));
    return target;
  }
  if (typeof value === 'object') {
    Object.entries(value).forEach(([childKey, childValue]) => collectStrings(childValue, target, childKey));
  }
  return target;
}

function addAlias(aliasMap, targetNodeId, alias) {
  if (!targetNodeId || !alias?.title) return;
  const current = aliasMap.get(targetNodeId) || [];
  current.push(alias);
  aliasMap.set(targetNodeId, current);
}

export function buildSearchIndex({ semanticNodes = {}, primaryNavigation = [], homeOverview = {}, entryPoints = [], internalDocuments = [] } = {}) {
  const aliases = new Map();

  primaryNavigation.forEach(group => {
    addAlias(aliases, group.targetNodeId, {
      title: group.label,
      description: group.description || '',
      source: group.label
    });
    (group.items || []).forEach(item => {
      addAlias(aliases, item.targetNodeId, {
        title: item.label,
        description: item.description || '',
        source: group.label
      });
    });
  });

  (homeOverview.directItems || []).forEach(item => {
    addAlias(aliases, item.targetNodeId, {
      title: item.title,
      description: item.description || '',
      source: 'Главная'
    });
  });

  entryPoints.forEach(item => {
    if (!item.href) addAlias(aliases, item.targetNodeId, {
      title: item.title,
      description: item.subtitle || '',
      source: 'Быстрый старт'
    });
  });

  const legacyDocuments = Object.values(semanticNodes)
    .filter(node => node && node.id && node.availability !== 'draft' && isPublicTopic(node.id))
    .map(node => {
      const nodeAliases = aliases.get(node.id) || [];
      const titleCandidates = [
        { title: node.label || node.content?.title || node.id, description: node.content?.lead || node.coreMeaning || '', source: 'Раздел' },
        ...(node.content?.title && node.content.title !== node.label
          ? [{ title: node.content.title, description: node.content?.lead || node.coreMeaning || '', source: 'Раздел' }]
          : []),
        ...nodeAliases
      ];

      const bodyParts = collectStrings({
        label: node.label,
        coreMeaning: node.coreMeaning,
        content: node.content,
        variants: node.variants,
        examples: launchFeatures.contextualEntryExamples ? node.examples : {},
        aliases: nodeAliases
      });
      const body = normalize(bodyParts.join(' '));
      const bodyTokens = tokenize(body);
      const bodyStems = new Set(bodyTokens.map(tokenStem));

      return {
        nodeId: node.id,
        availability: node.availability,
        titleCandidates: titleCandidates.map(candidate => ({
          ...candidate,
          normalized: normalize(candidate.title),
          tokens: tokenize(candidate.title)
        })),
        body,
        bodyTokens,
        bodyStems
      };
    });
  return [...legacyDocuments, ...internalDocuments.map(page => {
    const entryAliases = entryPoints.filter(entry => entry.href === page.href).map(entry => ({
      title: entry.title, description: entry.subtitle || '', source: 'Быстрый старт'
    }));
    const body = normalize([page.text, ...entryAliases.flatMap(alias => [alias.title, alias.description])].join(' '));
    const bodyTokens = tokenize(body);
    return {
      pageId: page.id, href: page.href, availability: 'current', body, bodyTokens,
      bodyStems: new Set(bodyTokens.map(tokenStem)),
      titleCandidates: [
        { title: page.label, description: page.lead, source: 'Польза ИИ' },
        ...entryAliases
      ].map(candidate => ({ ...candidate, normalized: normalize(candidate.title), tokens: tokenize(candidate.title) }))
    };
  })];
}

function scoreTitle(candidate, query, queryTokens, queryStems) {
  let score = 0;
  const title = candidate.normalized;
  if (!title) return score;
  if (title === query) score += 120;
  else if (title.startsWith(query)) score += 80;
  else if (title.includes(query)) score += 55;

  const titleStems = new Set(candidate.tokens.map(tokenStem));
  queryTokens.forEach((token, index) => {
    if (candidate.tokens.includes(token)) score += 20;
    else if (candidate.tokens.some(word => word.startsWith(token) || token.startsWith(word))) score += 14;
    else if (titleStems.has(queryStems[index])) score += 9;
  });
  return score;
}

export function searchSite(index = [], rawQuery = '', limit = 7) {
  const query = normalize(rawQuery);
  if (query.length < 2) return [];

  const queryTokens = tokenize(query);
  const queryStems = queryTokens.map(tokenStem);

  return index
    .map(document => {
      let bestCandidate = document.titleCandidates[0];
      let bestTitleScore = -1;
      document.titleCandidates.forEach(candidate => {
        const score = scoreTitle(candidate, query, queryTokens, queryStems);
        if (score > bestTitleScore) {
          bestTitleScore = score;
          bestCandidate = candidate;
        }
      });

      let matchedTokens = 0;
      let bodyScore = 0;
      queryTokens.forEach((token, index) => {
        if (document.body.includes(token)) {
          matchedTokens += 1;
          bodyScore += 8;
          return;
        }
        if (document.bodyTokens.some(word => word.startsWith(token) || token.startsWith(word))) {
          matchedTokens += 1;
          bodyScore += 5;
          return;
        }
        if (document.bodyStems.has(queryStems[index])) {
          matchedTokens += 1;
          bodyScore += 3;
        }
      });

      const allTermsMatched = matchedTokens === queryTokens.length;
      const score = bestTitleScore + bodyScore + (allTermsMatched ? 18 : 0) + (document.body.includes(query) ? 18 : 0);
      return {
        nodeId: document.nodeId,
        pageId: document.pageId,
        href: document.href,
        title: bestCandidate.title,
        description: bestCandidate.description,
        source: bestCandidate.source,
        availability: document.availability,
        score,
        matchedTokens
      };
    })
    .filter(result => result.score > 0 && result.matchedTokens > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, 'ru'))
    .slice(0, limit);
}
