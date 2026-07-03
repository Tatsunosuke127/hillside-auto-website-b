/* ============================================
   HILLSIDE AUTO — Unified site behavior
   (nav / overlay / scroll-top / sticky CTA /
   business-hours dot / fade-in) for subpages
   ============================================ */
(function () {
  'use strict';

  // --- Nav scroll state ---
  var nav = document.getElementById('nav');
  if (nav) {
    var onNavScroll = function () {
      nav.classList.toggle('nav--scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', onNavScroll, { passive: true });
    onNavScroll();
  }

  // --- Mobile overlay ---
  var menuBtn = document.getElementById('menuBtn');
  var overlay = document.getElementById('navOverlay');
  if (menuBtn && overlay) {
    menuBtn.addEventListener('click', function () {
      menuBtn.classList.toggle('active');
      overlay.classList.toggle('active');
      var open = overlay.classList.contains('active');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    overlay.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menuBtn.classList.remove('active');
        overlay.classList.remove('active');
        menuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Business-hours dot (Mon–Sat 9:00–18:00 JST) ---
  var dot = document.querySelector('.stick-cta__dot');
  if (dot) {
    try {
      var jst = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
      var open = jst.getDay() >= 1 && jst.getDay() <= 6 && jst.getHours() >= 9 && jst.getHours() < 18;
      if (!open) dot.classList.add('stick-cta__dot--closed');
    } catch (e) { /* keep default */ }
  }

  // --- Scroll top + sticky CTA visibility ---
  var scrollBtn = document.getElementById('scrollTop');
  var stickCta = document.getElementById('stickCta');
  if (scrollBtn || stickCta) {
    var onScroll = function () {
      var y = window.scrollY;
      if (scrollBtn) scrollBtn.classList.toggle('visible', y > 500);
      if (stickCta) {
        var docH = document.documentElement.scrollHeight;
        var winH = window.innerHeight;
        var nearBottom = y + winH > docH - 600;
        stickCta.classList.toggle('visible', y > winH * 0.5 && !nearBottom);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
  if (scrollBtn) {
    scrollBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Fade in (.fi) ---
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.fi').forEach(function (el) { obs.observe(el); });
  } else {
    document.querySelectorAll('.fi').forEach(function (el) { el.classList.add('visible'); });
  }
})();
