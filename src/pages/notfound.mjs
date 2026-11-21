import { icon } from '../components/icons.mjs';
export default function notfound(ctx) {
  // La page 404 peut être servie depuis n'importe quelle URL : ses liens sont donc absolus (voir build.mjs).
  return {
    id: 'notfound', path: '404.html', nav: '', noindex: true,
    title: 'Page introuvable — FMB Transport', description: 'La page demandée n’existe pas ou a été déplacée.',
    body: `<section class="notfound"><div class="container">
  <p class="code" aria-hidden="true">4<span>0</span>4</p>
  <h1>Cette page a pris une autre route</h1>
  <p class="lead">La page demandée n’existe pas ou a été déplacée. Reprenez la route depuis l’accueil ou consultez nos véhicules.</p>
  <div class="notfound-actions"><a class="btn" href="${ctx.root}index.html">Retour à l’accueil${icon('arrow-right')}</a><a class="btn btn--secondary" href="${ctx.root}vehicules.html">Véhicules à vendre</a><a class="btn btn--secondary" href="${ctx.root}contact.html">Nous contacter</a></div>
</div></section>`
  };
}
