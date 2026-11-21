// Tests de bout en bout : parcours réels dans un navigateur (réservation, catalogue, favoris, galerie, contact, mobile).
// Prérequis : npm install (Playwright) · lancer `npm run dev` dans un terminal, puis `npm run e2e` dans un autre.
const { chromium } = require('playwright');
const assert = require('assert');
const B = 'http://localhost:4173/';
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  const popups = []; ctx.on('page', pg => popups.push(pg.url()));
  await ctx.route('https://wa.me/**', r => r.fulfill({ body: 'wa' }));
  await ctx.route('https://api.whatsapp.com/**', r => r.fulfill({ body: 'wa' }));

  // 1. Widget accueil → réservation
  // 1. Module de réservation (page Chauffeur privé) → formulaire complet
  await p.goto(B + 'chauffeur.html');
  await p.click('#tab-aeroport');
  assert(await p.isVisible('#w-sens'), 'sens visible'); assert(!(await p.isVisible('#w-duree')), 'duree cachée');
  await p.selectOption('#w-sens', 'aibd'); await p.fill('#w-depart', 'Almadies'); await p.fill('#w-date', '2027-03-10'); await p.fill('#w-heure', '21:30'); await p.fill('#w-passagers', '3');
  await p.click('.booking button[type=submit]');
  await p.waitForURL(/reservation\.html\?/);
  assert.equal(await p.inputValue('#r-service'), 'aeroport'); assert.equal(await p.inputValue('#r-depart'), 'Almadies'); assert.equal(await p.inputValue('#r-passagers'), '3');
  assert(await p.isVisible('#r-vol'), 'vol visible');
  let recap = await p.innerText('[data-recap-list]'); assert(/AIBD vers Dakar/.test(recap) && /10\/03\/2027/.test(recap) && /21:30/.test(recap), 'recap ' + recap);
  // 2. Validation
  await p.click('.recap button[type=submit]');
  assert(await p.isVisible('[data-form-summary]')); assert(/votre nom, votre téléphone/.test(await p.innerText('[data-form-summary]')));
  assert.equal(await p.getAttribute('#r-nom', 'aria-invalid'), 'true');
  await p.fill('#r-nom', 'Awa Diop'); await p.fill('#r-telephone', '77 000'); 
  assert(/trop court/.test(await p.innerText('[data-field=telephone] [data-error]')));
  await p.fill('#r-telephone', '+221 77 000 00 00'); await p.check('#r-veh-bleu', { force: true });
  await p.waitForSelector('[data-form-summary]', { state: 'hidden', timeout: 3000 });
  await p.click('.recap button[type=submit]'); await p.waitForTimeout(500);
  assert(await p.isVisible('[data-reserve-success]'), 'succès visible');
  const wa = decodeURIComponent(await p.getAttribute('[data-success-wa]', 'href'));
  assert(/Renault QM3 bleu/.test(wa) && /Awa Diop/.test(wa) && /Transfert aéroport AIBD/.test(wa), wa);
  assert(popups.some(u => /wa\.me|whatsapp/.test(u)), 'popup WhatsApp ' + popups);
  console.log('✔ réservation : widget → formulaire → validation → WhatsApp');
  await p.click('[data-success-edit]'); assert(await p.isVisible('#r-nom'));
  // brouillon conservé
  await p.goto(B + 'reservation.html'); assert.equal(await p.inputValue('#r-nom'), 'Awa Diop'); console.log('✔ brouillon de session restauré');

  // 3. Catalogue
  await p.goto(B + 'vehicules.html');
  const vis = () => p.locator('[data-vehicle]:visible').count();
  assert.equal(await vis(), 12); assert(await p.isVisible('[data-more]'));
  await p.click('[data-more-btn]'); await p.click('[data-more-btn]'); assert.equal(await vis(), 25);
  await p.selectOption('#f-marque', 'Kia'); await p.waitForTimeout(300); assert.equal(await vis(), 8);
  await p.selectOption('#f-type', 'SUV'); await p.waitForTimeout(300); assert.equal(await vis(), 3);
  assert(/marque=Kia/.test(p.url()) && /type=SUV/.test(p.url()));
  await p.selectOption('#f-tri', 'prix-desc'); await p.waitForTimeout(300);
  assert(/Seltos/.test(await p.locator('[data-vehicle]:visible').first().innerText()));
  assert.equal(await p.locator('[data-active-chips] .chip').count(), 2);
  await p.fill('#f-q', 'zzz'); await p.waitForTimeout(300); assert(await p.isVisible('[data-empty]')); assert.equal(await p.innerText('[data-count]'), 'Aucun véhicule');
  await p.click('[data-empty] [data-filters-reset]'); await p.waitForTimeout(200); assert.equal(await vis(), 12);
  await p.fill('#f-q', 'prado'); await p.waitForTimeout(300); assert.equal(await vis(), 1);
  // favoris
  await p.click('[data-vehicle]:visible .fav-btn'); assert.equal(await p.innerText('[data-fav-count]'), '1');
  await p.goto(B + 'vehicules.html?favoris=1'); assert.equal(await vis(), 1);
  console.log('✔ catalogue : pagination, filtres, tri, recherche, état vide, URL, favoris');
  await p.click('[data-vehicle]:visible .vcard-title a'); await p.waitForURL(/land-cruiser-prado/);
  assert.equal(await p.getAttribute('.vehicle-tools [data-fav]', 'aria-pressed'), 'true');
  // RDV
  await p.click('#rendez-vous button[type=submit]'); assert(await p.isVisible('#rendez-vous [data-field=nom] [data-error]'));
  console.log('✔ fiche véhicule : favori synchronisé, validation du rendez-vous');
  // 4. Galerie
  await p.goto(B + 'vehicules/renault-qm3-noir.html');
  await p.click('[data-gallery-next]'); assert.equal(await p.innerText('[data-gallery-counter]'), '2 / 5'); assert(/face/.test(await p.getAttribute('[data-gallery-main]', 'src')));
  await p.click('[data-gallery-zoom]'); assert(await p.isVisible('dialog.lightbox')); await p.keyboard.press('Escape');
  console.log('✔ galerie : navigation et agrandissement');
  // 5. Contact
  await p.goto(B + 'contact.html'); await p.click('form button[type=submit]'); assert(await p.isVisible('[data-form-summary]'));
  await p.fill('#c-nom', 'Test'); await p.fill('#c-tel', '771234567'); await p.fill('#c-message', 'Bonjour, une question sur un véhicule.');
  const n = popups.length; await p.click('form button[type=submit]'); await p.waitForTimeout(900); assert(popups.length > n); assert(await p.isVisible('.toast'));
  console.log('✔ contact : validation, envoi, notification');
  // 6. Révélation au défilement
  await p.goto(B + 'index.html'); const pend = await p.locator('.reveal-pending').count(); assert(pend > 5);
  for (let i = 0; i < 40; i++) { await p.mouse.wheel(0, 400); await p.waitForTimeout(40); } await p.waitForTimeout(800);
  assert.equal(await p.locator('.reveal-pending').count(), 0); console.log('✔ animations au défilement (' + pend + ' blocs)');
  // 6 bis. Architecture : chaque page a son objectif, la navigation y mène
  await p.goto(B + 'index.html');
  for (const href of ['chauffeur.html', 'vehicules.html', 'services.html', 'investir.html', 'contact.html']) assert(await p.isVisible(`.main-nav a[href="${href}"]`), 'menu : ' + href);
  assert.equal(await p.locator('.offer').count(), 3, '3 activités sur l’accueil');
  await p.goto(B + 'chauffeur.html'); assert(await p.isVisible('.booking')); assert.equal(await p.locator('.formula').count(), 5); assert.equal(await p.locator('.fleet').count(), 3);
  await p.click('.faq summary'); await p.waitForTimeout(450); assert(await p.isVisible('.faq details[open] p'));
  await p.goto(B + 'services.html'); assert.equal(await p.locator('.service-group').count(), 4);
  console.log('✔ architecture : menu, accueil, chauffeur (réservation, formules, flotte, FAQ), services groupés');
  // 7. Mobile
  const m = await b.newContext({ viewport: { width: 390, height: 800 }, hasTouch: true, isMobile: true }); const q = await m.newPage(); q.on('pageerror', e => errs.push(e.message));
  await q.goto(B + 'index.html'); await q.click('[data-nav-toggle]'); await q.waitForTimeout(400); assert(await q.isVisible('.main-nav a[href="services.html"]'));
  await q.screenshot({ path: '/dev/null', type: 'png' });
  await q.click('.main-nav a[href="vehicules.html"]'); await q.waitForURL(/vehicules/);
  await q.click('[data-filters-open]'); await q.waitForTimeout(400); await q.screenshot({ path: '/dev/null', type: 'png' });
  await q.selectOption('#f-type', 'Pick-up'); await q.click('.filters-apply'); await q.waitForTimeout(400); assert.equal(await q.locator('[data-vehicle]:visible').count(), 3);
  // barre d'onglets en bas d'écran (remplace l'ancienne barre d'actions et le bouton flottant)
  assert(await q.isVisible('.tabbar'));
  assert.equal(await q.getAttribute('.tabbar [data-tab="vehicles"]', 'aria-current'), 'page');
  // 10 véhicules puis « Afficher plus » avec le nombre restant
  await q.goto(B + 'vehicules.html'); assert.equal(await q.locator('[data-vehicle]:visible').count(), 10);
  assert(/15 restants/.test(await q.innerText('[data-more-btn]')));
  // fiche rapide : panneau qui monte du bas, sans quitter la liste
  await q.locator('.vcard:visible .vcard-title a').first().click(); await q.waitForTimeout(400);
  assert(await q.isVisible('dialog.sheet .sheet-actions')); assert(/vehicules\.html$/.test(q.url()));
  await q.click('dialog.sheet .sheet-close'); await q.waitForTimeout(400); assert(!(await q.isVisible('dialog.sheet')));
  await q.goto(B + 'vehicules/renault-qm3-noir.html'); await q.screenshot({ path: '/dev/null', type: 'png', fullPage: true });
  assert.equal(await q.evaluate(() => document.documentElement.scrollWidth - innerWidth), 0, 'aucun défilement horizontal');
  console.log('✔ mobile : menu, filtres en panneau, barre d’onglets, fiche rapide, 10 véhicules + « Afficher plus »');
  assert.deepEqual(errs, [], 'erreurs JS: ' + errs); console.log('✔ aucune erreur JavaScript');
  await b.close();
})().catch(e => { console.error('✖', e.message); process.exit(1); });
