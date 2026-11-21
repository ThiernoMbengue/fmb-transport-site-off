import { icon } from '../components/icons.mjs';
import { esc, picture, waLink, rs } from '../components/util.mjs';
import { pageHero, ctaBand } from '../components/sections.mjs';
import { breadcrumb, breadcrumbLd } from '../components/layout.mjs';

export default function services(ctx) {
  const { site, data, root } = ctx;
  const crumbs = [{ label: 'Services' }];
  const waOwner = waLink(site, 'Bonjour FMB, je possède un véhicule et je souhaite vous le confier pour qu’il soit géré.');
  const body = `
${pageHero(ctx, { crumbs: breadcrumb(ctx, crumbs), eyebrow: 'Les services de FMB', title: 'Gestion, achat, vente et investissement', lead: 'Au-delà du transport avec chauffeur, FMB accompagne les propriétaires, les entreprises et les investisseurs.', leadShort: 'Pour les propriétaires, entreprises et investisseurs.' })}
<section class="section">
  <div class="container">
    <div class="grid grid--4">
      ${data.services.map((s) => `<article class="service-card" id="${s.id}" data-reveal>
        <span class="ico-tile">${icon(s.icon)}</span>
        <h2 class="h3">${esc(s.title)}</h2>
        <p>${esc(s.text)}</p>
        <a class="link-arrow" href="${s.href ? root + s.href : waLink(site, s.wa)}"${s.href ? '' : ' target="_blank" rel="noopener"'}>${rs(esc(s.cta), esc(s.ctaShort))}${icon('arrow-right')}</a>
      </article>`).join('\n      ')}
    </div>
  </div>
</section>
<section class="section section--dark" id="proprietaires" aria-labelledby="proprio-title">
  <div class="container split">
    <div class="stack" data-reveal>
      <span class="eyebrow">Propriétaires de véhicules</span>
      <h2 id="proprio-title">Vous avez un véhicule ? Confiez-le-nous.</h2>
      <p>${rs('Nous mettons votre véhicule en service et le gérons pour vous. Vous suivez son activité grâce à des relevés de versements réguliers.', 'Nous le gérons, vous suivez les versements.')}</p>
      <ul class="tick-list lg">
        <li>${icon('check-circle')}Location, Yango ou chauffeur : nous gérons l’exploitation</li>
        <li>${icon('check-circle')}Entretien suivi par notre équipe</li>
        <li>${icon('check-circle')}Relevés de versements détaillés, jour par jour</li>
      </ul>
      <div><a class="btn btn--cta" href="${waOwner}" target="_blank" rel="noopener">${icon('handshake')}Confier mon véhicule</a></div>
    </div>
    <ol class="steps">
      <li class="step" data-reveal><h3>Vous nous le confiez</h3><p>Nous étudions votre véhicule et convenons des modalités avec vous.</p></li>
      <li class="step" data-reveal><h3>Nous le mettons en service</h3><p>Location, Yango ou chauffeur : nous gérons l’exploitation et l’entretien.</p></li>
      <li class="step" data-reveal><h3>Vous suivez les résultats</h3><p>Vous recevez des relevés de versements détaillés, jour par jour.</p></li>
    </ol>
  </div>
</section>
<section class="section section--white">
  <div class="container split">
    <div class="split-media lg" data-reveal>${picture(ctx, 'qm3-creme-avant', 'Renault QM3 crème de la flotte FMB', { sizes: '(min-width: 900px) 580px, 92vw' })}</div>
    <div class="stack" data-reveal>
      <span class="eyebrow">Transport avec chauffeur</span>
      <h2>Besoin d’un chauffeur à Dakar ?</h2>
      <p class="lead">${rs('Transfert aéroport AIBD, chauffeur à la journée ou sur plusieurs jours, location longue durée avec ou sans chauffeur.', 'Aéroport, journée, plusieurs jours ou longue durée.')}</p>
      <div class="cluster"><a class="btn btn--cta" href="${root}reservation.html">${rs('Réserver un chauffeur', 'Réserver')}${icon('arrow-right')}</a><a class="btn btn--outline" href="${root}index.html#flotte">${rs('Voir la flotte', 'La flotte')}</a></div>
    </div>
  </div>
</section>
${ctaBand(ctx, { title: 'Un projet ? Parlons-en.', text: 'Gestion de flotte, courtage, transport scolaire : décrivez votre besoin, nous revenons vers vous rapidement.' })}`;
  return {
    id: 'services', path: 'services.html', nav: 'services',
    title: 'Services : gestion de véhicules, courtage, transport scolaire — FMB Transport',
    description: 'Gestion de véhicules de location et de bus, exploitation sur Yango, vente de véhicules dédouanés, achat en courtage, investissement participatif et transport scolaire à Dakar.',
    body, jsonLd: [breadcrumbLd(ctx, crumbs)]
  };
}
