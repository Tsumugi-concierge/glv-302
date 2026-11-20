GLV 302 Multilingual Update — Summary

Scope
- Made the entire static site multilingual across 6 languages: English (en), Japanese (ja), Simplified Chinese (zh), Korean (ko), French (fr), and Spanish (es).
- Pages covered: index.html and all subpages under each directory.

What Changed
- Added assets/i18n.js
  - Persists language selection in localStorage (key: glv302.lang).
  - Initializes language from browser settings when no prior choice exists (fallback: en).
  - Works with existing per‑page translation logic by calling the page’s own setLang(lang, btn) and setting document.documentElement.lang.
  - Automatically indexes all .lang-btn buttons and saves the selected language on click.
- Wired i18n.js into all HTML pages (correct relative paths) so the above behavior is consistent site‑wide.
- Preserved all existing layouts, images and paths. URLs remain unchanged.

Design Notes
- The site already used per‑page data‑i18n translations with 6 languages. The new shared i18n.js adds consistency, persistence, and browser‑language defaulting without altering existing copy or templates.
- Language switchers are present on every page; i18n.js now ensures they are synchronized and persisted.

Access Codes
- No door key codes or similar access codes are published on the site. The “How to Open” page intentionally states that codes are sent after guest registration; we left this as-is per the brief.

Pre-existing Change
- The removal of the embedded chat section on index.html was pre-existing in the working tree. We kept that change exactly as-is while implementing i18n.

Validation
- Switching languages updates visible text on every page.
- Language choice persists across navigation and reloads.
- Initial language follows the browser if supported, else English.
