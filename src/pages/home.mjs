import { icon } from '../components/icons.mjs';
import { esc, picture, waLink, rs } from '../components/util.mjs';
import { bookingWidget, fleetCard, vehicleCard, faq, faqLd, reviews, ctaBand } from '../components/sections.mjs';

export default function home(ctx) {
  const { site, data, root } = ctx;
  const featured = ['FMB-V001', 'FMB-V011', 'FMB-V018', 'FMB-V020'].map((r) => data.vehicles.find((v) => v.ref === r)).filter(Boolean);
  const org = {
    '@context': 'https://schema.org', '@type': 'LocalBusiness', name: site.name, legalName: site.legalName,
    description: 'Voitures avec chauffeur à Dakar, transfert aéroport AIBD, location longue durée, vente de véhicules dédouanés et gestion de véhicules.',
    telephone: site.phoneE164, email: site.email, priceRange: 'Sur devis', areaServed: 'Dakar',
    address: { '@type': 'PostalAddress', streetAddress: site.address.street, addressLocality: site.address.locality, addressRegion: site.address.region, addressCountry: site.address.country },
    ...(ctx.siteUrl ? { url: ctx.siteUrl, image: `${ctx.siteUrl}/assets/img/og-default.jpg`, logo: `${ctx.siteUrl}/assets/img/icon-192.png` } : {})
  };
  const body = `
<section class="hero">
  <div class="container">
    <div class="hero-copy">
      <span class="eyebrow">Chauffeur privé · Dakar &amp; AIBD</span>
      <h1>Réservez votre <em>chauffeur</em> à Dakar</h1>
      <p class="lead">${rs('Transfert aéroport AIBD, chauffeur à la journée ou sur plusieurs jours, location longue durée. Choisissez votre véhicule, envoyez votre demande : la confirmation se fait sur WhatsApp.', 'Devis et confirmation sur WhatsApp.')}</p>
      <ul class="hero-trust">
        <li>${icon('check-circle')}${rs('Photos réelles des véhicules', 'Photos réelles')}</li>
        <li>${icon('check-circle')}${rs('Tarif sur devis', 'Sur devis')}</li>
        <li>${icon('check-circle')}${rs('Réponse sur WhatsApp', 'Sans paiement')}</li>
      </ul>
      <div class="cluster">
        <a class="btn btn--cta" href="#reserver">Réserver maintenant${icon('arrow-right')}</a>
        <a class="btn btn--ghost-light" href="#flotte">Voir les véhicules</a>
      </div>
    </div>
    <div class="hero-visual">
      <div class="hero-main">${picture(ctx, 'qm3-bleu-avant', 'Renault QM3 bleue de FMB Transport', { sizes: '(min-width: 900px) 580px, 92vw', eager: true, max: 800, skipPhone: true })}</div>
      <div class="hero-float hero-float--a"><span class="ico-tile">${icon('plane')}</span><span><strong>Transfert AIBD</strong>Dakar ⇄ aéroport, dans les deux sens</span></div>
      <div class="hero-float hero-float--b"><span class="ico-tile">${icon('whatsapp')}</span><span><strong>Confirmation WhatsApp</strong>Sans paiement en ligne</span></div>
    </div>
  </div>
</section>

<div class="booking-wrap" id="reserver">
  <div class="container">
    ${bookingWidget(ctx)}
    <div class="trust-strip" data-reveal>
      <div class="trust-item"><span class="ico-tile">${icon('camera')}</span><div><strong>Photos réelles</strong><span>Vous voyez le véhicule qui vient vous chercher</span></div></div>
      <div class="trust-item"><span class="ico-tile">${icon('receipt')}</span><div><strong>Devis clair</strong><span>Tarif communiqué avant toute confirmation</span></div></div>
      <div class="trust-item"><span class="ico-tile">${icon('whatsapp')}</span><div><strong>Suivi sur WhatsApp</strong><span>Un interlocuteur direct, sans intermédiaire</span></div></div>
      <div class="trust-item"><span class="ico-tile">${icon('building')}</span><div><strong>Société immatriculée</strong><span>RC ${site.rc}</span></div></div>
    </div>
  </div>
</div>

<section class="section" id="flotte" aria-labelledby="flotte-title">
  <div class="container">
    <div class="section-head section-head--row" data-reveal>
      <div>
        <span class="eyebrow">Notre flotte avec chauffeur</span>
        <h2 id="flotte-title">${data.fleet.length} véhicules disponibles</h2>
        <p class="lead">${rs('Des Renault QM3 confortables, climatisées, 5 places. Parcourez les photos, puis réservez celui qui vous convient.', 'Renault QM3 climatisées, 5 places · tarif sur devis.')}</p>
      </div>
      <a class="link-arrow lg" href="#reserver">Demander un devis${icon('arrow-right')}</a>
    </div>
    <div class="grid grid--3">
      ${data.fleet.map((c) => `<div data-reveal>${fleetCard(ctx, c)}</div>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="section section--dark" id="comment" aria-labelledby="comment-title">
  <div class="container">
    <div class="section-head" data-reveal>
      <span class="eyebrow">Réserver en 3 étapes</span>
      <h2 id="comment-title">Comment ça marche</h2>
    </div>
    <ol class="steps">
      <li class="step" data-reveal><h3>Recherchez</h3><p>Choisissez le service, la date, l’heure et le lieu dans le module de réservation.</p></li>
      <li class="step" data-reveal><h3>Choisissez votre véhicule</h3><p>Parcourez les photos réelles et cliquez sur « Réserver » pour le véhicule qui vous convient.</p></li>
      <li class="step" data-reveal><h3>Confirmez sur WhatsApp</h3><p>Votre récapitulatif est envoyé à notre équipe, qui vous répond avec le tarif.</p></li>
    </ol>
  </div>
</section>

<section class="section section--white home-vente" aria-labelledby="vente-title">
  <div class="container">
    <div class="section-head section-head--row" data-reveal>
      <div>
        <span class="eyebrow">Vente de véhicules</span>
        <h2 id="vente-title">Des véhicules dédouanés, tout compris</h2>
        <p class="lead">${rs(`Dédouanement et frais inclus dans le prix annoncé. ${data.vehicles.length} véhicules à découvrir dans le catalogue.`, `${data.vehicles.length} véhicules, dédouanement et frais inclus.`)}</p>
      </div>
      <a class="btn btn--outline" href="${root}vehicules.html">${rs('Voir tout le catalogue', 'Tout voir')}${icon('arrow-right')}</a>
    </div>
    <div class="vgrid">
      ${featured.map((v) => `<div data-reveal>${vehicleCard(ctx, v)}</div>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="section home-services" aria-labelledby="services-title">
  <div class="container">
    <div class="section-head section-head--row" data-reveal>
      <div>
        <span class="eyebrow">Au-delà du transport</span>
        <h2 id="services-title">${rs('Gestion, achat, vente et investissement', 'Nos autres services')}</h2>
        <p class="lead lg">FMB accompagne aussi les propriétaires, les entreprises et les investisseurs.</p>
      </div>
      <a class="link-arrow" href="${root}services.html">${rs('Tous les services', 'Tout voir')}${icon('arrow-right')}</a>
    </div>
    <div class="grid grid--4">
      ${data.services.slice(0, 4).map((s) => `<article class="service-card" data-reveal><span class="ico-tile">${icon(s.icon)}</span><h3>${rs(esc(s.title), esc(s.short))}</h3><p>${esc(s.text)}</p><a class="link-arrow" href="${root}services.html#${s.id}">Découvrir${icon('arrow-right')}</a></article>`).join('\n      ')}
      <a class="service-card service-more" href="${root}services.html"><span class="ico-tile">${icon('plus')}</span><span>Tout voir</span></a>
    </div>
  </div>
</section>

<section class="section section--white" id="avis" aria-labelledby="avis-title">
  <div class="container">
    <div class="section-head section-head--row" data-reveal>
      <div>
        <span class="eyebrow">Avis de nos clients</span>
        <h2 id="avis-title">${data.reviews.length ? 'Ils ont voyagé avec nous' : 'Votre avis compte'}</h2>
      </div>
      <a class="btn btn--outline btn--sm" href="${waLink(site, 'Bonjour FMB, je souhaite laisser un avis sur mon trajet.')}" target="_blank" rel="noopener">Laisser un avis</a>
    </div>
    ${data.reviews.length ? `<div class="grid grid--3" data-reveal>${reviews(data.reviews)}</div>` : `<div class="empty"><span class="ico-tile">${icon('star')}</span><h3>Vous avez voyagé avec FMB Transport ?</h3><p>Partagez votre expérience : votre avis aide les prochains clients à choisir.</p></div>`}
  </div>
</section>

<section class="section" id="faq" aria-labelledby="faq-title">
  <div class="container split">
    <div class="section-head" data-reveal>
      <span class="eyebrow">Questions fréquentes</span>
      <h2 id="faq-title">Vos questions, nos réponses</h2>
      <p class="lead lg">Une autre question ? Écrivez-nous sur WhatsApp, nous vous répondons directement.</p>
      <div class="lg"><a class="btn btn--wa" href="${waLink(site)}" target="_blank" rel="noopener">${icon('whatsapp')}Poser ma question</a></div>
    </div>
    <div data-reveal>${faq(data.faq)}</div>
  </div>
</section>
${ctaBand(ctx)}`;
  return {
    id: 'home', path: 'index.html', nav: 'home',
    title: 'FMB Transport — Chauffeur privé à Dakar, transfert aéroport AIBD',
    description: 'Réservez votre chauffeur à Dakar : transfert aéroport AIBD, chauffeur à la journée ou sur plusieurs jours, location longue durée. Tarif sur devis, confirmation sur WhatsApp.',
    body, jsonLd: [org, faqLd(data.faq)]
  };
}
