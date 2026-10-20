/* ============================================
   Language Toggle System
   --------------------------------------------
   A page opens in its own language: English when <body data-default-lang="en">,
   otherwise Japanese. The browser's language is NOT used to switch the page,
   so search engines (which crawl with an English browser) read Japanese pages
   in Japanese. A visitor's choice is saved only when they press JP / EN.
   Visitors whose browser is not Japanese get a one-line hint offering English.
   ============================================ */

(function () {
  'use strict';

  const STORAGE_KEY = 'hillside-lang';
  const HINT_KEY = 'hillside-lang-hint';
  const SUPPORTED_LANGS = ['ja', 'en'];

  function pageDefaultLang() {
    return document.body.dataset.defaultLang === 'en' ? 'en' : 'ja';
  }

  function browserPrefersJapanese() {
    const list = (navigator.languages && navigator.languages.length)
      ? navigator.languages
      : [navigator.language || navigator.userLanguage || ''];
    return String(list[0] || '').toLowerCase().split('-')[0] === 'ja';
  }

  function getSavedLang() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && SUPPORTED_LANGS.includes(saved)) return saved;
    } catch (e) {
      // localStorage unavailable
    }
    return null;
  }

  function saveLang(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      // localStorage unavailable
    }
  }

  function setLang(lang, persist) {
    if (!SUPPORTED_LANGS.includes(lang)) return;

    document.body.classList.remove('lang-ja', 'lang-en');
    document.body.classList.add('lang-' + lang);
    document.documentElement.lang = lang;

    // Update toggle buttons
    document.querySelectorAll('[data-lang-btn]').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.langBtn === lang);
    });

    // Update page title if bilingual titles exist
    var titleJa = document.querySelector('meta[name="title-ja"]');
    var titleEn = document.querySelector('meta[name="title-en"]');
    if (titleJa && titleEn) {
      document.title = lang === 'ja' ? titleJa.content : titleEn.content;
    }

    // Update meta description
    var descJa = document.querySelector('meta[name="desc-ja"]');
    var descEn = document.querySelector('meta[name="desc-en"]');
    var metaDesc = document.querySelector('meta[name="description"]');
    if (descJa && descEn && metaDesc) {
      metaDesc.content = lang === 'ja' ? descJa.content : descEn.content;
    }

    // Update placeholders
    document.querySelectorAll('[data-placeholder-ja][data-placeholder-en]').forEach(function (el) {
      el.placeholder = lang === 'ja' ? el.dataset.placeholderJa : el.dataset.placeholderEn;
    });

    // Update select options text
    document.querySelectorAll('[data-select-lang] option').forEach(function (opt) {
      if (opt.dataset.ja && opt.dataset.en) {
        opt.textContent = lang === 'ja' ? opt.dataset.ja : opt.dataset.en;
      }
    });

    if (persist !== false) {
      saveLang(lang);
      removeHint();
    }
  }

  /* ---------- One-line "English available" hint ---------- */

  function hintDismissed() {
    try { return sessionStorage.getItem(HINT_KEY) === 'off'; } catch (e) { return false; }
  }

  function removeHint() {
    var hint = document.getElementById('lang-hint');
    if (!hint) return;
    hint.parentNode.removeChild(hint);
    var nav = document.getElementById('nav') || document.querySelector('.nav');
    if (nav) nav.style.top = '';
  }

  function showHint() {
    if (document.getElementById('lang-hint')) return;

    var style = document.createElement('style');
    style.textContent =
      '.lang-hint{position:fixed;top:0;left:0;right:0;z-index:101;height:40px;' +
      'display:flex;align-items:center;justify-content:center;gap:16px;padding:0 48px 0 16px;' +
      'background:#000;color:rgba(255,255,255,0.8);font-family:Inter,sans-serif;font-size:12px;' +
      'letter-spacing:0.04em;border-bottom:1px solid rgba(255,255,255,0.15);}' +
      '.lang-hint__go{background:none;border:0;padding:0 0 1px;color:#fff;font:inherit;cursor:pointer;' +
      'border-bottom:1px solid rgba(255,255,255,0.6);}' +
      '.lang-hint__go:hover{border-color:#fff;}' +
      '.lang-hint__x{position:absolute;right:8px;top:50%;transform:translateY(-50%);width:32px;height:32px;' +
      'background:none;border:0;color:rgba(255,255,255,0.6);font-size:18px;line-height:1;cursor:pointer;}' +
      '.lang-hint__x:hover{color:#fff;}';
    document.head.appendChild(style);

    var hint = document.createElement('div');
    hint.id = 'lang-hint';
    hint.className = 'lang-hint';
    hint.lang = 'en';
    hint.setAttribute('data-nosnippet', '');
    hint.setAttribute('role', 'region');
    hint.setAttribute('aria-label', 'Language');
    hint.innerHTML =
      '<span>English available</span>' +
      '<button type="button" class="lang-hint__go">Switch to English →</button>' +
      '<button type="button" class="lang-hint__x" aria-label="Close">×</button>';

    hint.querySelector('.lang-hint__go').addEventListener('click', function () {
      setLang('en', true);
    });
    hint.querySelector('.lang-hint__x').addEventListener('click', function () {
      try { sessionStorage.setItem(HINT_KEY, 'off'); } catch (e) { /* storage unavailable */ }
      removeHint();
    });

    document.body.insertBefore(hint, document.body.firstChild);
    var nav = document.getElementById('nav') || document.querySelector('.nav');
    if (nav) nav.style.top = '40px';
  }

  function init() {
    var saved = getSavedLang();
    var lang = saved || pageDefaultLang();

    // Apply without saving: only an explicit JP / EN press is remembered.
    setLang(lang, false);

    if (!saved && lang === 'ja' && !browserPrefersJapanese() && !hintDismissed()) {
      showHint();
    }

    // Bind toggle buttons
    document.querySelectorAll('[data-lang-btn]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setLang(this.dataset.langBtn, true);
      });
    });
  }

  // Expose globally for external use
  window.HillsideLang = { setLang: setLang };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
