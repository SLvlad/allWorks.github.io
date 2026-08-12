/* ==========================================================================
   Mamino Ogrodzenia — tracking.js
   Wysyła zdarzenia do dataLayer (GTM/GA4) i Meta Pixel (fbq).
   Podłączenie realnego Pixela: patrz PIXEL_ID poniżej + README.md.
   ========================================================================== */

(function () {
  "use strict";

  // TODO: wstawić prawdziwy Meta Pixel ID przy deployu (np. "1234567890123456").
  var PIXEL_ID = "PIXEL_ID";

  // --- Meta Pixel bootstrap -------------------------------------------------
  // Odkomentować poniższy blok i wstawić prawdziwy PIXEL_ID, aby aktywować
  // realne śledzenie Meta Pixel. Zostawione wyłączone, dopóki PIXEL_ID
  // jest placeholderem, żeby nie wysyłać zdarzeń pod fałszywym ID.
  //
  // !function(f,b,e,v,n,t,s){...}(window, document,'script',
  // 'https://connect.facebook.net/en_US/fbevents.js');
  // fbq('init', PIXEL_ID);
  // fbq('track', 'PageView');

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
