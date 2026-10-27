function relationById(relations, id) {
  return relations.find((relation) => relation.id === id);
}

function addRelationOnce(relations, relation) {
  if (!relations.some((item) => item.id === relation.id)) relations.push(relation);
}

export function applyFoundationNavigationPatch({ homeOverview, relations, mapGroups }) {
  const directItems = homeOverview?.directItems || [];
  const capabilitiesIndex = directItems.findIndex((item) => item.id === 'capabilities');
  const requestItem = directItems.find((item) => item.id === 'request-understanding');

  if (!requestItem) {
    const insertAt = capabilitiesIndex >= 0 ? capabilitiesIndex + 1 : 0;
    directItems.splice(insertAt, 0, {
      id: 'request-understanding',
      title: 'Понять, как ИИ понимает ваш запрос',
      description: 'Почему короткая фраза в чате может не совпасть с полной картиной задачи, которую вы держите в голове.',
      targetNodeId: 'AI_REQUEST_UNDERSTANDING'
    });
  }

  const mechanicsItem = directItems.find((item) => item.id === 'mechanics');
  if (mechanicsItem) {
    mechanicsItem.title = 'Понять, откуда берётся ответ ИИ';
    mechanicsItem.description = 'Почему ответ не достаётся как готовая карточка и от чего зависит то, что ИИ сформирует.';
  }

  const whatMechanics = relationById(relations, 'what-mechanics');
  if (whatMechanics) {
    whatMechanics.id = 'what-request';
    whatMechanics.to = 'AI_REQUEST_UNDERSTANDING';
    whatMechanics.label = 'Понять, как ИИ понимает ваш запрос';
  }

  const capMechanics = relationById(relations, 'cap-mechanics');
  if (capMechanics) {
    capMechanics.id = 'cap-request';
    capMechanics.to = 'AI_REQUEST_UNDERSTANDING';
    capMechanics.label = 'Как ИИ понимает ваш запрос';
  }

  const understandMechanics = relationById(relations, 'understand-mechanics');
  if (understandMechanics) {
    understandMechanics.id = 'understand-request';
    understandMechanics.to = 'AI_REQUEST_UNDERSTANDING';
    understandMechanics.label = 'Как ИИ понимает ваш запрос';
  }

  addRelationOnce(relations, {
    id: 'cap-origin',
    from: 'AI_CAPABILITIES',
    to: 'AI_MECHANICS',
    relation: 'DEEPER_INTO',
    label: 'Откуда берётся ответ ИИ',
    priority: 25,
    minLevel: 'beginner'
  });

  addRelationOnce(relations, {
    id: 'request-origin',
    from: 'AI_REQUEST_UNDERSTANDING',
    to: 'AI_MECHANICS',
    relation: 'DEEPER_INTO',
    label: 'Откуда берётся ответ ИИ',
    priority: 10,
    minLevel: 'beginner'
  });

  addRelationOnce(relations, {
    id: 'request-context',
    from: 'AI_REQUEST_UNDERSTANDING',
    to: 'TASK_CONTEXT',
    relation: 'DEEPER_INTO',
    label: 'Почему нужные факты меняют ответ',
    priority: 20,
    minLevel: 'beginner'
  });

  addRelationOnce(relations, {
    id: 'request-start',
    from: 'AI_REQUEST_UNDERSTANDING',
    to: 'UNDERSTAND_AI_WORK',
    relation: 'APPLY_TO',
    label: 'Попробовать на реальной задаче',
    priority: 30,
    minLevel: 'beginner'
  });

  addRelationOnce(relations, {
    id: 'request-learning',
    from: 'AI_REQUEST_UNDERSTANDING',
    to: 'LEARNING_OPTIONS',
    relation: 'LEARN_AS_SKILL',
    label: 'Научиться ставить задачи ИИ самостоятельно',
    priority: 90,
    minLevel: 'beginner'
  });

  addRelationOnce(relations, {
    id: 'understand-origin',
    from: 'UNDERSTAND_AI_WORK',
    to: 'AI_MECHANICS',
    relation: 'DEEPER_INTO',
    label: 'Откуда берётся ответ ИИ',
    priority: 15,
    minLevel: 'beginner'
  });

  const foundationGroup = (mapGroups || []).find((group) => group.id === 'foundation');
  if (foundationGroup && !foundationGroup.nodeIds.includes('AI_REQUEST_UNDERSTANDING')) {
    const mechanicsIndex = foundationGroup.nodeIds.indexOf('AI_MECHANICS');
    const insertAt = mechanicsIndex >= 0 ? mechanicsIndex : 2;
    foundationGroup.nodeIds.splice(insertAt, 0, 'AI_REQUEST_UNDERSTANDING');
  }
}
