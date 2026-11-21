import { icon } from '../components/icons.mjs';
import { esc, waLink, rs } from '../components/util.mjs';
import { pageHead } from '../components/sections.mjs';
import { breadcrumb, breadcrumbLd } from '../components/layout.mjs';

export default function contact(ctx) {
  const { site } = ctx;
  const a = site.address;
  const crumbs = [{ label: 'Contact' }];
  const mapUrl = `https://www.openstreetmap.org/search?query=${encodeURIComponent(`${a.locality}, ${a.region}, ${a.countryName}`)}`;
  const channel = (href, ico, title, text, ext = false, cls = '') => `<a class="channel${cls}" href="${href}"${ext ? ' target="_blank" rel="noopener"' : ''}><span class="ico">${icon(ico)}</span><span><strong>${title}</strong><span>${text}</span></span>${icon('arrow-right')}</a>`;
  const body = `
${pageHead(ctx, { crumbs: breadcrumb(ctx, crumbs), eyebrow: 'Contact', title: 'Parlons de votre projet', lead: 'Une réservation, un véhicule à acheter ou à confier, une question : nous vous répondons directement.', leadShort: 'Nous vous répondons directement.' })}

<section class="section section--tight">
  <div class="container">
    <div class="channels">
      ${channel(waLink(site, 'Bonjour FMB Transport, '), 'whatsapp', 'WhatsApp', 'Réponse la plus rapide', true, ' channel--wa')}
      ${channel(`tel:${site.phoneE164}`, 'phone', 'Appeler', site.phoneDisplay)}
      ${channel(`mailto:${site.email}`, 'mail', 'E-mail', site.email)}
    </div>
    <div class="contact-grid">
      <div class="card contact-form">
        <div><h2>Envoyer un message</h2><p>${rs('Votre message s’ouvre dans WhatsApp ou dans votre messagerie, déjà rédigé : il ne reste qu’à l’envoyer.', 'Il s’ouvre déjà rédigé, prêt à envoyer.')}</p></div>
        <form class="form-grid" data-wa-form data-wa-intro="Bonjour FMB Transport," data-success="Votre message est prêt : il ne reste qu’à l’envoyer." novalidate>
          <div class="alert alert--error span-all" role="alert" tabindex="-1" data-form-summary hidden>${icon('alert')}<span></span></div>
          <div class="field field--full" data-field="nom"><label for="c-nom">Nom et prénom <span aria-hidden="true">*</span></label><input class="input" id="c-nom" name="nom" data-label="Nom" type="text" autocomplete="name" maxlength="80" required data-min="2" data-msg="Indiquez votre nom et prénom."><span class="field-error" data-error hidden></span></div>
          <div class="field field--full" data-field="telephone"><label for="c-tel">Téléphone ou WhatsApp <span aria-hidden="true">*</span></label><input class="input" id="c-tel" name="telephone" data-label="Téléphone" type="tel" inputmode="tel" autocomplete="tel" maxlength="24" required data-phone data-msg="Indiquez un numéro valide (8 chiffres minimum)."><span class="field-error" data-error hidden></span></div>
          <div class="field span-all" data-field="sujet"><label for="c-sujet">Sujet</label><select class="select" id="c-sujet" name="sujet" data-label="Sujet"><option>Réservation d’un chauffeur</option><option>Achat d’un véhicule</option><option>Confier mon véhicule</option><option>Investissement participatif</option><option>Transport scolaire</option><option>Autre demande</option></select></div>
          <div class="field span-all" data-field="message"><label for="c-message">Votre message <span aria-hidden="true">*</span></label><textarea class="textarea" id="c-message" name="message" data-label="Message" maxlength="1000" required data-min="10" data-msg="Écrivez votre message (10 caractères minimum)." placeholder="Décrivez votre besoin…"></textarea><span class="field-error" data-error hidden></span></div>
          <fieldset class="field span-all"><legend class="label">Envoyer par</legend>
            <div class="radio-pills">
              <label><input type="radio" name="canal" value="whatsapp" checked><span>${icon('whatsapp')}WhatsApp</span></label>
              <label><input type="radio" name="canal" value="email"><span>${icon('mail')}E-mail</span></label>
            </div>
          </fieldset>
          <div class="span-all form-submit"><button class="btn" type="submit">Envoyer mon message${icon('arrow-right')}</button>
          <p class="form-note">Aucune donnée n’est stockée sur ce site : votre message part depuis votre application. <a href="confidentialite.html">Confidentialité</a></p></div>
        </form>
      </div>
      <aside class="card contact-info" aria-labelledby="coord-title">
        <h2 id="coord-title">Coordonnées</h2>
        <ul class="contact-list">
          <li>${icon('pin')}<div><span>Adresse</span><strong>${esc(a.locality)}, ${esc(a.street)}</strong></div></li>
          <li>${icon('building')}<div><span>Société</span><strong>${esc(site.legalName)}</strong><span>RC ${site.rc} · NINEA ${site.ninea}</span></div></li>
        </ul>
        <a class="btn btn--secondary btn--sm" href="${mapUrl}" target="_blank" rel="noopener">${icon('map')}Voir sur la carte</a>
      </aside>
    </div>
  </div>
</section>`;
  return {
    id: 'contact', path: 'contact.html', nav: 'contact',
    title: 'Contact — FMB Transport, Dakar',
    description: `Contactez FMB Transport par WhatsApp, téléphone (${site.phoneDisplay}) ou e-mail. ${a.locality}, Dakar.`,
    body, jsonLd: [breadcrumbLd(ctx, crumbs)]
  };
}
