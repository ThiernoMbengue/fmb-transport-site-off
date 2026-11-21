// Blocs réutilisables : en-têtes de page et de section, cartes, galerie, réservation, FAQ, avis, appel à l'action.
// Chaque bloc a une seule définition ; les pages ne font que les assembler.
import { icon } from './icons.mjs';
import { esc, fmtInt, fmtPrice, picture, imgUrl, srcset, vehicleName, waLink, rs } from './util.mjs';

/* Les formules de transport avec chauffeur (source unique : onglets, formulaire, page Chauffeur) */
export const SERVICES = [
  { id: 'journee', label: 'Chauffeur', short: 'Journée', long: 'Chauffeur à la journée', icon: 'user', text: 'Un chauffeur à votre disposition pour une demi-journée ou une journée complète.' },
  { id: 'duree', label: 'Plusieurs jours', short: 'Jours', long: 'Chauffeur sur plusieurs jours', icon: 'calendar', text: 'Missions, séjours, événements : le même chauffeur du premier au dernier jour.' },
  { id: 'aeroport', label: 'Aéroport AIBD', short: 'AIBD', long: 'Transfert aéroport AIBD', icon: 'plane', text: 'Accueil à l’arrivée ou dépose à l’aéroport, dans les deux sens, de jour comme de nuit.' },
  { id: 'longue', label: 'Longue durée', short: 'Location', long: 'Location longue durée', icon: 'key', text: 'Un véhicule pour 1 à 12 mois, avec ou sans chauffeur.' },
  { id: 'ville', label: 'En ville', short: 'Ville', long: 'Trajet en ville', icon: 'route', text: 'Un trajet simple dans Dakar et sa région, à l’heure qui vous convient.' }
];

/* ---------- En-tête de section ---------- */
export function secHead({ eyebrow = '', title, lead = '', leadShort = '', action = '', id = '', center = false }) {
  return `<div class="sec-head${center ? ' sec-head--center' : ''}">
  <div>
    ${eyebrow ? `<span class="eyebrow">${eyebrow}</span>` : ''}
    <h2${id ? ` id="${id}"` : ''}>${title}</h2>
    ${lead ? `<p class="lead">${leadShort ? rs(lead, leadShort) : lead}</p>` : ''}
  </div>
  ${action}
</div>`;
}

/* ---------- En-tête de page (pages intérieures) ---------- */
export function pageHead(ctx, { crumbs = '', eyebrow = '', title, lead = '', leadShort = '', plain = false, extra = '' }) {
  return `<header class="page-head${plain ? ' page-head--plain' : ''}">
  <div class="container">
    ${crumbs}
    ${eyebrow ? `<span class="eyebrow">${eyebrow}</span>` : ''}
    <h1>${title}</h1>
    ${lead ? `<p class="lead">${leadShort ? rs(lead, leadShort) : lead}</p>` : ''}
    ${extra}
  </div>
</header>`;
}

/* ---------- Galerie photo (1 à n images) ---------- */
export function gallery(ctx, photos, name, { sizes, eager = false, zoom = true, max = 1280 } = {}) {
  const multi = photos.length > 1;
  const first = photos[0];
  return `<div class="gallery" data-gallery>
  <div class="gallery-stage">
    ${picture(ctx, first.key, `${name} — ${first.label}`, { sizes, eager, max, attrs: 'data-gallery-main' })}
    ${zoom ? `<button class="gallery-zoom" type="button" data-gallery-zoom data-full="${imgUrl(ctx, first.key)}" aria-label="Agrandir la photo"></button>` : ''}
    ${multi ? `<button class="gallery-nav gallery-nav--prev" type="button" data-gallery-prev aria-label="Photo précédente">${icon('chevron-left')}</button>
    <button class="gallery-nav gallery-nav--next" type="button" data-gallery-next aria-label="Photo suivante">${icon('chevron-right')}</button>
    <span class="gallery-caption" data-gallery-label>${esc(first.label)}</span>
    <span class="gallery-caption gallery-counter" data-gallery-counter aria-hidden="true">1 / ${photos.length}</span>` : ''}
  </div>
  ${multi ? `<div class="gallery-thumbs" role="group" aria-label="Photos — ${esc(name)}">
    ${photos.map((p, i) => `<button type="button" data-gallery-thumb data-src="${imgUrl(ctx, p.key, max)}" data-srcset="${srcset(ctx, p.key, 'webp', max)}" data-srcset-avif="${srcset(ctx, p.key, 'avif', max)}" data-full="${imgUrl(ctx, p.key)}" data-label="${esc(p.label)}" data-alt="${esc(`${name} — ${p.label}`)}" aria-label="${esc(p.label)}"${i === 0 ? ' aria-current="true"' : ''}>${picture(ctx, p.key, '', { sizes: '120px', max: 320, avif: false })}</button>`).join('\n    ')}
  </div>` : ''}
</div>`;
}

/* ---------- Carte « véhicule à vendre » ---------- */
export function vehicleCard(ctx, v, { eager = false, priority = false } = {}) {
  const name = vehicleName(v);
  const href = `${ctx.root}vehicules/${v.slug}.html`;
  const full = v.year ? `${name} ${v.year}` : name;
  const wa = waLink(ctx.site, `Bonjour FMB, je suis intéressé par le véhicule ${v.ref} : ${full} à ${fmtPrice(v.price)} (dédouané, tout compris).`);
  const meta = v.year
    ? rs(`${v.year} · ${fmtInt(v.km)}&nbsp;km · ${esc(v.fuel)}`, `${v.year} · ${fmtInt(v.km)}&nbsp;km`)
    : rs('SUV compact · photos réelles', 'SUV · 5 places');
  return `<article class="vcard" data-vehicle data-href="${href}" data-wa="${esc(wa)}" data-ref="${v.ref}" data-make="${esc(v.make)}" data-type="${esc(v.type)}" data-fuel="${esc(v.fuel || '')}" data-gearbox="${esc(v.gearbox || '')}" data-price="${v.price}" data-year="${v.year || 0}" data-km="${v.km || 0}" data-name="${esc(`${name} ${v.type} ${v.ref}`.toLowerCase())}">
  <div class="vcard-media">
    ${picture(ctx, v.photos[0].key, name, { sizes: '(min-width: 1180px) 280px, (min-width: 721px) 30vw, 46vw', eager, priority, max: 800 })}
    <div class="vcard-badges"><span class="chip chip--glass">${esc(v.type)}</span></div>
  </div>
  <button class="fav-btn" type="button" data-fav="${v.ref}" aria-pressed="false" aria-label="Ajouter ${esc(name)} aux favoris">${icon('heart')}</button>
  <div class="vcard-body">
    <h3 class="vcard-title"><a href="${href}">${esc(name)}</a></h3>
    <p class="vcard-meta">${meta}</p>
    <ul class="vcard-specs" hidden>
      ${v.year ? `<li>${icon('calendar')}${v.year}</li><li>${icon('gauge')}${fmtInt(v.km)}&nbsp;km</li><li>${icon('fuel')}${esc(v.fuel)}</li><li>${icon('gearbox')}${esc(v.gearbox)}</li>` : `<li>${icon('users')}${v.seats} places</li><li>${icon('camera')}${v.photos.length} photos réelles</li>`}
    </ul>
    <div class="vcard-price"><span class="price num">${fmtInt(v.price)} <small>FCFA</small></span><span class="label">Dédouané</span></div>
  </div>
</article>`;
}

/* ---------- Carte « véhicule avec chauffeur » (flotte) ---------- */
export function fleetCard(ctx, car) {
  return `<article class="fleet">
  ${gallery(ctx, car.photos, car.name, { sizes: '(min-width: 1180px) 380px, (min-width: 861px) 31vw, (min-width: 721px) 92vw, 34vw', max: 800 })}
  <div class="fleet-body">
    <h3>${esc(car.name)}</h3>
    <p class="fleet-sub">${esc(car.sub)}</p>
    <ul class="fleet-meta">
      <li>${icon('users')}${car.seats} places</li>
      <li>${icon('check-circle')}Climatisée</li>
    </ul>
    <a class="btn btn--secondary btn--sm" href="${ctx.root}reservation.html?vehicule=${car.id}" data-reserve-vehicle="${car.id}">${rs('Réserver ce véhicule', 'Réserver')}</a>
  </div>
</article>`;
}

/* ---------- Champs de réservation (partagés entre le module et la page Réservation) ---------- */
const opt = (v, l, sel) => `<option value="${esc(v)}"${sel ? ' selected' : ''}>${esc(l)}</option>`;
export function bookingFields(p = 'b', { full = false } = {}) {
  // Les champs qui ne concernent pas le service affiché par défaut (« journee ») sont masqués dès le HTML :
  // le JavaScript n'a rien à cacher au chargement → aucun décalage de mise en page (CLS).
  const f = (name, forList, label, control, extra = '') => {
    const off = forList && !forList.split(' ').includes('journee');
    return `<div class="field" data-field="${name}"${forList ? ` data-for="${forList}"` : ''}${off ? ' hidden' : ''}><label for="${p}-${name}">${label}</label>${off ? control.replace(/<(input|select)/, '<$1 disabled') : control}${extra}<span class="field-error" data-error hidden></span></div>`;
  };
  const req = full ? ' <span aria-hidden="true">*</span>' : '';
  return [
    f('sens', 'aeroport', `Sens du trajet${req}`, `<select class="select" id="${p}-sens" name="sens">${opt('dakar', 'Dakar vers AIBD', true)}${opt('aibd', 'AIBD vers Dakar')}</select>`),
    f('formule', 'longue', `Formule${req}`, `<select class="select" id="${p}-formule" name="formule">${opt('chauffeur', 'Avec chauffeur', true)}${opt('sans', 'Sans chauffeur')}</select>`),
    f('depart', 'journee duree aeroport ville', '<span data-label-depart>Prise en charge</span>', `<input class="input" id="${p}-depart" name="depart" type="text" placeholder="Quartier, adresse ou lieu" data-ph-sm="Adresse ou quartier" autocomplete="street-address" maxlength="120">`),
    f('arrivee', 'ville', 'Arrivée', `<input class="input" id="${p}-arrivee" name="arrivee" type="text" placeholder="Où allez-vous ?" maxlength="120">`),
    f('date', '', `<span data-label-date>Date</span>${req}`, `<input class="input" id="${p}-date" name="date" type="date"${full ? ' required' : ''}>`),
    f('date_fin', 'duree', `${full ? 'Date de fin' : 'Au'}${req}`, `<input class="input" id="${p}-date_fin" name="date_fin" type="date"${full ? ' required' : ''}>`),
    f('heure', 'journee aeroport ville', full ? rs('Heure de prise en charge', 'Heure') : 'Heure', `<input class="input" id="${p}-heure" name="heure" type="time">`),
    f('duree', 'journee', `${full ? 'Mise à disposition' : 'Durée'}${req}`, `<select class="select" id="${p}-duree" name="duree">${opt('Demi-journée', 'Demi-journée')}${opt('Journée complète', 'Journée complète', true)}${opt('À l’heure (à préciser)', 'À l’heure')}</select>`),
    f('mois', 'longue', `Durée${req}`, `<select class="select" id="${p}-mois" name="mois">${opt('1', '1 mois')}${opt('3', '3 mois', true)}${opt('6', '6 mois')}${opt('12', '12 mois')}</select>`),
    full ? f('programme', 'journee duree', `${rs('Destination ou programme', 'Destination')} <span class="opt">(facultatif)</span>`, `<input class="input" id="${p}-programme" name="programme" type="text" placeholder="Où allez-vous ? Quel programme ?" data-ph-sm="Destination…" maxlength="160">`) : '',
    full ? f('vol', 'aeroport', 'Numéro de vol <span class="opt">(facultatif)</span>', `<input class="input" id="${p}-vol" name="vol" type="text" placeholder="Par exemple AF 718" maxlength="20">`) : '',
    f('passagers', '', `Passagers${req}`, `<input class="input" id="${p}-passagers" name="passagers" type="number" inputmode="numeric" min="1" max="30" value="1"${full ? ' required' : ''}>`)
  ].join('\n      ');
}

export function bookingWidget(ctx) {
  return `<form class="booking" action="${ctx.root}reservation.html" method="get" data-booking="widget" novalidate>
  <input type="hidden" name="service" value="journee" data-service-input>
  <div class="booking-tabs" role="tablist" aria-label="Type de service">
    ${SERVICES.map((s, i) => `<button class="booking-tab" type="button" role="tab" id="tab-${s.id}" aria-selected="${i === 0}" aria-controls="booking-panel" data-service="${s.id}"${i === 0 ? '' : ' tabindex="-1"'}>${icon(s.icon)}${rs(s.label, s.short)}</button>`).join('\n    ')}
  </div>
  <div class="booking-body" id="booking-panel" role="tabpanel" aria-labelledby="tab-journee">
    <div class="booking-fields">
      ${bookingFields('w')}
      <button class="btn btn--lg" type="submit">Continuer${icon('arrow-right')}</button>
    </div>
    <p class="booking-hint" data-for="aeroport" hidden><span>Destinations courantes depuis l’AIBD :</span>${['Dakar', 'Saly', 'Mbour', 'Somone', 'Thiès'].map((d) => `<span class="chip">${d}</span>`).join('')}</p>
    <p class="booking-hint" data-for="journee duree longue ville">${icon('shield')}<span>Aucun paiement en ligne : le tarif et la confirmation vous sont envoyés sur WhatsApp.</span></p>
  </div>
</form>`;
}

/* ---------- FAQ ---------- */
export function faq(items) {
  return `<div class="faq">${items.map((it) => `
  <details><summary>${esc(it.q)}${icon('plus')}</summary><p>${esc(it.a)}</p></details>`).join('')}
</div>`;
}
export const faqLd = (items) => ({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: items.map((it) => ({ '@type': 'Question', name: it.q, acceptedAnswer: { '@type': 'Answer', text: it.a } })) });

/* ---------- Avis ---------- */
export function reviews(list) {
  const star = icon('star');
  return `<div class="grid grid--3 reviews">${list.map((r) => `<figure class="review" data-reveal>
  <div class="stars" role="img" aria-label="Note : 5 sur 5">${star.repeat(5)}</div>
  <blockquote>« ${esc(r.text)} »</blockquote>
  <figcaption class="review-author"><span class="avatar" aria-hidden="true">${esc(r.name[0])}</span><span><strong>${esc(r.name)}</strong><span>${esc(r.detail)}${r.demo ? ' · avis d’exemple' : ''}</span></span></figcaption>
</figure>`).join('\n')}</div>`;
}

/* ---------- Appel à l'action final (un seul par page) ---------- */
export function cta(ctx, { title, text, primary, secondary = '' }) {
  return `<section class="section" aria-labelledby="cta-title">
  <div class="container">
    <div class="cta" data-reveal>
      <div><h2 id="cta-title">${title}</h2><p>${text}</p></div>
      <div class="actions">${primary}${secondary}</div>
    </div>
  </div>
</section>`;
}
export const waButton = (ctx, label = 'Écrire sur WhatsApp', text = '') => `<a class="btn btn--wa" href="${waLink(ctx.site, text)}" target="_blank" rel="noopener">${icon('whatsapp')}${label}</a>`;

export { fmtPrice };
