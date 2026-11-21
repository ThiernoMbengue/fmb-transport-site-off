/* Panneau qui monte du bas de l'écran (téléphone uniquement).
   FMB.sheet.open(contenu, idDuTitre) : ouvre un panneau pleine largeur, coins arrondis en haut,
   qui se ferme par le bouton ×, la touche Échap, un toucher sur le voile ou un glissement vers le bas.
   Utilisé pour la fiche rapide des véhicules : sur téléphone, toucher une carte ouvre ce panneau
   au lieu de quitter la liste (la fiche complète reste à un toucher). */
FMB.register('sheet', function () {
  'use strict';
  var $ = FMB.$;
  var dlg = null, scroller = null, lastFocus = null, closing = false;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  function build() {
    dlg = document.createElement('dialog');
    dlg.className = 'sheet';
    dlg.innerHTML = '<span class="sheet-handle" aria-hidden="true"></span>' +
      '<button class="icon-btn sheet-close" type="button" aria-label="Fermer"><svg class="i" aria-hidden="true" focusable="false"><use href="#i-x"/></svg></button>' +
      '<div class="sheet-scroll"></div>';
    scroller = $('.sheet-scroll', dlg);
    document.body.appendChild(dlg);
    $('.sheet-close', dlg).addEventListener('click', close);
    dlg.addEventListener('cancel', function (e) { e.preventDefault(); close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) close(); });   // toucher sur le voile
    // Glisser vers le bas pour fermer (depuis le haut du panneau)
    var y0 = null, dy = 0;
    dlg.addEventListener('touchstart', function (e) { y0 = scroller.scrollTop <= 0 ? e.touches[0].clientY : null; dy = 0; }, { passive: true });
    dlg.addEventListener('touchmove', function (e) {
      if (y0 === null) return;
      dy = Math.max(0, e.touches[0].clientY - y0);
      if (dy > 0) { dlg.style.transition = 'none'; dlg.style.transform = 'translateY(' + dy + 'px)'; }
    }, { passive: true });
    dlg.addEventListener('touchend', function () {
      if (y0 === null) return;
      dlg.style.transition = ''; dlg.style.transform = '';
      if (dy > 90) close();
      y0 = null;
    });
    // Passage en affichage large pendant que le panneau est ouvert : on le ferme
    FMB.mobile.addEventListener('change', function () { if (dlg.open && !FMB.mobile.matches) close(); });
  }

  function open(content, labelId) {
    if (!dlg) build();
    lastFocus = document.activeElement;
    scroller.textContent = '';
    scroller.appendChild(content);
    scroller.scrollTop = 0;
    if (labelId) dlg.setAttribute('aria-labelledby', labelId);
    closing = false;
    dlg.classList.remove('is-in');
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
    document.documentElement.classList.add('sheet-open');
    requestAnimationFrame(function () { requestAnimationFrame(function () { dlg.classList.add('is-in'); }); });
  }

  function close() {
    if (!dlg || !dlg.open || closing) return;
    closing = true;
    dlg.classList.remove('is-in');
    var done = function () {
      if (dlg.close) dlg.close(); else dlg.removeAttribute('open');
      document.documentElement.classList.remove('sheet-open');
      closing = false;
      if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    };
    if (reduce.matches) done(); else setTimeout(done, 300);
  }

  FMB.sheet = { open: open, close: close };

  /* ----- Fiche rapide d'un véhicule ----- */
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; return e; }
  function quickView(card) {
    var name = $('.vcard-title a', card).textContent.trim();
    var frag = document.createDocumentFragment();
    var media = el('div', 'sheet-media');
    var pic = $('.vcard-media picture', card);
    if (pic) {
      var copy = pic.cloneNode(true);
      [].forEach.call(copy.querySelectorAll('source, img'), function (n) { n.setAttribute('sizes', '100vw'); });
      var img = copy.querySelector('img'); img.removeAttribute('loading'); img.alt = name;
      media.appendChild(copy);
    }
    frag.appendChild(media);
    var head = el('div');
    var h = el('h2', '', name); h.id = 'sheet-title'; head.appendChild(h);
    var sub = $('.vcard-meta .lg', card) || $('.vcard-meta', card);
    head.appendChild(el('p', 'vcard-meta', sub.textContent.trim()));
    frag.appendChild(head);
    var specs = $('.vcard-specs', card);
    if (specs) { var list = specs.cloneNode(true); list.hidden = false; frag.appendChild(list); }
    var price = el('div', 'sheet-price');
    price.appendChild($('.price', card).cloneNode(true));
    price.appendChild(el('span', '', 'Dédouané · tout compris'));
    frag.appendChild(price);
    var actions = el('div', 'sheet-actions');
    var wa = el('a', 'btn btn--wa'); wa.href = card.dataset.wa; wa.target = '_blank'; wa.rel = 'noopener';
    wa.innerHTML = '<svg class="i" aria-hidden="true" focusable="false"><use href="#i-whatsapp"/></svg>'; wa.appendChild(document.createTextNode('Demander'));
    var more = el('a', 'btn btn--secondary', 'Fiche complète'); more.href = card.dataset.href;
    actions.appendChild(wa); actions.appendChild(more);
    frag.appendChild(actions);
    open(frag, 'sheet-title');
  }

  document.addEventListener('click', function (e) {
    if (!FMB.mobile.matches || e.defaultPrevented || e.button) return;
    var link = e.target.closest && e.target.closest('.vcard[data-vehicle] .vcard-title a, .vcard[data-vehicle] [data-quick]');
    if (!link || e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    quickView(link.closest('.vcard'));
  });
});
