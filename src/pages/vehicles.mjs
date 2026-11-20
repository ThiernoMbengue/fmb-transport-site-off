import { icon } from '../components/icons.mjs';
import { esc, fmtInt, fmtPrice, vehicleName, waLink, imgUrl } from '../components/util.mjs';
import { vehicleCard, gallery, pageHero, ctaBand } from '../components/sections.mjs';
import { breadcrumb, breadcrumbLd } from '../components/layout.mjs';

const uniq = (arr) => [...new Set(arr.filter(Boolean))].sort((a, b) => a.localeCompare(b, 'fr'));
const options = (list, all) => `<option value="">${all}</option>${list.map((x) => `<option value="${esc(x)}">${esc(x)}</option>`).join('')}`;

/* ---------- Catalogue ---------- */
export function catalogue(ctx) {
  const { site, data } = ctx;
  const vs = data.vehicles;
  const crumbs = [{ label: 'Véhicules à vendre' }];
  const body = `
${pageHero(ctx, { crumbs: breadcrumb(ctx, crumbs), eyebrow: 'Vente de véhicules', title: 'Des véhicules dédouanés, tout compris', lead: 'Choisissez parmi nos véhicules disponibles : dédouanement et frais inclus dans le prix annoncé.', compact: true })}
<section class="section section--tight">
  <div class="container catalog" data-catalog>
    <form class="filters" id="filtres" data-filters aria-label="Filtrer les véhicules">
      <div class="filters-head"><h2 class="filters-title">Filtres</h2><span class="cluster"><button class="text-btn" type="reset" data-filters-reset>Réinitialiser</button><button class="icon-btn filters-close" type="button" data-filters-close aria-label="Fermer les filtres">${icon('x')}</button></span></div>
      <div class="field"><label for="f-q">Recherche</label><div class="search-field">${icon('search')}<input class="input" id="f-q" name="q" type="search" placeholder="Marque, modèle, référence…" autocomplete="off"></div></div>
      <div class="field"><label for="f-marque">Marque</label><select class="select" id="f-marque" name="marque">${options(uniq(vs.map((v) => v.make)), 'Toutes les marques')}</select></div>
      <div class="field"><label for="f-type">Type</label><select class="select" id="f-type" name="type">${options(uniq(vs.map((v) => v.type)), 'Tous les types')}</select></div>
      <div class="field"><label for="f-budget">Budget maximum</label><select class="select" id="f-budget" name="budget"><option value="">Tous les budgets</option>${[5, 8, 10, 15].map((m) => `<option value="${m * 1e6}">${fmtPrice(m * 1e6)}</option>`).join('')}</select></div>
      <div class="field"><label for="f-carburant">Carburant</label><select class="select" id="f-carburant" name="carburant">${options(uniq(vs.map((v) => v.fuel)), 'Tous')}</select></div>
      <div class="field"><label for="f-boite">Boîte de vitesses</label><select class="select" id="f-boite" name="boite">${options(uniq(vs.map((v) => v.gearbox)), 'Toutes')}</select></div>
      <label class="check"><input type="checkbox" name="favoris" value="1">Mes favoris uniquement</label>
      <button class="btn btn--cta filters-apply" type="button" data-filters-close>Voir les résultats</button>
    </form>
    <div>
      <div class="catalog-bar">
        <h2 class="count" data-count aria-live="polite">${vs.length} véhicules disponibles</h2>
        <div class="cluster">
          <button class="btn btn--outline btn--sm filters-open" type="button" data-filters-open aria-controls="filtres">${icon('sliders')}Filtres<span class="badge-count badge-count--inline" data-filters-badge hidden>0</span></button>
          <div class="sort"><label for="f-tri">Trier par</label><select class="select" id="f-tri" name="tri" form="filtres" data-sort><option value="">Sélection FMB</option><option value="prix-asc">Prix croissant</option><option value="prix-desc">Prix décroissant</option><option value="annee">Année la plus récente</option><option value="km">Kilométrage le plus bas</option></select></div>
        </div>
      </div>
      <div class="active-chips" data-active-chips></div>
      <div class="vgrid" data-grid>
        ${vs.map((v, i) => vehicleCard(ctx, v, { eager: i === 0 })).join('\n        ')}
      </div>
      <div class="empty" data-empty hidden>
        <span class="ico-tile">${icon('search')}</span>
        <h3>Aucun véhicule ne correspond à votre recherche</h3>
        <p>Modifiez vos filtres ou dites-nous ce que vous cherchez : nous trouvons le véhicule pour vous.</p>
        <div class="cluster"><button class="btn btn--outline" type="button" data-filters-reset>Réinitialiser les filtres</button><a class="btn btn--wa" href="${waLink(site, 'Bonjour FMB, je souhaite acheter un véhicule en courtage. Voici le modèle et le budget recherchés : ')}" target="_blank" rel="noopener">${icon('whatsapp')}Parler à un conseiller</a></div>
      </div>
      <div class="catalog-more" data-more hidden><p data-more-text></p><button class="btn btn--outline" type="button" data-more-btn>Voir plus de véhicules</button></div>
      <p class="disclaimer" style-x>Prix en FCFA, dédouanement inclus.${site.demoMode ? ' Hormis la Renault QM3, les annonces et photos de cette page sont des exemples de démonstration.' : ''}</p>
    </div>
  </div>
</section>
${ctaBand(ctx, { title: 'Vous ne trouvez pas votre véhicule ?', text: 'Donnez-nous votre budget et le modèle recherché : nous trouvons le véhicule et l’achetons pour vous (achat en courtage).' })}`.replace(' style-x', '');
  const ld = ctx.siteUrl ? { '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: vs.map((v, i) => ({ '@type': 'ListItem', position: i + 1, url: `${ctx.siteUrl}/vehicules/${v.slug}.html`, name: vehicleName(v) })) } : null;
  return {
    id: 'catalogue', path: 'vehicules.html', nav: 'vehicles',
    title: 'Véhicules dédouanés à vendre à Dakar — FMB Transport',
    description: `${vs.length} véhicules à vendre à Dakar : SUV, berlines, citadines, pick-up et minibus. Dédouanement et frais inclus dans le prix annoncé.`,
    body, jsonLd: [breadcrumbLd(ctx, crumbs), ld]
  };
}

/* ---------- Fiche véhicule ---------- */
export function vehiclePage(ctx, v) {
  const { site, data } = ctx;
  const name = vehicleName(v);
  const full = v.year ? `${name} ${v.year}` : name;
  const crumbs = [{ label: 'Véhicules à vendre', href: 'vehicules.html' }, { label: full }];
  const similar = data.vehicles.filter((o) => o.ref !== v.ref).sort((a, b) => (b.type === v.type) - (a.type === v.type) || Math.abs(a.price - v.price) - Math.abs(b.price - v.price)).slice(0, 3);
  const waText = `Bonjour FMB, je suis intéressé par le véhicule ${v.ref} : ${full} à ${fmtPrice(v.price)} (dédouané, tout compris).`;
  const spec = (ico, k, val) => `<div class="spec"><dt>${icon(ico)}${k}</dt><dd>${esc(val)}</dd></div>`;
  const credit = data.credits[v.photos[0].key];
  const desc = v.year
    ? `${name} de ${v.year}, ${v.type.toLowerCase()} ${v.fuel.toLowerCase()} à boîte ${v.gearbox.toLowerCase()}, ${fmtInt(v.km)} km au compteur. Véhicule vendu dédouané : le prix annoncé comprend le dédouanement et les frais.`
    : `${name}, SUV compact 5 places issu de la flotte FMB. Photos réelles du véhicule. Année et kilométrage communiqués sur demande. Véhicule vendu dédouané : le prix annoncé comprend le dédouanement et les frais.`;
  const body = `
<section class="section section--tight">
  <div class="container">
    ${breadcrumb(ctx, crumbs, true)}
    <div class="vehicle" data-vehicle-page data-ref="${v.ref}" data-name="${esc(full)}">
      <div class="vehicle-gallery">
          ${gallery(ctx, v.photos, name, { sizes: '(min-width: 1300px) 690px, (min-width: 901px) 54vw, 100vw', eager: true })}
          ${credit ? `<p class="photo-credit">Photo d’illustration (véhicule de démonstration) : ${esc(credit.artist || 'auteur inconnu')}, ${esc(credit.license)}, via <a href="${esc(credit.page)}" target="_blank" rel="noopener nofollow">Wikimedia Commons</a>.</p>` : ''}
      </div>
      <div class="vehicle-main">
        <div>
          <h2>Caractéristiques</h2>
          <dl class="spec-grid">
            ${spec('car', 'Type', v.type)}
            ${spec('calendar', 'Année', v.year || 'Sur demande')}
            ${spec('gauge', 'Kilométrage', v.km ? `${fmtInt(v.km)} km` : 'Sur demande')}
            ${spec('fuel', 'Carburant', v.fuel || 'Sur demande')}
            ${spec('gearbox', 'Boîte', v.gearbox || 'Sur demande')}
            ${v.seats ? spec('users', 'Places', v.seats) : ''}
            ${spec('tag', 'Référence', v.ref)}
          </dl>
        </div>
        <div>
          <h2>Description</h2>
          <p>${esc(desc)}</p>
        </div>
        <div>
          <h2>Compris dans le prix</h2>
          <ul class="tick-list">
            <li>${icon('check-circle')}Dédouanement du véhicule</li>
            <li>${icon('check-circle')}Frais inclus dans le prix annoncé</li>
            <li>${icon('check-circle')}Échange direct avec un conseiller FMB sur WhatsApp</li>
          </ul>
        </div>
        <div class="form-block no-print" id="rendez-vous">
          <div><h2>Demander un rendez-vous</h2><p>Proposez un créneau pour voir le véhicule : nous vous confirmons la disponibilité sur WhatsApp.</p></div>
          <form class="form-grid" data-wa-form data-wa-intro="Bonjour FMB, je souhaite un rendez-vous pour voir le véhicule ${v.ref} : ${esc(full)}." novalidate>
            <div class="field" data-field="nom"><label for="rv-nom">Nom et prénom <span aria-hidden="true">*</span></label><input class="input" id="rv-nom" name="nom" data-label="Nom" type="text" autocomplete="name" maxlength="80" required data-min="2" data-msg="Indiquez votre nom et prénom."><span class="field-error" data-error hidden></span></div>
            <div class="field" data-field="telephone"><label for="rv-tel">Téléphone ou WhatsApp <span aria-hidden="true">*</span></label><input class="input" id="rv-tel" name="telephone" data-label="Téléphone" type="tel" inputmode="tel" autocomplete="tel" maxlength="24" required data-phone data-msg="Indiquez un numéro valide (8 chiffres minimum)."><span class="field-error" data-error hidden></span></div>
            <div class="field" data-field="date"><label for="rv-date">Date souhaitée <span aria-hidden="true">*</span></label><input class="input" id="rv-date" name="date" data-label="Date souhaitée" type="date" required data-future data-msg="Choisissez une date à venir."><span class="field-error" data-error hidden></span></div>
            <div class="field" data-field="creneau"><label for="rv-creneau">Créneau</label><select class="select" id="rv-creneau" name="creneau" data-label="Créneau"><option>Matin</option><option>Après-midi</option><option>Fin de journée</option></select></div>
            <div class="span-all"><button class="btn btn--cta" type="submit">${icon('calendar')}Demander ce rendez-vous</button></div>
          </form>
        </div>
      </div>
      <aside class="vehicle-side">
        <div class="vehicle-panel">
          <div class="cluster"><span class="chip chip--soft">${esc(v.type)}</span><span class="chip chip--ok"><span class="dot"></span>Disponible</span>${v.demo ? '<span class="chip chip--amber">Annonce d’exemple</span>' : `<span class="chip chip--soft">${icon('camera')}Photos réelles</span>`}</div>
          <div><h1>${esc(name)}</h1><p class="vcard-sub">${v.year ? `${v.year} · ${fmtInt(v.km)} km · ${v.fuel} · ${v.gearbox}` : 'SUV compact · 5 places'}</p></div>
          <div class="vehicle-price"><span class="price num">${fmtInt(v.price)} <small>FCFA</small></span><span>Dédouané · tout compris</span></div>
          <div class="vehicle-actions">
            <a class="btn btn--wa btn--block" href="${waLink(site, waText)}" target="_blank" rel="noopener">${icon('whatsapp')}Demander ce véhicule</a>
            <a class="btn btn--outline btn--block" href="#rendez-vous">${icon('calendar')}Prendre rendez-vous</a>
            <a class="btn btn--outline btn--block" href="tel:${site.phoneE164}">${icon('phone')}${site.phoneDisplay}</a>
          </div>
          <div class="vehicle-tools">
            <button class="btn btn--outline btn--sm" type="button" data-fav="${v.ref}" data-fav-labelled aria-pressed="false">${icon('heart')}<span>Favori</span></button>
            <button class="btn btn--outline btn--sm" type="button" data-share data-share-title="${esc(full)} — FMB Transport">${icon('share')}Partager</button>
            <button class="btn btn--outline btn--sm" type="button" data-print>${icon('printer')}Fiche PDF</button>
          </div>
          <p class="print-only">Contact : ${site.phoneDisplay} · ${site.email}</p>
        </div>
      </aside>
    </div>
  </div>
</section>
<section class="section section--white no-print" aria-labelledby="similaires-title">
  <div class="container">
    <div class="section-head section-head--row"><div><span class="eyebrow">À découvrir aussi</span><h2 id="similaires-title">Véhicules similaires</h2></div><a class="link-arrow" href="${ctx.root}vehicules.html">Tout le catalogue${icon('arrow-right')}</a></div>
    <div class="vgrid">${similar.map((s) => vehicleCard(ctx, s)).join('\n')}</div>
  </div>
</section>`;
  const ld = {
    '@context': 'https://schema.org', '@type': 'Car', name: full, brand: { '@type': 'Brand', name: v.make }, model: v.model, sku: v.ref, bodyType: v.type, itemCondition: 'https://schema.org/UsedCondition',
    ...(v.year ? { vehicleModelDate: String(v.year), mileageFromOdometer: { '@type': 'QuantitativeValue', value: v.km, unitCode: 'KMT' }, fuelType: v.fuel, vehicleTransmission: v.gearbox } : {}),
    ...(ctx.siteUrl ? { image: `${ctx.siteUrl}/${imgUrl({ ...ctx, root: '' }, v.photos[0].key)}`, url: `${ctx.siteUrl}/vehicules/${v.slug}.html` } : {}),
    offers: { '@type': 'Offer', price: v.price, priceCurrency: 'XOF', availability: 'https://schema.org/InStock', seller: { '@type': 'Organization', name: site.name } }
  };
  return {
    id: 'vehicle', path: `vehicules/${v.slug}.html`, nav: 'vehicles',
    title: `${full} à vendre — ${fmtPrice(v.price)} dédouané | FMB Transport`,
    description: `${full}${v.year ? `, ${v.type.toLowerCase()} ${v.fuel.toLowerCase()}, boîte ${v.gearbox.toLowerCase()}, ${fmtInt(v.km)} km` : ', SUV compact 5 places'}. ${fmtPrice(v.price)}, dédouanement et frais inclus. Réf. ${v.ref}.`,
    body, jsonLd: [breadcrumbLd(ctx, crumbs), v.demo ? null : ld], noindex: !!v.demo
  };
}
