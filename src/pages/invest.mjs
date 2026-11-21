import { icon } from '../components/icons.mjs';
import { fmtInt, waLink, rs } from '../components/util.mjs';
import { ctaBand } from '../components/sections.mjs';
import { breadcrumb, breadcrumbLd } from '../components/layout.mjs';

// Graphique en barres : hauteurs relatives issues du relevé (src/data/dashboard.json).
function chart(d) {
  const W = 560, H = 150, base = 126, n = d.bars.length, bw = 16, step = (W - 16 - bw) / (n - 1);
  const bars = d.bars.map((h, i) => `<rect class="bar" x="${(8 + i * step).toFixed(1)}" y="${(base - h).toFixed(1)}" width="${bw}" height="${h}" rx="3"><title>Jour d’activité ${i + 1}</title></rect>`).join('');
  const avgY = (base - d.avgBar).toFixed(1);
  return `<svg role="img" aria-label="Net par jour d’activité, ${d.period} : ${n} jours, moyenne ${fmtInt(d.kpis.avgNet)} FCFA par jour" viewBox="0 0 ${W} ${H}"><line class="grid-line" x1="8" y1="${base}" x2="${W - 8}" y2="${base}"/>${bars}<line x1="8" y1="${avgY}" x2="${W - 8}" y2="${avgY}" class="avg-line" stroke-width="2" stroke-dasharray="5 4"/><text x="8" y="144">1 sept.</text><text x="${W - 8}" y="144" text-anchor="end">30 sept.</text></svg>`;
}

export default function invest(ctx) {
  const { site, data } = ctx;
  const d = data.dashboard;
  const crumbs = [{ label: 'Investir' }];
  const wa = waLink(site, 'Bonjour FMB, je souhaite en savoir plus sur l’investissement participatif et l’accès au tableau de bord.');
  const body = `
<section class="page-hero">
  <div class="container split">
    <div class="stack">
      ${breadcrumb(ctx, crumbs)}
      <span class="eyebrow">Investissement participatif</span>
      <h1>Investissez dans le transport, ensemble</h1>
      <p class="lead">${rs('Participez au financement de véhicules exploités par FMB et suivez leur activité en toute transparence, depuis votre tableau de bord investisseur.', 'Financez des véhicules FMB, suivez leurs résultats en direct.')}</p>
      <ul class="tick-list tick-list--light lg">
        <li>${icon('check-circle')}Participez au financement de véhicules exploités par FMB</li>
        <li>${icon('check-circle')}Suivez les recettes, les dépenses et les versements de chaque véhicule</li>
        <li>${icon('check-circle')}Consultez les données réelles dans votre tableau de bord</li>
      </ul>
      <div><a class="btn btn--cta" href="${wa}" target="_blank" rel="noopener">${rs('Demander l’accès au tableau de bord', 'Demander l’accès')}${icon('arrow-right')}</a></div>
      <p class="disclaimer">Les modalités de participation sont communiquées sur demande. Tout investissement comporte un risque, y compris de perte en capital.</p>
    </div>
    <div class="stack">
      <div class="dash">
        <div class="dash-head"><div><strong>Tableau de bord investisseur</strong><span>Un véhicule exploité par FMB · ${d.period}</span></div><span class="chip chip--amber">Aperçu</span></div>
        <div class="kpis">
          <div class="kpi"><span>Recette</span><strong class="num">${fmtInt(d.kpis.revenue)}</strong><small>FCFA</small></div>
          <div class="kpi"><span>Dépenses</span><strong class="num">${fmtInt(d.kpis.expenses)}</strong><small>FCFA</small></div>
          <div class="kpi kpi--accent"><span>Net versé</span><strong class="num">${fmtInt(d.kpis.net)}</strong><small>FCFA</small></div>
          <div class="kpi"><span>Activité</span><strong class="num">${d.kpis.days}</strong><small>jours</small></div>
        </div>
        <div class="dash-chart">
          <div class="dash-chart-head"><strong>Net par jour d’activité</strong><span class="legend-avg">Moyenne : ${fmtInt(d.kpis.avgNet)} FCFA par jour</span></div>
          ${chart(d)}
        </div>
        <div class="table-wrap" tabindex="0" role="region" aria-label="Derniers relevés journaliers">
          <table class="table num">
            <thead><tr><th scope="col">Date</th><th scope="col" class="r">Recette</th><th scope="col" class="r">Dépenses</th><th scope="col" class="r">Net</th></tr></thead>
            <tbody>${d.rows.map((r) => `<tr><td>${r.date}</td><td class="r">${fmtInt(r.revenue)}</td><td class="r">${fmtInt(r.expenses)}</td><td class="r"><strong>${fmtInt(r.net)}</strong></td></tr>`).join('')}</tbody>
          </table>
        </div>
      </div>
      <p class="disclaimer">Données réelles d’un véhicule exploité par FMB, présentées sans information personnelle. Les performances passées ne préjugent pas des performances futures.</p>
    </div>
  </div>
</section>
<section class="section" aria-labelledby="inv-how">
  <div class="container">
    <div class="section-head" data-reveal><span class="eyebrow">Le principe</span><h2 id="inv-how">Un suivi transparent, véhicule par véhicule</h2></div>
    <ol class="steps steps--light">
      <li class="step" data-reveal><h3>Vous nous contactez</h3><p>Les modalités de participation vous sont communiquées sur demande, par WhatsApp ou par téléphone.</p></li>
      <li class="step" data-reveal><h3>FMB exploite le véhicule</h3><p>Location, chauffeur ou plateforme : notre équipe gère l’exploitation et l’entretien au quotidien.</p></li>
      <li class="step" data-reveal><h3>Vous suivez l’activité</h3><p>Recettes, dépenses et versements sont consultables dans votre tableau de bord investisseur.</p></li>
    </ol>
  </div>
</section>
${ctaBand(ctx, { title: 'Envie d’en savoir plus ?', text: 'Demandez les modalités de participation et un accès au tableau de bord : nous vous répondons directement.' })}`;
  return {
    id: 'invest', path: 'investir.html', nav: 'invest',
    title: 'Investissement participatif dans le transport à Dakar — FMB Transport',
    description: 'Participez au financement de véhicules exploités par FMB et suivez recettes, dépenses et versements dans un tableau de bord investisseur.',
    body, jsonLd: [breadcrumbLd(ctx, crumbs)]
  };
}
