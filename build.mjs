#!/usr/bin/env node
/**
 * Générateur du site FMB Transport — aucune dépendance (Node ≥ 18).
 *   node build.mjs            → construit le site dans dist/
 *   SITE_URL=https://… node build.mjs   → idem, avec URL canoniques + sitemap.xml
 * Sur Netlify, l'URL du site (variable URL) est détectée automatiquement.
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync, cpSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { layout } from './src/components/layout.mjs';
import home from './src/pages/home.mjs';
import reservation from './src/pages/reservation.mjs';
import { catalogue, vehiclePage } from './src/pages/vehicles.mjs';
import services from './src/pages/services.mjs';
import invest from './src/pages/invest.mjs';
import contact from './src/pages/contact.mjs';
import { mentions, privacy, terms } from './src/pages/legal.mjs';
import notfound from './src/pages/notfound.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const SRC = join(ROOT, 'src'), DIST = join(ROOT, 'dist');
const json = (p) => JSON.parse(readFileSync(join(SRC, p), 'utf8'));
const write = (p, content) => { const f = join(DIST, p); mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, content); };
const bundle = (dir, ext) => readdirSync(join(SRC, dir)).filter((f) => f.endsWith(ext)).sort().map((f) => readFileSync(join(SRC, dir, f), 'utf8')).join('\n');
const hash = (s) => createHash('sha256').update(s).digest('hex').slice(0, 10);
// Minification légère et sûre (commentaires + espaces) — suffisant sans outil externe.
const minCss = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([{};,>])\s*/g, '$1').replace(/;}/g, '}').trim();
const minJs = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').split('\n').map((l) => l.replace(/^\s+/, '').replace(/^\/\/.*$/, '')).filter(Boolean).join('\n');

// 1. Données et configuration
const site = json('config/site.json');
const siteUrl = (process.env.SITE_URL || process.env.URL || site.siteUrl || '').replace(/\/$/, '');
const data = {
  vehicles: json('data/vehicles.json'), fleet: json('data/fleet.json'), services: json('data/services.json'),
  reviews: json('data/reviews.json'), faq: json('data/faq.json'), dashboard: json('data/dashboard.json'), credits: json('data/photo-credits.json')
};
const images = json('data/images.json');

// 2. Dossier de sortie + fichiers statiques
rmSync(DIST, { recursive: true, force: true });
mkdirSync(join(DIST, 'assets/css'), { recursive: true });
mkdirSync(join(DIST, 'assets/js'), { recursive: true });
cpSync(join(SRC, 'static/img'), join(DIST, 'assets/img'), { recursive: true });
cpSync(join(SRC, 'static/fonts'), join(DIST, 'assets/fonts'), { recursive: true });
cpSync(join(SRC, 'static/favicon.ico'), join(DIST, 'favicon.ico'));

// 3. CSS et JS : un seul fichier chacun, nommé d'après son contenu (cache longue durée sans risque)
const css = minCss(bundle('styles', '.css')), js = minJs(bundle('scripts', '.js'));
const assets = { css: `app.${hash(css)}.css`, js: `app.${hash(js)}.js` };
write(`assets/css/${assets.css}`, css);
write(`assets/js/${assets.js}`, js);

// 4. Pages
const ctxFor = (path) => ({ site, siteUrl, data, images, assets, root: '../'.repeat(path.split('/').length - 1) });
const builders = [home, reservation, catalogue, services, invest, contact, mentions, privacy, terms, ...data.vehicles.map((v) => (ctx) => vehiclePage(ctx, v))];
const pages = [];
for (const build of builders) {
  const probe = build(ctxFor('x.html'));                 // 1er passage : connaître le chemin de la page
  const ctx = ctxFor(probe.path);
  const page = ctx.root === '' ? probe : build(ctx);     // 2e passage si la page est dans un sous-dossier
  write(page.path, layout(ctx, page));
  pages.push(page);
}
// La page 404 est servie depuis n'importe quelle adresse : chemins absolus obligatoires.
const ctx404 = { ...ctxFor('404.html'), root: '/' };
write('404.html', layout(ctx404, notfound(ctx404)));

// 5. Fichiers techniques : robots, sitemap, manifeste, en-têtes de sécurité
const indexable = pages.filter((p) => !p.noindex);
write('robots.txt', `User-agent: *\nAllow: /\n${siteUrl ? `\nSitemap: ${siteUrl}/sitemap.xml\n` : ''}`);
if (siteUrl) {
  const today = new Date().toISOString().slice(0, 10);
  write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexable.map((p) => `  <url><loc>${siteUrl}/${p.path === 'index.html' ? '' : p.path}</loc><lastmod>${today}</lastmod></url>`).join('\n')}\n</urlset>\n`);
}
write('manifest.webmanifest', JSON.stringify({
  name: site.name, short_name: 'FMB', lang: 'fr', start_url: './index.html', display: 'standalone', background_color: '#ffffff', theme_color: site.themeColor,
  icons: [{ src: 'assets/img/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: 'assets/img/icon-512.png', sizes: '512x512', type: 'image/png' }]
}, null, 2));
const csp = ["default-src 'self'", "img-src 'self' data:", "style-src 'self'", `script-src 'self' 'inline-speculation-rules'${site.analytics.enabled && site.analytics.scriptUrl ? ' ' + new URL(site.analytics.scriptUrl).origin : ''}`, "font-src 'self'", `connect-src 'self'${site.analytics.enabled && site.analytics.scriptUrl ? ' ' + new URL(site.analytics.scriptUrl).origin : ''}`, "object-src 'none'", "base-uri 'self'", "form-action 'self'", "frame-ancestors 'none'", 'upgrade-insecure-requests'].join('; ');
write('_headers', `# En-têtes de sécurité et de cache (Netlify, Cloudflare Pages)
/*
  Content-Security-Policy: ${csp}
  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
  Cross-Origin-Opener-Policy: same-origin-allow-popups

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/*.html
  Cache-Control: public, max-age=0, must-revalidate
`);

console.log(`✔ ${pages.length + 1} pages générées dans dist/ (${data.vehicles.length} fiches véhicules)`);
console.log(`  CSS ${(css.length / 1024).toFixed(1)} Ko · JS ${(js.length / 1024).toFixed(1)} Ko`);
if (!siteUrl) console.log('  ℹ Aucune URL de site définie : pas de sitemap.xml ni d’URL canoniques (définir SITE_URL ou "siteUrl" dans src/config/site.json).');
if (site.demoMode) console.log('  ℹ Mode démonstration actif (bandeau + annonces d’exemple non indexées).');
