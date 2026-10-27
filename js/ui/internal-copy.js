// Clipboard failure is an ordinary, visible state. The prompt always stays in HTML.
export async function copyText(text, clipboard) {
  try {
    const api = clipboard === undefined ? globalThis.navigator?.clipboard : clipboard;
    if (typeof api?.writeText !== "function") return "unavailable";
    await api.writeText(text);
    return "success";
  } catch (error) {
    return error?.name === "NotAllowedError" ? "denied" : "error";
  }
}

export function enhanceCopy(root = document) {
  for (const block of root.querySelectorAll("[data-copyable]")) {
    const prompt = block.querySelector(".copyable-text[id]");
    if (!prompt || block.querySelector(".copy-button")) continue;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "copy-button";
    button.textContent = "Копировать";
    button.setAttribute("aria-controls", prompt.id);
    const status = document.createElement("p");
    status.className = "copy-status";
    status.setAttribute("role", "status");
    status.setAttribute("aria-atomic", "true");
    let pending = false;
    button.addEventListener("click", async () => {
      if (pending) return;
      pending = true;
      button.setAttribute("aria-busy", "true");
      status.textContent = "";
      const result = await copyText(prompt.textContent);
      block.dataset.copyState = result;
      status.textContent = result === "success"
        ? "Скопировано."
        : result === "unavailable"
          ? "Копирование недоступно. Выделите текст запроса и скопируйте вручную."
          : "Не удалось скопировать. Выделите текст запроса и скопируйте вручную.";
      button.removeAttribute("aria-busy");
      pending = false;
    });
    block.append(button, status);
  }

  // Unified A–F pages contain the same approved exercises as native topic
  // pages, but load internal-page.js instead of topic-page.js.
  for (const button of root.querySelectorAll("[data-practice-copy]")) {
    if (button.dataset.practiceCopyReady === "true") continue;
    const prompt = button.closest(".practice-prompt")?.querySelector("[data-practice-copy-source]");
    if (!prompt) continue;
    button.dataset.practiceCopyReady = "true";
    let pending = false;
    let resetTimeout;
    const originalLabel = button.textContent;

    button.addEventListener("click", async () => {
      if (pending) return;
      const value = prompt.textContent?.trim();
      if (!value) return;
      pending = true;
      button.setAttribute("aria-busy", "true");

      let result = await copyText(value);
      if (result !== "success") {
        // Match native article behavior when Clipboard API is unavailable.
        let field;
        try {
          field = document.createElement("textarea");
          field.value = value;
          field.readOnly = true;
          field.style.position = "fixed";
          field.style.opacity = "0";
          document.body.appendChild(field);
          field.select();
          if (document.execCommand("copy")) result = "success";
        } catch {
          // Visible fallback is provided below.
        } finally {
          field?.remove();
        }
      }

      button.textContent = result === "success" ? "Скопировано" : "Выделите текст вручную";
      button.classList.toggle("is-copied", result === "success");
      button.removeAttribute("aria-busy");
      pending = false;
      if (resetTimeout) clearTimeout(resetTimeout);
      resetTimeout = setTimeout(() => {
        if (!button.isConnected) return;
        button.textContent = originalLabel;
        button.classList.remove("is-copied");
      }, 1600);
    });
  }
}
