/* ==========================================================================
   Noyau : espace de noms FMB, utilitaires partagés par tous les modules.
   Chaque fichier de src/scripts/ est un module indépendant ; le build les
   assemble dans l'ordre alphabétique en un seul fichier.
   ========================================================================== */
var FMB = (function () {
  'use strict';
  var html = document.documentElement;
  // Téléphone : même seuil que la feuille de style 05-mobile.css
  var mobile = window.matchMedia('(max-width: 640px)');
  var cfg = { wa: html.dataset.wa, email: html.dataset.email, phone: html.dataset.phone, root: html.dataset.root || '' };
  var $ = function (sel, el) { return (el || document).querySelector(sel); };
  var $$ = function (sel, el) { return Array.prototype.slice.call((el || document).querySelectorAll(sel)); };

  // Stockage local tolérant aux erreurs (navigation privée, quota…).
  var store = {
    get: function (key, fallback, session) {
      try { var v = (session ? sessionStorage : localStorage).getItem('fmb:' + key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; }
    },
    set: function (key, value, session) {
      try { (session ? sessionStorage : localStorage).setItem('fmb:' + key, JSON.stringify(value)); } catch (e) { /* stockage indisponible */ }
    },
    remove: function (key, session) { try { (session ? sessionStorage : localStorage).removeItem('fmb:' + key); } catch (e) { /* rien */ } }
  };

  function waUrl(text) { return 'https://wa.me/' + cfg.wa + (text ? '?text=' + encodeURIComponent(text) : ''); }
  // Ouvre un lien externe dans un nouvel onglet ; si le navigateur bloque la fenêtre (cas fréquent sur mobile),
  // on bascule dans l'onglet courant : la demande du visiteur n'est jamais perdue.
  function openExternal(url) {
    var w = null;
    try { w = window.open(url, '_blank'); } catch (e) { /* bloqué */ }
    if (w) { try { w.opener = null; } catch (e) { /* rien */ } } else location.href = url;
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

  // Affiche / efface l'erreur d'un champ, avec les attributs ARIA correspondants.
  function setFieldError(field, message) {
    if (!field) return;
    var input = $('input, select, textarea', field), err = $('[data-error]', field);
    field.classList.toggle('has-error', !!message);
    if (err) { err.hidden = !message; err.textContent = message || ''; if (!err.id && input) err.id = input.id + '-err'; }
    if (input) { if (message) { input.setAttribute('aria-invalid', 'true'); if (err) input.setAttribute('aria-describedby', err.id); } else { input.removeAttribute('aria-invalid'); input.removeAttribute('aria-describedby'); } }
  }

  // Journal d'erreurs minimal : point d'entrée unique pour brancher un outil de suivi (Sentry, etc.).
  window.addEventListener('error', function (e) { if (window.console) console.warn('[FMB] erreur', e.message); });

  var modules = [];
  function register(name, init) { modules.push({ name: name, init: init }); }
  function start() {
    modules.forEach(function (m) { try { m.init(); } catch (e) { if (window.console) console.error('[FMB] module ' + m.name, e); } });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else setTimeout(start, 0);

  return { mobile: mobile, cfg: cfg, $: $, $$: $$, store: store, waUrl: waUrl, openExternal: openExternal, toast: toast, todayISO: todayISO, frDate: frDate, digits: digits, clean: clean, setFieldError: setFieldError, register: register };
})();
