/* ==========================================================================
   Mamino Ogrodzenia — animations.js
   Drobne, nienachalne animacje: cień nagłówka po przewinięciu + "wjeżdżanie"
   elementów przy scrollowaniu (reveal-on-scroll). Wejściowa animacja hero
   i pulsy działają czysto w CSS (mamino.css) — ten plik dokłada tylko to,
   czego CSS nie potrafi: reakcję na pozycję scrolla.

   Uszanowanie prefers-reduced-motion: jeśli użytkownik go włączył, klasa
   ".reveal" i tak jest dodawana (nieszkodliwie), ale sama animacja jest
   wyłączona w CSS pod @media (prefers-reduced-motion: no-preference) —
   więc elementy po prostu zostają widoczne od razu, bez utraty treści.
   ========================================================================== */

(function () {
  "use strict";

  // --- Cień nagłówka po przewinięciu strony --------------------------------
  var header = document.querySelector(".site-header");
  if (header) {
    var updateHeaderShadow = function () {
      header.classList.toggle("site-header--scrolled", window.scrollY > 12);
    };
    window.addEventListener("scroll", updateHeaderShadow, { passive: true });
    updateHeaderShadow();
  }

  // --- Reveal-on-scroll dla treści drugorzędnych (nie dotyka kalkulatora) --
  var revealEls = document.querySelectorAll(
    ".section-head, .card, .step, .gallery-item, .city-pill"
  );

  if (!revealEls.length) return;

  revealEls.forEach(function (el, index) {
    el.classList.add("reveal");
    el.style.transitionDelay = (index % 4) * 70 + "ms";
  });

  if (!("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );

  revealEls.forEach(function (el) {
    observer.observe(el);
  });
})();
