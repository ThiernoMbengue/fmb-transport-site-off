// Chauffeur privé : tout ce qui concerne le transport avec chauffeur, dans l'ordre du parcours —
// réserver, choisir une formule, voir la flotte, comprendre le déroulé, lever les doutes.
import { icon } from '../components/icons.mjs';
import { esc, rs } from '../components/util.mjs';
import { SERVICES, bookingWidget, fleetCard, faq, faqLd, secHead, cta, waButton, pageHead } from '../components/sections.mjs';
import { breadcrumb, breadcrumbLd } from '../components/layout.mjs';

export default function chauffeur(ctx) {
  const { data, root } = ctx;
  const crumbs = [{ label: 'Chauffeur privé' }];
  const body = `
${pageHead(ctx, {
  crumbs: breadcrumb(ctx, crumbs), eyebrow: 'Transport avec chauffeur', title: 'Votre chauffeur privé à Dakar',
  lead: 'Choisissez la formule, indiquez la date : nous vous répondons sur WhatsApp avec le tarif et la confirmation.',
  leadShort: 'Tarif et confirmation sur WhatsApp.',
  extra: `<div class="booking-slot" id="reserver">${bookingWidget(ctx)}</div>`
})}

<section class="section" aria-labelledby="formules-title">
  <div class="container">
    ${secHead({ eyebrow: 'Nos formules', title: 'Une formule pour chaque déplacement', id: 'formules-title' })}
    <div class="formulas">
      ${SERVICES.map((s) => `<a class="formula" href="${root}reservation.html?service=${s.id}" data-reveal>
        <span class="ico">${icon(s.icon)}</span>
        <span class="formula-text"><strong>${esc(s.long)}</strong><span>${esc(s.text)}</span></span>
        <span class="formula-go" aria-hidden="true">${icon('arrow-right')}</span>
      </a>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="section section--soft" id="flotte" aria-labelledby="flotte-title">
  <div class="container">
    ${secHead({ eyebrow: 'La flotte', title: `${data.fleet.length} véhicules disponibles`, lead: 'Des Renault QM3 récentes, climatisées, 5 places. Photos réelles, prises par notre équipe.', leadShort: 'Renault QM3 climatisées, 5 places. Photos réelles.', id: 'flotte-title' })}
    <div class="grid grid--3 fleet-grid">
      ${data.fleet.map((c) => fleetCard(ctx, c)).join('\n      ')}
    </div>
  </div>
</section>

<section class="section" aria-labelledby="deroule-title">
  <div class="container">
    ${secHead({ eyebrow: 'Comment ça marche', title: 'Réserver en trois étapes', id: 'deroule-title' })}
    <ol class="steps">
      <li class="step" data-reveal><h3>Vous décrivez le trajet</h3><p>Formule, date, heure et lieu de prise en charge, en moins d’une minute.</p></li>
      <li class="step" data-reveal><h3>Nous vous envoyons le tarif</h3><p>Votre demande arrive sur WhatsApp ; vous recevez un devis clair.</p></li>
      <li class="step" data-reveal><h3>Le chauffeur vient vous chercher</h3><p>À l’heure convenue, avec le véhicule choisi. Aucun paiement en ligne.</p></li>
    </ol>
  </div>
</section>

<section class="section section--soft" id="faq" aria-labelledby="faq-title">
  <div class="container faq-layout">
    ${secHead({ eyebrow: 'Questions fréquentes', title: 'Avant de réserver', id: 'faq-title' })}
    ${faq(data.faq)}
  </div>
</section>

${cta(ctx, { title: 'Un besoin particulier ?', text: 'Événement, délégation, transport de personnel : décrivez-nous votre projet.', primary: waButton(ctx, 'Écrire sur WhatsApp', 'Bonjour FMB, j’ai un besoin de transport particulier : '), secondary: `<a class="btn btn--ghost" href="${root}reservation.html">${rs('Formulaire de réservation', 'Réserver')}</a>` })}`;
  return {
    id: 'chauffeur', path: 'chauffeur.html', nav: 'chauffeur',
    title: 'Chauffeur privé à Dakar et transfert aéroport AIBD — FMB Transport',
    description: 'Réservez un chauffeur privé à Dakar : à la journée, sur plusieurs jours, transfert aéroport AIBD, trajet en ville ou location longue durée. Tarif sur WhatsApp.',
    body, jsonLd: [breadcrumbLd(ctx, crumbs), faqLd(data.faq)]
  };
}
