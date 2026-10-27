// One nav is moved between its HTML disclosure and the modal; no cloned anchors.
export function enhanceTOC(layout) {
  const disclosure = layout?.querySelector(".internal-toc");
  const nav = disclosure?.querySelector("nav");
  const summary = disclosure?.querySelector("summary");
  const sidebar = layout?.querySelector(".internal-sidebar");
  if (!nav || !summary || !sidebar || typeof HTMLDialogElement === "undefined"
      || typeof HTMLDialogElement.prototype.showModal !== "function") return;

  const controls = document.createElement("div");
  controls.className = "toc-controls";
  const makeButton = (label, text) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = text;
    button.setAttribute("aria-label", label);
    button.title = label;
    return button;
  };
  const collapse = makeButton("Свернуть содержание", "Свернуть");
  const expand = makeButton("Развернуть содержание", "→");
  const open = makeButton("Открыть содержание страницы", "≡");
  const openLabel = document.createElement("span");
  openLabel.className = "toc-open-label";
  openLabel.textContent = " Содержание";
  open.append(openLabel);
  open.setAttribute("aria-haspopup", "dialog");
  open.setAttribute("aria-controls", "internal-toc-dialog");
  controls.append(collapse, expand, open);

  const dialog = document.createElement("dialog");
  dialog.id = "internal-toc-dialog";
  dialog.className = "toc-dialog";
  dialog.setAttribute("aria-labelledby", "internal-toc-title");
  const title = document.createElement("h2");
  title.id = "internal-toc-title";
  title.tabIndex = -1;
  title.textContent = "На этой странице";
  const close = makeButton("Закрыть содержание", "Закрыть");
  dialog.append(title, close);
  document.body.append(dialog);
  sidebar.prepend(controls);

  // Measure actual font-dependent CSS sizes, not device labels or hard px cutoffs.
  const metrics = document.createElement("div");
  metrics.className = "toc-metrics";
  metrics.setAttribute("aria-hidden", "true");
  const probes = {};
  for (const name of ["reading", "toc", "rail", "gap"]) {
    const probe = document.createElement("span");
    probe.style.width = `var(--internal-${name})`;
    metrics.append(probe);
    probes[name] = probe;
  }
  layout.append(metrics);
  // Global navigation occupies the left rail; start article TOC compact on wide screens.
  // The reader can expand it explicitly without losing the native content.
  let manuallyCollapsed = document.documentElement.dataset.sidebarReady === 'true'
    && window.matchMedia('(min-width: 981px)').matches;
  let modalState = null;
  let queued = false;

  function fit() {
    queued = false;
    if (modalState) return; // Do not dismantle an open dialog during resize.
    const width = layout.getBoundingClientRect().width;
    const size = name => probes[name].getBoundingClientRect().width;
    const canDock = width >= size("reading") + size("toc") + size("gap");
    const canRail = width >= size("reading") + size("rail") + size("gap");
    const mode = canDock && !manuallyCollapsed ? "expanded" : canRail ? "rail" : "trigger";
    layout.dataset.tocMode = mode;
    collapse.hidden = mode !== "expanded";
    expand.hidden = mode !== "rail" || !canDock;
    open.hidden = mode === "expanded" || !expand.hidden;
    disclosure.hidden = mode !== "expanded";
    disclosure.open = true;
    summary.hidden = true;
  }
  function scheduleFit() {
    if (!queued) {
      queued = true;
      requestAnimationFrame(fit);
    }
  }
  function finishClose(restore = true) {
    if (!modalState) return;
    const previous = modalState;
    modalState = null;
    if (dialog.open) dialog.close();
    disclosure.append(nav);
    document.documentElement.classList.remove("internal-modal-open");
    fit();
    if (restore) {
      const target = previous.trigger.getClientRects().length
        ? previous.trigger : !expand.hidden ? expand : collapse;
      target.focus({ preventScroll: true });
      window.scrollTo(previous.x, previous.y);
    }
  }
  open.addEventListener("click", () => {
    if (modalState) return;
    const previous = { trigger: open, x: window.scrollX, y: window.scrollY };
    dialog.append(nav);
    try {
      dialog.showModal();
    } catch {
      disclosure.append(nav);
      return;
    }
    modalState = previous;
    document.documentElement.classList.add("internal-modal-open");
    title.focus({ preventScroll: true });
  });
  close.addEventListener("click", () => finishClose());
  dialog.addEventListener("cancel", event => {
    event.preventDefault();
    finishClose();
  });
  dialog.addEventListener("close", () => {
    // Ignore a queued close event if the user already opened the dialog again.
    if (!dialog.open) finishClose();
  });
  dialog.addEventListener("keydown", event => {
    if (event.key !== "Tab") return;
    const stops = [...dialog.querySelectorAll("button, a[href]")];
    const first = stops[0];
    const last = stops.at(-1);
    if (event.shiftKey && (document.activeElement === first || document.activeElement === title)) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus();
    }
  });
  nav.addEventListener("click", event => {
    const anchor = event.target.closest("a[href^='#']");
    if (!anchor || event.defaultPrevented || event.button !== 0
        || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const heading = document.getElementById(anchor.getAttribute("href").slice(1));
    if (!heading) return;
    finishClose(false);
    heading.focus({ preventScroll: true });
    // Keep the native anchor default: scroll + history, including repeated targets.
  });
  collapse.addEventListener("click", () => {
    manuallyCollapsed = true;
    fit();
    (expand.hidden ? open : expand).focus({ preventScroll: true });
  });
  expand.addEventListener("click", () => {
    manuallyCollapsed = false;
    fit();
    collapse.focus({ preventScroll: true });
  });
  window.addEventListener("resize", scheduleFit);
  window.addEventListener("popstate", () => finishClose(false));
  document.addEventListener("site-tool-opening", () => finishClose());
  window.addEventListener("pagehide", () => finishClose(false));
  window.addEventListener("pageshow", () => { finishClose(false); scheduleFit(); });
  if (typeof ResizeObserver === "function") new ResizeObserver(scheduleFit).observe(layout);
  document.fonts?.ready.then(scheduleFit);
  fit();
  return { refresh: scheduleFit, close: finishClose };
}
