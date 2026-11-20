/* Favoris : enregistrés sur l'appareil du visiteur (localStorage), aucun compte nécessaire. */
FMB.register('favorites', function () {
  'use strict';
  var $$ = FMB.$$;
  var get = function () { return FMB.store.get('favoris', []); };
  function render() {
    var favs = get();
    $$('[data-fav]').forEach(function (b) {
      var on = favs.indexOf(b.dataset.fav) !== -1;
      b.setAttribute('aria-pressed', String(on));
      if (b.hasAttribute('data-fav-labelled')) { var s = b.querySelector('span'); if (s) s.textContent = on ? 'Enregistré' : 'Favori'; }
    });
    $$('[data-fav-count]').forEach(function (c) { c.textContent = favs.length; c.hidden = favs.length === 0; });
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-fav]'); if (!b) return;
    e.preventDefault();
    var favs = get(), ref = b.dataset.fav, i = favs.indexOf(ref);
    if (i === -1) { favs.push(ref); FMB.toast('Véhicule ajouté à vos favoris'); } else { favs.splice(i, 1); FMB.toast('Véhicule retiré de vos favoris'); }
    FMB.store.set('favoris', favs); render();
    document.dispatchEvent(new CustomEvent('fmb:favoris'));
  });
  window.addEventListener('storage', render);
  FMB.favorites = get;
  render();
});
