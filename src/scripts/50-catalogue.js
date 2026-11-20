/* Catalogue : recherche, filtres, tri, favoris, pagination, synchronisation avec l'URL (lien partageable). */
FMB.register('catalogue', function () {
  'use strict';
  var $ = FMB.$, $$ = FMB.$$;
  var root = $('[data-catalog]'); if (!root) return;
  var form = $('[data-filters]', root), grid = $('[data-grid]', root), cards = $$('[data-vehicle]', grid);
  var countEl = $('[data-count]', root), chipsEl = $('[data-active-chips]', root), emptyEl = $('[data-empty]', root);
  var moreBox = $('[data-more]', root), moreText = $('[data-more-text]', root), sortEl = $('[data-sort]', root);
  var lastOrder = cards.map(function (c, i) { return i; }).join(','), badge = $('[data-filters-badge]', root);
  var PAGE = 12, shown = PAGE, KEYS = ['q', 'marque', 'type', 'budget', 'carburant', 'boite', 'favoris', 'tri'];
  var LABELS = { q: 'Recherche', marque: 'Marque', type: 'Type', budget: 'Budget max.', carburant: 'Carburant', boite: 'Boîte', favoris: 'Favoris' };
  cards.forEach(function (c, i) { c.dataset.index = i; });
  var norm = function (s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); };
  var field = function (k) { return k === 'tri' ? sortEl : form.elements[k]; };
  function state() { var s = {}; KEYS.forEach(function (k) { var e = field(k); s[k] = e.type === 'checkbox' ? (e.checked ? '1' : '') : e.value.trim(); }); return s; }
  function setField(k, v) { var e = field(k); if (e.type === 'checkbox') e.checked = v === '1'; else if (e.tagName !== 'SELECT' || $$('option', e).some(function (o) { return o.value === v; })) e.value = v; }

  function apply(keepPage) {
    var s = state(), favs = FMB.favorites ? FMB.favorites() : [], q = norm(s.q).split(/\s+/).filter(Boolean);
    if (!keepPage) shown = PAGE;
    var match = cards.filter(function (c) {
      var d = c.dataset, name = norm(d.name);
      return q.every(function (w) { return name.indexOf(w) !== -1; }) && (!s.marque || d.make === s.marque) && (!s.type || d.type === s.type) &&
        (!s.budget || Number(d.price) <= Number(s.budget)) && (!s.carburant || d.fuel === s.carburant) && (!s.boite || d.gearbox === s.boite) && (!s.favoris || favs.indexOf(d.ref) !== -1);
    });
    var by = { 'prix-asc': function (a, b) { return a.dataset.price - b.dataset.price; }, 'prix-desc': function (a, b) { return b.dataset.price - a.dataset.price; }, annee: function (a, b) { return b.dataset.year - a.dataset.year; }, km: function (a, b) { return (Number(a.dataset.km) || 1e9) - (Number(b.dataset.km) || 1e9); } }[s.tri];
    match.sort(function (a, b) { return (by ? by(a, b) : 0) || a.dataset.index - b.dataset.index; });
    cards.forEach(function (c) { c.hidden = true; });
    match.forEach(function (c, i) { c.hidden = i >= shown; });
    // On ne réordonne le DOM que si l'ordre change réellement (évite un recalcul inutile au chargement).
    var order = match.map(function (c) { return c.dataset.index; }).join(',');
    if (order !== lastOrder) { lastOrder = order; var frag = document.createDocumentFragment(); match.forEach(function (c) { frag.appendChild(c); }); grid.appendChild(frag); }
    var n = match.length;
    countEl.textContent = n === 0 ? 'Aucun véhicule' : n + (n > 1 ? ' véhicules disponibles' : ' véhicule disponible');
    emptyEl.hidden = n !== 0; grid.hidden = n === 0;
    moreBox.hidden = n <= shown;
    moreText.textContent = Math.min(shown, n) + ' véhicules affichés sur ' + n;
    // Pastilles des filtres actifs
    chipsEl.textContent = '';
    Object.keys(LABELS).forEach(function (k) {
      if (!s[k]) return;
      var e = field(k), text = k === 'favoris' ? 'Mes favoris' : LABELS[k] + ' : ' + (e.tagName === 'SELECT' ? e.options[e.selectedIndex].text : s[k]);
      var b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.textContent = text + '  ✕'; b.setAttribute('aria-label', 'Retirer le filtre ' + text);
      b.addEventListener('click', function () { setField(k, ''); apply(); });
      chipsEl.appendChild(b);
    });
    var active = Object.keys(LABELS).filter(function (k) { return s[k]; }).length;
    if (badge) { badge.textContent = active; badge.hidden = active === 0; }
    // URL partageable
    var p = new URLSearchParams(); KEYS.forEach(function (k) { if (s[k]) p.set(k, s[k]); });
    try { history.replaceState(null, '', location.pathname + (p.toString() ? '?' + p : '')); } catch (e) { /* file:// */ }
    if (ready) { root.classList.add('is-loading'); setTimeout(function () { root.classList.remove('is-loading'); }, 140); }
    ready = true;
  }

  var params = new URLSearchParams(location.search);
  KEYS.forEach(function (k) { if (params.has(k)) setField(k, params.get(k)); });
  var timer, ready = false;
  form.addEventListener('input', function () { clearTimeout(timer); timer = setTimeout(apply, 120); });
  form.addEventListener('submit', function (e) { e.preventDefault(); });
  sortEl.addEventListener('change', function () { apply(); });
  $$('[data-filters-reset]', root).forEach(function (b) { b.addEventListener('click', function (e) { e.preventDefault(); KEYS.forEach(function (k) { setField(k, ''); }); apply(); }); });
  $('[data-more-btn]', root).addEventListener('click', function () { shown += PAGE; apply(true); });
  document.addEventListener('fmb:favoris', function () { if (form.elements.favoris.checked) apply(true); });

  // Panneau de filtres sur mobile
  var opener = $('[data-filters-open]', root);
  function drawer(open) {
    form.classList.toggle('is-open', open); document.body.classList.toggle('nav-open', open);
    if (!open && opener) { opener.focus({ preventScroll: true }); countEl.scrollIntoView({ block: 'start' }); }
  }
  if (opener) opener.addEventListener('click', function () { drawer(true); $('input', form).focus(); });
  $$('[data-filters-close]', root).forEach(function (b) { b.addEventListener('click', function () { drawer(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && form.classList.contains('is-open')) drawer(false); });
  apply();
});
