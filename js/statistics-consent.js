import { analyticsConfig } from './data/analytics-config.js';
import { safeSearchTerm } from './core/search-statistics.js';
export const CONSENT_KEY = 'ai-v-delo.statistics.v1';
export function initStatisticsConsent(config = analyticsConfig) {
  if (window.__aiVDeloStatistics) return window.__aiVDeloStatistics;
  const panel = document.querySelector('[data-statistics-consent]');
  if (!panel) return null;
  const accept = panel.querySelector('[data-statistics-accept]');
  const decline = panel.querySelector('[data-statistics-decline]');
  const settings = document.querySelector('[data-statistics-settings]');
  const disableKey = 'ga-disable-' + config.measurementId;
  let choice = null, started = false, tag = null, expiryTimer;
  let searchEpoch = {};
  window[disableKey] = true;
  function readChoice() {
    try {
      const v = JSON.parse(localStorage.getItem(CONSENT_KEY));
      return v?.version === config.consentVersion && ['accepted','declined'].includes(v.value) &&
        Number.isFinite(v.at) && v.at <= Date.now() && Date.now() - v.at < config.lifetimeDays * 86400000 ? v.value : null;
    } catch { return null; }
  }
  function cleanAnalytics() {
    const names = document.cookie.split(';').map(x => x.trim().split('=')[0]);
    const domains = ['', location.hostname, '.' + location.hostname, 'ai-v-delo.ru', '.ai-v-delo.ru'];
    for (const name of names.filter(n => /^(?:_ga(?:_|$)|aivdelo_ga(?:_|$)|_gid$|_gat(?:_|$))/.test(n))) {
      for (const domain of domains) document.cookie = `${name}=; Max-Age=0; path=/;${domain ? ' domain=' + domain + ';' : ''}`;
    }
    for (const storage of ['localStorage','sessionStorage']) {
      try { for (const key of Object.keys(window[storage])) if (/^(?:_ga(?:_|$)|aivdelo_ga(?:_|$))/.test(key)) window[storage].removeItem(key); } catch { /* fail closed */ }
    }
  }
  function stop() {
    searchEpoch = {};
    window[disableKey] = true; // Official GA opt-out is set before unload or any other work.
    tag?.remove();
    if (window.dataLayer) window.dataLayer.length = 0;
    if (started) window.gtag = () => {};
    cleanAnalytics();
    document.documentElement.dataset.statisticsNetwork = 'blocked';
  }
  function start() {
    if (started || choice !== 'accepted' || readChoice() !== 'accepted' ||
      !config.legalApproved || !config.measurementIdVerified || !config.streamSettingsVerified ||
      location.hostname !== config.allowedHost) return;
    started = true;
    window[disableKey] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { if (!window[disableKey] && readChoice() === 'accepted') window.dataLayer.push(arguments); };
    const gtag = window.gtag;
    gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
    gtag('consent','update',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
    gtag('js',new Date());
    const canonical = document.querySelector('link[rel="canonical"]')?.href || location.origin + location.pathname;
    const safeLocation = new URL(canonical); safeLocation.search = ''; safeLocation.hash = '';
    gtag('config',config.measurementId,{
      send_page_view:false, allow_google_signals:false, allow_ad_personalization_signals:false,
      cookie_prefix:'aivdelo', cookie_domain:'none', cookie_path:'/',
      cookie_expires:config.lifetimeDays * 86400, cookie_update:false,
      page_location:safeLocation.href, page_referrer:''
    });
    // One manual page_view per document; history events belong to Enhanced Measurement.
    gtag('event','page_view',{page_location:safeLocation.href,page_title:document.title,page_referrer:''});
    tag = document.createElement('script'); tag.async = true; tag.dataset.statisticsTag = '';
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(config.measurementId);
    tag.onload = () => { if (!window[disableKey]) document.documentElement.dataset.statisticsNetwork = 'active'; };
    tag.onerror = () => { stop(); document.documentElement.dataset.statisticsNetwork = 'failed'; };
    document.documentElement.dataset.statisticsNetwork = 'starting';
    document.head.append(tag);
  }
  function reserveSpace() {
    document.documentElement.style.setProperty('--statistics-consent-space', panel.hidden ? '0px' : Math.ceil(panel.getBoundingClientRect().height) + 'px');
  }
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(reserveSpace).observe(panel);
  function show(focus = false) {
    panel.hidden = false; reserveSpace();
    if (focus) accept.focus({preventScroll:true});
  }
  function close() {
    const hadFocus = panel.contains(document.activeElement);
    panel.hidden = true; reserveSpace();
    if (hadFocus) settings?.focus({preventScroll:true});
  }
  function apply(value, persisted = true) {
    clearTimeout(expiryTimer);
    choice = value;
    document.documentElement.dataset.statisticsChoice = value || 'unknown';
    if (value === 'accepted' && persisted) { start(); scheduleExpiry(); } else stop();
  }
  function scheduleExpiry() {
    try {
      const v = JSON.parse(localStorage.getItem(CONSENT_KEY));
      const delay = v.at + config.lifetimeDays * 86400000 - Date.now();
      expiryTimer = setTimeout(() => { if (readChoice() !== choice) sync(); else scheduleExpiry(); }, Math.max(1,Math.min(delay,2147000000)));
    } catch { /* next lifecycle sync fails closed */ }
  }
  function choose(value) {
    const reload = started && value !== 'accepted';
    if (value !== 'accepted') stop();
    let saved = false;
    try { localStorage.setItem(CONSENT_KEY,JSON.stringify({version:config.consentVersion,value,at:Date.now()})); saved = true; } catch { /* no persistent consent, no tracking */ }
    apply(value,saved); close();
    if (reload) location.reload(); // Discard all SDK timers/listeners, not just its script node.
  }
  function sync() {
    const v = readChoice();
    if (v === choice) return;
    const reload = started && v !== 'accepted';
    apply(v);
    if (!v) show(); else close();
    if (reload) location.reload();
  }
  accept.addEventListener('click',() => choose('accepted'));
  decline.addEventListener('click',() => choose('declined'));
  settings?.addEventListener('click',event => { event.preventDefault(); show(true); });
  panel.querySelector('a[href$="#statistics-privacy"]')?.addEventListener('click',() => {
    const details = document.getElementById('statistics-privacy');
    if (details?.tagName === 'DETAILS') details.open = true;
  });
  panel.addEventListener('keydown',event => { if (event.key === 'Escape') { close(); settings?.focus({preventScroll:true}); } });
  window.addEventListener('storage',event => { if (event.key === CONSENT_KEY || event.key === null) sync(); });
  window.addEventListener('pageshow',sync);
  document.addEventListener('visibilitychange',() => { if (!document.hidden) sync(); });
  function searchAllowed() {
    return started && !window[disableKey] && choice === 'accepted' && readChoice() === 'accepted' &&
      config.legalApproved && config.measurementIdVerified && config.streamSettingsVerified &&
      location.hostname === config.allowedHost;
  }
  const controller = {
    open:() => show(true),
    searchSnapshot:() => searchAllowed() ? searchEpoch : null,
    trackSearch(raw, count, token) {
      const term = safeSearchTerm(raw);
      if (!searchAllowed() || token !== searchEpoch || !term || !Number.isInteger(count) || count < 0 || count > 7) return false;
      window.gtag('event','view_search_results',{
        search_term:term, search_result_count:count, search_no_results:count === 0 ? 1 : 0
      });
      return true;
    }
  };
  window.__aiVDeloStatistics = controller;
  apply(readChoice());
  if (!choice) show();
  return controller;
}
function revealPrivacyDetailsFromLink() {
  if (location.hash !== '#statistics-privacy') return;
  const details = document.getElementById('statistics-privacy');
  if (details?.tagName === 'DETAILS') details.open = true;
}
window.addEventListener('hashchange', revealPrivacyDetailsFromLink);
revealPrivacyDetailsFromLink();
initStatisticsConsent();
