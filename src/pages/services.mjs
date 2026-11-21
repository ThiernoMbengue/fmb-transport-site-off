// Services : les offres au-delà du transport, rangées par type de client.
import { icon } from '../components/icons.mjs';
import { esc, waLink, rs } from '../components/util.mjs';
import { pageHead, secHead, cta, waButton } from '../components/sections.mjs';
import { breadcrumb, breadcrumbLd } from '../components/layout.mjs';

const GROUPS = [
  { id: 'proprietaires', title: 'Propriétaires de véhicules', text: 'Votre véhicule travaille, nous gérons tout.', items: ['confier', 'gestion-location', 'yango'] },
  { id: 'entreprises', title: 'Entreprises et établissements', text: 'Transport collectif et scolaire, sur mesure.', items: ['gestion-bus', 'scolaire'] },
  { id: 'achat', title: 'Achat de véhicules', text: 'Des véhicules dédouanés, prix tout compris.', items: ['vente', 'courtage'] },
  { id: 'investisseurs', title: 'Investisseurs', text: 'Financez des véhicules, suivez leurs résultats.', items: ['investissement'] }
];

export default function services(ctx) {
  const { site, data, root } = ctx;
  const crumbs = [{ label: 'Services' }];
  const byId = Object.fromEntries(data.services.map((s) => [s.id, s]));
  const row = (s) => {
    const href = s.href ? root + s.href : waLink(site, s.wa);
    return `<article class="service" id="${s.id}" data-reveal>
          <span class="ico">${icon(s.icon)}</span>
          <div><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div>
          <a class="link-arrow" href="${href}"${s.href ? '' : ' target="_blank" rel="noopener"'}>${rs(esc(s.cta), esc(s.ctaShort))}${icon('arrow-right')}</a>
        </article>`;
  };
  const body = `
${pageHead(ctx, { crumbs: breadcrumb(ctx, crumbs), eyebrow: 'Services', title: 'Au-delà du transport', lead: 'Gestion de véhicules, transport collectif, achat et investissement : FMB accompagne les propriétaires, les entreprises et les investisseurs.', leadShort: 'Pour les propriétaires, entreprises et investisseurs.' })}

<section class="section">
  <div class="container">
    ${GROUPS.map((g) => `<div class="service-group" id="${g.id}">
      <div class="service-group-head"><h2>${g.title}</h2><p>${g.text}</p></div>
      <div class="service-list">
        ${g.items.map((id) => row(byId[id])).join('\n        ')}
      </div>
    </div>`).join('\n    ')}
  </div>
</section>

<section class="section section--soft" aria-labelledby="confier-title">
  <div class="container">
    ${secHead({ eyebrow: 'Propriétaires', title: 'Confier votre véhicule en trois étapes', id: 'confier-title', action: `<a class="btn" href="${waLink(site, 'Bonjour FMB, je possède un véhicule et je souhaite vous le confier pour qu’il soit géré.')}" target="_blank" rel="noopener">${rs('Confier mon véhicule', 'Confier mon véhicule')}</a>` })}
    <ol class="steps">
      <li class="step" data-reveal><h3>Vous nous le confiez</h3><p>Nous étudions votre véhicule et convenons des modalités avec vous.</p></li>
      <li class="step" data-reveal><h3>Nous le mettons en service</h3><p>Location, Yango ou chauffeur : nous gérons l’exploitation et l’entretien.</p></li>
      <li class="step" data-reveal><h3>Vous suivez les résultats</h3><p>Vous recevez des relevés de versements détaillés, jour par jour.</p></li>
    </ol>
  </div>
</section>

${cta(ctx, { title: 'Un projet à nous présenter ?', text: 'Gestion de flotte, transport du personnel, courtage : décrivez votre besoin, nous revenons vers vous rapidement.', primary: waButton(ctx), secondary: `<a class="btn btn--ghost" href="${root}contact.html">Nous contacter</a>` })}`;
  return {
    id: 'services', path: 'services.html', nav: 'services',
    title: 'Services : gestion de véhicules, transport collectif, courtage — FMB Transport',
    description: 'Gestion de véhicules de location et de bus, exploitation sur Yango, transport scolaire, vente de véhicules dédouanés, achat en courtage et investissement participatif à Dakar.',
    body, jsonLd: [breadcrumbLd(ctx, crumbs)]
  };
}
