/* Formulaires génériques (contact, rendez-vous) : validation accessible puis envoi par WhatsApp ou e-mail.
   Règles déclarées dans le HTML : required, data-min="n", data-phone, data-future, data-msg="message d'erreur". */
FMB.register('forms', function () {
  'use strict';
  var $ = FMB.$, $$ = FMB.$$, clean = FMB.clean;
  $$('[data-wa-form]').forEach(function (form) {
    var tried = false, summary = $('[data-form-summary]', form);
    function check(input) {
      var v = clean(input.value), d = input.dataset;
      if (!input.required && !v) return '';
      if (!v) return d.msg || 'Ce champ est obligatoire.';
      if (d.min && v.length < Number(d.min)) return d.msg;
      if ('phone' in d && FMB.digits(v) < 8) return d.msg;
      if ('future' in d && v < FMB.todayISO()) return d.msg;
      return '';
    }
    function validate() {
      var bad = [];
      $$('[data-field]', form).forEach(function (f) {
        var input = $('input, select, textarea', f), msg = check(input);
        FMB.setFieldError(f, tried ? msg : ''); if (msg) bad.push(input);
      });
      if (summary) { summary.hidden = !(tried && bad.length); $('span', summary).textContent = 'Merci de vérifier les champs signalés (' + bad.length + ').'; }
      return bad;
    }
    form.addEventListener('input', function () { if (tried) validate(); });
    form.addEventListener('submit', function (e) {
      e.preventDefault(); tried = true;
      var bad = validate(); if (bad.length) { bad[0].focus(); return; }
      var lines = $$('[data-label]', form).map(function (i) { var v = clean(i.value); if (i.type === 'date') v = FMB.frDate(v); return v ? i.dataset.label + ' : ' + v : ''; }).filter(Boolean);
      var text = form.dataset.waIntro + '\n\n' + lines.join('\n');
      var canal = (form.elements.canal || {}).value || 'whatsapp';
      var btn = $('[type="submit"]', form); btn.setAttribute('aria-busy', 'true');
      if (canal === 'email') {
        var subject = (form.elements.sujet ? form.elements.sujet.value : 'Demande') + ' — site FMB Transport';
        location.href = 'mailto:' + FMB.cfg.email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(text);
      } else FMB.openExternal(FMB.waUrl(text));
      setTimeout(function () { btn.removeAttribute('aria-busy'); FMB.toast(form.dataset.success || 'Votre demande est prête : envoyez-la depuis WhatsApp.'); }, 600);
    });
  });
});
