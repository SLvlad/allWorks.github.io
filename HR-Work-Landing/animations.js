/* ============================================================
   HR Work — site animations (scroll-reveal).
   Vanilla JS, no dependencies. Loaded with `defer`, so the DOM
   is parsed by the time this runs.

   Behaviour:
   - Sections fade + gently slide in as they scroll into view.
   - Selected inner blocks (cards, list items) lift + fade in,
     with a light per-group stagger.
   Implemented by toggling the `.is-visible` class; the initial
   and final states live in styles.css, gated on `.anim-ready`.

   Motion is deliberately slow and smooth (brand style, no bounce)
   and is fully disabled for `prefers-reduced-motion: reduce`.
   No calculator or form logic lives here — that stays in app.js.
   ============================================================ */
(function () {
  'use strict';

  // Respect reduced-motion: bail out entirely and leave every element in
  // its natural, fully-visible state (the `.anim-ready` class is never added,
  // so the reveal rules in styles.css never apply).
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  var root = document.documentElement;

  // Inner blocks that get the lift + fade-in treatment.
  var ITEM_SELECTOR = [
    '.stats-grid > div',
    '.calc .panel',
    '.calc .result',
    '.steps .step',
    '.checklist li',
    '.tests .test',
    '.facts > div',
    '.faq details',
    '.apply .why > div',
    '.hero-side .row'
  ].join(',');

  function toArray(nodeList) {
    return Array.prototype.slice.call(nodeList);
  }

  function init() {
    // Opt into the animated initial state only now that JS is running —
    // without this class the page stays fully visible (no-JS safe).
    root.classList.add('anim-ready');

    var sections = toArray(document.querySelectorAll('section'));
    var items = toArray(document.querySelectorAll(ITEM_SELECTOR));

    sections.forEach(function (el) { el.classList.add('reveal'); });
    items.forEach(function (el) { el.classList.add('reveal-item'); });

    // Light stagger: each item is delayed a little more than its previous
    // sibling within the same parent, capped so groups never lag too long.
    var counts = {};
    var groupId = 0;
    items.forEach(function (el) {
      var parent = el.parentElement;
      if (!parent._revealGroup) parent._revealGroup = ++groupId;
      var key = parent._revealGroup;
      var i = counts[key] || 0;
      el.style.transitionDelay = Math.min(i * 80, 400) + 'ms';
      counts[key] = i + 1;
    });

    // Without IntersectionObserver, show everything immediately.
    if (!('IntersectionObserver' in window)) {
      root.classList.remove('anim-ready');
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    sections.forEach(function (el) { observer.observe(el); });
    items.forEach(function (el) { observer.observe(el); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
