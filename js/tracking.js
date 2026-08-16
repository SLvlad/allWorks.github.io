/* ==========================================================================
   Mamino Ogrodzenia — tracking.js
   Wysyła zdarzenia do dataLayer (GTM/GA4) i Meta Pixel (fbq).
   Podłączenie realnego Pixela: patrz PIXEL_ID poniżej + README.md.
   ========================================================================== */

(function () {
  "use strict";

  // KROK 1: wstaw prawdziwy Meta Pixel ID (np. "1234567890123456").
  var PIXEL_ID = "PIXEL_ID";

  // KROK 2: odkomentuj CAŁY blok poniżej (zaznacz i usuń "// " z każdej linii).
  // Nic więcej nie trzeba zmieniać: funkcja track() poniżej automatycznie
  // wyśle wszystkie zdarzenia do fbq, gdy tylko Pixel będzie zainicjowany,
  // a PIXEL_ID nie będzie już placeholderem "PIXEL_ID".
  //
  // !(function (f, b, e, v, n, t, s) {
  //   if (f.fbq) return; n = f.fbq = function () {
  //     n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
  //   };
  //   if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0";
  //   n.queue = []; t = b.createElement(e); t.async = !0;
  //   t.src = v; s = b.getElementsByTagName(e)[0];
  //   s.parentNode.insertBefore(t, s);
  // })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  // fbq("init", PIXEL_ID);
  // fbq("track", "PageView");

  window.dataLayer = window.dataLayer || [];

  /**
   * Centralny punkt wysyłki eventu: dataLayer (GTM) + fbq (Meta Pixel), jeśli dostępne.
   * @param {string} eventName - np. "cta_hero", "calc_start", "calc_submit"
   * @param {object} [payload] - dodatkowe dane zdarzenia
   */
  function track(eventName, payload) {
    var data = payload || {};

    window.dataLayer.push(Object.assign({ event: eventName }, data));

    if (typeof window.fbq === "function" && PIXEL_ID !== "PIXEL_ID") {
      window.fbq("trackCustom", eventName, data);
    }

    // eslint-disable-next-line no-console
    console.log("[tracking]", eventName, data);
  }

  // Udostępniamy globalnie, żeby calculator.js mógł wywoływać calc_start / calc_submit.
  window.maminoTrack = track;

  // --- Automatyczne wpięcie kliknięć w elementy [data-event] ----------------
  document.addEventListener(
    "click",
    function (e) {
      var el = e.target.closest("[data-event]");
      if (!el) return;
      track(el.getAttribute("data-event"), {
        label: (el.textContent || "").trim(),
        href: el.getAttribute("href") || null,
      });
    },
    false
  );
})();
