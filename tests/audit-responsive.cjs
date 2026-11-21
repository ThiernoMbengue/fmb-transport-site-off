// Audit responsive + accessibilité sur 12 tailles d'écran (du téléphone 320 px à la 4K) × 10 pages :
// débordement horizontal, éléments hors écran, cibles tactiles < 40 px, textes < 12 px, texte coupé, règles WCAG (axe-core).
// Prérequis : npm install · lancer `npm run dev` dans un terminal, puis `npm run audit:responsive` dans un autre.
const { chromium } = require('playwright');
const fs = require('fs');
const axe = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
// Option : SCHEMES=light,dark et VPS=320,390 pour cibler (par défaut : clair seulement, toutes les tailles)
const ONLY = process.env.VPS ? process.env.VPS.split(',').map(Number) : null;
const SCHEMES = (process.env.SCHEMES || 'light').split(',');
const VPS = [[320, 568], [360, 740], [390, 844], [430, 932], [768, 1024], [1024, 768], [1024, 1366], [1280, 800], [1440, 900], [1920, 1080], [2560, 1440], [3840, 2160]];
const PAGES = ['index.html', 'reservation.html?service=aeroport', 'vehicules.html', 'vehicules/renault-qm3-noir.html', 'vehicules/toyota-land-cruiser-prado-2014.html', 'services.html', 'investir.html', 'contact.html', 'mentions-legales.html', 'conditions.html'];
(async () => {
  const b = await chromium.launch(); const issues = {}; const add = (k, v) => { (issues[k] = issues[k] || new Set()).add(v); };
  for (const scheme of SCHEMES) for (const [w, h] of VPS.filter(([w]) => !ONLY || ONLY.includes(w))) {
    const touch = w < 1100;
    const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: touch, isMobile: w < 800, reducedMotion: 'reduce', colorScheme: scheme });
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    for (const url of PAGES) {
      await p.goto('http://localhost:4173/' + url, { waitUntil: 'load' });
      const r = await p.evaluate((touch) => {
        const out = { over: 0, wide: [], small: [], tiny: [], clipped: [], wrapNav: false };
        const de = document.documentElement, vw = de.clientWidth; const Z = parseFloat(getComputedStyle(de).zoom) || 1;
        out.over = de.scrollWidth - vw;
        const vis = (e) => { const s = getComputedStyle(e); if (s.visibility === 'hidden' || s.display === 'none' || +s.opacity === 0) return false; const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
        const hiddenAnc = (e) => { for (let x = e; x; x = x.parentElement) { const s = getComputedStyle(x); if (s.visibility === 'hidden' || s.display === 'none' || +s.opacity === 0) return true; } return false; };
        const label = (e) => (e.className && typeof e.className === 'string' ? e.tagName.toLowerCase() + '.' + e.className.split(' ').slice(0, 2).join('.') : e.tagName.toLowerCase()) + (e.id ? '#' + e.id : '');
        for (const e of document.querySelectorAll('body *')) {
          if (!vis(e) || hiddenAnc(e)) continue; const r = e.getBoundingClientRect();
          if (r.right > vw + 1 || r.left < -1) { if (!e.closest('.booking-tabs, .table-wrap, .gallery-thumbs')) out.wide.push(label(e)); }
        }
        if (touch) for (const e of document.querySelectorAll('a, button, input:not([type=hidden]), select, textarea, summary, label.check')) {
          if (!vis(e) || hiddenAnc(e)) continue; const r = e.getBoundingClientRect();
          const inline = e.tagName === 'A' && e.closest('p, li, .breadcrumb, .footer-bottom, .recap-note, .photo-credit, dd, .contact-list, .cluster') && !e.classList.contains('btn');
          if (inline || e.closest('.vcard-title')) continue; if (e.type === 'radio' || e.type === 'checkbox') continue;
          if (r.height < 40 || r.width < 40) out.small.push(label(e) + ' ' + Math.round(r.width) + '×' + Math.round(r.height));
        }
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        while (walker.nextNode()) { const t = walker.currentNode; if (!t.nodeValue.trim()) continue; const e = t.parentElement; if (!vis(e) || hiddenAnc(e) || e.closest('svg, .sr-only')) continue; const fs = parseFloat(getComputedStyle(e).fontSize); if (fs < 11) out.tiny.push(label(e) + ' ' + fs + 'px'); }
        for (const e of document.querySelectorAll('h1,h2,h3,.btn,.chip,.price,.booking-tab,.kpi strong,dd,label')) { if (!vis(e) || hiddenAnc(e)) continue; if (e.getBoundingClientRect().width <= 1) continue;   // libellé masqué visuellement (lecteurs d'écran)
          if (e.scrollWidth > e.clientWidth + 2 && getComputedStyle(e).overflow !== 'visible') out.clipped.push(label(e)); }
        const nav = document.querySelector('.main-nav ul'); if (nav && vis(nav) && vw > 960) out.wrapNav = nav.getBoundingClientRect().height / Z > 60 || document.querySelector('.site-header .container').getBoundingClientRect().height / Z > 80;
        const btnWrap = [...document.querySelectorAll('.btn')].filter((e) => vis(e) && !hiddenAnc(e) && e.getBoundingClientRect().height / Z > 70).map(label); out.btnWrap = btnWrap;
        return out;
      }, touch);
      const k = `${w}×${h} ${scheme}`;
      if (r.over > 0) add('débordement horizontal', `${k} ${url} (+${r.over}px)`);
      [...new Set(r.wide)].slice(0, 6).forEach((x) => add('élément hors écran', `${k} ${url.split('?')[0]} ${x}`));
      [...new Set(r.small)].forEach((x) => add('cible tactile < 40px', `${x}  [${url.split('?')[0].split('/')[0]}]`));
      [...new Set(r.tiny)].forEach((x) => add('texte < 11px', x));
      [...new Set(r.clipped)].forEach((x) => add('texte coupé', `${k} ${url.split('?')[0]} ${x}`));
      if (r.wrapNav) add('en-tête qui passe sur 2 lignes', k);
      r.btnWrap.forEach((x) => add('bouton sur 2 lignes', `${k} ${url.split('?')[0]} ${x}`));
      if ([320, 390, 1440].includes(w)) {
        await p.evaluate(axe); const res = await p.evaluate(() => axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice'] }));
        for (const v of res.violations) for (const n of v.nodes.slice(0, 3)) add('axe: ' + v.id, n.html.slice(0, 90) + ' — ' + (n.any[0]?.message || n.all[0]?.message || '').slice(0, 110));
      }
    }
    if (errs.length) add('erreurs JS', errs.join('|'));
    await ctx.close();
  }
  await b.close();
  const keys = Object.keys(issues); if (!keys.length) console.log('✔ aucun problème détecté sur ' + VPS.filter(([w]) => !ONLY || ONLY.includes(w)).length + ' tailles × ' + PAGES.length + ' pages × ' + SCHEMES.length + ' thème(s)');
  for (const k of keys) { const v = [...issues[k]]; console.log(`\n■ ${k} (${v.length})`); v.slice(0, 14).forEach((x) => console.log('   ' + x)); }
})();
