import { AF_ARTICLES } from './af-public-content.js';
// Canonical documents only. href is relative to the repository root.
// Null means unavailable in this prototype, never a legacy-node substitute.
export const INTERNAL_PAGES = Object.freeze({
  "LEARN-WITH-AI": {
    id: "LEARN-WITH-AI",
    label: "Изучить с ИИ",
    href: "pages/learn-with-ai.html",
    search: false,
  },
  "BENEFITS-INDEX": {
    id: "BENEFITS-INDEX",
    label: "Польза ИИ — темы и направления",
    menuGroup: "benefits",
    href: "pages/benefits.html",
  },
  "LEARNING-OVERVIEW": {
    id: "LEARNING-OVERVIEW",
    label: "Обучение — зачем осваивать ИИ",
    menuGroup: "learning",
    href: "pages/learning.html",
  },
  "BUSINESS-OVERVIEW": {
    id: "BUSINESS-OVERVIEW",
    label: "Для бизнеса — с чего начинать",
    menuGroup: "business",
    href: "pages/business.html",
  },
  ...Object.fromEntries(AF_ARTICLES.map(article => [article.id, {
    id: article.id,
    label: article.label,
    menuGroup: 'benefits',
    href: article.href,
  }]))
});

// Editorial decisions, independent of legacy settings and viewed history.
// Public contextual routes are authored in the HTML-first articles.
// Full A-F content is now available through AF_ARTICLES; future exits must be editorially reviewed.
export const INTERNAL_CONTEXT_EXITS = Object.freeze({
  "A-P2": { primary: null, alternative: null },
  "C-P3": { primary: null, alternative: null },
});

// Static HTML contains matching labels/URLs so reading never depends on JS.
// Keep these records and static links synchronized when adding a document.
// Availability does not depend on runtime settings or the legacy hash router.
