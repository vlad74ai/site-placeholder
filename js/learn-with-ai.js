import { copyText } from './ui/internal-copy.js?v=af-practice-1';

const root = document.querySelector('.learn-ai');
if (root) {
  const radios = [...root.querySelectorAll('[name="learn-method"]')];
  const panels = [...root.querySelectorAll('.learn-ai__method')];
  const fitPrompt = panel => {
    if (panel.hidden || !panel.querySelector('details').open) return;
    const source = panel.querySelector('textarea');
    source.style.height = 'auto';
    source.style.height = `${source.scrollHeight}px`;
  };
  const selectMethod = () => {
    const selected = radios.find(radio => radio.checked)?.value;
    for (const panel of panels) {
      panel.hidden = panel.id !== `learn-${selected}`;
      fitPrompt(panel);
    }
  };
  for (const radio of radios) radio.addEventListener('change', selectMethod);
  selectMethod();
  window.addEventListener('resize', () => panels.forEach(fitPrompt));
  document.fonts?.ready.then(() => panels.forEach(fitPrompt));
  for (const panel of panels) {
    const button = panel.querySelector('[data-learn-copy]');
    const source = panel.querySelector('textarea');
    const status = panel.querySelector('[role="status"]');
    panel.querySelector('details').addEventListener('toggle', () => fitPrompt(panel));
    button.addEventListener('click', async () => {
      button.disabled = true;
      status.textContent = '';
      const result = await copyText(source.value);
      button.disabled = false;
      // A pending clipboard request must not move focus after a mode change.
      if (panel.hidden) return;
      if (result === 'success') {
        status.textContent = 'Запрос скопирован. Вставьте его в свой ИИ-чат.';
      } else {
        panel.querySelector('details').open = true;
        fitPrompt(panel);
        status.textContent = 'Не удалось скопировать автоматически. Выделите текст ниже и скопируйте его вручную.';
        source.focus();
        source.select();
      }
    });
  }
}
