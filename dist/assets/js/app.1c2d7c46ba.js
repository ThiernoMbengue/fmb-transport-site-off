var FMB = (function () {
'use strict';
var html = document.documentElement;
var mobile = window.matchMedia('(max-width: 720px)');
var cfg = { wa: html.dataset.wa, email: html.dataset.email, phone: html.dataset.phone, root: html.dataset.root || '' };
var $ = function (sel, el) { return (el || document).querySelector(sel); };
var $$ = function (sel, el) { return Array.prototype.slice.call((el || document).querySelectorAll(sel)); };
var store = {
get: function (key, fallback, session) {
try { var v = (session ? sessionStorage : localStorage).getItem('fmb:' + key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; }
},
set: function (key, value, session) {
try { (session ? sessionStorage : localStorage).setItem('fmb:' + key, JSON.stringify(value)); } catch (e) {  }
},
remove: function (key, session) { try { (session ? sessionStorage : localStorage).removeItem('fmb:' + key); } catch (e) {  } }
};
function waUrl(text) { return 'https://wa.me/' + cfg.wa + (text ? '?text=' + encodeURIComponent(text) : ''); }
function openExternal(url) {
var w = null;
try { w = window.open(url, '_blank'); } catch (e) {  }
if (w) { try { w.opener = null; } catch (e) {  } } else location.href = url;
}
function toast(message) {
var box = $('[data-toasts]'); if (!box) return;
var t = document.createElement('div'); t.className = 'toast';
t.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>';
var s = document.createElement('span'); s.textContent = message; t.appendChild(s);
box.appendChild(t);
setTimeout(function () { t.classList.add('is-out'); setTimeout(function () { t.remove(); }, 300); }, 3200);
}
function todayISO() { var d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
function frDate(iso) { var p = String(iso || '').split('-'); return p.length === 3 ? p[2] + '/' + p[1] + '/' + p[0] : ''; }
function digits(s) { return (String(s).match(/\d/g) || []).length; }
function clean(s) { return String(s == null ? '' : s).replace(/\s+/g, ' ').trim(); }
function setFieldError(field, message) {
if (!field) return;
var input = $('input, select, textarea', field), err = $('[data-error]', field);
field.classList.toggle('has-error', !!message);
if (err) { err.hidden = !message; err.textContent = message || ''; if (!err.id && input) err.id = input.id + '-err'; }
if (input) { if (message) { input.setAttribute('aria-invalid', 'true'); if (err) input.setAttribute('aria-describedby', err.id); } else { input.removeAttribute('aria-invalid'); input.removeAttribute('aria-describedby'); } }
}
window.addEventListener('error', function (e) { if (window.console) console.warn('[FMB] erreur', e.message); });
var modules = [];
function register(name, init) { modules.push({ name: name, init: init }); }
function start() {
modules.forEach(function (m) { try { m.init(); } catch (e) { if (window.console) console.error('[FMB] module ' + m.name, e); } });
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else setTimeout(start, 0);
return { mobile: mobile, cfg: cfg, $: $, $$: $$, store: store, waUrl: waUrl, openExternal: openExternal, toast: toast, todayISO: todayISO, frDate: frDate, digits: digits, clean: clean, setFieldError: setFieldError, register: register };
})();
FMB.register('ui', function () {
'use strict';
var $ = FMB.$, $$ = FMB.$$;
var header = $('[data-header]');
if (header) {
var onScroll = function () { header.classList.toggle('is-stuck', window.scrollY > 8); };
onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
}
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
window.matchMedia('(min-width: 901px)').addEventListener('change', function () { setOpen(false); });
}
var demo = $('[data-demo-bar]');
if (demo) {
if (FMB.store.get('demo-hidden', false, true)) demo.hidden = true;
$('[data-demo-close]', demo).addEventListener('click', function () { demo.hidden = true; FMB.store.set('demo-hidden', true, true); });
}
var items = $$('[data-reveal]');
if (items.length && 'IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
var io = new IntersectionObserver(function (entries) {
entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('reveal-in'); en.target.classList.remove('reveal-pending'); io.unobserve(en.target); } });
}, { rootMargin: '0px 0px -8% 0px' });
var vh = window.innerHeight;
var below = items.filter(function (el) { return el.getBoundingClientRect().top > vh * 0.92; });
below.forEach(function (el, i) { el.style.transitionDelay = (i % 4) * 70 + 'ms'; el.classList.add('reveal-pending'); io.observe(el); });
}
$$('[data-share]').forEach(function (btn) {
btn.addEventListener('click', function () {
var data = { title: btn.dataset.shareTitle || document.title, url: location.href };
if (navigator.share) { navigator.share(data).catch(function () {}); return; }
if (navigator.clipboard) navigator.clipboard.writeText(data.url).then(function () { FMB.toast('Lien copié dans le presse-papiers'); }, function () { FMB.toast('Copiez le lien depuis la barre d’adresse'); });
else FMB.toast('Copiez le lien depuis la barre d’adresse');
});
});
$$('[data-print]').forEach(function (btn) { btn.addEventListener('click', function () { window.print(); }); });
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
var ph = $$('[data-ph-sm]');
ph.forEach(function (i) { i.dataset.phLg = i.placeholder; });
var setPh = function () { ph.forEach(function (i) { i.placeholder = FMB.mobile.matches ? i.dataset.phSm : i.dataset.phLg; }); };
setPh(); FMB.mobile.addEventListener('change', setPh);
if (/[?&]favoris=1/.test(location.search)) {
$$('.tabbar [aria-current]').forEach(function (a) { a.removeAttribute('aria-current'); });
var fav = $('.tabbar [data-tab="favs"]'); if (fav) fav.setAttribute('aria-current', 'page');
}
var today = FMB.todayISO();
$$('input[type="date"]').forEach(function (i) { i.min = today; });
});
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
var inRow = function () { return FMB.mobile.matches && g.closest('.fleet'); };
stage.addEventListener('touchstart', function (e) { x0 = inRow() ? null : e.touches[0].clientX; }, { passive: true });
stage.addEventListener('touchend', function (e) { if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0; x0 = null; if (dx < -40) show(idx + 1); else if (dx > 40) show(idx - 1); });
if (zoom) zoom.addEventListener('click', function () { openLightbox(zoom.dataset.full || main.currentSrc || main.src, main.alt); });
});
});
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
var formBox = $('[data-reserve-form]'), successBox = $('[data-reserve-success]');
var summary = $('[data-form-summary]', form), tried = false;
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
FMB.register('catalogue', function () {
'use strict';
var $ = FMB.$, $$ = FMB.$$;
var root = $('[data-catalog]'); if (!root) return;
var form = $('[data-filters]', root), grid = $('[data-grid]', root), cards = $$('[data-vehicle]', grid);
var countEl = $('[data-count]', root), chipsEl = $('[data-active-chips]', root), emptyEl = $('[data-empty]', root);
var moreBox = $('[data-more]', root), moreText = $('[data-more-text]', root), sortEl = $('[data-sort]', root);
var lastOrder = cards.map(function (c, i) { return i; }).join(','), badge = $('[data-filters-badge]', root);
var PAGE = FMB.mobile.matches ? 10 : 12, shown = PAGE, KEYS = ['q', 'marque', 'type', 'budget', 'carburant', 'boite', 'favoris', 'tri'];
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
var order = match.map(function (c) { return c.dataset.index; }).join(',');
if (order !== lastOrder) { lastOrder = order; var frag = document.createDocumentFragment(); match.forEach(function (c) { frag.appendChild(c); }); grid.appendChild(frag); }
var n = match.length;
countEl.textContent = n === 0 ? 'Aucun véhicule' : n + (n > 1 ? ' véhicules disponibles' : ' véhicule disponible');
emptyEl.hidden = n !== 0; grid.hidden = n === 0;
moreBox.hidden = n <= shown;
moreText.textContent = Math.min(shown, n) + ' véhicules affichés sur ' + n;
$$('[data-more-left]', root).forEach(function (el) { el.textContent = Math.max(0, n - shown); });
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
var p = new URLSearchParams(); KEYS.forEach(function (k) { if (s[k]) p.set(k, s[k]); });
try { history.replaceState(null, '', location.pathname + (p.toString() ? '?' + p : '')); } catch (e) {  }
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
var opener = $('[data-filters-open]', root);
var backdrop = null, sheetMode = window.matchMedia('(max-width: 960px)');   // filtres en panneau sous 960 px
function drawer(open) {
form.classList.toggle('is-open', open); document.body.classList.toggle('nav-open', open);
if (open && sheetMode.matches && !backdrop) { backdrop = document.createElement('div'); backdrop.className = 'sheet-backdrop'; backdrop.addEventListener('click', function () { drawer(false); }); document.body.appendChild(backdrop); }
if (!open && backdrop) { backdrop.parentNode.removeChild(backdrop); backdrop = null; }
if (!open && opener) { opener.focus({ preventScroll: true }); countEl.scrollIntoView({ block: 'start' }); }
}
if (opener) opener.addEventListener('click', function () { drawer(true); if (!sheetMode.matches) $('input', form).focus(); else $('[data-filters-close]', form).focus({ preventScroll: true }); });
$$('[data-filters-close]', root).forEach(function (b) { b.addEventListener('click', function () { drawer(false); }); });
document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && form.classList.contains('is-open')) drawer(false); });
apply();
});
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