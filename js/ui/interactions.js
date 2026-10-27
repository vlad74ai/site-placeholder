export function createInteractions(callbacks) {
  const refs = {
    header: document.querySelector('.site-header'),
    hero: document.querySelector('.hero'),
    entryGrid: document.querySelector('[data-entry-grid]'),
    workspace: document.querySelector('#workspace'),
    contentStage: document.querySelector('#content-stage'),
    mapDrawer: document.querySelector('[data-map-drawer]'),
    equalizerDrawer: document.querySelector('[data-equalizer-drawer]'),
    backdrop: document.querySelector('[data-drawer-backdrop]'),
    mapGroups: document.querySelector('[data-map-groups]'),
    hachuhaFab: document.querySelector('[data-hachuha-toggle]'),
    hachuhaPopover: document.querySelector('[data-hachuha-popover]'),
    hachuhaRoutes: document.querySelector('[data-hachuha-routes]')
  };

  function closeDrawers() { callbacks.onCloseTools?.(); }

  function closePopover() {
    if (refs.hachuhaPopover) refs.hachuhaPopover.hidden = true;
    if (refs.hachuhaFab) refs.hachuhaFab.setAttribute('aria-expanded', 'false');
  }

  function togglePopover() {
    if (!refs.hachuhaPopover || !refs.hachuhaFab || refs.hachuhaFab.hidden) return;
    const opening = refs.hachuhaPopover.hidden;
    refs.hachuhaPopover.hidden = !opening;
    refs.hachuhaFab.setAttribute('aria-expanded', opening ? 'true' : 'false');
  }

  function showHome({ preserveOverlays = false } = {}) {
    if (refs.hero) refs.hero.hidden = false;
    if (refs.workspace) refs.workspace.hidden = true;
    if (preserveOverlays) return;
    closeDrawers();
    closePopover();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function showWorkspace({ scroll = false } = {}) {
    if (refs.hero) refs.hero.hidden = false;
    if (scroll && refs.workspace) {
      requestAnimationFrame(() => refs.workspace.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    }
  }

  function syncHelper(model) {
    const usable = model?.helper?.enabled && !model.helper.dismissed && model.helper.suggestions?.length;
    if (refs.hachuhaFab) refs.hachuhaFab.hidden = !usable;
    if (!usable) closePopover();
  }

  async function copyPracticePrompt(button) {
    const source = button.closest('.practice-prompt')?.querySelector('[data-practice-copy-source]');
    const text = source?.textContent?.trim();
    if (!text) return;

    let copied = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        copied = true;
      }
    } catch (error) {
      console.warn('AI В ДЕЛО: Clipboard API unavailable; trying fallback.', error);
    }

    if (!copied) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        copied = document.execCommand('copy');
      } catch (error) {
        console.warn('AI В ДЕЛО: copy fallback failed.', error);
      }
      textarea.remove();
    }

    if (!copied) return;
    const previous = button.textContent;
    button.textContent = 'Скопировано';
    button.classList.add('is-copied');
    window.setTimeout(() => {
      if (!button.isConnected) return;
      button.textContent = previous;
      button.classList.remove('is-copied');
    }, 1600);
  }

  document.addEventListener('click', (event) => {
    const target = event.target.closest('button, a');
    if (!target) return;

    if (target.matches('[data-home-link]')) {
      event.preventDefault();
      callbacks.onHome();
      return;
    }

    if (target.matches('[data-open-entry]')) {
      callbacks.onOpenEntry(target.dataset.openEntry);
      return;
    }

    if (target.matches('[data-open-node]')) {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      callbacks.onOpenNode(target.dataset.openNode);
      closeDrawers();
      closePopover();
      return;
    }

    if (target.matches('[data-practice-copy]')) {
      copyPracticePrompt(target);
      return;
    }

    if (target.matches('[data-practice-service]')) {
      callbacks.onPracticeService?.(target.dataset.practiceService);
      return;
    }

    if (target.matches('[data-hachuha-toggle]')) {
      togglePopover();
      return;
    }

    if (target.matches('[data-hachuha-close]')) {
      closePopover();
      return;
    }

    if (target.matches('[data-helper-dismiss]')) {
      callbacks.onDismissHelper();
      closePopover();
      return;
    }

    if (target.matches('[data-depth-down]')) {
      callbacks.onDepthChange(-1);
      return;
    }

    if (target.matches('[data-depth-up]')) {
      callbacks.onDepthChange(1);
      return;
    }

    if (target.matches('[data-intro-level]')) {
      callbacks.onIntroLevel(target.dataset.introLevel);
      return;
    }

    if (target.matches('[data-intro-skip]')) {
      callbacks.onIntroSkip();
      return;
    }

  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closePopover();
  });

  function updateHeaderState() {
    if (!refs.header) return;
    refs.header.classList.toggle('is-scrolled', window.scrollY > 24);
  }
  updateHeaderState();
  window.addEventListener('scroll', updateHeaderState, { passive: true });

  return {
    refs,
    closeDrawers,
    closePopover,
    showHome,
    showWorkspace,
    syncHelper
  };
}
