// Pages légales. ⚠ Modèles à relire et faire valider (juriste) avant mise en ligne définitive.
import { esc } from '../components/util.mjs';
import { pageHead } from '../components/sections.mjs';
import { breadcrumb } from '../components/layout.mjs';

const todo = (v, what) => v ? esc(v) : `<span class="todo">à compléter : ${what}</span>`;
const page = (ctx, { path, label, title, description, lead, html }) => ({
  id: 'legal', path, nav: '', title: `${title} — FMB Transport`, description,
  body: `${pageHead(ctx, { crumbs: breadcrumb(ctx, [{ label }]), title, lead })}
<section class="section"><div class="container container--narrow"><div class="prose">${html}</div></div></section>`
});

export function mentions(ctx) {
  const { site, data } = ctx;
  const a = site.address;
  const credits = Object.entries(data.credits);
  return page(ctx, {
    path: 'mentions-legales.html', label: 'Mentions légales', title: 'Mentions légales',
    description: `Mentions légales du site ${site.name} : éditeur, hébergeur, propriété intellectuelle et crédits photos.`,
    lead: 'Informations sur l’éditeur du site, son hébergement et les contenus publiés.',
    html: `
<h2>Éditeur du site</h2>
<p><strong>${esc(site.legalName)}</strong><br>${esc(a.locality)}, ${esc(a.street)}, ${esc(a.region)}, ${esc(a.countryName)}<br>
Registre du commerce : ${site.rc}<br>NINEA : ${site.ninea}<br>
Téléphone : <a href="tel:${site.phoneE164}">${site.phoneDisplay}</a> · E-mail : <a href="mailto:${site.email}">${site.email}</a></p>
<p>Directeur de la publication : ${todo(site.publicationDirector, 'nom du responsable')}</p>
<h2>Hébergement</h2>
<p>${todo(site.host.name, 'nom de l’hébergeur')} — ${todo(site.host.address, 'adresse de l’hébergeur')} — ${todo(site.host.website, 'site web de l’hébergeur')}</p>
<h2>Propriété intellectuelle</h2>
<p>Les textes, le logo et les photos des véhicules de la flotte FMB sont la propriété de ${esc(site.legalName)}. Toute reproduction sans autorisation est interdite.</p>
${credits.length ? `<h2>Crédits photos</h2>
<p>Les photos illustrant les annonces de démonstration proviennent de Wikimedia Commons et sont utilisées selon leur licence respective :</p>
<ul>${credits.map(([, c]) => `<li><a href="${esc(c.page)}" target="_blank" rel="noopener nofollow">${esc(c.title)}</a> — ${esc(c.artist || 'auteur inconnu')} — ${esc(c.license)}</li>`).join('')}</ul>` : ''}
<h2>Responsabilité</h2>
<p>Les informations publiées (disponibilités, caractéristiques et prix des véhicules) sont données à titre indicatif et peuvent évoluer. Seul le devis ou la confirmation transmis par notre équipe engage ${esc(site.name)}.</p>`
  });
}

export function privacy(ctx) {
  const { site } = ctx;
  return page(ctx, {
    path: 'confidentialite.html', label: 'Confidentialité', title: 'Politique de confidentialité',
    description: `Comment ${site.name} traite vos données personnelles : données collectées, finalités, durée de conservation et droits.`,
    lead: 'Nous collectons le strict nécessaire pour répondre à votre demande, rien de plus.',
    html: `
<h2>Responsable du traitement</h2>
<p>${esc(site.legalName)}, ${esc(site.address.locality)}, ${esc(site.address.region)}, ${esc(site.address.countryName)} — <a href="mailto:${site.email}">${site.email}</a>.</p>
<h2>Données que vous nous transmettez</h2>
<p>Ce site ne possède ni compte utilisateur ni base de données. Les formulaires (réservation, rendez-vous, contact) préparent un message que <strong>vous envoyez vous-même</strong> depuis WhatsApp ou votre messagerie. Nous recevons alors les informations que vous avez saisies : nom, numéro de téléphone, détails du trajet ou de la demande.</p>
<h2>Finalités et base légale</h2>
<ul><li>Répondre à votre demande, établir un devis et organiser la prestation (mesures précontractuelles et exécution du contrat).</li><li>Assurer le suivi de la relation client (intérêt légitime).</li></ul>
<h2>Destinataires</h2>
<p>Vos informations sont lues par l’équipe ${esc(site.name)}. Les messages transitent par le service que vous choisissez (WhatsApp, édité par Meta, ou votre fournisseur de messagerie), selon leurs propres règles de confidentialité. Nous ne vendons ni ne louons vos données.</p>
<h2>Durée de conservation</h2>
<p>Les échanges sont conservés le temps nécessaire au traitement de la demande et au suivi de la prestation, puis supprimés ou archivés conformément aux obligations légales applicables.</p>
<h2>Stockage sur votre appareil et cookies</h2>
<p>Le site n’utilise pas de cookies publicitaires. Il enregistre uniquement sur votre appareil (stockage local du navigateur) : vos véhicules favoris et, le temps de votre visite, le brouillon de votre réservation. Ces éléments ne nous sont pas transmis et peuvent être effacés à tout moment depuis les réglages de votre navigateur.</p>
<p>Si une mesure d’audience est activée ultérieurement, elle ne sera déclenchée qu’après votre accord, recueilli par un bandeau de consentement.</p>
<h2>Vos droits</h2>
<p>Conformément à la loi sénégalaise n° 2008-12 du 25 janvier 2008 sur la protection des données à caractère personnel et, pour les personnes situées dans l’Union européenne, au Règlement général sur la protection des données (RGPD), vous disposez d’un droit d’accès, de rectification, d’opposition et de suppression de vos données. Pour l’exercer, écrivez à <a href="mailto:${site.email}">${site.email}</a>. Vous pouvez également saisir la Commission de protection des données personnelles (CDP) du Sénégal ou l’autorité de contrôle de votre pays de résidence.</p>`
  });
}

export function terms(ctx) {
  const { site } = ctx;
  return page(ctx, {
    path: 'conditions.html', label: 'Conditions d’utilisation', title: 'Conditions d’utilisation',
    description: `Conditions d’utilisation du site ${site.name} : demandes de réservation, devis, annonces de véhicules.`,
    lead: 'Les règles simples qui encadrent l’utilisation de ce site.',
    html: `
<h2>Objet du site</h2>
<p>Le site présente les services de ${esc(site.legalName)} et permet d’envoyer des demandes : réservation d’un véhicule avec chauffeur, information sur un véhicule à vendre, prise de rendez-vous ou contact.</p>
<h2>Demandes de réservation et devis</h2>
<p>L’envoi d’une demande ne vaut pas réservation ferme. Les tarifs sont établis sur devis, selon le service, la date et la durée. La réservation n’est confirmée qu’après accord de notre équipe sur la disponibilité et le tarif. Aucun paiement n’est effectué sur le site.</p>
<h2>Véhicules à vendre</h2>
<p>Les annonces décrivent les véhicules de bonne foi. Les prix sont indiqués en FCFA, dédouanement inclus. La disponibilité d’un véhicule et ses caractéristiques définitives sont confirmées par notre équipe avant toute vente.</p>
<h2>Investissement participatif</h2>
<p>Les informations de la page « Investir » sont fournies à titre d’information et ne constituent pas une offre au public ni un conseil en investissement. Tout investissement comporte un risque, y compris de perte en capital. Les modalités sont communiquées sur demande.</p>
<h2>Bon usage</h2>
<p>Vous vous engagez à fournir des informations exactes et à ne pas utiliser le site à des fins frauduleuses ou portant atteinte à son fonctionnement.</p>
<h2>Droit applicable</h2>
<p>Les présentes conditions sont soumises au droit sénégalais. Pour toute question : <a href="mailto:${site.email}">${site.email}</a>.</p>`
  });
}
