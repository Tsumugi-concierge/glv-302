/* Lightweight i18n bootstrap for GLV 302
 * - Persists selected language in localStorage
 * - Initializes from browser language if supported, else English
 * - Works with existing per-page setLang(lang, btn) implementations
 * - No assumptions about page-specific translation stores; just calls setLang
 */
(function(){
  const KEY = 'glv302.lang';
  const SUPPORTED = ['en','ja','zh','ko','fr','es'];

  function normLang(l){
    if(!l) return null;
    l = String(l).toLowerCase();
    // Map script/region variants to base
    if (l.startsWith('en')) return 'en';
    if (l.startsWith('ja') || l.startsWith('jp')) return 'ja';
    if (l.startsWith('zh')) return 'zh';
    if (l.startsWith('ko') || l.startsWith('kr')) return 'ko';
    if (l.startsWith('fr')) return 'fr';
    if (l.startsWith('es')) return 'es';
    return null;
  }

  function getStored(){
    try { return localStorage.getItem(KEY); } catch { return null; }
  }
  function setStored(lang){
    try { localStorage.setItem(KEY, lang); } catch {}
  }

  function detectBrowser(){
    const langs = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'en']).filter(Boolean);
    for (const l of langs){
      const n = normLang(l);
      if (n && SUPPORTED.includes(n)) return n;
    }
    return 'en';
  }

  function parseBtnLang(btn){
    if (!btn) return null;
    // Prefer explicit data attribute if already present
    if (btn.dataset && btn.dataset.lang && SUPPORTED.includes(btn.dataset.lang)) return btn.dataset.lang;
    // Try to parse from inline onclick="setLang('xx', this)"
    const oc = btn.getAttribute && btn.getAttribute('onclick');
    if (oc){
      const m = oc.match(/setLang\((['"])\s*([a-z]{2})\s*\1\s*,/i);
      if (m && SUPPORTED.includes(m[2])) return m[2];
    }
    // Heuristic: look at button text for language code
    const t = (btn.textContent || '').toLowerCase();
    for (const code of SUPPORTED){
      if (t.includes(code)) return code;
    }
    return null;
  }

  function indexButtons(){
    document.querySelectorAll('.lang-btn').forEach(btn => {
      const code = parseBtnLang(btn);
      if (code) btn.dataset.lang = code;
      // Persist on click
      btn.addEventListener('click', function(){
        const lang = btn.dataset.lang || parseBtnLang(btn);
        if (lang && SUPPORTED.includes(lang)) {
          setStored(lang);
          try { document.documentElement.lang = lang; } catch {}
          // Also broadcast for pages that listen
          try { window.dispatchEvent(new CustomEvent('i18n:change', { detail: { lang } })); } catch {}
        }
      });
    });
  }

  function findBtnFor(lang){
    // Prefer data-lang indexed buttons
    let btn = document.querySelector('.lang-btn[data-lang="'+lang+'"]');
    if (btn) return btn;
    // Fallback: match onclick pattern
    btn = document.querySelector(`.lang-btn[onclick*="setLang('${lang}'"], .lang-btn[onclick*="setLang(\"${lang}\""]`);
    if (btn) return btn;
    // Last resort: first .lang-btn
    return document.querySelector('.lang-btn');
  }

  function applyInitial(){
    const stored = getStored();
    const initial = (stored && SUPPORTED.includes(stored)) ? stored : detectBrowser();
    // If page defines setLang(lang, btn), use it to ensure active state + translation
    const hasSetLang = typeof window.setLang === 'function';
    const btn = findBtnFor(initial);
    if (hasSetLang && btn){
      try { window.setLang(initial, btn); } catch {}
    } else {
      // Fallback: let page handle via its own hooks if any
      if (typeof window.applyTranslations === 'function') {
        try { window.applyTranslations(initial); } catch {}
      }
    }
    setStored(initial);
    try { document.documentElement.lang = initial; } catch {}
  }

  function onReady(fn){
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, { once: true });
    else fn();
  }

  onReady(function(){
    indexButtons();
    applyInitial();
  });
})();
