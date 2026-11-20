/* Galerie photo : miniatures, flèches, clavier, balayage tactile, agrandissement plein écran. */
FMB.register('gallery', function () {
  'use strict';
  var $ = FMB.$, $$ = FMB.$$;
  var lightbox;
  function openLightbox(src, alt) {
    if (!lightbox) {
      lightbox = document.createElement('dialog'); lightbox.className = 'lightbox';
      lightbox.innerHTML = '<div class="lightbox-inner"><img alt=""></div><button class="icon-btn lightbox-close" type="button" aria-label="Fermer"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg></button>';
      document.body.appendChild(lightbox);
      lightbox.addEventListener('click', function () { lightbox.close(); });
    }
    var img = $('img', lightbox); img.src = src; img.alt = alt;
    if (lightbox.showModal) lightbox.showModal(); else window.open(src, '_blank');
  }
  $$('[data-gallery]').forEach(function (g) {
    var main = $('[data-gallery-main]', g), thumbs = $$('[data-gallery-thumb]', g);
    var avif = main.parentNode.querySelector('source[type="image/avif"]'), zoom = $('[data-gallery-zoom]', g);
    var label = $('[data-gallery-label]', g), counter = $('[data-gallery-counter]', g), idx = 0, n = thumbs.length;
    function show(i) {
      if (!n) return;
      idx = (i % n + n) % n; var t = thumbs[idx];
      if (avif && t.dataset.srcsetAvif) avif.srcset = t.dataset.srcsetAvif;
      main.srcset = t.dataset.srcset; main.src = t.dataset.src; main.alt = t.dataset.alt;
      if (zoom) zoom.dataset.full = t.dataset.full;
      if (label) label.textContent = t.dataset.label;
      if (counter) counter.textContent = (idx + 1) + ' / ' + n;
      thumbs.forEach(function (b, j) { if (j === idx) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
    }
    thumbs.forEach(function (b, i) { b.addEventListener('click', function () { show(i); }); });
    var prev = $('[data-gallery-prev]', g), next = $('[data-gallery-next]', g);
    if (prev) prev.addEventListener('click', function () { show(idx - 1); });
    if (next) next.addEventListener('click', function () { show(idx + 1); });
    g.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') show(idx - 1); if (e.key === 'ArrowRight') show(idx + 1); });
    var x0 = null, stage = $('.gallery-stage', g);
    stage.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend', function (e) { if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0; x0 = null; if (dx < -40) show(idx + 1); else if (dx > 40) show(idx - 1); });
    if (zoom) zoom.addEventListener('click', function () { openLightbox(zoom.dataset.full || main.currentSrc || main.src, main.alt); });
  });
});
