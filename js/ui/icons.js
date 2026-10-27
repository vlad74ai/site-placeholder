// CSS masks use the unmodified geometry of the bundled Lucide icons.
export function icon(name, className = '') {
  return `<span class="ui-icon ui-icon--${name} ${className}" aria-hidden="true"></span>`;
}
