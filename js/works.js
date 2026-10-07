/* ============================================
   Works — renders cards from /works.json
   Containers: <section data-works [data-works-limit="3"]>
     [data-works-filters]  optional, category buttons
     [data-works-grid]     required, card grid
   Only fields from works.json are shown; article bodies
   are never copied here. Cards carry both languages so
   the existing JP/EN toggle keeps working after render.
   ============================================ */
(function () {
  'use strict';

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function yen(n) {
    return '¥' + Number(n).toLocaleString('ja-JP');
  }
  function bi(ja, en) {
    return '<span data-lang-ja>' + esc(ja) + '</span><span data-lang-en>' + esc(en) + '</span>';
  }
  function imgSrc(p) {
    // works.json uses root-absolute paths; keep them relative so file:// previews work too
    return String(p || '').replace(/^\//, '');
  }

  function card(w) {
    var alt = esc(w.title_ja + ' / ' + w.title_en);
    return (
      '<article class="work" data-category="' + esc(w.category_ja) + '">' +
        '<a class="work__media" href="' + esc(w.url) + '" target="_blank" rel="noopener">' +
          '<img class="work__img" src="' + esc(imgSrc(w.image)) + '" alt="' + alt + '" width="1200" height="900" loading="lazy">' +
        '</a>' +
        '<div class="work__cat">' + bi(w.category_ja, w.category_en) + '</div>' +
        '<h3 class="work__title">' + bi(w.title_ja, w.title_en) + '</h3>' +
        '<div class="work__car">' + bi(w.car_ja, w.car_en) + '</div>' +
        '<div class="work__price">' +
          '<span class="work__price-label">' + bi(w.price_label_ja, w.price_label_en) + '</span>' +
          '<span class="work__price-value">' + yen(w.price) + '</span>' +
        '</div>' +
        '<p class="work__sum">' + bi(w.summary_ja, w.summary_en) + '</p>' +
        '<a class="work__btn" href="' + esc(w.url) + '" target="_blank" rel="noopener">' +
          bi('記事を読む', 'Read the write-up') +
        '</a>' +
      '</article>'
    );
  }

  function buildFilters(root, list, grid) {
    var holder = root.querySelector('[data-works-filters]');
    if (!holder) return;
    var cats = [], seen = {};
    list.forEach(function (w) {
      if (!seen[w.category_ja]) { seen[w.category_ja] = true; cats.push({ ja: w.category_ja, en: w.category_en }); }
    });
    var html = '<button type="button" class="works__filter active" data-filter="">' + bi('すべて', 'All') + '</button>';
    cats.forEach(function (c) {
      html += '<button type="button" class="works__filter" data-filter="' + esc(c.ja) + '">' + bi(c.ja, c.en) + '</button>';
    });
    holder.innerHTML = html;
    holder.addEventListener('click', function (e) {
      var btn = e.target.closest('.works__filter');
      if (!btn) return;
      var key = btn.getAttribute('data-filter');
      holder.querySelectorAll('.works__filter').forEach(function (b) { b.classList.toggle('active', b === btn); });
      grid.querySelectorAll('.work').forEach(function (el) {
        el.hidden = !!key && el.getAttribute('data-category') !== key;
      });
    });
  }

  function render(root, list) {
    var grid = root.querySelector('[data-works-grid]');
    if (!grid) return;
    var limit = parseInt(root.getAttribute('data-works-limit') || '0', 10);
    // newest first; Array.prototype.sort is stable, so same-day items keep their JSON order
    var sorted = list.slice().sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; });
    if (limit > 0) sorted = sorted.slice(0, limit);
    grid.innerHTML = sorted.map(card).join('');
    buildFilters(root, sorted, grid);
    if (window.HillsideLang && document.body.classList.contains('lang-en')) {
      window.HillsideLang.setLang('en'); // re-apply so select/placeholder hooks stay consistent
    }
  }

  function init() {
    var roots = document.querySelectorAll('[data-works]');
    if (!roots.length) return;
    fetch('works.json', { cache: 'no-cache' })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (list) { roots.forEach(function (root) { render(root, list); }); })
      .catch(function () {
        roots.forEach(function (root) {
          var grid = root.querySelector('[data-works-grid]');
          if (grid) grid.innerHTML = '<p class="works__empty">' +
            bi('作業実績を読み込めませんでした。ページを再読み込みしてください。',
               'Could not load our work list. Please reload the page.') + '</p>';
        });
      });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
