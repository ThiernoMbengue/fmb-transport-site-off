import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
// Audit Lighthouse (performance, accessibilité, bonnes pratiques, SEO) en mobile ET ordinateur.
// Prérequis : npm install · `npm run dev` dans un terminal, puis `npm run audit:lighthouse`. Chrome : variable CHROME_PATH si besoin.
const urls = process.argv.length > 2 ? process.argv.slice(2) : ['', 'vehicules.html', 'vehicules/renault-qm3-noir.html', 'reservation.html', 'services.html', 'investir.html', 'contact.html'];
const chrome = await launch({ ...(process.env.CHROME_PATH ? { chromePath: process.env.CHROME_PATH } : {}), chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu'] });
for (const u of urls) {
  for (const form of ['mobile', 'desktop']) {
    const cfg = form === 'desktop' ? { extends: 'lighthouse:default', settings: { formFactor: 'desktop', screenEmulation: { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: false }, throttling: { rttMs: 40, throughputKbps: 10240, cpuSlowdownMultiplier: 1 } } } : undefined;
    const r = await lighthouse('http://localhost:4173/' + u, { port: chrome.port, output: 'json', logLevel: 'error', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'] }, cfg);
    const l = r.lhr, c = l.categories, a = l.audits;
    console.log(`\n== ${u || 'index.html'} [${form}]  perf ${Math.round(c.performance.score * 100)} · a11y ${Math.round(c.accessibility.score * 100)} · bp ${Math.round(c['best-practices'].score * 100)} · seo ${Math.round(c.seo.score * 100)}`);
    console.log(`   FCP ${a['first-contentful-paint'].displayValue} · LCP ${a['largest-contentful-paint'].displayValue} · TBT ${a['total-blocking-time'].displayValue} · CLS ${a['cumulative-layout-shift'].displayValue} · SI ${a['speed-index'].displayValue} · poids ${(a['total-byte-weight'].numericValue / 1024).toFixed(0)} Ko`);
    const fails = Object.values(a).filter((x) => x.score !== null && x.score < 0.9 && x.scoreDisplayMode !== 'informative' && x.scoreDisplayMode !== 'manual' && x.scoreDisplayMode !== 'notApplicable' && !['first-contentful-paint','largest-contentful-paint','speed-index','total-blocking-time','interactive','max-potential-fid'].includes(x.id));
    for (const f of fails) console.log(`   ✖ ${f.id}: ${f.title}${f.displayValue ? ' — ' + f.displayValue : ''}`);
    const lcp = a['largest-contentful-paint-element']?.details?.items?.[0]?.items?.[0]?.node?.snippet; if (lcp) console.log('   LCP el:', lcp.slice(0, 140));
  }
}
await chrome.kill();
