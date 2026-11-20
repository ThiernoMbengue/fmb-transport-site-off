// Fonctions utilitaires partagées par les composants et les pages.
export const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const fmtInt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0');
export const fmtPrice = (n) => `${fmtInt(n)}\u00a0FCFA`;
export const waLink = (site, text) => `https://wa.me/${site.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
export const vehicleName = (v) => `${v.make} ${v.model}`;

const imgPath = (ctx, key, w, ext) => `${ctx.root}assets/img/${key}-${w}.${ext}`;
const widthsFor = (ctx, key, max) => {
  const m = ctx.images[key];
  if (!m) throw new Error(`Image absente du manifeste : ${key} (lancer « npm run images »)`);
  const ws = m.widths.filter((w) => w <= max);
  return ws.length ? ws : [m.widths[0]];
};
export const srcset = (ctx, key, ext = 'webp', max = 1280) => widthsFor(ctx, key, max).map((w) => `${imgPath(ctx, key, w, ext)} ${w}w`).join(', ');
/** URL d'une image (par défaut : la plus grande disponible ≤ max, en WebP). */
export const imgUrl = (ctx, key, max = 1280, ext = 'webp') => imgPath(ctx, key, widthsFor(ctx, key, max).pop(), ext);

/**
 * Image responsive : <picture> AVIF (le plus léger) + repli WebP, plusieurs largeurs.
 *  - sizes : largeur réellement affichée → le navigateur ne télécharge que la taille utile
 *  - max   : plus grande largeur proposée (une carte n'a jamais besoin de 1280 px)
 *  - eager : image visible dès le chargement (pas de lazy-loading) ; priority : LA grande image de la page (LCP)
 * width/height sont toujours présents → aucun saut de mise en page (CLS).
 */
export function picture(ctx, key, alt, { sizes = '100vw', eager = false, priority = eager, max = 1280, attrs = '', avif = true } = {}) {
  const m = ctx.images[key];
  const ws = widthsFor(ctx, key, max), big = ws[ws.length - 1];
  const h = Math.round(m.h * big / m.w);
  // priority : image principale (LCP) → téléchargée en premier ; eager seul : chargée sans attendre, priorité normale
  const load = priority ? 'fetchpriority="high"' : (eager ? 'decoding="async"' : 'loading="lazy" decoding="async"');
  const img = `<img${attrs ? ` ${attrs}` : ''} src="${imgPath(ctx, key, big, 'webp')}" srcset="${srcset(ctx, key, 'webp', max)}" sizes="${sizes}" width="${big}" height="${h}" alt="${esc(alt)}" ${load}>`;
  // avif: false → simple <img> WebP (miniatures : gain AVIF négligeable, HTML plus léger)
  return avif ? `<picture><source type="image/avif" srcset="${srcset(ctx, key, 'avif', max)}" sizes="${sizes}">${img}</picture>` : img;
}
