/* Consentement & mesure d'audience.
   Inactif par défaut. Pour l'activer : src/config/site.json → "analytics": { "enabled": true, "scriptUrl": "…", "siteId": "…" }
   Le script de mesure n'est chargé qu'APRÈS accord explicite du visiteur (RGPD / loi sénégalaise 2008-12). */
FMB.register('consent', function () {
  'use strict';
  var html = document.documentElement, src = html.dataset.analyticsSrc;
  if (!src) return;
  function load() { var s = document.createElement('script'); s.defer = true; s.src = src; s.dataset.domain = html.dataset.analyticsId || ''; document.head.appendChild(s); }
  var choice = FMB.store.get('consentement', null);
  if (choice === 'oui') { load(); return; }
  if (choice === 'non') return;
  var box = document.createElement('div'); box.className = 'consent'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', 'Mesure d’audience');
  box.innerHTML = '<h2>Mesure d’audience</h2><p>Avec votre accord, nous mesurons la fréquentation du site de façon anonyme pour l’améliorer. Aucune publicité, aucune revente de données.</p><div class="cluster"><button class="btn btn--cta btn--sm" type="button" data-c="oui">Accepter</button><button class="btn btn--outline btn--sm" type="button" data-c="non">Refuser</button><a href="' + FMB.cfg.root + 'confidentialite.html">En savoir plus</a></div>';
  box.addEventListener('click', function (e) { var c = e.target.dataset && e.target.dataset.c; if (!c) return; FMB.store.set('consentement', c); box.remove(); if (c === 'oui') load(); });
  document.body.appendChild(box);
});
