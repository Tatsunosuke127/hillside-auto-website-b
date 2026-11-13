/* ============================================
   GA4 events
   The Google tag (GTM-WTRWDLW9 -> GA4 G-2XLR0Z1C0G) sits at the top
   of each page's <head>. This file adds the events the 2026-11 brief asks for:
     phone_tap      tel: links
     line_tap       LINE (lin.ee) links
     booking_click  TimeRex booking links
     scroll_25 / scroll_50 / scroll_75 / scroll_100
   contact_form_sent is sent from js/form.js only after a successful submit.
   No names, e-mails or message text are ever sent.
   ============================================ */
(function () {
  'use strict';

  function send(name, params) {
    if (typeof window.gtag === 'function') window.gtag('event', name, params || {});
  }
  window.HillsideTrack = send;

  function where(a) {
    if (a.closest('.mob-bar')) return 'mobile_bar';
    if (a.closest('.stick-cta')) return 'sticky_button';
    if (a.closest('.nav, .nav-overlay')) return 'header';
    if (a.closest('footer, .ft')) return 'footer';
    return 'page';
  }

  // Link taps (capture phase, so it runs even when another handler stops the event)
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (/^tel:/i.test(href)) send('phone_tap', { link_location: where(a) });
    else if (/lin\.ee\//i.test(href)) send('line_tap', { link_location: where(a) });
    else if (/timerex\.net\//i.test(href)) send('booking_click', { link_location: where(a), link_url: href });
  }, true);

  // Scroll depth: each mark once per page view
  var marks = [25, 50, 75, 100];
  var done = {};
  function onScroll() {
    var doc = document.documentElement;
    var top = Math.max(window.scrollY || 0, doc.scrollTop || 0, document.body ? document.body.scrollTop : 0);
    var max = doc.scrollHeight - window.innerHeight;
    if (max <= 0) return;
    var pct = top / max * 100;
    for (var i = 0; i < marks.length; i++) {
      var m = marks[i];
      if (!done[m] && pct >= m - 1) { done[m] = true; send('scroll_' + m); }
    }
    if (done[100]) window.removeEventListener('scroll', onScroll);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
})();
