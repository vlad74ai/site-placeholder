import { entryPointsMarkup } from './entry-markup.js';
import { aiPracticeServices, practiceExperiments } from '../data/practice.js';
import { topicHref } from '../data/topic-pages.js?v=public-prune-1';
import { INTERNAL_PAGES } from '../data/internal-pages.js';
import { articleIllustrations } from '../data/article-illustrations.js';
import { launchFeatures } from '../data/launch-features.js';
import { relations } from '../data/navigation.js';
import { getPublicContinuationRoutes } from '../data/public-continuations.js?v=public-prune-1';

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function normalizeDisplayText(value = '') {
  return String(value).trim().replace(/\s+/g, ' ').toLocaleLowerCase('ru-RU');
}

// Context links are stored by semantic node ID, so one source works both in the
// root view and native topic pages without hardcoding relative destinations.
function renderInternalLinks(text, links = [], prefix = '') {
  let html = text;
  for (const link of links) {
    const label = escapeHtml(link.label);
    const href = link.targetNodeId ? topicHref(link.targetNodeId) : (link.targetPageId ? INTERNAL_PAGES[link.targetPageId]?.href : null);
    if (!href || !html.includes(label) || html.indexOf(label) !== html.lastIndexOf(label)) {
      throw new Error('Invalid internal topic link: ' + link.targetNodeId);
    }
    html = html.replace(label, `<a href="${escapeHtml(prefix + href)}">${label}</a>`);
  }
  return html;
}

function renderParagraph(block, prefix = '') {
  let text = escapeHtml(block.text);
  for (const strong of block.strong || []) {
    const label = escapeHtml(strong);
    if (!text.includes(label)) throw new Error('Missing emphasis: ' + block.id);
    text = text.replace(label, `<strong>${label}</strong>`);
  }
  for (const italic of block.italic || []) {
    const label = escapeHtml(italic);
    if (!text.includes(label)) throw new Error('Missing italic emphasis: ' + block.id);
    text = text.replace(label, `<em>${label}</em>`);
  }
  text = renderInternalLinks(text, block.links || [], prefix);
  if (block.link) {
    const label = escapeHtml(block.link.label);
    const href = String(block.link.href || '');
    if (!href.startsWith('https://t.me/') || !text.includes(label)) throw new Error('Invalid paragraph link: ' + block.id);
    text = text.replace(label, `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${label}</a>`);
  }
  const cls = block.presentation === 'keyline' ? ' class="author-keyline"' : '';
  return `<p${cls}>${text}</p>`;
}

function renderHighlight(block) {
  return `<div class="content-highlight">${escapeHtml(block.text)}</div>`;
}

function renderExample(block) {
  return `<div class="example-panel">
    <span class="example-panel__label">${escapeHtml(block.label || 'Пример')}</span>
    <p>${escapeHtml(block.text)}</p>
  </div>`;
}

function renderCollection(block) {
  const items = (block.items || []).map((item) => `<div class="capability-card">
    <strong>${escapeHtml(item.title)}</strong>
    <p>${escapeHtml(item.text)}</p>
  </div>`).join('');
  return `<div class="capability-grid">${items}</div>`;
}

function renderComparison(block) {
  const sides = block.sides || [];
  if (sides.length < 2) return '';
  return `<div class="compare-strip">
    <div class="compare-strip__box"><strong>${escapeHtml(sides[0].title)}</strong><p>${escapeHtml(sides[0].text)}</p></div>
    <div class="compare-strip__arrow" aria-hidden="true">→</div>
    <div class="compare-strip__box"><strong>${escapeHtml(sides[1].title)}</strong><p>${escapeHtml(sides[1].text)}</p></div>
  </div>`;
}

// A single bounded trial uses the existing approved asset. Every other
// illustrated block remains text-only until the owner accepts its placement.
function renderIllustrated(block, allowTrial = false) {
  const paragraphs = (block.paragraphs || [])
    .map((text) => `<p>${escapeHtml(text)}</p>`)
    .join('');
  const title = block.title ? `<h3>${escapeHtml(block.title)}</h3>` : '';
  const captionText = block.media?.caption || '';
  const asset = allowTrial && launchFeatures.illustrationTrialBlockId === block.id
    ? articleIllustrations[block.id] : null;
  const figure = asset ? `<figure class="illustrated-block__figure">
      <img class="illustrated-block__image" src="../${escapeHtml(asset)}" width="900" height="600" loading="lazy" decoding="async" alt="${escapeHtml(block.media?.alt || block.media?.title || '')}">
      <figcaption class="illustrated-block__caption">${escapeHtml(captionText)}</figcaption>
    </figure>` : '';
  const caption = asset || !captionText ? '' : `<p>${escapeHtml(captionText)}</p>`;
  return `<section class="illustrated-block">
    <div class="illustrated-block__text">${title}${paragraphs}${figure}${caption}</div>
  </section>`;
}

function renderBlock(block, prefix = '', allowIllustrationTrial = false) {
  switch (block.type) {
    case 'paragraph': return renderParagraph(block, prefix);
    case 'heading': return `<h3>${escapeHtml(block.title)}</h3>`;
    case 'highlight': return renderHighlight(block);
    case 'example': return renderExample(block);
    case 'collection': return renderCollection(block);
    case 'comparison': return renderComparison(block);
    case 'illustrated': return renderIllustrated(block, allowIllustrationTrial);
    default: return '';
  }
}

function renderServiceLink(service, className = 'practice-service-link') {
  return `<a class="${className}" href="${escapeHtml(service.url)}" target="_blank" rel="noopener noreferrer" data-practice-service="${escapeHtml(service.id)}">${escapeHtml(service.label)} <span aria-hidden="true">↗</span></a>`;
}

function renderPracticeServices(preferredServiceId) {
  const preferred = aiPracticeServices.find((service) => service.id === preferredServiceId);

  if (!preferred) {
    return `<div class="practice-services">
      <div class="practice-services__intro">
        <strong>Где вы обычно общаетесь с ИИ?</strong>
        <span>Если чат уже открыт — просто копируйте запросы. Если нет, можно открыть сервис рядом с сайтом. Для чистого сравнения удобнее начать отдельный новый чат.</span>
      </div>
      <div class="practice-services__links">${aiPracticeServices.map((service) => renderServiceLink(service)).join('')}</div>
    </div>`;
  }

  const alternatives = aiPracticeServices.filter((service) => service.id !== preferred.id);
  return `<div class="practice-services practice-services--compact">
    ${renderServiceLink(preferred, 'practice-service-link practice-service-link--primary')}
    <details class="practice-services__other">
      <summary>Другой ИИ</summary>
      <div class="practice-services__links">${alternatives.map((service) => renderServiceLink(service)).join('')}</div>
    </details>
  </div>`;
}

function renderObserveParagraphs(text) {
  return String(text).split(/\n\s*\n/).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('');
}

// Desktop editorial practice trial, scoped to VERIFY_RESULT only.
function renderEditorialPractice(experiment) {
  const services = aiPracticeServices.map((service) =>
    `<a class="practice-service-link" href="${escapeHtml(service.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(service.label)}</a>`
  ).join('');

  const prompts = (experiment.prompts || []).map((prompt, index) => `${index ? '    <p class="practice-step-note"><span class="practice-step-note__arrow" aria-hidden="true">↓</span>После ответа отправьте второй запрос</p>\n' : ''}    <div class="practice-prompt practice-prompt--editorial">
      <div class="practice-prompt__head">
        <strong>${String(index + 1).padStart(2, '0')} · ${escapeHtml(prompt.label || 'Запрос')}</strong>
        <button class="practice-copy" type="button" data-practice-copy>Скопировать</button>
      </div>
      <p class="practice-prompt__text" data-practice-copy-source>${escapeHtml(prompt.text)}</p>
    </div>`).join('\n');

  const observe = experiment.observe
    ? `<div class="practice-observe practice-observe--editorial"><strong>На что смотреть</strong>${renderObserveParagraphs(experiment.observe)}</div>`
    : '';

  return `<aside class="practice-block practice-block--editorial" aria-label="Практический блок">
    <div class="practice-block__head">
      <div>
        <div class="practice-block__meta"><span class="practice-block__kind">Практический блок</span><span class="practice-block__eyebrow">Необязательно · ${escapeHtml(experiment.duration || '2 минуты')}</span></div>
        <h3>${escapeHtml(experiment.title || 'Попробуйте на своём ИИ')}</h3>
      </div>
    </div>
    <p class="practice-block__intro">${escapeHtml(experiment.intro || '')}</p>
    <nav class="practice-services practice-services--editorial" aria-label="Открыть ИИ-чат">
      <span class="practice-services__label">Открыть чат</span>
      <div class="practice-services__links">${services}</div>
    </nav>
    <div class="practice-prompts practice-prompts--editorial">${prompts}</div>
    ${observe}
  </aside>`;
}

function renderPractice(experiment, preferredServiceId, presentation = 'default') {
  if (!experiment) return '';
  if (presentation === 'editorial') return renderEditorialPractice(experiment);

  const prompts = (experiment.prompts || []).map((prompt) => `<div class="practice-prompt">
    <div class="practice-prompt__head">
      <strong>${escapeHtml(prompt.label || 'Запрос')}</strong>
      <button class="practice-copy" type="button" data-practice-copy>Скопировать</button>
    </div>
    <p class="practice-prompt__text" data-practice-copy-source>${escapeHtml(prompt.text)}</p>
  </div>`).join('');

  const observe = experiment.observe
    ? `<div class="practice-observe"><strong>На что смотреть</strong>${renderObserveParagraphs(experiment.observe)}</div>`
    : '';

  return `<aside class="practice-block" aria-label="Необязательный практический пример">
    <div class="practice-block__head">
      <div>
        <span class="practice-block__eyebrow">Необязательно · ${escapeHtml(experiment.duration || '2 минуты')}</span>
        <h3>${escapeHtml(experiment.title || 'Попробуйте на своём ИИ')}</h3>
      </div>
      <span class="practice-block__mark" aria-hidden="true">↗</span>
    </div>
    <p class="practice-block__intro">${escapeHtml(experiment.intro || '')}</p>
    ${renderPracticeServices(preferredServiceId)}
    <div class="practice-prompts">${prompts}</div>
    ${observe}
  </aside>`;
}

function renderBlocksWithPractice(blocks, experiment, preferredServiceId) {
  let inserted = false;
  const html = (blocks || []).map((block) => {
    const rendered = renderBlock(block);
    if (experiment && block.id === experiment.afterBlockId) {
      inserted = true;
      return `${rendered}${renderPractice(experiment, preferredServiceId)}`;
    }
    return rendered;
  }).join('');

  if (experiment && !inserted) return `${html}${renderPractice(experiment, preferredServiceId)}`;
  return html;
}

// A single, reversible editorial trial: Telegram illustration after the
// accepted explanation of proportional verification. No copy is changed.
function renderTelegramIllustrationTrial(nodeId, blockId) {
  if (nodeId !== launchFeatures.telegramIllustrationTrialNodeId || blockId !== 'verify-meaning') return '';
  return '<figure class="article-illustration-trial"><a href="../assets/telegram/post-07-verification.webp" target="_blank" rel="noopener noreferrer" aria-label="Открыть иллюстрацию в полном размере"><img src="../assets/telegram/post-07-verification.webp" width="1448" height="1086" loading="lazy" decoding="async" alt="Весы с надписью «Ответ ИИ»: на одной чаше — цена ошибки, к другой подносят проверку ответа."></a></figure>';
}

// Shared native reading structure; existing block text/ordering is unchanged.
export function renderTopicReading(model) {
  const node = model.node;
  const sections = [{ id: 'topic-intro', label: 'Главное', html: node.lead ? `<p class="width-reading">${renderInternalLinks(escapeHtml(node.lead), node.leadLinks, '../')}</p>` : '' }];
  const experiment = model.settings.detail === 'short' ? null : practiceExperiments[node.id];
  let inserted = false;
  const labels = { highlight: 'Главная мысль', example: 'Пример', collection: 'Возможности', comparison: 'Сравнение' };
  const addPractice = () => {
    sections.push({ id: 'topic-practice', label: experiment.title,
      html: renderPractice(experiment, model.settings.aiService, 'editorial') });
    inserted = true;
  };
  for (const [index, block] of [...(node.example?.blocks || []), ...node.blocks].entries()) {
    if (block.type !== 'paragraph') sections.push({ id: `topic-${block.id || index}`,
      label: block.title || block.media?.title || block.label || labels[block.type] || 'Подробнее', html: '' });
    sections.at(-1).html += renderBlock(block, '../', node.id === 'WHAT_IS_AI');
    sections.at(-1).html += renderTelegramIllustrationTrial(node.id, block.id);
    if (experiment && block.id === experiment.afterBlockId) addPractice();
  }
  if (experiment && !inserted) addPractice();
  return {
    article: sections.map(section => `<section class="topic-section width-breakout" id="${escapeHtml(section.id)}" tabindex="-1" aria-label="${escapeHtml(section.label)}">${section.html}</section>`).join('\n').replaceAll('src="assets/', 'src="../assets/'),
    toc: sections.map(section => `<li><a href="#${escapeHtml(section.id)}">${escapeHtml(section.label)}</a></li>`).join('')
      + '<li><a href="#topic-next">Продолжение темы</a></li>'
  };
}

// Isolated editorial navigation trial. Semantic links and ordering still come
// from the same suggestion model used by all other topic pages.
function renderEditorialTopicExits(model, prefix) {
  // Respect the relation's meaning; the accepted VERIFY_RESULT labels remain
  // unchanged. Do not present every related article as an extra example.
  const purposeByRelation = {
    RELATED_TO: 'СВЯЗАННАЯ ТЕМА',
    APPLY_TO: 'ПРИМЕНИТЬ НА ПРАКТИКЕ',
    DEEPER_INTO: 'РАЗОБРАТЬСЯ ГЛУБЖЕ',
    LEARN_AS_SKILL: 'РАЗВИТЬ НАВЫК',
    EXAMPLE_OF: 'ПРИМЕР ПРИМЕНЕНИЯ',
    BACK_TO: 'ВЕРНУТЬСЯ К ОСНОВАМ',
    ALTERNATIVE_VIEW: 'ДРУГОЙ ПОДХОД'
  };
  const purposeFor = route => {
    if (model.node.id === 'VERIFY_RESULT') {
      const chosen = {
        DECISION_SUPPORT: 'ЕЩЁ ОДИН ПРИМЕР',
        OWN_TASK: 'ПОПРОБОВАТЬ САМОМУ',
        LEARNING_OPTIONS: 'УЗНАТЬ ОБ ОБУЧЕНИИ',
        AI_WORK_USE: 'УГЛУБИТЬ ТЕМУ'
      }[route.targetNodeId];
      if (chosen) return chosen;
    }
    if (route.targetNodeId === 'LEARNING_OPTIONS') return 'УЗНАТЬ ОБ ОБУЧЕНИИ';
    if (route.targetNodeId === 'OWN_TASK') return 'ПОПРОБОВАТЬ САМОМУ';
    return purposeByRelation[route.relation] || 'ДРУГАЯ ТЕМА';
  };
  const rows = getPublicContinuationRoutes(model.node.id, relations).map(route => `<li class="context-exit__item">
    <a class="context-exit__route" href="${prefix + topicHref(route.targetNodeId)}">
      <span class="context-exit__body">
        <span class="context-exit__hint">${escapeHtml(purposeFor(route))}</span>
        <span class="context-exit__name">${escapeHtml(route.label)}</span>
      </span>
      <span class="context-exit__arrow" aria-hidden="true">↗</span>
    </a>
  </li>`).join('');
  return `<aside class="context-exit context-exit--editorial width-reading" id="topic-next" tabindex="-1" aria-labelledby="topic-next-title">
    <h2 id="topic-next-title">Продолжение темы</h2>
    <nav aria-label="Связанные темы"><ul class="context-exit__routes">${rows}</ul></nav>
    <p class="context-exit__return"><a class="context-exit__back" href="${prefix}index.html"><span aria-hidden="true">←</span><span>К выбору тем</span></a></p>
  </aside>`;
}

export function renderTopicExits(model, prefix = '../') {
  return renderEditorialTopicExits(model, prefix);
}

function renderRoutePanel(model) {
  if (!model.helper?.enabled || model.helper.dismissed || model.helper.mode === 'minimal') return '';
  if (!model.suggestions?.length) return '';

  const buttons = model.suggestions.map((route) => `<button class="route-button" type="button" data-open-node="${escapeHtml(route.targetNodeId)}">${escapeHtml(route.label)}</button>`).join('');

  return `<div class="route-panel">
    <div class="route-panel__head">
      <span class="route-panel__truck" aria-hidden="true"></span>
      <div><strong>Куда отсюда?</strong><span>Выберите только если это сейчас полезно.</span></div>
    </div>
    <div class="route-buttons">${buttons}<button class="route-button" type="button" data-helper-dismiss>Мне достаточно</button></div>
  </div>`;
}

export function renderEntryPoints(container, entryPoints) {
  if (container) container.innerHTML = entryPointsMarkup(entryPoints);
}

export function renderContent(stage, workspace, model) {
  if (!stage || !workspace) return false;

  if (model.status === 'home') {
    workspace.hidden = true;
    stage.innerHTML = '';
    return true;
  }

  workspace.hidden = false;

  if (model.status === 'missing') {
    stage.innerHTML = `<article class="content-card">
      <div class="content-card__head">
        <p class="content-card__eyebrow">Материал недоступен</p>
        <h2>Такого смыслового узла сейчас нет</h2>
        <p class="content-card__lead">ID: ${escapeHtml(model.missingNodeId || 'не указан')}. Сайт не будет молча подменять его другим материалом.</p>
      </div>
    </article>`;
    return false;
  }

  const node = model.node;
  const exampleBlocks = node.example?.blocks || [];
  const experiment = model.settings.detail === 'short' ? null : practiceExperiments[node.id];
  const body = renderBlocksWithPractice(
    [...exampleBlocks, ...node.blocks],
    experiment,
    model.settings.aiService
  );
  const opening = node.lead ? `<p class="content-opening">${renderInternalLinks(escapeHtml(node.lead), node.leadLinks)}</p>` : '';
  const repeatedLabel = normalizeDisplayText(node.label) === normalizeDisplayText(node.title);
  const eyebrow = node.availability === 'preview'
    ? '<p class="content-card__eyebrow">Предпросмотр · материал ещё развивается</p>'
    : repeatedLabel
      ? ''
      : `<p class="content-card__eyebrow">${escapeHtml(node.label)}</p>`;

  stage.innerHTML = `<article class="content-card" data-rendered-node="${escapeHtml(node.id)}">
      <div class="content-card__head">
        ${eyebrow}
        <h2>${escapeHtml(node.title)}</h2>
      </div>
      <div class="content-card__body">${opening}${body}</div>
    </article>
    ${renderRoutePanel(model)}`;

  return Boolean(stage.querySelector(`[data-rendered-node="${CSS.escape(node.id)}"]`));
}

export function renderMap(container, groups) {
  if (!container) return;
  container.innerHTML = (groups || []).map((group) => `<section class="map-group">
    <h3>${escapeHtml(group.label)}</h3>
    <div class="map-group__items">
      ${group.items.map((item) => `<button class="map-item${item.viewed ? ' is-viewed' : ''}${item.current ? ' is-current' : ''}" type="button" data-open-node="${escapeHtml(item.id)}">
        <span class="map-item__mark" aria-hidden="true">✓</span>
        <span>${escapeHtml(item.label)}</span>
      </button>`).join('')}
    </div>
  </section>`).join('');
}

export function renderHachuhaRoutes(container, suggestions) {
  if (!container) return;
  const routes = (suggestions || []).map((route) => `<button type="button" data-open-node="${escapeHtml(route.targetNodeId)}">${escapeHtml(route.label)}</button>`).join('');
  container.innerHTML = `${routes}<button type="button" data-helper-dismiss>Мне достаточно</button>`;
}

export function syncSettingControls(root, settings, levelLabels) {
  if (!root) return;

  root.querySelectorAll('[data-level]').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.level === settings.level);
  });
  root.querySelectorAll('[data-detail]').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.detail === settings.detail);
  });
  root.querySelectorAll('[data-helper]').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.helper === settings.helper);
  });

  const levelText = levelLabels[settings.level] || levelLabels.beginner || 'Новичок';
  root.querySelectorAll('[data-setting-level-label], [data-depth-label]').forEach((element) => {
    element.textContent = levelText;
  });

  const mapSetting = root.querySelector('[data-map-setting]');
  if (mapSetting) mapSetting.checked = settings.mapVisible;
  const memorySetting = root.querySelector('[data-memory-setting]');
  if (memorySetting) memorySetting.checked = settings.memory;

  const mapOpen = root.querySelector('[data-map-open]');
  if (mapOpen) mapOpen.hidden = !settings.mapVisible;
}
