// One canonical library. All other routes are entrances.
export const AF_ARTICLES = Object.freeze([
  {
    "id": "A-P1",
    "label": "Что такое ИИ и что ему можно поручать",
    "letter": "a",
    "href": "pages/af-a-p1.html"
  },
  {
    "id": "A-P2",
    "label": "Работа с разными видами информации",
    "letter": "a",
    "href": "pages/af-a-p2.html"
  },
  {
    "id": "B-P1",
    "label": "Почему один и тот же ИИ может давать разный результат",
    "letter": "b",
    "href": "pages/af-b-p1.html"
  },
  {
    "id": "B-P2",
    "label": "Почему убедительный ответ нужно проверять",
    "letter": "b",
    "href": "pages/af-b-p2.html"
  },
  {
    "id": "C-P1",
    "label": "Не обязательно получать всё одним запросом",
    "letter": "c",
    "href": "pages/af-c-p1.html"
  },
  {
    "id": "C-P2",
    "label": "Не обязательно каждый раз начинать с нуля",
    "letter": "c",
    "href": "pages/af-c-p2.html"
  },
  {
    "id": "C-P3",
    "label": "ИИ может работать с подключёнными сервисами",
    "letter": "c",
    "href": "pages/af-c-p3.html"
  },
  {
    "id": "C-P4",
    "label": "ИИ может выполнять связанные действия",
    "letter": "c",
    "href": "pages/af-c-p4.html"
  },
  {
    "id": "D-P1",
    "label": "ИИ меняет способ организации работы",
    "letter": "d",
    "href": "pages/af-d-p1.html"
  },
  {
    "id": "D-P2",
    "label": "Связанные этапы, циклы и контроль",
    "letter": "d",
    "href": "pages/af-d-p2.html"
  },
  {
    "id": "D-P3",
    "label": "От удачного способа к повторяемому процессу",
    "letter": "d",
    "href": "pages/af-d-p3.html"
  },
  {
    "id": "E-P1",
    "label": "Где ИИ действительно даёт бизнес-эффект",
    "letter": "e",
    "href": "pages/af-e-p1.html"
  },
  {
    "id": "E-P2",
    "label": "С чего начинать внедрение ИИ в компании",
    "letter": "e",
    "href": "pages/af-e-p2.html"
  },
  {
    "id": "E-P3",
    "label": "Что руководителю нужно понимать об ИИ",
    "letter": "e",
    "href": "pages/af-e-p3.html"
  },
  {
    "id": "F-P1",
    "label": "Где вы сейчас и что имеет смысл осваивать дальше?",
    "letter": "f",
    "href": "pages/af-f-p1.html"
  }
].map(Object.freeze));
export const AF_DIRECTIONS = Object.freeze([
  {
    "id": "a",
    "label": "Что такое ИИ и что он умеет",
    "href": "pages/benefits.html#direction-a"
  },
  {
    "id": "b",
    "label": "Как получать полезный результат",
    "href": "pages/benefits.html#direction-b"
  },
  {
    "id": "c",
    "label": "Как работать с ИИ эффективнее",
    "href": "pages/benefits.html#direction-c"
  },
  {
    "id": "d",
    "label": "ИИ в рабочих процессах",
    "href": "pages/benefits.html#direction-d"
  },
  {
    "id": "e",
    "label": "Польза ИИ для бизнеса",
    "href": "pages/benefits.html#direction-e"
  },
  {
    "id": "f",
    "label": "Оценить свой уровень",
    "href": "pages/benefits.html#direction-f"
  }
].map(Object.freeze));
export const AF_LEGACY_DESTINATIONS = Object.freeze({
  "what-is-ai": "pages/af-a-p1.html#what-is-ai",
  "ai-capabilities": "pages/af-a-p1.html#ai-capabilities",
  "ai-mechanics": "pages/af-a-p1.html#ai-mechanics",
  "understand-ai-work": "pages/af-c-p1.html#understand-ai-work",
  "visual-context-support": "pages/af-a-p2.html#visual-context-support",
  "decision-support": "pages/af-a-p2.html#decision-support",
  "own-task": "pages/af-f-p1.html#own-task",
  "ai-request-understanding": "pages/af-b-p1.html#ai-request-understanding",
  "task-context": "pages/af-b-p1.html#task-context",
  "verify-result": "pages/af-b-p2.html#verify-result",
  "materials-and-results": "pages/af-a-p2.html#materials-and-results",
  "ai-work-use": "pages/af-c-p1.html#ai-work-use",
  "decompose-work": "pages/af-c-p1.html#decompose-work",
  "connected-services": "pages/af-c-p3.html#connected-services"
});
export const afHref = id => AF_ARTICLES.find(x=>x.id===id)?.href || null;
