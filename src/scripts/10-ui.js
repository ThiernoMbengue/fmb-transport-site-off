/* Interface générale : menu mobile, en-tête, apparitions, bandeau démo, partage, impression. */
FMB.register('ui', function () {
  'use strict';
  var $ = FMB.$, $$ = FMB.$$;

  // En-tête : ombre au défilement
  var header = $('[data-header]');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-stuck', window.scrollY > 8); };
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Menu mobile
  var nav = $('[data-nav]'), toggle = $('[data-nav-toggle]');
  if (nav && toggle) {
    var setOpen = function (open) {
      if (open) nav.style.setProperty('--nav-top', header.getBoundingClientRect().bottom + 'px');
      nav.classList.toggle('is-open', open);
      document.body.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      $('.sr-only', toggle).textContent = open ? 'Fermer le menu' : 'Ouvrir le menu';
    };
    toggle.addEventListener('click', function () { setOpen(!nav.classList.contains('is-open')); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('is-open')) { setOpen(false); toggle.focus(); } });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    window.matchMedia('(min-width: 1081px)').addEventListener('change', function () { setOpen(false); });
  }

  // Bandeau de démonstration (masquable, mémorisé pour la session)
  // (affiché par défaut dans le HTML : aucun décalage de mise en page au chargement)
  var demo = $('[data-demo-bar]');
  if (demo) {
    if (FMB.store.get('demo-hidden', false, true)) demo.hidden = true;
    $('[data-demo-close]', demo).addEventListener('click', function () { demo.hidden = true; FMB.store.set('demo-hidden', true, true); });
  }

  // Apparition douce des blocs situés sous la ligne de flottaison
  var items = $$('[data-reveal]');
  if (items.length && 'IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('reveal-in'); en.target.classList.remove('reveal-pending'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    // Lectures groupées PUIS écritures groupées : un seul calcul de mise en page au lieu d'un par bloc.
    var vh = window.innerHeight;
    var below = items.filter(function (el) { return el.getBoundingClientRect().top > vh * 0.92; });
    below.forEach(function (el, i) { el.style.transitionDelay = (i % 4) * 70 + 'ms'; el.classList.add('reveal-pending'); io.observe(el); });
  }

  // Partage (API native, sinon copie du lien)
  $$('[data-share]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var data = { title: btn.dataset.shareTitle || document.title, url: location.href };
      if (navigator.share) { navigator.share(data).catch(function () {}); return; }
      if (navigator.clipboard) navigator.clipboard.writeText(data.url).then(function () { FMB.toast('Lien copié dans le presse-papiers'); }, function () { FMB.toast('Copiez le lien depuis la barre d’adresse'); });
      else FMB.toast('Copiez le lien depuis la barre d’adresse');
    });
  });
  $$('[data-print]').forEach(function (btn) { btn.addEventListener('click', function () { window.print(); }); });

  // Navigation instantanée — repli pour les navigateurs sans « speculation rules » (Safari, Firefox) :
  // la page de destination est préchargée dès que le visiteur survole ou touche un lien interne.
  if (!(window.HTMLScriptElement && HTMLScriptElement.supports && HTMLScriptElement.supports('speculationrules')) && location.protocol !== 'file:') {
    var done = {}, conn = navigator.connection || {};
    var warm = function (e) {
      var a = e.target.closest && e.target.closest('a[href]');
      if (!a || a.target === '_blank' || a.origin !== location.origin || a.pathname === location.pathname || done[a.href] || conn.saveData) return;
      done[a.href] = 1;
      var l = document.createElement('link'); l.rel = 'prefetch'; l.href = a.href; document.head.appendChild(l);
    };
    document.addEventListener('pointerenter', warm, { capture: true, passive: true });
    document.addEventListener('touchstart', warm, { capture: true, passive: true });
  }

  // Textes d'aide courts sur téléphone (ils ne doivent jamais être coupés)
  var ph = $$('[data-ph-sm]');
  ph.forEach(function (i) { i.dataset.phLg = i.placeholder; });
  var setPh = function () { ph.forEach(function (i) { i.placeholder = FMB.mobile.matches ? i.dataset.phSm : i.dataset.phLg; }); };
  setPh(); FMB.mobile.addEventListener('change', setPh);

  // Barre d'onglets : « Favoris » est l'onglet actif quand on regarde ses favoris
  if (/[?&]favoris=1/.test(location.search)) {
    $$('.tabbar [aria-current]').forEach(function (a) { a.removeAttribute('aria-current'); });
    var fav = $('.tabbar [data-tab="favs"]'); if (fav) fav.setAttribute('aria-current', 'page');
  }

  // Dates : pas de date passée
  var today = FMB.todayISO();
  $$('input[type="date"]').forEach(function (i) { i.min = today; });
});
