import { AF_LEGACY_DESTINATIONS } from './af-public-content.js';

export const homeOverview = {
  title: 'AI В ДЕЛО — сайт о практическом использовании искусственного интеллекта.',
  meta: {
    aiLabel: 'AI — искусственный интеллект (ИИ)',
    motto: 'Понимай. Используй. Развивайся.'
  },
  directTitle: 'Здесь можно',
  directItems: [
    {
      id: 'what-is-ai',
      title: 'Коротко понять, что такое ИИ',
      description: 'Что делает ИИ, какую информацию получает и почему хорошо написанный ответ не равен гарантированной истине.',
      targetNodeId: 'WHAT_IS_AI'
    },
    {
      id: 'capabilities',
      title: 'Посмотреть, что уже умеет ИИ',
      description: 'Объяснять, писать, сравнивать, разбирать материалы, создавать новое и участвовать в более сложной работе.',
      targetNodeId: 'AI_CAPABILITIES'
    },
    {
      id: 'mechanics',
      title: 'Понять, как ИИ получает ответ',
      description: 'Что ИИ действительно знает о вашей ситуации и почему недостающие факты важны.',
      targetNodeId: 'AI_MECHANICS'
    },
    {
      id: 'context',
      title: 'Понять, почему важны нужные факты',
      description: 'Почему один и тот же ИИ отвечает по-разному, когда получает больше полезной информации о задаче.',
      targetNodeId: 'TASK_CONTEXT'
    },
    {
      id: 'verify',
      title: 'Понять, почему результат нужно проверять',
      description: 'Почему уверенный ответ может быть неверным и как последствия ошибки влияют на проверку.',
      targetNodeId: 'VERIFY_RESULT'
    },
    {
      id: 'examples',
      title: 'Разобраться на простых и рабочих примерах',
      description: 'Посмотреть, как способы работы с ИИ проявляются в знакомых личных и рабочих задачах.',
      targetNodeId: 'UNDERSTAND_AI_WORK'
    },
    {
      id: 'visual',
      title: 'Показать ИИ скриншот или фото',
      description: 'Передать часть ситуации изображением и спросить, что здесь происходит или что разумно сделать дальше.',
      targetNodeId: 'VISUAL_CONTEXT_SUPPORT'
    },
    {
      id: 'decision',
      title: 'Сравнить варианты и помочь с выбором',
      description: 'Разложить варианты по вашим критериям и увидеть различия, не отдавая ИИ само решение.',
      targetNodeId: 'DECISION_SUPPORT'
    },
    {
      id: 'own-task',
      title: 'Найти способ использовать ИИ в своей задаче',
      description: 'Начать со своей ситуации и нужного результата, не зная заранее инструмент или правильный термин.',
      targetNodeId: 'OWN_TASK'
    },
    {
      id: 'work',
      title: 'Посмотреть, как ИИ участвует в работе',
      description: 'Когда достаточно одного запроса, а когда полезно связать несколько разных частей работы.',
      targetNodeId: 'AI_WORK_USE'
    },
    {
      id: 'skill-adoption',
      title: 'Сделать полезный приём привычкой',
      description: 'Осваивать нужные возможности небольшими порциями, а не пытаться запомнить всё сразу.',
      targetNodeId: 'SKILL_ADOPTION'
    },
    {
      id: 'practical',
      title: 'Получить практическую пользу',
      description: 'Открыть листы пользы и другие материалы, которые можно использовать отдельно.',
      targetNodeId: 'MATERIALS'
    },
    {
      id: 'three-waves',
      title: 'Посмотреть «Три волны технологий»',
      description: 'Сравнить массовое использование ПК, Интернета и ИИ с реальным уровнем освоения.',
      targetNodeId: 'THREE_WAVES'
    },
    {
      id: 'learning',
      title: 'Посмотреть варианты обучения',
      description: 'Перейти к практике и формированию навыка, когда одного объяснения уже недостаточно.',
      targetNodeId: 'LEARNING_OPTIONS'
    }
  ],
  settings: {
    title: 'Настройте объяснения под себя',
    intro: 'Сайт начинает с уровня «Новичок». В Эквалайзере можно в любой момент изменить глубину и подробность подачи.',
    difficultyLabel: 'Сложность',
    difficultyValues: ['Новичок', 'Исследователь', 'Практик', 'Специалист'],
    detailLabel: 'Подробность',
    detailValues: ['Коротко', 'Обычно', 'Подробно'],
    note: 'Уровень — это режим подачи, а не оценка человека.',
    actionLabel: 'Открыть Эквалайзер'
  },
  start: {
    title: 'Если пока не знаете, с чего начать',
    text: 'Не нужно знать специальные термины или заранее понимать, какой инструмент вам нужен.',
    note: 'Можно начать с обычного вопроса, знакомой ситуации или своей задачи.'
  }
};

export const entryPoints = [
  {
    id: 'capabilities',
    order: 1,
    featured: true,
    title: 'Что вообще умеет ИИ?',
    subtitle: 'Показать возможности на простых примерах',
    targetNodeId: 'AI_CAPABILITIES'
  },
  {
    id: 'try-task',
    order: 2,
    title: 'Хочу попробовать ИИ на простой задаче',
    subtitle: 'Начать со знакомого дела · Получить первый результат',
    targetNodeId: 'UNDERSTAND_AI_WORK'
  },
  {
    id: 'visual',
    order: 3,
    title: 'Хочу показать ИИ, что у меня на экране',
    subtitle: 'Скриншот · Фото · Сообщение об ошибке',
    targetNodeId: 'VISUAL_CONTEXT_SUPPORT'
  },
  {
    id: 'diagnose',
    order: 4,
    title: 'ИИ сделал не то, что я просил',
    subtitle: 'Почему он понял задачу иначе · Как объяснить нужный результат',
    targetNodeId: 'AI_REQUEST_UNDERSTANDING'
  },
  {
    id: 'verify',
    order: 5,
    title: 'Хочу проверить ответ ИИ',
    subtitle: 'Когда нужна проверка · Как избежать ошибки',
    targetNodeId: 'VERIFY_RESULT'
  },
  {
    id: 'compare',
    order: 6,
    title: 'Хочу сравнить и выбрать',
    subtitle: 'Сравнить варианты · Помочь принять решение',
    targetNodeId: 'DECISION_SUPPORT'
  },
  {
    id: 'files',
    order: 7,
    title: 'Хочу разобраться в документах или файлах',
    subtitle: 'Документ · Таблица · Несколько материалов',
    href: AF_LEGACY_DESTINATIONS['materials-and-results']
  },
  {
    id: 'work',
    order: 8,
    title: 'Хочу поручить ИИ несколько действий',
    subtitle: 'Продолжить задачу · Уточнить · Проверить результат',
    targetNodeId: 'AI_WORK_USE'
  }
];

export const relations = [
  { id: 'what-cap', from: 'WHAT_IS_AI', to: 'AI_CAPABILITIES', relation: 'DEEPER_INTO', label: 'Посмотреть, что ИИ уже умеет', priority: 10, minLevel: 'beginner' },
  { id: 'what-request', from: 'WHAT_IS_AI', to: 'AI_REQUEST_UNDERSTANDING', relation: 'DEEPER_INTO', label: 'Понять, как ИИ понимает ваш запрос', priority: 20, minLevel: 'beginner' },
  { id: 'what-mechanics', from: 'WHAT_IS_AI', to: 'AI_MECHANICS', relation: 'DEEPER_INTO', label: 'Понять, как ИИ получает ответ', priority: 25, minLevel: 'explorer' },
  { id: 'what-verify', from: 'WHAT_IS_AI', to: 'VERIFY_RESULT', relation: 'DEEPER_INTO', label: 'Почему важный результат нужно проверять', priority: 30, minLevel: 'beginner' },

  { id: 'mechanics-cap', from: 'AI_MECHANICS', to: 'AI_CAPABILITIES', relation: 'RELATED_TO', label: 'Что ИИ уже умеет делать', priority: 10, minLevel: 'beginner' },
  { id: 'mechanics-context', from: 'AI_MECHANICS', to: 'TASK_CONTEXT', relation: 'DEEPER_INTO', label: 'Почему нужные факты меняют ответ', priority: 20, minLevel: 'beginner' },
  { id: 'mechanics-verify', from: 'AI_MECHANICS', to: 'VERIFY_RESULT', relation: 'DEEPER_INTO', label: 'Почему ответ всё равно нужно проверять', priority: 30, minLevel: 'beginner' },
  { id: 'mechanics-own', from: 'AI_MECHANICS', to: 'OWN_TASK', relation: 'APPLY_TO', label: 'Попробовать на своей задаче', priority: 40, minLevel: 'beginner' },
  { id: 'mechanics-learning', from: 'AI_MECHANICS', to: 'LEARNING_OPTIONS', relation: 'LEARN_AS_SKILL', label: 'Научиться применять это самому', priority: 90, minLevel: 'beginner' },

  { id: 'cap-start', from: 'AI_CAPABILITIES', to: 'UNDERSTAND_AI_WORK', relation: 'APPLY_TO', label: 'Как начать пользоваться этими возможностями', priority: 10, minLevel: 'beginner' },
  { id: 'cap-visual', from: 'AI_CAPABILITIES', to: 'VISUAL_CONTEXT_SUPPORT', relation: 'EXAMPLE_OF', label: 'Показать ИИ скриншот или фото', priority: 15, minLevel: 'beginner' },
  { id: 'cap-request', from: 'AI_CAPABILITIES', to: 'AI_REQUEST_UNDERSTANDING', relation: 'RELATED_TO', label: 'Как ИИ понимает ваш запрос', priority: 17, minLevel: 'beginner' },
  { id: 'cap-mechanics', from: 'AI_CAPABILITIES', to: 'AI_MECHANICS', relation: 'DEEPER_INTO', label: 'Откуда берётся ответ ИИ', priority: 20, minLevel: 'beginner' },
  { id: 'cap-context', from: 'AI_CAPABILITIES', to: 'TASK_CONTEXT', relation: 'DEEPER_INTO', label: 'Почему нужные факты меняют ответ', priority: 30, minLevel: 'beginner' },
  { id: 'cap-verify', from: 'AI_CAPABILITIES', to: 'VERIFY_RESULT', relation: 'DEEPER_INTO', label: 'Почему результат нужно проверять', priority: 40, minLevel: 'beginner' },
  { id: 'cap-own', from: 'AI_CAPABILITIES', to: 'OWN_TASK', relation: 'APPLY_TO', label: 'У меня есть своя задача', priority: 50, minLevel: 'beginner' },
  { id: 'cap-work', from: 'AI_CAPABILITIES', to: 'AI_WORK_USE', relation: 'DEEPER_INTO', label: 'Как использовать несколько возможностей в одной работе', priority: 60, minLevel: 'explorer' },
  { id: 'cap-skill', from: 'AI_CAPABILITIES', to: 'SKILL_ADOPTION', relation: 'LEARN_AS_SKILL', label: 'Как постепенно освоить нужные возможности', priority: 70, minLevel: 'beginner' },
  { id: 'cap-learning', from: 'AI_CAPABILITIES', to: 'LEARNING_OPTIONS', relation: 'LEARN_AS_SKILL', label: 'Научиться выбирать и использовать возможности ИИ', priority: 90, minLevel: 'beginner' },

  { id: 'request-mechanics', from: 'AI_REQUEST_UNDERSTANDING', to: 'AI_MECHANICS', relation: 'RELATED_TO', label: 'Откуда берётся ответ ИИ', priority: 10, minLevel: 'beginner' },
  { id: 'request-context', from: 'AI_REQUEST_UNDERSTANDING', to: 'TASK_CONTEXT', relation: 'DEEPER_INTO', label: 'Почему нужные факты меняют ответ', priority: 20, minLevel: 'beginner' },
  { id: 'request-practice', from: 'AI_REQUEST_UNDERSTANDING', to: 'UNDERSTAND_AI_WORK', relation: 'APPLY_TO', label: 'Попробовать на реальной задаче', priority: 30, minLevel: 'beginner' },
  { id: 'request-learning', from: 'AI_REQUEST_UNDERSTANDING', to: 'LEARNING_OPTIONS', relation: 'LEARN_AS_SKILL', label: 'Научиться ставить задачи ИИ самостоятельно', priority: 90, minLevel: 'beginner' },

  { id: 'visual-context', from: 'VISUAL_CONTEXT_SUPPORT', to: 'TASK_CONTEXT', relation: 'DEEPER_INTO', label: 'Почему изображение — это часть контекста задачи', priority: 10, minLevel: 'beginner' },
  { id: 'visual-verify', from: 'VISUAL_CONTEXT_SUPPORT', to: 'VERIFY_RESULT', relation: 'RELATED_TO', label: 'Какие действия после совета ИИ нужно перепроверять', priority: 20, minLevel: 'beginner' },
  { id: 'visual-own', from: 'VISUAL_CONTEXT_SUPPORT', to: 'OWN_TASK', relation: 'APPLY_TO', label: 'Перейти к своей задаче', priority: 30, minLevel: 'beginner' },

  { id: 'understand-request', from: 'UNDERSTAND_AI_WORK', to: 'AI_REQUEST_UNDERSTANDING', relation: 'RELATED_TO', label: 'Как ИИ понимает ваш запрос', priority: 5, minLevel: 'beginner' },
  { id: 'understand-mechanics', from: 'UNDERSTAND_AI_WORK', to: 'AI_MECHANICS', relation: 'DEEPER_INTO', label: 'Откуда берётся ответ ИИ', priority: 10, minLevel: 'beginner' },
  { id: 'understand-context', from: 'UNDERSTAND_AI_WORK', to: 'TASK_CONTEXT', relation: 'DEEPER_INTO', label: 'Почему дополнительная информация меняет ответ', priority: 20, minLevel: 'beginner' },
  { id: 'understand-verify', from: 'UNDERSTAND_AI_WORK', to: 'VERIFY_RESULT', relation: 'DEEPER_INTO', label: 'Почему результат нужно проверять', priority: 30, minLevel: 'beginner' },
  { id: 'understand-own', from: 'UNDERSTAND_AI_WORK', to: 'OWN_TASK', relation: 'APPLY_TO', label: 'Перейти к своей задаче', priority: 40, minLevel: 'beginner' },
  { id: 'understand-work', from: 'UNDERSTAND_AI_WORK', to: 'AI_WORK_USE', relation: 'DEEPER_INTO', label: 'Когда одной задачи уже мало', priority: 50, minLevel: 'explorer' },
  { id: 'understand-learning', from: 'UNDERSTAND_AI_WORK', to: 'LEARNING_OPTIONS', relation: 'LEARN_AS_SKILL', label: 'Научиться работать с ИИ самостоятельно', priority: 90, minLevel: 'beginner' },

  { id: 'context-verify', from: 'TASK_CONTEXT', to: 'VERIFY_RESULT', relation: 'DEEPER_INTO', label: 'А если ответ звучит убедительно?', priority: 10, minLevel: 'beginner' },
  { id: 'context-own', from: 'TASK_CONTEXT', to: 'OWN_TASK', relation: 'APPLY_TO', label: 'Разобрать свою ситуацию', priority: 20, minLevel: 'beginner' },
  { id: 'context-feedback', from: 'TASK_CONTEXT', to: 'FEEDBACK_CONTROL', relation: 'DEEPER_INTO', label: 'Что происходит, если новый факт меняет следующий шаг?', priority: 30, minLevel: 'explorer' },
  { id: 'context-learning', from: 'TASK_CONTEXT', to: 'LEARNING_OPTIONS', relation: 'LEARN_AS_SKILL', label: 'Научиться давать ИИ нужную информацию', priority: 90, minLevel: 'beginner' },

  { id: 'verify-decision', from: 'VERIFY_RESULT', to: 'DECISION_SUPPORT', relation: 'RELATED_TO', label: 'Как ИИ может помочь сравнить варианты', priority: 10, minLevel: 'beginner' },
  { id: 'verify-own', from: 'VERIFY_RESULT', to: 'OWN_TASK', relation: 'APPLY_TO', label: 'Разобрать свою задачу', priority: 20, minLevel: 'beginner' },
  { id: 'verify-work', from: 'VERIFY_RESULT', to: 'AI_WORK_USE', relation: 'DEEPER_INTO', label: 'Как проверка работает в связанной работе', priority: 30, minLevel: 'explorer' },
  { id: 'verify-learning', from: 'VERIFY_RESULT', to: 'LEARNING_OPTIONS', relation: 'LEARN_AS_SKILL', label: 'Научиться получать и проверять полезный результат', priority: 90, minLevel: 'beginner' },

  { id: 'decision-verify', from: 'DECISION_SUPPORT', to: 'VERIFY_RESULT', relation: 'RELATED_TO', label: 'Почему важный выбор нужно проверять', priority: 10, minLevel: 'beginner' },
  { id: 'decision-own', from: 'DECISION_SUPPORT', to: 'OWN_TASK', relation: 'APPLY_TO', label: 'Сравнить варианты в своей задаче', priority: 20, minLevel: 'beginner' },
  { id: 'decision-learning', from: 'DECISION_SUPPORT', to: 'LEARNING_OPTIONS', relation: 'LEARN_AS_SKILL', label: 'Научиться использовать ИИ для выбора', priority: 90, minLevel: 'beginner' },

  { id: 'work-verify', from: 'AI_WORK_USE', to: 'VERIFY_RESULT', relation: 'RELATED_TO', label: 'Почему промежуточные результаты нужно проверять', priority: 10, minLevel: 'beginner' },
  { id: 'work-own', from: 'AI_WORK_USE', to: 'OWN_TASK', relation: 'APPLY_TO', label: 'Разобрать свою рабочую задачу', priority: 20, minLevel: 'beginner' },
  { id: 'work-decompose', from: 'AI_WORK_USE', to: 'DECOMPOSE_WORK', relation: 'DEEPER_INTO', label: 'Когда большую задачу лучше разделить', priority: 30, minLevel: 'explorer' },
  { id: 'work-slide9', from: 'AI_WORK_USE', to: 'SLIDE9_WORK_MODEL', relation: 'DEEPER_INTO', label: 'Как меняется организация более сложной работы', priority: 40, minLevel: 'explorer' },
  { id: 'work-process', from: 'AI_WORK_USE', to: 'PROCESS_IMPROVEMENT', relation: 'DEEPER_INTO', label: 'Что делать, если эта работа постоянно повторяется', priority: 50, minLevel: 'practitioner' },
  { id: 'work-learning', from: 'AI_WORK_USE', to: 'LEARNING_OPTIONS', relation: 'LEARN_AS_SKILL', label: 'Научиться использовать ИИ в работе', priority: 90, minLevel: 'beginner' },

  { id: 'decompose-feedback', from: 'DECOMPOSE_WORK', to: 'FEEDBACK_CONTROL', relation: 'DEEPER_INTO', label: 'А если результат одного шага меняет следующий?', priority: 10, minLevel: 'explorer' },
  { id: 'decompose-own', from: 'DECOMPOSE_WORK', to: 'OWN_TASK', relation: 'APPLY_TO', label: 'Разобрать свою задачу', priority: 20, minLevel: 'beginner' },
  { id: 'decompose-learning', from: 'DECOMPOSE_WORK', to: 'LEARNING_OPTIONS', relation: 'LEARN_AS_SKILL', label: 'Научиться разделять сложные задачи', priority: 90, minLevel: 'explorer' },

  { id: 'slide9-feedback', from: 'SLIDE9_WORK_MODEL', to: 'FEEDBACK_CONTROL', relation: 'DEEPER_INTO', label: 'Как результат одного этапа меняет следующий', priority: 10, minLevel: 'explorer' },
  { id: 'slide9-process', from: 'SLIDE9_WORK_MODEL', to: 'PROCESS_IMPROVEMENT', relation: 'APPLY_TO', label: 'Перейти к повторяющемуся процессу', priority: 20, minLevel: 'practitioner' },
  { id: 'slide9-cap', from: 'SLIDE9_WORK_MODEL', to: 'AI_CAPABILITIES', relation: 'BACK_TO', label: 'Вернуться к отдельным возможностям', priority: 30, minLevel: 'beginner' },
  { id: 'slide9-own', from: 'SLIDE9_WORK_MODEL', to: 'OWN_TASK', relation: 'APPLY_TO', label: 'Разобрать свою задачу', priority: 40, minLevel: 'beginner' },

  { id: 'feedback-slide9', from: 'FEEDBACK_CONTROL', to: 'SLIDE9_WORK_MODEL', relation: 'BACK_TO', label: 'Посмотреть общую модель сложной работы', priority: 10, minLevel: 'explorer' },
  { id: 'feedback-own', from: 'FEEDBACK_CONTROL', to: 'OWN_TASK', relation: 'APPLY_TO', label: 'Применить к своей задаче', priority: 20, minLevel: 'beginner' },
  { id: 'feedback-process', from: 'FEEDBACK_CONTROL', to: 'PROCESS_IMPROVEMENT', relation: 'APPLY_TO', label: 'Посмотреть на повторяющийся процесс', priority: 30, minLevel: 'practitioner' },

  { id: 'process-automation', from: 'PROCESS_IMPROVEMENT', to: 'AUTOMATION', relation: 'DEEPER_INTO', label: 'Когда улучшенный процесс уже имеет смысл автоматизировать', priority: 10, minLevel: 'practitioner' },
  { id: 'process-skills', from: 'PROCESS_IMPROVEMENT', to: 'SKILLS_MAP', relation: 'LEARN_AS_SKILL', label: 'Какие навыки нужны для устойчивой работы', priority: 20, minLevel: 'explorer' },
  { id: 'process-learning', from: 'PROCESS_IMPROVEMENT', to: 'LEARNING_OPTIONS', relation: 'LEARN_AS_SKILL', label: 'Посмотреть варианты обучения', priority: 90, minLevel: 'beginner' },

  { id: 'automation-process', from: 'AUTOMATION', to: 'PROCESS_IMPROVEMENT', relation: 'BACK_TO', label: 'Сначала проверить сам способ работы', priority: 10, minLevel: 'practitioner' },
  { id: 'automation-own', from: 'AUTOMATION', to: 'OWN_TASK', relation: 'APPLY_TO', label: 'Начать с конкретной задачи', priority: 20, minLevel: 'beginner' },

  { id: 'skill-skills', from: 'SKILL_ADOPTION', to: 'SKILLS_MAP', relation: 'DEEPER_INTO', label: 'Посмотреть карту навыков', priority: 10, minLevel: 'explorer' },
  { id: 'skill-own', from: 'SKILL_ADOPTION', to: 'OWN_TASK', relation: 'APPLY_TO', label: 'Выбрать приёмы для своей задачи', priority: 20, minLevel: 'beginner' },
  { id: 'skill-learning', from: 'SKILL_ADOPTION', to: 'LEARNING_OPTIONS', relation: 'LEARN_AS_SKILL', label: 'Перейти к системной практике', priority: 90, minLevel: 'beginner' },

  { id: 'skills-learning', from: 'SKILLS_MAP', to: 'LEARNING_OPTIONS', relation: 'LEARN_AS_SKILL', label: 'Как закрывать найденные пробелы', priority: 10, minLevel: 'beginner' },
  { id: 'skills-cap', from: 'SKILLS_MAP', to: 'AI_CAPABILITIES', relation: 'BACK_TO', label: 'Вернуться к возможностям ИИ', priority: 20, minLevel: 'beginner' },

  { id: 'three-waves-cap', from: 'THREE_WAVES', to: 'AI_CAPABILITIES', relation: 'RELATED_TO', label: 'Посмотреть, что ИИ уже умеет', priority: 10, minLevel: 'beginner' },
  { id: 'three-waves-skills', from: 'THREE_WAVES', to: 'SKILLS_MAP', relation: 'DEEPER_INTO', label: 'Какие навыки нужны для грамотного использования', priority: 20, minLevel: 'explorer' },
  { id: 'three-waves-learning', from: 'THREE_WAVES', to: 'LEARNING_OPTIONS', relation: 'LEARN_AS_SKILL', label: 'Посмотреть варианты обучения', priority: 30, minLevel: 'beginner' },
  { id: 'three-waves-slide9', from: 'THREE_WAVES', to: 'SLIDE9_WORK_MODEL', relation: 'DEEPER_INTO', label: 'Посмотреть, как меняется способ сложной работы с ИИ', priority: 40, minLevel: 'explorer' },

  { id: 'materials-skill', from: 'MATERIALS', to: 'SKILL_ADOPTION', relation: 'LEARN_AS_SKILL', label: 'Как превратить полезные приёмы в привычку', priority: 10, minLevel: 'beginner' },
  { id: 'materials-own', from: 'MATERIALS', to: 'OWN_TASK', relation: 'APPLY_TO', label: 'Перейти к своей задаче', priority: 20, minLevel: 'beginner' },
  { id: 'materials-cap', from: 'MATERIALS', to: 'AI_CAPABILITIES', relation: 'RELATED_TO', label: 'Посмотреть другие возможности ИИ', priority: 30, minLevel: 'beginner' },

  { id: 'learning-skills', from: 'LEARNING_OPTIONS', to: 'SKILLS_MAP', relation: 'RELATED_TO', label: 'Посмотреть карту навыков', priority: 10, minLevel: 'explorer' },
  { id: 'learning-cap', from: 'LEARNING_OPTIONS', to: 'AI_CAPABILITIES', relation: 'BACK_TO', label: 'Сначала посмотреть возможности ИИ', priority: 20, minLevel: 'beginner' },
  { id: 'learning-own', from: 'LEARNING_OPTIONS', to: 'OWN_TASK', relation: 'APPLY_TO', label: 'Сначала разобрать свою задачу', priority: 30, minLevel: 'beginner' },

  { id: 'own-context', from: 'OWN_TASK', to: 'TASK_CONTEXT', relation: 'DEEPER_INTO', label: 'Почему ИИ нужны факты о вашей ситуации', priority: 10, minLevel: 'beginner' },
  { id: 'own-cap', from: 'OWN_TASK', to: 'AI_CAPABILITIES', relation: 'ALTERNATIVE_VIEW', label: 'Посмотреть другие возможности ИИ', priority: 20, minLevel: 'beginner' },
  { id: 'own-work', from: 'OWN_TASK', to: 'AI_WORK_USE', relation: 'DEEPER_INTO', label: 'Как связать несколько частей работы', priority: 30, minLevel: 'explorer' },
  { id: 'own-skill', from: 'OWN_TASK', to: 'SKILL_ADOPTION', relation: 'LEARN_AS_SKILL', label: 'Как закрепить полезный способ в своей работе', priority: 40, minLevel: 'beginner' },
  { id: 'own-learning', from: 'OWN_TASK', to: 'LEARNING_OPTIONS', relation: 'LEARN_AS_SKILL', label: 'Научиться ставить задачи ИИ системно', priority: 90, minLevel: 'beginner' }
];

export const mapGroups = [
  {
    id: 'foundation',
    label: 'Базовое понимание',
    nodeIds: ['WHAT_IS_AI', 'AI_CAPABILITIES', 'AI_MECHANICS', 'TASK_CONTEXT', 'VERIFY_RESULT', 'UNDERSTAND_AI_WORK']
  },
  {
    id: 'tasks',
    label: 'Задачи и применение',
    nodeIds: ['VISUAL_CONTEXT_SUPPORT', 'DECISION_SUPPORT', 'OWN_TASK', 'AI_WORK_USE']
  },
  {
    id: 'work',
    label: 'Работа и процессы',
    nodeIds: ['DECOMPOSE_WORK', 'FEEDBACK_CONTROL', 'SLIDE9_WORK_MODEL', 'PROCESS_IMPROVEMENT', 'AUTOMATION']
  },
  {
    id: 'development',
    label: 'Навыки и материалы',
    nodeIds: ['SKILL_ADOPTION', 'SKILLS_MAP', 'MATERIALS', 'THREE_WAVES', 'LEARNING_OPTIONS']
  }
];
