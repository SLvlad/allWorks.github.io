/* ==========================================================================
   Mamino Ogrodzenia — calculator.js
   Kalkulator orientacyjnej ceny ogrodzenia panelowego.

   WAŻNE: wszystkie stawki/mnożniki poniżej to PRZYKŁADOWE wartości robocze,
   NIE są potwierdzonym cennikiem. Realny cennik dostarczy klient — wtedy
   wystarczy podmienić liczby w obiekcie PRICING poniżej, reszta kodu się
   nie zmienia.
   ========================================================================== */

(function () {
  "use strict";

  // ------------------------------------------------------------------------
  // KONFIGURACJA CEN — jedyne miejsce, które trzeba zaktualizować realnym
  // cennikiem klienta. Wszystkie wartości to placeholdery.
  // ------------------------------------------------------------------------
  var PRICING = {
    // Cena bazowa za mb przy: wysokość 103 cm, drut 4 mm, słupek 1,5 mm,
    // bez podmurówki, bez dodatków. Zależna od rodzaju panelu.
    // Wg informacji od klienta: panel 3D od 38 zł/mb, panel 2D od 60 zł/mb.
    basePricePerMb: {
      "3d": 38, // zł/mb (cena startowa)
      "2d": 60  // zł/mb (cena startowa)
    },

    // Mnożnik ceny za mb w zależności od wysokości ogrodzenia.
    heightMultiplier: {
      "103": 1,     // TODO: podtwierdzić w kliencie
      "123": 1.15,  // TODO: podtwierdzić w kliencie
      "143": 1.3,   // TODO: podtwierdzić w kliencie
      "153": 1.4,   // TODO: podtwierdzić w kliencie
      "173": 1.55   // TODO: podtwierdzić w kliencie
    },

    // Mnożnik ceny za mb w zależności od grubości drutu.
    wireMultiplier: {
      "4": 1,    // TODO: podtwierdzić w kliencie
      "5": 1.1   // TODO: podtwierdzić w kliencie
    },

    // Mnożnik ceny za mb w zależności od grubości słupka.
    postMultiplier: {
      "1.5": 1,    // TODO: podtwierdzić w kliencie
      "2": 1.12    // TODO: podtwierdzić w kliencie
    },

    // Dopłata do mb za kolor inny niż podstawowy (antracyt/grafit = bazowy).
    colorSurchargePerMb: {
      antracyt: 0, // TODO: podtwierdzić w kliencie
      zielony: 5,  // TODO: podtwierdzić w kliencie
      czarny: 5    // TODO: podtwierdzić w kliencie
    },

    // Dopłata do mb za podmurówkę systemową.
    podmurowkaPerMb: 25, // zł/mb // TODO: podtwierdzić w kliencie

    // Cena za sztukę furtki.
    furtkaPrice: 350, // zł/szt. // TODO: podtwierdzić w kliencie

    // Cena za bramę, w zależności od typu ("brak" celowo pominięty = 0 zł).
    bramaPrice: {
      dwuskrzydlowa: 1800, // zł // TODO: podtwierdzić w kliencie
      przesuwna: 2600      // zł // TODO: podtwierdzić w kliencie
    },

    // Montaż przez ekipę / tylko materiał (klient montuje we własnym zakresie).
    option: {
      montaz: { label: "Z montażem", flatFee: 0, perMb: 15 },      // TODO: podtwierdzić w kliencie
      material: { label: "Tylko materiał", flatFee: 0, perMb: 0 } // TODO: podtwierdzić w kliencie (czy doliczać dostawę?)
    }
  };

  // ------------------------------------------------------------------------
  // DOM references
  // ------------------------------------------------------------------------
  var form = document.getElementById("calc-form");
  if (!form) return;

  var fields = {
    length: document.getElementById("calc-length"),
    gateCount: document.getElementById("calc-gate-count"),
    brama: document.getElementById("calc-brama")
  };

  var lengthSlider = document.getElementById("calc-length-slider");
  var pillGroups = document.querySelectorAll(".calc-pills");
  var pillState = {};

  var totalEl = document.getElementById("calc-total");
  var breakdownEl = document.getElementById("calc-breakdown");
  var leadForm = document.getElementById("wycena-form");
  var leadPriceHidden = document.getElementById("wycena-cena-hidden");
  var successEl = document.getElementById("wycena-success");

  var pln = new Intl.NumberFormat("pl-PL", { maximumFractionDigits: 0 });
  var hasTrackedStart = false;
  var isFirstRender = true;

  function trackStart(field) {
    if (hasTrackedStart || !window.maminoTrack) return;
    window.maminoTrack("calc_start", { field: field });
    hasTrackedStart = true;
  }

  // ------------------------------------------------------------------------
  // Logika obliczeń
  // ------------------------------------------------------------------------
  function readState() {
    return {
      length: Math.max(0, parseFloat(fields.length.value) || 0),
      panel: pillState.panel, // "3d" | "2d"
      height: pillState.height,
      color: pillState.color,
      wire: pillState.wire,
      post: pillState.post,
      podmurowka: pillState.podmurowka === "true",
      option: pillState.option,
      gateCount: Math.max(0, parseInt(fields.gateCount.value, 10) || 0),
      brama: fields.brama.value // "brak" | "dwuskrzydlowa" | "przesuwna"
    };
  }

  function calculate(state) {
    var perMb = PRICING.basePricePerMb[state.panel] || PRICING.basePricePerMb["3d"];
    perMb *= PRICING.heightMultiplier[state.height] || 1;
    perMb *= PRICING.wireMultiplier[state.wire] || 1;
    perMb *= PRICING.postMultiplier[state.post] || 1;
    perMb += PRICING.colorSurchargePerMb[state.color] || 0;
    if (state.podmurowka) perMb += PRICING.podmurowkaPerMb;

    var optionCfg = PRICING.option[state.option] || PRICING.option.montaz;
    perMb += optionCfg.perMb;

    var fenceCost = perMb * state.length;
    var gatesCost = state.gateCount * PRICING.furtkaPrice;
    var bramaCost = PRICING.bramaPrice[state.brama] || 0;
    var deliveryFlat = optionCfg.flatFee;

    var total = fenceCost + gatesCost + bramaCost + deliveryFlat;

    return {
      perMb: perMb,
      total: total,
      state: state
    };
  }

  function round10(n) {
    return Math.round(n / 10) * 10;
  }

  function render(result) {
    var priceRounded = round10(result.total);
    totalEl.textContent = pln.format(priceRounded) + " zł";

    // Krótki puls przy każdej zmianie ceny (poza pierwszym renderem przy wejściu na stronę).
    if (!isFirstRender) {
      totalEl.classList.remove("is-updated");
      void totalEl.offsetWidth; // wymuś reflow, żeby animacja odpaliła się ponownie
      totalEl.classList.add("is-updated");
    }
    isFirstRender = false;

    breakdownEl.textContent =
      pln.format(Math.round(result.perMb)) + " zł/mb · " +
      "panel " + String(result.state.panel).toUpperCase() + " · " +
      result.state.length + " mb · " +
      result.state.height + " cm · drut " + result.state.wire + " mm";

    if (leadPriceHidden) {
      leadPriceHidden.value = pln.format(priceRounded) + " zł";
    }
  }

  function recalculate() {
    render(calculate(readState()));
  }

  // ------------------------------------------------------------------------
  // Pigułki wyboru (wysokość, grubość drutu/słupka, kolor, podmurówka, montaż)
  // ------------------------------------------------------------------------
  pillGroups.forEach(function (group) {
    var field = group.getAttribute("data-field");
    var active = group.querySelector(".calc-pill.is-active");
    pillState[field] = active ? active.getAttribute("data-value") : null;

    group.addEventListener("click", function (e) {
      var btn = e.target.closest(".calc-pill");
      if (!btn || btn.classList.contains("is-active")) return;

      group.querySelectorAll(".calc-pill").forEach(function (p) {
        p.classList.remove("is-active");
        p.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-pressed", "true");
      pillState[field] = btn.getAttribute("data-value");

      trackStart(field);
      recalculate();
    });
  });

  // ------------------------------------------------------------------------
  // Suwak długości ogrodzenia — dwukierunkowa synchronizacja z polem liczbowym
  // ------------------------------------------------------------------------
  function updateSliderFill(slider) {
    var min = parseFloat(slider.min) || 0;
    var max = parseFloat(slider.max) || 100;
    var val = parseFloat(slider.value) || 0;
    var pct = ((val - min) / (max - min)) * 100;
    slider.style.background =
      "linear-gradient(to right, var(--color-cta) 0%, var(--color-cta) " +
      pct + "%, var(--color-border) " + pct + "%, var(--color-border) 100%)";
  }

  if (lengthSlider) {
    updateSliderFill(lengthSlider);

    lengthSlider.addEventListener("input", function () {
      fields.length.value = lengthSlider.value;
      updateSliderFill(lengthSlider);
      trackStart("length");
      recalculate();
    });

    fields.length.addEventListener("input", function () {
      if (fields.length.value === "") return;
      lengthSlider.value = fields.length.value;
      updateSliderFill(lengthSlider);
    });
  }

  // ------------------------------------------------------------------------
  // Zdarzenia: przeliczanie na żywo + calc_start (pole liczbowe + selecty)
  // ------------------------------------------------------------------------
  Object.keys(fields).forEach(function (key) {
    var el = fields[key];
    if (!el) return;
    var evt = el.tagName === "SELECT" ? "change" : "input";
    el.addEventListener(evt, function () {
      trackStart(key);
      recalculate();
    });
  });

  recalculate();

  // ------------------------------------------------------------------------
  // Formularz leada (Netlify Forms, submit przez AJAX żeby zostać na stronie)
  // ------------------------------------------------------------------------
  if (leadForm) {
    leadForm.addEventListener("submit", function (e) {
      e.preventDefault();

      var formData = new FormData(leadForm);
      var priceEstimate = totalEl.textContent;

      if (window.maminoTrack) {
        window.maminoTrack("calc_submit", {
          imie: formData.get("imie"),
          cena_orientacyjna: priceEstimate
        });
      }

      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString()
      })
        .then(function () {
          leadForm.classList.add("is-submitted");
          if (successEl) successEl.classList.add("is-visible");
        })
        .catch(function (err) {
          // eslint-disable-next-line no-console
          console.error("[wycena-form] submit error", err);
          alert("Nie udało się wysłać formularza. Zadzwoń do nas: 518 784 697.");
        });
    });
  }
})();
