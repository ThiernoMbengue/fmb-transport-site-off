// Accueil : présenter l'entreprise et orienter vers ses trois métiers. Rien d'autre.
// (La réservation détaillée est sur la page « Chauffeur privé », le catalogue sur « Véhicules ».)
import { icon } from '../components/icons.mjs';
import { picture, waLink, rs } from '../components/util.mjs';
import { vehicleCard, reviews, secHead, cta, waButton } from '../components/sections.mjs';

export default function home(ctx) {
  const { site, data, root } = ctx;
  const featured = ['FMB-V001', 'FMB-V011', 'FMB-V018', 'FMB-V020'].map((r) => data.vehicles.find((v) => v.ref === r)).filter(Boolean);
  const org = {
    '@context': 'https://schema.org', '@type': 'LocalBusiness', name: site.name, legalName: site.legalName,
    description: 'Chauffeur privé à Dakar, transfert aéroport AIBD, location longue durée, vente de véhicules dédouanés et gestion de véhicules.',
    telephone: site.phoneE164, email: site.email, priceRange: 'Sur devis', areaServed: 'Dakar',
    address: { '@type': 'PostalAddress', streetAddress: site.address.street, addressLocality: site.address.locality, addressRegion: site.address.region, addressCountry: site.address.country },
    ...(ctx.siteUrl ? { url: ctx.siteUrl, image: `${ctx.siteUrl}/assets/img/og-default.jpg`, logo: `${ctx.siteUrl}/assets/img/icon-192.png` } : {})
  };
  // la première carte est visible dès l'arrivée sur téléphone : chargée tout de suite, les autres en différé
  const offer = (href, key, chip, title, text, alt, eager = false) => `<a class="offer" href="${root}${href}" data-reveal>
        ${picture(ctx, key, alt, { sizes: '(min-width: 1180px) 380px, (min-width: 861px) 31vw, 92vw', max: 800, eager, priority: false })}
        <span class="chip chip--glass">${chip}</span>
        <h3>${title}</h3>
        <p>${text}</p>
        <span class="link-arrow">Découvrir${icon('arrow-right')}</span>
      </a>`;
  const feature = (ico, title, text) => `<div class="feature" data-reveal><span class="ico">${icon(ico)}</span><h3>${title}</h3><p>${text}</p></div>`;

  const body = `
<section class="hero">
  <div class="container hero-grid">
    <div class="hero-copy">
      <span class="eyebrow">Transport &amp; mobilité · Dakar</span>
      <h1>Votre chauffeur privé à Dakar, en toute sérénité.</h1>
      <p class="lead">${rs('Transfert aéroport AIBD, chauffeur à la journée ou sur plusieurs jours, location longue durée — et des véhicules dédouanés à vendre, prix tout compris.', 'Aéroport, journée, longue durée — et des véhicules dédouanés à vendre.')}</p>
      <div class="hero-actions">
        <a class="btn btn--lg" href="${root}chauffeur.html#reserver">Réserver un chauffeur${icon('arrow-right')}</a>
        <a class="btn btn--secondary btn--lg" href="${root}vehicules.html">${rs('Voir les véhicules à vendre', 'Véhicules à vendre')}</a>
      </div>
      <ul class="hero-trust">
        <li>${icon('check-circle')}Société immatriculée</li>
        <li>${icon('check-circle')}Devis sur WhatsApp</li>
        <li class="lg">${icon('check-circle')}Photos réelles</li>
      </ul>
    </div>
    <div class="hero-media">
      ${picture(ctx, 'qm3-bleu-avant', 'Renault QM3 bleue de la flotte FMB', { sizes: '(min-width: 1180px) 560px, 46vw', eager: true, max: 800, skipPhone: true })}
      <div class="hero-card">
        <span class="ico">${icon('plane')}</span>
        <span><strong>Transfert AIBD</strong><span>Dakar ⇄ aéroport, 7 j/7</span></span>
      </div>
    </div>
  </div>
</section>

<section class="section section--soft" aria-labelledby="activites-title">
  <div class="container">
    ${secHead({ eyebrow: 'Nos activités', title: rs('Trois métiers, un seul interlocuteur', 'Nos trois métiers'), id: 'activites-title' })}
    <div class="grid grid--3">
      ${offer('chauffeur.html', 'qm3-creme-interieur', 'Transport', 'Chauffeur privé', 'Journée, plusieurs jours, aéroport AIBD ou location longue durée.', 'Portière ouverte d’une Renault QM3 de la flotte FMB', true)}
      ${offer('vehicules.html', 'vente-toyota-land-cruiser-prado', 'Vente', 'Véhicules à vendre', `${data.vehicles.length} véhicules dédouanés, prix tout compris.`, 'Toyota Land Cruiser Prado à vendre')}
      ${offer('services.html', 'qm3-bleu-interieur', 'Gestion', 'Gestion & investissement', 'Confiez votre véhicule ou financez des véhicules exploités par FMB.', 'Tableau de bord d’un véhicule de la flotte FMB')}
    </div>
  </div>
</section>

<section class="section" aria-labelledby="pourquoi-title">
  <div class="container">
    ${secHead({ eyebrow: 'Pourquoi FMB', title: 'Une entreprise sérieuse, des réponses claires', id: 'pourquoi-title' })}
    <div class="grid grid--4 features">
      ${feature('camera', 'Photos réelles', 'Vous voyez le véhicule qui vient vous chercher ou que vous achetez.')}
      ${feature('receipt', 'Devis avant engagement', 'Le tarif vous est communiqué avant toute confirmation.')}
      ${feature('whatsapp', 'Un interlocuteur direct', 'Réservation et suivi sur WhatsApp, sans intermédiaire.')}
      ${feature('building', 'Société immatriculée', `${site.legalName}, RC ${site.rc}.`)}
    </div>
  </div>
</section>

<section class="section section--soft" aria-labelledby="vente-title">
  <div class="container">
    ${secHead({ eyebrow: 'Véhicules à vendre', title: 'Sélection du moment', id: 'vente-title', action: `<a class="link-arrow" href="${root}vehicules.html">${rs('Tout le catalogue', 'Tout voir')}${icon('arrow-right')}</a>` })}
    <div class="vgrid">
      ${featured.map((v) => vehicleCard(ctx, v)).join('\n      ')}
    </div>
  </div>
</section>

<section class="section" id="avis" aria-labelledby="avis-title">
  <div class="container">
    ${secHead({ eyebrow: 'Avis clients', title: 'Ils nous ont fait confiance', id: 'avis-title', action: `<a class="link-arrow" href="${waLink(site, 'Bonjour FMB, je souhaite laisser un avis.')}" target="_blank" rel="noopener">Laisser un avis${icon('arrow-right')}</a>` })}
    ${reviews(data.reviews)}
  </div>
</section>

${cta(ctx, { title: 'Un trajet, un véhicule, un projet ?', text: 'Écrivez-nous : nous vous répondons directement, avec un devis clair.', primary: waButton(ctx), secondary: `<a class="btn btn--ghost" href="${root}contact.html">Nous contacter</a>` })}`;
  return {
    id: 'home', path: 'index.html', nav: 'home',
    title: 'FMB Transport — Chauffeur privé et véhicules à Dakar',
    description: 'Chauffeur privé à Dakar, transfert aéroport AIBD, location longue durée et véhicules dédouanés à vendre. Devis et confirmation sur WhatsApp.',
    body, jsonLd: [org]
  };
}
