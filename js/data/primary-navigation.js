import { INTERNAL_PAGES } from './internal-pages.js';
import { launchFeatures } from './launch-features.js';

export const primaryNavigation = [
  {
    id: 'benefits', label: 'Польза ИИ',
    items: [
      { id: 'benefits-a', label: 'Что такое ИИ и что он умеет', href: INTERNAL_PAGES['A-P1'].href, status: 'current' },
      { id: 'benefits-b', label: 'Как получать полезный результат', href: 'pages/benefits.html#direction-b', status: 'current' },
      { id: 'benefits-c', label: 'Как работать с ИИ эффективнее', href: 'pages/benefits.html#direction-c', status: 'current' },
      { id: 'benefits-d', label: 'ИИ в рабочих процессах', href: 'pages/benefits.html#direction-d', status: 'current' },
      { id: 'benefits-e', label: 'Польза ИИ для бизнеса', href: 'pages/benefits.html#direction-e', status: 'current' },
      { id: 'benefits-f', label: 'Оценить свой уровень', href: 'pages/benefits.html#direction-f', status: 'current' }
    ]
  },
  {
    id: 'learning',
    label: 'Обучение',
    // An informational entrance, not a published course catalogue.
    targetNodeId: 'LEARNING_OPTIONS',
    items: [
      { id: 'learning-overview', label: 'Зачем учиться работе с ИИ', pageId: 'LEARNING-OVERVIEW', href: INTERNAL_PAGES['LEARNING-OVERVIEW'].href, status: 'current' },
      // Detailed course directions remain drafts until the owning product approves them.
      { id: 'learning-part-1', label: 'Грамотное самостоятельное использование ИИ', status: 'planned', visible: false },
      { id: 'learning-part-2', label: 'Применение ИИ в работе бизнеса', status: 'planned', visible: false }
    ]
  },
  {
    id: 'materials',
    label: 'Материалы',
    targetNodeId: 'MATERIALS',
    items: [
      {
        id: 'materials-equalizer',
        label: 'Эквалайзер (PDF)',
        description: 'Практическое упражнение и шпаргалка по управлению ответами ИИ.',
        href: 'assets/downloads/AI-V-DELO_Equalizer.pdf',
        download: 'AI-V-DELO_Equalizer.pdf',
        status: 'current'
      },
      {
        id: 'materials-four-sheets',
        label: '4 листа пользы (PDF)',
        description: 'Четыре самостоятельных практических листа в одном PDF.',
        href: 'assets/downloads/AI-V-DELO_4-lista-polzy.pdf',
        download: 'AI-V-DELO_4-lista-polzy.pdf',
        status: 'current'
      }
    ]
  },
  {
    id: 'business',
    label: 'Для бизнеса',
    // Informational entrance only: no diagnostics, implementations or services promised.
    items: [
      { id: 'business-overview', label: 'С чего начинается применение ИИ в бизнесе', pageId: 'BUSINESS-OVERVIEW', href: INTERNAL_PAGES['BUSINESS-OVERVIEW'].href, status: 'current' },
      { id: 'business-diagnostic', label: 'Диагностика и карта возможностей', status: 'planned', visible: false },
      { id: 'business-activation', label: 'Активация навыков', status: 'planned', visible: false },
      { id: 'business-implementation', label: 'Внедрение ИИ', status: 'planned', visible: false }
    ]
  }
];

// Plain fifth link; not an expandable menu group.
primaryNavigation.push({ id: 'blog', label: 'Блог', href: 'blog/index.html', direct: true, items: [] });

// The authoring generator and both runtime contours consume this same order.
primaryNavigation.sort((a, b) => ['benefits', 'learning', 'business', 'materials', 'blog'].indexOf(a.id) - ['benefits', 'learning', 'business', 'materials', 'blog'].indexOf(b.id));

export const utilityNavigation = [
  { id: 'about', label: 'О сайте', targetNodeId: 'ABOUT_SITE', icon: 'book-open', status: 'current' },
  {
    id: 'map',
    label: 'Карта',
    action: 'map', icon: 'map',
    status: 'current'
  },
  { id: 'learn', label: 'Изучить с ИИ', href: INTERNAL_PAGES['LEARN-WITH-AI'].href, icon: 'graduation-cap', status: 'current' },
  {
    id: 'equalizer',
    label: 'Эквалайзер',
    action: 'equalizer', icon: 'sliders-horizontal',
    status: 'current',
    visible: launchFeatures.adaptivePresentation
  },
  {
    id: 'account',
    label: 'Войти',
    action: 'account',
    status: 'planned',
    visible: false
  }
];
