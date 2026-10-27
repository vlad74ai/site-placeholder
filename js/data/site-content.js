import { semanticNodes as coreSemanticNodes } from './content.js';
import { networkSemanticNodes } from './content-network.js';
import { foundationStoryOverrides } from './content-foundations-story.js';
import { requestUnderstandingOverrides } from './content-foundations-request-understanding.js';
import { applyFoundationNavigationPatch } from './foundation-navigation-patch.js';
import { storyWhatIsAi } from './content-story-what-is-ai.js';
import { aboutSiteNodes } from './content-about-site.js';
import { homeOverview, relations, mapGroups } from './navigation.js';

export const semanticNodes = {
  ...coreSemanticNodes,
  ...networkSemanticNodes,
  ...aboutSiteNodes
};

function applyNodeOverrides(overrides) {
  Object.entries(overrides).forEach(([nodeId, override]) => {
    const baseNode = semanticNodes[nodeId] || {};
    semanticNodes[nodeId] = {
      ...baseNode,
      ...override,
      content: {
        ...(baseNode.content || {}),
        ...(override.content || {})
      },
      variants: {
        ...(baseNode.variants || {}),
        ...(override.variants || {}),
        lead: {
          ...(baseNode.variants?.lead || {}),
          ...(override.variants?.lead || {})
        }
      },
      examples: override.examples || baseNode.examples || {}
    };
  });
}

applyNodeOverrides(foundationStoryOverrides);
applyNodeOverrides(requestUnderstandingOverrides);
applyNodeOverrides(storyWhatIsAi);
applyFoundationNavigationPatch({ homeOverview, relations, mapGroups });
