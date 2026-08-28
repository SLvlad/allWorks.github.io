/* ============================================================
   HR WORK recruiter landing — page logic.
   Vanilla JS, no dependencies, no build step.
     1. ROI calculator (sliders → live payout figures)
     2. Application form submit via Netlify Forms (AJAX, keeps
        the inline "thank you" and uploads the optional CV file)
   ============================================================ */
(function () {
  function init() {
    var $ = function (id) { return document.getElementById(id); };

    /* ---- 1. ROI calculator ------------------------------------------ */
    if ($('cand') && $('rate') && $('mon')) {
      var zl = function (n) {
        // group thousands with a thin space: 16200 -> "16 200 zł"
        return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' zł';
      };
      var calc = function () {
        var c = +$('cand').value, r = +$('rate').value, m = +$('mon').value;
        $('outCand').textContent = c;
        $('outRate').textContent = zl(r);
        $('outMon').textContent = m;
        $('outMonth').textContent = zl(c * r);
        $('outTotal').textContent = zl(c * r * m);
        $('outYear').textContent = zl(c * r * 12);
      };
      ['cand', 'rate', 'mon'].forEach(function (id) {
        $(id).addEventListener('input', calc);
      });
      calc();
    }

    /* ---- 2. Application form (Netlify Forms) ------------------------- */
    var form = $('form');
    if (!form) return;

    var showSent = function () {
      var fields = form.querySelector('.fields');
      var btn = form.querySelector('button[type=submit]');
      var err = $('form-error');
      if (fields) fields.style.display = 'none';
      if (btn) btn.style.display = 'none';
      if (err) err.style.display = 'none';
      if ($('sent')) $('sent').style.display = 'block';
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Custom validation flow (form carries `novalidate`): focus the first
      // invalid field instead of relying on the native bubble.
      if (!form.checkValidity()) {
        var firstInvalid = form.querySelectorAll(':invalid')[0];
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      var btn = form.querySelector('button[type=submit]');
      var err = $('form-error');
      if (err) err.style.display = 'none';
      if (btn) { btn.disabled = true; btn.textContent = 'Надсилаємо…'; }

      // Netlify Forms: POST the multipart form body (incl. the CV file and the
      // hidden `form-name`) back to the page path. Do NOT set Content-Type —
      // the browser adds the multipart boundary itself.
      fetch(form.getAttribute('action') || '/', {
        method: 'POST',
        body: new FormData(form)
      })
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          showSent();
        })
        .catch(function (error) {
          console.error('Form submit failed:', error);
          if (btn) { btn.disabled = false; btn.textContent = 'Надіслати заявку'; }
          if (err) err.style.display = 'block';
        });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
