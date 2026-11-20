// Gabarit commun à toutes les pages : <head> SEO, en-tête, pied de page, barres d'action.
import { icon, takeSprite } from './icons.mjs';
import { esc, waLink } from './util.mjs';

const NAV = [
  { id: 'home', href: 'index.html', label: 'Réserver' },
  { id: 'vehicles', href: 'vehicules.html', label: 'Véhicules à vendre' },
  { id: 'services', href: 'services.html', label: 'Services' },
  { id: 'invest', href: 'investir.html', label: 'Investir' },
  { id: 'contact', href: 'contact.html', label: 'Contact' }
];

function header(ctx, page) {
  const { site, root } = ctx;
  return `
<a class="skip-link" href="#contenu">Aller au contenu</a>
${site.demoMode ? `<aside class="demo-bar" data-demo-bar aria-label="Information sur cette version"><div class="container"><p><strong>Version de démonstration</strong><span class="demo-long"> — les annonces de vente, leurs prix et les avis clients sont des exemples.</span><span class="demo-short"> · annonces et avis d’exemple</span></p><button type="button" data-demo-close aria-label="Masquer ce message">${icon('x')}</button></div></aside>` : ''}
<header class="site-header" data-header>
  <div class="container">
    <a class="brand" href="${root}index.html">
      <img src="${root}assets/img/logo-96.webp" srcset="${root}assets/img/logo-96.webp 1x, ${root}assets/img/logo-192.webp 2x" width="46" height="46" alt="" decoding="async">
      <span><span class="brand-name">FMB Transport</span><span class="brand-sub">${esc(site.tagline)}</span><span class="sr-only"> — accueil</span></span>
    </a>
    <nav class="main-nav" id="menu" aria-label="Navigation principale" data-nav>
      <ul>
        ${NAV.map((n) => `<li><a href="${root}${n.href}"${page.nav === n.id ? ' aria-current="page"' : ''}>${n.label}</a></li>`).join('\n        ')}
      </ul>
      <div class="nav-extra">
        <a class="btn btn--cta btn--block" href="${root}reservation.html">Réserver un chauffeur</a>
        <a class="btn btn--outline btn--block" href="${root}vehicules.html?favoris=1">${icon('heart')}Mes favoris</a>
        <a class="btn btn--outline btn--block" href="tel:${site.phoneE164}">${icon('phone')}${site.phoneDisplay}</a>
      </div>
    </nav>
    <div class="header-actions">
      <a class="header-phone" href="tel:${site.phoneE164}" aria-label="Appeler le ${site.phoneDisplay}">${icon('phone')}<span>${site.phoneDisplay}</span></a>
      <a class="icon-btn header-fav" href="${root}vehicules.html?favoris=1" aria-label="Mes véhicules favoris">${icon('heart')}<span class="badge-count" data-fav-count hidden>0</span></a>
      <a class="btn btn--cta btn--sm" href="${root}reservation.html">Réserver</a>
      <button class="icon-btn nav-toggle" type="button" aria-expanded="false" aria-controls="menu" data-nav-toggle><span class="sr-only">Ouvrir le menu</span>${icon('menu')}</button>
    </div>
  </div>
</header>`;
}

function footer(ctx) {
  const { site, root } = ctx;
  const a = site.address;
  return `
<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <a class="brand" href="${root}index.html">
          <img src="${root}assets/img/logo-96.webp" width="46" height="46" alt="" loading="lazy">
          <span><span class="brand-name">FMB Transport</span><span class="brand-sub">${esc(site.tagline)}</span></span>
        </a>
        <p>Voitures avec chauffeur à Dakar, transfert aéroport AIBD, location longue durée, vente de véhicules dédouanés et gestion de véhicules.</p>
        <div class="cluster">
          <a class="btn btn--wa btn--sm" href="${waLink(site)}" target="_blank" rel="noopener">${icon('whatsapp')}WhatsApp</a>
          <a class="btn btn--ghost-light btn--sm" href="tel:${site.phoneE164}">${icon('phone')}Appeler</a>
        </div>
      </div>
      <nav aria-label="Transport">
        <h2>Transport</h2>
        <ul>
          <li><a href="${root}reservation.html?service=journee">Chauffeur à la journée</a></li>
          <li><a href="${root}reservation.html?service=duree">Chauffeur plusieurs jours</a></li>
          <li><a href="${root}reservation.html?service=aeroport">Transfert aéroport AIBD</a></li>
          <li><a href="${root}reservation.html?service=longue">Location longue durée</a></li>
          <li><a href="${root}reservation.html?service=ville">Trajet en ville</a></li>
        </ul>
      </nav>
      <nav aria-label="Entreprise">
        <h2>FMB</h2>
        <ul>
          <li><a href="${root}vehicules.html">Véhicules à vendre</a></li>
          <li><a href="${root}services.html">Tous les services</a></li>
          <li><a href="${root}services.html#proprietaires">Confier mon véhicule</a></li>
          <li><a href="${root}investir.html">Investir</a></li>
          <li><a href="${root}index.html#faq">Questions fréquentes</a></li>
        </ul>
      </nav>
      <div>
        <h2>Contact</h2>
        <ul>
          <li><a href="tel:${site.phoneE164}">${site.phoneDisplay}</a></li>
          <li><a href="mailto:${site.email}">${site.email}</a></li>
          <li>${esc(a.locality)}, ${esc(a.street)}</li>
          <li><a href="${root}contact.html">Nous écrire</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© <span data-year>${new Date().getFullYear()}</span> ${esc(site.legalName)} · RC : ${site.rc} · NINEA : ${site.ninea}</span>
      <span class="cluster"><a href="${root}mentions-legales.html">Mentions légales</a><a href="${root}confidentialite.html">Confidentialité</a><a href="${root}conditions.html">Conditions d’utilisation</a></span>
    </div>
  </div>
<nav class="mobile-bar no-print" aria-label="Actions rapides">
    <a href="tel:${site.phoneE164}">${icon('phone')}Appeler</a>
    <a class="is-wa" href="${waLink(site)}" target="_blank" rel="noopener">${icon('whatsapp')}WhatsApp</a>
    <a class="is-cta" href="${root}reservation.html">Réserver</a>
  </nav>
  <a class="wa-float no-print" href="${waLink(site)}" target="_blank" rel="noopener" aria-label="Écrire sur WhatsApp">${icon('whatsapp')}</a>
</footer>
<div class="toasts" role="status" aria-live="polite" data-toasts></div>`;
}

export function breadcrumb(ctx, items, light = false) {
  return `<nav class="breadcrumb${light ? ' breadcrumb--light' : ''}" aria-label="Fil d’Ariane"><ol>
    <li><a href="${ctx.root}index.html">Accueil</a></li>
    ${items.map((it, i) => i === items.length - 1 ? `<li><span aria-current="page">${esc(it.label)}</span></li>` : `<li><a href="${ctx.root}${it.href}">${esc(it.label)}</a></li>`).join('')}
  </ol></nav>`;
}

export function breadcrumbLd(ctx, items) {
  if (!ctx.siteUrl) return null;
  const all = [{ label: 'Accueil', href: '' }, ...items];
  return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: all.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.label, ...(it.href !== undefined ? { item: `${ctx.siteUrl}/${it.href}` } : {}) })) };
}

/** Typographie française : espace insécable avant « : ; ! ? » et à l'intérieur des guillemets,
 *  pour qu'un signe de ponctuation ne se retrouve jamais seul en début de ligne. (Texte visible uniquement.) */
const typo = (html) => html.replace(/>([^<]+)</g, (m, t) => `>${t.replace(/ ([:;!?»])/g, '\u00a0$1').replace(/« /g, '«\u00a0')}<`);

/** Assemble une page complète. `page` = { path, title, description, nav, body, jsonLd[], ogImage, noindex } */
export function layout(ctx, page) {
  const { site, root, siteUrl, assets } = ctx;
  const url = siteUrl ? `${siteUrl}/${page.path === 'index.html' ? '' : page.path}` : '';
  const ogImg = siteUrl ? `${siteUrl}/assets/img/${page.ogImage || 'og-default.jpg'}` : '';
  const ld = (page.jsonLd || []).filter(Boolean);
  const top = header(ctx, page), bottom = footer(ctx);
  const sprite = takeSprite();   // après le rendu de tous les blocs : ne contient que les icônes réellement utilisées
  // Navigation « instantanée » : le navigateur précharge la page dès que le visiteur survole / touche un lien interne.
  const speculation = { prerender: [{ where: { and: [{ href_matches: '/*' }, { not: { href_matches: '/*\\?*' } }, { not: { selector_matches: '[target=_blank]' } }] }, eagerness: 'moderate' }], prefetch: [{ where: { href_matches: '/*' }, eagerness: 'moderate' }] };
  const html = `<!doctype html>
<html lang="fr" data-wa="${site.whatsapp}" data-email="${site.email}" data-phone="${site.phoneDisplay}" data-root="${root}"${site.analytics.enabled ? ` data-analytics-src="${esc(site.analytics.scriptUrl)}" data-analytics-id="${esc(site.analytics.siteId)}"` : ''}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.description)}">
${page.noindex ? '<meta name="robots" content="noindex">' : ''}
${url ? `<link rel="canonical" href="${url}">` : ''}
<meta name="theme-color" content="${site.themeColor}">
<meta name="color-scheme" content="light">
<meta name="format-detection" content="telephone=no">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:locale" content="${site.locale}">
<meta property="og:title" content="${esc(page.title)}">
<meta property="og:description" content="${esc(page.description)}">
${url ? `<meta property="og:url" content="${url}">` : ''}
${ogImg ? `<meta property="og:image" content="${ogImg}">` : ''}
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${root}favicon.ico" sizes="32x32">
<link rel="icon" type="image/png" href="${root}assets/img/icon-192.png">
<link rel="apple-touch-icon" href="${root}assets/img/icon-180.png">
<link rel="manifest" href="${root}manifest.webmanifest">
<link rel="preload" href="${root}assets/fonts/manrope-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${root}assets/fonts/bricolage-grotesque-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${root}assets/css/${assets.css}">
<script src="${root}assets/js/${assets.js}" defer></script>
<script type="speculationrules">${JSON.stringify(speculation)}</script>
${ld.map((o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`).join('\n')}
</head>
<body data-page="${page.id}">
${sprite}
${top}
<main id="contenu">
${page.body}
</main>
${bottom}
</body>
</html>
`;
  return typo(html);
}
