import { icon } from '../components/icons.mjs';
import { esc, imgUrl, picture } from '../components/util.mjs';
import { SERVICES, bookingFields } from '../components/sections.mjs';
import { breadcrumb } from '../components/layout.mjs';

export default function reservation(ctx) {
  const { site, data } = ctx;
  const crumbs = [{ label: 'Réservation' }];
  const body = `
<section class="section section--tight">
  <div class="container">
    ${breadcrumb(ctx, crumbs, true)}
    <div data-reserve-form>
      <div class="section-head" style-reset>
        <h1 class="h-page">Finalisez votre réservation</h1>
        <p class="lead">Vérifiez votre trajet, ajoutez vos coordonnées, puis envoyez votre demande sur WhatsApp. Les champs marqués d’un * sont obligatoires.</p>
      </div>
      <form class="reserve" data-booking="full" novalidate>
        <div>
          <div class="alert alert--error" role="alert" tabindex="-1" data-form-summary hidden>${icon('alert')}<span></span></div>
          <fieldset class="form-block">
            <legend class="form-step"><span class="n">1</span>Votre trajet</legend>
            <div class="form-grid">
              <div class="field" data-field="service"><label for="r-service">Service <span aria-hidden="true">*</span></label>
                <select class="select" id="r-service" name="service" data-service-input>${SERVICES.map((s, i) => `<option value="${s.id}"${i === 0 ? ' selected' : ''}>${s.long}</option>`).join('')}</select></div>
              ${bookingFields('r', { full: true })}
            </div>
          </fieldset>
          <fieldset class="form-block">
            <legend class="form-step"><span class="n">2</span>Votre véhicule</legend>
            <div class="veh-options">
              <div class="veh-option"><input type="radio" name="vehicule" id="r-veh-any" value="" checked><label for="r-veh-any"><span class="any">${icon('car')}</span>Peu importe</label></div>
              ${data.fleet.map((c) => `<div class="veh-option"><input type="radio" name="vehicule" id="r-veh-${c.id}" value="${c.id}" data-name="${esc(c.name)}" data-sub="${esc(c.sub)}" data-img="${imgUrl(ctx, c.photos[0].key, 800)}"><label for="r-veh-${c.id}">${picture(ctx, c.photos[0].key, '', { sizes: '160px', max: 480, avif: false })}${esc(c.short)}</label></div>`).join('\n              ')}
            </div>
          </fieldset>
          <fieldset class="form-block">
            <legend class="form-step"><span class="n">3</span>Vos coordonnées</legend>
            <div class="form-grid">
              <div class="field" data-field="nom"><label for="r-nom">Nom et prénom <span aria-hidden="true">*</span></label><input class="input" id="r-nom" name="nom" type="text" placeholder="Par exemple Awa Diop" autocomplete="name" maxlength="80" required><span class="field-error" data-error hidden></span></div>
              <div class="field" data-field="telephone"><label for="r-telephone">Téléphone ou WhatsApp <span aria-hidden="true">*</span></label><input class="input" id="r-telephone" name="telephone" type="tel" inputmode="tel" placeholder="+221 77 000 00 00" autocomplete="tel" maxlength="24" required><span class="field-error" data-error hidden></span></div>
              <div class="field span-all" data-field="precisions"><label for="r-precisions">Précisions <span class="opt">(facultatif)</span></label><textarea class="textarea" id="r-precisions" name="precisions" placeholder="Bagages, enfants, arrêts souhaités, autre besoin…" maxlength="500"></textarea></div>
            </div>
          </fieldset>
        </div>
        <aside class="recap" aria-label="Récapitulatif de votre demande">
          <div class="recap-media" data-recap-media><span>Véhicule au choix de FMB</span></div>
          <div class="recap-body">
            <div><p class="recap-title" data-recap-title>Chauffeur à la journée</p><p class="vcard-sub" data-recap-sub>Véhicule au choix de FMB</p></div>
            <dl class="recap-list" data-recap-list aria-live="polite"></dl>
            <div class="recap-total"><span class="price-label">Tarif</span><span class="price">Sur devis</span></div>
            <button class="btn btn--wa btn--block" type="submit">${icon('whatsapp')}Envoyer sur WhatsApp</button>
            <p class="recap-note">Aucun paiement en ligne. WhatsApp s’ouvre avec votre demande déjà rédigée ; notre équipe vous répond avec le tarif et la confirmation. En envoyant, vous acceptez notre <a href="confidentialite.html">politique de confidentialité</a>.</p>
          </div>
        </aside>
      </form>
    </div>
    <div class="success" data-reserve-success hidden tabindex="-1">
      <span class="ico-tile">${icon('check')}</span>
      <h2>Dernière étape : envoyez le message sur WhatsApp</h2>
      <p>WhatsApp s’est ouvert avec votre demande déjà rédigée. Appuyez sur « Envoyer » pour la transmettre à notre équipe : elle vous répond avec le tarif et la confirmation de disponibilité.</p>
      <dl class="recap-list" data-success-list></dl>
      <div class="cluster">
        <a class="btn btn--wa" href="#" target="_blank" rel="noopener" data-success-wa>${icon('whatsapp')}Rouvrir WhatsApp</a>
        <button class="btn btn--outline" type="button" data-success-edit>Modifier ma demande</button>
        <button class="btn btn--outline" type="button" data-success-new>Nouvelle réservation</button>
      </div>
      <p class="recap-note">WhatsApp ne s’ouvre pas ? Appelez-nous au <a href="tel:${site.phoneE164}">${site.phoneDisplay}</a>.</p>
    </div>
  </div>
</section>`.replace(' style-reset', '');
  return {
    id: 'reservation', path: 'reservation.html', nav: 'home',
    title: 'Réserver un chauffeur à Dakar — FMB Transport',
    description: 'Finalisez votre demande de réservation : trajet, véhicule et coordonnées. Aucun paiement en ligne, confirmation et tarif sur WhatsApp.',
    body
  };
}
