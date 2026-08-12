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
    // bez podmurówki, bez dodatków.
    basePricePerMb: 38, // zł/mb // TODO: podtwierdzić w kliencie

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

    // Dopłata do mb za podmurówkę betonową.
    podmurowkaPerMb: 25, // zł/mb // TODO: podtwierdzić w kliencie

    // Cena za sztukę furtki.
    furtkaPrice: 350, // zł/szt. // TODO: podtwierdzić w kliencie

    // Cena za sztukę bramy, w zależności od typu.
    bramaPrice: {
      dwuskrzydlowa: 1800, // zł/szt. // TODO: podtwierdzić w kliencie
      przesuwna: 2600      // zł/szt. // TODO: podtwierdzić w kliencie
    },

    // Dostawa / montaż / odbiór własny.
    option: {
      montaz: { label: "Dostawa + montaż", flatFee: 0, perMb: 15 },   // TODO: podtwierdzić w kliencie
      dostawa: { label: "Tylko dostawa", flatFee: 200, perMb: 0 },     // TODO: podtwierdzić w kliencie
      odbior: { label: "Odbiór własny", flatFee: 0, perMb: 0 }
    },

    // Widełki „ceny orientacyjnej” pokazywane użytkownikowi (± od wyliczonej sumy).
    estimateRangeMin: 0.95,
    estimateRangeMax: 1.1
  };

  // ------------------------------------------------------------------------
  // DOM references
  // ------------------------------------------------------------------------
  var form = document.getElementById("calc-form");
  if (!form) return;

  var fields = {
    length: document.getElementById("calc-length"),
    height: document.getElementById("calc-height"),
    color: document.getElementById("calc-color"),
    wire: document.getElementById("calc-wire"),
    post: document.getElementById("calc-post"),
    gateCount: document.getElementById("calc-gate-count"),
    option: document.getElementById("calc-option"),
    bramaCount: document.getElementById("calc-brama-count"),
    bramaType: document.getElementById("calc-brama-type"),
    podmurowka: document.getElementById("calc-podmurowka")
  };

  var totalEl = document.getElementById("calc-total");
  var breakdownEl = document.getElementById("calc-breakdown");
  var leadForm = document.getElementById("wycena-form");
  var leadPriceHidden = document.getElementById("wycena-cena-hidden");
  var successEl = document.getElementById("wycena-success");

  var pln = new Intl.NumberFormat("pl-PL", { maximumFractionDigits: 0 });
  var hasTrackedStart = false;
  var isFirstRender = true;

  // ------------------------------------------------------------------------
  // Logika obliczeń
  // ------------------------------------------------------------------------
  function readState() {
    return {
      length: Math.max(0, parseFloat(fields.length.value) || 0),
      height: fields.height.value,
      color: fields.color.value,
      wire: fields.wire.value,
      post: fields.post.value,
      gateCount: Math.max(0, parseInt(fields.gateCount.value, 10) || 0),
      option: fields.option.value,
      bramaCount: Math.max(0, parseInt(fields.bramaCount.value, 10) || 0),
      bramaType: fields.bramaType.value,
      podmurowka: !!fields.podmurowka.checked
    };
  }

  function calculate(state) {
    var perMb = PRICING.basePricePerMb;
    perMb *= PRICING.heightMultiplier[state.height] || 1;
    perMb *= PRICING.wireMultiplier[state.wire] || 1;
    perMb *= PRICING.postMultiplier[state.post] || 1;
    perMb += PRICING.colorSurchargePerMb[state.color] || 0;
    if (state.podmurowka) perMb += PRICING.podmurowkaPerMb;

    var optionCfg = PRICING.option[state.option] || PRICING.option.montaz;
    perMb += optionCfg.perMb;

    var fenceCost = perMb * state.length;
    var gatesCost = state.gateCount * PRICING.furtkaPrice;
    var bramaUnitPrice = PRICING.bramaPrice[state.bramaType] || 0;
    var bramaCost = state.bramaCount * bramaUnitPrice;
    var deliveryFlat = optionCfg.flatFee;

    var total = fenceCost + gatesCost + bramaCost + deliveryFlat;

    return {
      perMb: perMb,
      fenceCost: fenceCost,
      gatesCost: gatesCost,
      bramaCost: bramaCost,
      deliveryFlat: deliveryFlat,
      total: total,
      min: total * PRICING.estimateRangeMin,
      max: total * PRICING.estimateRangeMax
    };
  }

  function round10(n) {
    return Math.round(n / 10) * 10;
  }

  function render(result) {
    totalEl.textContent = pln.format(round10(result.min)) + "–" + pln.format(round10(result.max)) + " zł";

    // Krótki puls przy każdej zmianie ceny (poza pierwszym renderem przy wejściu na stronę).
    if (!isFirstRender) {
      totalEl.classList.remove("is-updated");
      void totalEl.offsetWidth; // wymuś reflow, żeby animacja odpaliła się ponownie
      totalEl.classList.add("is-updated");
    }
    isFirstRender = false;

    var rows = [
      ["Ogrodzenie (panele + montaż słupków)", result.fenceCost],
      ["Furtki", result.gatesCost],
      ["Brama", result.bramaCost],
      ["Dostawa", result.deliveryFlat]
    ];

    breakdownEl.innerHTML = rows
      .map(function (row) {
        return "<li><span>" + row[0] + "</span><span>" + pln.format(round10(row[1])) + " zł</span></li>";
      })
      .join("");

    if (leadPriceHidden) {
      leadPriceHidden.value = pln.format(round10(result.min)) + "-" + pln.format(round10(result.max)) + " zł";
    }
  }

  function recalculate() {
    render(calculate(readState()));
  }

  // ------------------------------------------------------------------------
  // Zdarzenia: przeliczanie na żywo + calc_start
  // ------------------------------------------------------------------------
  Object.keys(fields).forEach(function (key) {
    var el = fields[key];
    if (!el) return;
    var evt = el.tagName === "SELECT" || el.type === "checkbox" ? "change" : "input";
    el.addEventListener(evt, function () {
      if (!hasTrackedStart && window.maminoTrack) {
        window.maminoTrack("calc_start", { field: key });
        hasTrackedStart = true;
      }
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
