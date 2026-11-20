/* Réservation : module de recherche (accueil) et formulaire complet (page Réservation).
   Les champs visibles dépendent du service choisi (attribut data-for). */
FMB.register('booking', function () {
  'use strict';
  var $ = FMB.$, $$ = FMB.$$, clean = FMB.clean;
  var SERVICES = { journee: 'Chauffeur à la journée', duree: 'Chauffeur sur plusieurs jours', aeroport: 'Transfert aéroport AIBD', longue: 'Location longue durée', ville: 'Trajet en ville' };
  var FIELDS = ['service', 'sens', 'formule', 'depart', 'arrivee', 'date', 'date_fin', 'heure', 'duree', 'mois', 'programme', 'vol', 'passagers', 'vehicule', 'nom', 'telephone', 'precisions'];

  $$('[data-booking]').forEach(function (form) {
    var full = form.dataset.booking === 'full';
    var serviceInput = $('[data-service-input]', form);
    var el = function (name) { return form.elements[name]; };
    var val = function (name) { var e = el(name); if (!e) return ''; if (e.disabled) return ''; return clean(e.value); };
    var service = function () { return SERVICES[serviceInput.value] ? serviceInput.value : 'journee'; };

    function applyService() {
      var s = service();
      $$('[data-for]', form).forEach(function (box) {
        var on = box.dataset.for.split(' ').indexOf(s) !== -1;
        box.hidden = !on;
        $$('input, select, textarea', box).forEach(function (i) { i.disabled = !on; });
      });
      var dep = $('[data-label-depart]', form), dat = $('[data-label-date]', form), sens = el('sens').value;
      if (dep) dep.textContent = s === 'aeroport' ? (sens === 'dakar' ? (full ? 'Adresse de prise en charge à Dakar' : 'Prise en charge à Dakar') : (full ? 'Adresse de dépose à Dakar' : 'Dépose à Dakar')) : (s === 'ville' ? (full ? 'Lieu de départ' : 'Départ') : (full ? 'Lieu de prise en charge' : 'Prise en charge'));
      if (dat) dat.textContent = s === 'duree' ? (full ? 'Date de début' : 'Du') : (s === 'longue' ? (full ? 'Début de la location' : 'Début') : 'Date');
      $$('[data-service]', form).forEach(function (tab) {
        var sel = tab.dataset.service === s;
        tab.setAttribute('aria-selected', String(sel)); tab.tabIndex = sel ? 0 : -1;
        if (sel) { var panel = $('[role="tabpanel"]', form); if (panel) panel.setAttribute('aria-labelledby', tab.id); }
      });
      if (el('date_fin')) el('date_fin').min = el('date').value || FMB.todayISO();
    }

    // Onglets (accueil)
    var tabs = $$('[data-service]', form);
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { serviceInput.value = tab.dataset.service; applyService(); });
      tab.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (!d) return;
        e.preventDefault(); var t = tabs[(i + d + tabs.length) % tabs.length]; t.focus(); t.click();
      });
    });
    form.addEventListener('change', function (e) { if (e.target === serviceInput || e.target.name === 'sens' || e.target.name === 'date') applyService(); });

    if (!full) { applyService(); return; }

    /* ----- Formulaire complet ----- */
    var formBox = $('[data-reserve-form]'), successBox = $('[data-reserve-success]');
    var summary = $('[data-form-summary]', form), tried = false;

    // Pré-remplissage : paramètres d'URL (prioritaires) puis brouillon de la session
    var params = new URLSearchParams(location.search), draft = FMB.store.get('reservation', {}, true) || {};
    var source = {};
    FIELDS.forEach(function (k) { if (params.has(k)) source[k] = params.get(k); else if (draft[k] != null && !params.toString()) source[k] = draft[k]; else if (draft[k] != null && ['nom', 'telephone', 'precisions'].indexOf(k) !== -1) source[k] = draft[k]; });
    Object.keys(source).forEach(function (k) {
      var e = el(k); if (!e) return;
      if (k === 'vehicule') { $$('input[name="vehicule"]', form).forEach(function (r) { r.checked = r.value === source[k]; }); if (!$('input[name="vehicule"]:checked', form)) $('input[name="vehicule"]', form).checked = true; return; }
      if (e.tagName === 'SELECT') { if ($$('option', e).some(function (o) { return o.value === source[k]; })) e.value = source[k]; } else e.value = String(source[k]).slice(0, e.maxLength > 0 ? e.maxLength : 500);
    });
    applyService();

    function chosenVehicle() { return $('input[name="vehicule"]:checked', form); }
    function rows(withContact) {
      var s = service(), r = [], v = chosenVehicle();
      r.push(['Service', SERVICES[s]]);
      if (s === 'aeroport') r.push(['Sens', val('sens') === 'aibd' ? 'AIBD vers Dakar' : 'Dakar vers AIBD']);
      if (s === 'journee') r.push(['Mise à disposition', val('duree')]);
      if (s === 'longue') { r.push(['Durée', val('mois') + ' mois']); r.push(['Formule', val('formule') === 'sans' ? 'Sans chauffeur' : 'Avec chauffeur']); }
      if (val('date')) r.push([s === 'duree' ? 'Du' : (s === 'longue' ? 'Début' : 'Date'), FMB.frDate(val('date'))]);
      if (s === 'duree' && val('date_fin')) {
        var n = Math.round((new Date(val('date_fin')) - new Date(val('date'))) / 864e5) + 1;
        r.push(['Au', FMB.frDate(val('date_fin')) + (n > 0 ? ' (' + n + (n > 1 ? ' jours' : ' jour') + ')' : '')]);
      }
      if (val('heure')) r.push(['Heure', val('heure')]);
      if (val('depart')) r.push([s === 'aeroport' ? (val('sens') === 'aibd' ? 'Dépose à Dakar' : 'Prise en charge à Dakar') : (s === 'ville' ? 'Départ' : 'Prise en charge'), val('depart')]);
      if (val('arrivee')) r.push(['Arrivée', val('arrivee')]);
      if (val('programme')) r.push(['Destination', val('programme')]);
      if (val('vol')) r.push(['Vol', val('vol')]);
      r.push(['Passagers', val('passagers') || '—']);
      r.push(['Véhicule', v && v.value ? v.dataset.name : 'Au choix de FMB']);
      if (withContact) { r.push(['Nom', val('nom')]); r.push(['Téléphone', val('telephone')]); if (val('precisions')) r.push(['Précisions', val('precisions')]); }
      return r;
    }
    function fillList(dl, list) {
      dl.textContent = '';
      list.forEach(function (row) {
        var d = document.createElement('div'), dt = document.createElement('dt'), dd = document.createElement('dd');
        dt.textContent = row[0]; dd.textContent = row[1]; d.appendChild(dt); d.appendChild(dd); dl.appendChild(d);
      });
    }
    function renderRecap() {
      var v = chosenVehicle(), media = $('[data-recap-media]', form);
      fillList($('[data-recap-list]', form), rows(false));
      $('[data-recap-title]', form).textContent = v && v.value ? v.dataset.name : SERVICES[service()];
      $('[data-recap-sub]', form).textContent = v && v.value ? v.dataset.sub : 'Véhicule au choix de FMB';
      media.textContent = '';
      if (v && v.value) { var img = document.createElement('img'); img.src = v.dataset.img; img.alt = v.dataset.name; media.appendChild(img); }
      else { var sp = document.createElement('span'); sp.textContent = 'Véhicule au choix de FMB'; media.appendChild(sp); }
    }
    function validate() {
      var s = service(), errs = {}, today = FMB.todayISO(), pax = Number(val('passagers'));
      if (!val('date')) errs.date = 'Choisissez une date.'; else if (val('date') < today) errs.date = 'La date ne peut pas être dans le passé.';
      if (s === 'duree') { if (!val('date_fin')) errs.date_fin = 'Choisissez une date de fin.'; else if (val('date') && val('date_fin') < val('date')) errs.date_fin = 'La date de fin ne peut pas être avant la date de début.'; }
      if (!(pax >= 1)) errs.passagers = 'Indiquez au moins 1 passager.'; else if (!Number.isInteger(pax)) errs.passagers = 'Indiquez un nombre entier de passagers.'; else if (pax > 30) errs.passagers = 'Au-delà de 30 passagers, contactez-nous directement.';
      if (val('nom').length < 2) errs.nom = 'Indiquez votre nom et prénom.';
      var d = FMB.digits(val('telephone'));
      if (!d) errs.telephone = 'Indiquez votre numéro de téléphone ou WhatsApp.'; else if (d < 8) errs.telephone = 'Numéro trop court : indiquez au moins 8 chiffres.';
      return errs;
    }
    var NAMES = { date: 'la date', date_fin: 'la date de fin', passagers: 'le nombre de passagers', nom: 'votre nom', telephone: 'votre téléphone' };
    function showErrors(errs) {
      ['date', 'date_fin', 'passagers', 'nom', 'telephone'].forEach(function (k) { FMB.setFieldError($('[data-field="' + k + '"]', form), tried ? errs[k] : ''); });
      var keys = Object.keys(errs);
      summary.hidden = !(tried && keys.length);
      if (keys.length) $('span', summary).textContent = 'Merci de corriger : ' + keys.map(function (k) { return NAMES[k]; }).join(', ') + '.';
    }
    function saveDraft() { var d = {}; FIELDS.forEach(function (k) { var e = el(k); if (!e) return; d[k] = k === 'vehicule' ? (chosenVehicle() || {}).value || '' : e.value; }); FMB.store.set('reservation', d, true); }
    function refresh() { renderRecap(); if (tried) showErrors(validate()); saveDraft(); }
    form.addEventListener('input', refresh); form.addEventListener('change', refresh);

    form.addEventListener('submit', function (e) {
      e.preventDefault(); tried = true;
      var errs = validate(); showErrors(errs);
      var first = Object.keys(errs)[0];
      if (first) { var f = el(first); summary.focus(); if (f && f.scrollIntoView) setTimeout(function () { f.focus(); }, 50); return; }
      var all = rows(true);
      var text = 'Bonjour FMB Transport, je souhaite faire une demande de réservation :\n\n' + all.map(function (r) { return r[0] + ' : ' + r[1]; }).join('\n') + '\n\nMerci de me communiquer le tarif et de confirmer la disponibilité.';
      var url = FMB.waUrl(text);
      fillList($('[data-success-list]', successBox), all);
      $('[data-success-wa]', successBox).href = url;
      FMB.openExternal(url);
      formBox.hidden = true; successBox.hidden = false; successBox.focus(); window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    $('[data-success-edit]', successBox).addEventListener('click', function () { successBox.hidden = true; formBox.hidden = false; window.scrollTo({ top: 0 }); });
    $('[data-success-new]', successBox).addEventListener('click', function () { FMB.store.remove('reservation', true); location.href = location.pathname; });
    renderRecap();
  });
});
