// Blocs réutilisables : cartes véhicule, galerie, FAQ, avis, module de réservation, bandeau contact.
import { icon } from './icons.mjs';
import { esc, fmtInt, fmtPrice, picture, imgUrl, srcset, vehicleName, waLink, rs } from './util.mjs';

export const SERVICES = [
  { id: 'journee', label: 'Chauffeur', short: 'Chauffeur', long: 'Chauffeur à la journée', icon: 'user' },
  { id: 'duree', label: 'Plusieurs jours', short: 'Multi-jours', long: 'Chauffeur sur plusieurs jours', icon: 'calendar' },
  { id: 'aeroport', label: 'Aéroport AIBD', short: 'Aéroport', long: 'Transfert aéroport AIBD', icon: 'plane' },
  { id: 'longue', label: 'Longue durée', short: 'Location', long: 'Location longue durée', icon: 'key' },
  { id: 'ville', label: 'En ville', short: 'En ville', long: 'Trajet en ville', icon: 'route' }
];

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
  const specs = v.year
    ? `<ul class="vcard-specs">
        <li>${icon('calendar')}${v.year}</li>
        <li>${icon('gauge')}${fmtInt(v.km)}&nbsp;km</li>
        <li>${icon('fuel')}${v.fuel}</li>
        <li>${icon('gearbox')}${v.gearbox}</li>
      </ul>`
    : `<ul class="vcard-specs"><li>${icon('users')}${v.seats} places</li><li>${icon('camera')}${v.photos.length} photos réelles</li></ul>`;
  const wa = waLink(ctx.site, `Bonjour FMB, je suis intéressé par le véhicule ${v.ref} : ${v.year ? `${name} ${v.year}` : name} à ${fmtPrice(v.price)} (dédouané, tout compris).`);
  return `<article class="vcard" data-vehicle data-href="${href}" data-wa="${esc(wa)}" data-ref="${v.ref}" data-make="${esc(v.make)}" data-type="${esc(v.type)}" data-fuel="${esc(v.fuel || '')}" data-gearbox="${esc(v.gearbox || '')}" data-price="${v.price}" data-year="${v.year || 0}" data-km="${v.km || 0}" data-name="${esc(`${name} ${v.type} ${v.ref}`.toLowerCase())}">
  <div class="vcard-media">
    ${picture(ctx, v.photos[0].key, name, { sizes: '(min-width: 1081px) 300px, (min-width: 620px) 46vw, (min-width: 641px) 92vw, 46vw', eager, priority, max: 800 })}
    <div class="vcard-badges"><span class="chip">${esc(v.type)}</span>${v.demo ? '' : `<span class="chip chip--ok">${icon('camera')}Photos réelles</span>`}</div>
    <span class="vcard-ref">${v.ref}</span>
  </div>
  <button class="fav-btn" type="button" data-fav="${v.ref}" aria-pressed="false" aria-label="Ajouter ${esc(name)} aux favoris">${icon('heart')}</button>
  <div class="vcard-body">
    <div>
      <h3 class="vcard-title"><a href="${href}">${esc(name)}</a></h3>
      <p class="vcard-sub">${v.year ? rs(`${esc(v.type)} · ${v.year}`, `${v.year} · ${fmtInt(v.km)}&nbsp;km`) : rs('SUV compact · année et kilométrage sur demande', 'SUV · 5 places')}</p>
    </div>
    ${specs}
    <div class="vcard-foot">
      <div><span class="price-label">Prix tout compris</span><span class="price num">${fmtInt(v.price)} <small>FCFA</small></span></div>
      <span class="vcard-go" aria-hidden="true">${icon('arrow-right')}</span>
    </div>
    <div class="vcard-actions">
      <a class="btn btn--wa btn--sm" href="${esc(wa)}" target="_blank" rel="noopener">${icon('whatsapp')}Demander</a>
      <a class="btn btn--outline btn--sm" href="${href}" data-quick>Voir</a>
    </div>
  </div>
</article>`;
}

/* ---------- Carte « flotte avec chauffeur » ---------- */
export function fleetCard(ctx, car) {
  return `<article class="vcard fleet-card">
  ${gallery(ctx, car.photos, car.name, { sizes: '(min-width: 1000px) 380px, (min-width: 660px) 46vw, (min-width: 641px) 92vw, 30vw', max: 800 })}
  <div class="vcard-body">
    <div>
      <h3 class="vcard-title">${rs(esc(car.name), esc(car.short))}</h3>
      <p class="vcard-sub">${esc(car.sub)}</p>
    </div>
    <div class="fleet-meta">
      <span class="chip chip--soft">${icon('users')}${car.seats} places</span>
      <span class="chip chip--ok"><span class="dot"></span>Disponible</span>
    </div>
    <div class="vcard-foot">
      <div><span class="price-label">Tarif</span><span class="price">Sur devis</span></div>
      <a class="btn btn--cta btn--sm" href="${ctx.root}reservation.html?vehicule=${car.id}" data-reserve-vehicle="${car.id}">Réserver${icon('arrow-right')}</a>
    </div>
  </div>
</article>`;
}

/* ---------- Champs de réservation (partagés entre l'accueil et la page Réservation) ---------- */
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
      <button class="btn btn--cta" type="submit">${icon('search')}Continuer</button>
    </div>
    <p class="booking-hint" data-for="aeroport" hidden><span>Destinations courantes depuis l’AIBD (tarif sur devis) :</span>${['Dakar', 'Saly', 'Mbour', 'Somone', 'Ngaparou', 'Popenguine', 'Thiès', 'Joal'].map((d) => `<span class="chip chip--soft">${d}</span>`).join('')}</p>
    <p class="booking-hint" data-for="journee duree longue ville">${icon('shield', 'ico-inline')}<span>Aucun paiement en ligne : vous recevez le tarif et la confirmation sur WhatsApp.</span></p>
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
  return list.map((r) => `<figure class="review">
  <div class="stars" role="img" aria-label="Note : 5 sur 5">${star.repeat(5)}</div>
  <blockquote>« ${esc(r.text)} »</blockquote>
  <figcaption class="review-author"><span class="avatar" aria-hidden="true">${esc(r.name[0])}</span><span><strong>${esc(r.name)}</strong><span>${esc(r.detail)}${r.demo ? ' · avis d’exemple' : ''}</span></span></figcaption>
</figure>`).join('\n');
}

/* ---------- Bandeau contact ---------- */
// Sur téléphone, le bandeau générique est masqué (WhatsApp et Appeler sont déjà dans la barre du bas, les coordonnées
// dans le pied de page). `mobile: true` le garde, réduit à son titre, son texte court et un bouton (ex. : courtage).
export function ctaBand(ctx, { title = 'Une question ? Parlons de votre trajet.', text = 'Écrivez-nous sur WhatsApp ou appelez-nous : nous vous répondons directement et établissons votre devis.', textShort = '', mobile = false, wa = '' } = {}) {
  const { site } = ctx;
  return `<section class="section cta-section${mobile ? '' : ' lg'}" aria-labelledby="cta-title">
  <div class="container">
    <div class="cta-band" data-reveal>
      <div class="stack">
        <h2 id="cta-title">${title}</h2>
        <p>${textShort ? rs(text, textShort) : text}</p>
        <div class="cluster">
          <a class="btn btn--cta" href="${wa || waLink(site)}" target="_blank" rel="noopener">${icon('whatsapp')}${mobile ? rs('Écrire sur WhatsApp', 'Parler à un conseiller') : 'Écrire sur WhatsApp'}</a>
          <a class="btn btn--ghost-light lg" href="tel:${site.phoneE164}">${icon('phone')}Appeler</a>
        </div>
      </div>
      <ul class="contact-list lg">
        <li>${icon('phone')}<div><span>Téléphone et WhatsApp</span><a href="tel:${site.phoneE164}">${site.phoneDisplay}</a></div></li>
        <li>${icon('mail')}<div><span>E-mail</span><a href="mailto:${site.email}">${site.email}</a></div></li>
        <li>${icon('pin')}<div><span>Adresse</span><strong>${esc(site.address.locality)}, ${esc(site.address.street)}</strong></div></li>
      </ul>
    </div>
  </div>
</section>`;
}

export function pageHero(ctx, { eyebrow, title, lead, leadShort = '', crumbs, extra = '', compact = false }) {
  return `<section class="page-hero${compact ? ' page-hero--compact' : ''}">
  <div class="container">
    ${crumbs}
    ${eyebrow ? `<span class="eyebrow">${eyebrow}</span>` : ''}
    <h1>${title}</h1>
    ${lead ? `<p class="lead">${leadShort ? rs(lead, leadShort) : lead}</p>` : ''}
    ${extra}
  </div>
</section>`;
}
export { fmtPrice };
