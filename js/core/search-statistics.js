// A conservative allow-through filter, not anonymisation of arbitrary prose.
export function safeSearchTerm(raw = '') {
  if (typeof raw !== 'string') return null;
  const term = raw.normalize('NFKC').replace(/\s+/gu, ' ').trim();
  if (term.length < 2 || term.length > 100 || (term.match(/\p{L}/gu) || []).length < 2) return null;
  if (/[\p{Cc}\p{Cf}@＠]/u.test(raw) || (term.match(/\p{N}/gu) || []).length >= 5) return null;
  if (/https?:|www\.|mailto:|tel:|t\.me\/|\b[\w-]+\.(?:ru|com|net|org|рф)\b/iu.test(term)) return null;
  if (/(?:\bemail\b|\be-mail\b|\bphone\b|\baddress\b|телефон|тел\s*:|электронн.*почт|контакт|связаться со мной|адрес|улица|(?:^|\s)(?:ул|д|кв|пр-т)\.|квартир|whatsapp|ватсап|телеграм|telegram|skype|скайп)/iu.test(term)) return null;
  if (/(?:\[at\]|\(at\)|\sсобака\s|\sсобачка\s|\sат\s|\sat\s.*\bdot\b)/iu.test(term)) return null;
  return term;
}

// Only a result actually rendered following user input is eligible. Nothing is
// buffered before consent; an old consent epoch can never become eligible later.
export function createSearchStatistics({ snapshot, send, delay = 600 }) {
  let timer, pending;
  const sent = new Set(); // This search instance/document, not a new cookie.
  function cancel() { clearTimeout(timer); pending = null; }
  function flush() {
    clearTimeout(timer);
    const p = pending; pending = null;
    if (!p || sent.has(p.key)) return;
    try { if (send(p.term, p.count, p.token)) sent.add(p.key); } catch { /* search always works */ }
  }
  function schedule(raw, count) {
    cancel();
    const term = safeSearchTerm(raw);
    const key = term?.toLocaleLowerCase('ru').replaceAll('ё', 'е');
    let token;
    try { token = snapshot(); } catch { return; }
    if (!term || !token || sent.has(key)) return;
    pending = { term, key, count, token };
    timer = setTimeout(flush, delay);
  }
  return { schedule, cancel, flush };
}
