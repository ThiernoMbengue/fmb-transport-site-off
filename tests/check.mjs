#!/usr/bin/env node
/**
 * Contrôle qualité automatique du site généré (dist/). Aucune dépendance.
 * Vérifie pour chaque page : liens internes et fichiers référencés, titre et description uniques,
 * un seul <h1>, attribut alt sur les images, identifiants uniques, labels de formulaire, absence de style en ligne.
 * Usage : npm run check   (code de sortie ≠ 0 en cas d'erreur → bloque le déploiement en CI)
 */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const files = walk(DIST), pages = files.filter((f) => f.endsWith('.html'));
const errors = [], titles = new Map(), descs = new Map();
const err = (page, msg) => errors.push(`${relative(DIST, page)} : ${msg}`);
const attr = (tag, name) => (tag.match(new RegExp(`\\s${name}="([^"]*)"`)) || [])[1];

for (const page of pages) {
  const html = readFileSync(page, 'utf8'), is404 = page.endsWith('404.html');
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
  const desc = attr((html.match(/<meta name="description"[^>]*>/) || [''])[0], 'content');
  if (!title) err(page, 'balise <title> absente'); else if (titles.has(title)) err(page, `titre en double avec ${titles.get(title)}`); else titles.set(title, relative(DIST, page));
  if (!desc) err(page, 'meta description absente'); else if (desc.length > 200) err(page, `meta description trop longue (${desc.length})`); else if (descs.has(desc)) err(page, 'description en double'); else descs.set(desc, 1);
  if ((html.match(/<h1[\s>]/g) || []).length !== 1) err(page, 'la page doit contenir exactement un <h1>');
  if (!/<html lang="fr"/.test(html)) err(page, 'attribut lang manquant');
  if (/\sstyle="/.test(html)) err(page, 'style en ligne interdit (bloqué par la politique de sécurité CSP)');
  if (/<script(?![^>]*(src=|application\/ld\+json|speculationrules))/.test(html)) err(page, 'script en ligne interdit (CSP)');
  if (/undefined|\[object Object\]|NaN/.test(html.replace(/<script[\s\S]*?<\/script>/g, ''))) err(page, 'valeur non résolue (undefined / NaN) dans le HTML');

  for (const img of html.match(/<img[^>]*>/g) || []) {
    if (attr(img, 'alt') === undefined) err(page, `image sans alt : ${attr(img, 'src')}`);
    if (!attr(img, 'width') || !attr(img, 'height')) err(page, `image sans dimensions : ${attr(img, 'src')}`);
  }
  // Performance : une seule image prioritaire (LCP) par page, toutes les autres en chargement différé ou asynchrone
  const imgs = html.match(/<img[^>]*>/g) || [];
  if (imgs.filter((i) => /fetchpriority="high"/.test(i)).length > 1) err(page, 'plus d’une image en fetchpriority="high"');
  imgs.filter((i) => !/loading="lazy"|fetchpriority="high"|decoding="async"/.test(i)).forEach((i) => err(page, `image sans stratégie de chargement : ${attr(i, 'src')}`));
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  ids.filter((id, i) => ids.indexOf(id) !== i).forEach((id) => err(page, `identifiant en double : #${id}`));
  for (const m of html.matchAll(/<(input|select|textarea)\b[^>]*>/g)) {
    const t = m[0]; if (/type="(hidden|radio|checkbox)"/.test(t)) continue;
    const id = attr(t, 'id'); if (!id || !html.includes(`for="${id}"`)) err(page, `champ sans <label> : ${attr(t, 'name')}`);
  }
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) { try { JSON.parse(m[1]); } catch { err(page, 'JSON-LD invalide'); } }

  // Liens et ressources internes
  const refs = [...html.matchAll(/\s(?:href|src)="([^"]+)"/g)].map((m) => m[1]).concat([...html.matchAll(/\ssrcset="([^"]+)"/g)].filter((m) => !m[1].startsWith('data:')).flatMap((m) => m[1].split(',').map((s) => s.trim().split(' ')[0])));
  for (const ref of refs) {
    if (/^(https?:|mailto:|tel:|data:|#)/.test(ref)) continue;
    const [path, hash] = ref.split('?')[0].split('#');
    const target = path.startsWith('/') ? join(DIST, path) : join(dirname(page), path);
    const file = existsSync(target) && statSync(target).isDirectory() ? join(target, 'index.html') : target;
    if (!existsSync(file)) { err(page, `lien cassé : ${ref}`); continue; }
    if (ref.includes('#') && hash && file.endsWith('.html') && !readFileSync(file, 'utf8').includes(`id="${hash}"`)) err(page, `ancre introuvable : ${ref}`);
    if (is404 && !path.startsWith('/')) err(page, `la page 404 doit utiliser des chemins absolus : ${ref}`);
  }
  for (const m of html.matchAll(/href="(https?:[^"]+)"[^>]*target="_blank"(?![^>]*rel="[^"]*noopener)/g)) err(page, `lien externe sans rel="noopener" : ${m[1]}`);
}

for (const f of ['robots.txt', '_headers', 'manifest.webmanifest', 'favicon.ico', '404.html']) if (!existsSync(join(DIST, f))) errors.push(`fichier manquant : ${f}`);
const heavy = files.filter((f) => /\.(webp|avif|jpg|png)$/.test(f) && statSync(f).size > 300 * 1024);
heavy.forEach((f) => errors.push(`image trop lourde (> 300 Ko) : ${relative(DIST, f)}`));

// vercel.json (hébergement Vercel) doit reprendre la même politique de sécurité que dist/_headers (Netlify, Cloudflare)
const vercelFile = join(DIST, '..', 'vercel.json');
if (existsSync(vercelFile)) {
  const fromHeaders = (readFileSync(join(DIST, '_headers'), 'utf8').match(/Content-Security-Policy: (.*)/) || [])[1];
  const fromVercel = JSON.parse(readFileSync(vercelFile, 'utf8')).headers.flatMap((h) => h.headers).find((h) => h.key === 'Content-Security-Policy')?.value;
  if (fromHeaders !== fromVercel) errors.push('vercel.json : la Content-Security-Policy diffère de dist/_headers (copier la ligne de dist/_headers dans vercel.json)');
}

if (errors.length) { console.error(`✖ ${errors.length} problème(s) :\n - ${errors.join('\n - ')}`); process.exit(1); }
console.log(`✔ ${pages.length} pages contrôlées : liens, SEO, accessibilité de base, sécurité (CSP) — aucun problème.`);
