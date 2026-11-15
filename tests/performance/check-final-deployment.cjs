// Read-only deployed SEO/content checks; run outside Lighthouse collection.
// node tests/performance/check-final-deployment.cjs [evidence-directory]
// PUPPETEER_CORE_PATH can point to tooling installed outside application dependencies.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const puppeteer = require(process.env.PUPPETEER_CORE_PATH || 'puppeteer-core');
const config = require('../../capstonefall2026/src/seo/config.json');
const directory = process.argv[2] || 'tests/performance/2026-11-10-final-mobile';
const deployment = JSON.parse(fs.readFileSync(path.join(directory, 'deployment.json'), 'utf8'));
const base = deployment.requestedUrl;
const evidence = { capturedAtUtc: new Date().toISOString(), base, purpose: 'Supplemental rendered SEO and deployment checks; not Lighthouse scores or timing measurements', checks: [], routes: [], errors: [], formsSubmitted: false };
const check = (name, condition) => { evidence.checks.push({ name, passed: Boolean(condition) }); assert.ok(condition, name); };

(async () => {
  let browser;
  try {
    browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || deployment.chromePath, headless: true });
    evidence.browserVersion = await browser.version();
    const page = await browser.newPage();
    await page.setViewport({ width: 412, height: 823, deviceScaleFactor: 1.75 });
    let activeRoute = '/';
    page.on('pageerror', error => evidence.errors.push({ route: activeRoute, message: error.message }));
    for (const route of [...Object.keys(config.routes), '/workshops/WS-1001', '/final-performance-missing-page']) {
      activeRoute = route;
      const requests = [];
      const listener = request => requests.push(request.url());
      page.on('request', listener);
      const response = await page.goto(new URL(route, base).href, { waitUntil: 'networkidle0' });
      await page.waitForSelector('main h1');
      const snapshot = await page.evaluate(() => ({
        title: document.title,
        description: document.querySelector('meta[name="description"]')?.content,
        canonical: [...document.querySelectorAll('link[rel="canonical"]')].map(link => link.href),
        robots: document.querySelector('meta[name="robots"]')?.content,
        h1: document.querySelector('main h1')?.textContent,
        h1Count: document.querySelectorAll('h1').length,
        mainCount: document.querySelectorAll('main').length,
        entryScript: [...document.scripts].map(script => script.src).find(url => /\/static\/js\/main\./.test(url)),
        logo: { currentSrc: document.querySelector('header img').currentSrc, widthAttribute: document.querySelector('header img').getAttribute('width'), heightAttribute: document.querySelector('header img').getAttribute('height') },
      }));
      const missing = route === '/final-performance-missing-page';
      const unavailableWorkshop = route === '/workshops/WS-1001' && snapshot.h1 === 'Workshop Not Found';
      evidence.routes.push({ route, status: response.status(), ...snapshot, requests });
      check(`${route}: one main and h1`, snapshot.mainCount === 1 && snapshot.h1Count === 1);
      check(`${route}: expected deployment entry`, new URL(snapshot.entryScript).pathname === deployment.preflight.entryScript);
      if (missing || unavailableWorkshop) {
        check(`${route}: unavailable content has noindex and no canonical`, snapshot.robots.includes('noindex') && snapshot.canonical.length === 0);
        if (unavailableWorkshop) evidence.workshopLimitation = 'The representative WS-1001 detail is unavailable on this deployment; error metadata is verified, successful workshop-detail content is not.';
      } else {
        check(`${route}: HTTP 200`, response.status() === 200);
        check(`${route}: canonical`, snapshot.canonical.length === 1 && snapshot.canonical[0] === new URL(route, base).href);
        check(`${route}: indexable metadata`, snapshot.robots === 'index,follow' && Boolean(snapshot.description));
        if (config.routes[route]) check(`${route}: expected title and description`, snapshot.title === config.routes[route].title && snapshot.description === config.routes[route].description);
      }
      if (route === '/') {
        check('Home has no initial Stripe or lazy route/menu request', !requests.some(url => /stripe\.(com|network)/.test(url) || /\/static\/js\/[^/]+\.chunk\.js$/.test(url)));
        await page.screenshot({ path: path.join(directory, 'deployed-home-mobile.png'), fullPage: true });
      }
      page.off('request', listener);
    }
    evidence.crawlFiles = [];
    for (const name of ['robots.txt', 'sitemap.xml']) {
      const response = await page.goto(new URL(name, base).href, { waitUntil: 'networkidle0' });
      const body = await response.text();
      fs.writeFileSync(path.join(directory, name), body);
      evidence.crawlFiles.push({ name, status: response.status(), headers: response.headers(), body });
      check(`${name}: HTTP 200`, response.status() === 200);
      if (name === 'robots.txt') check('Robots advertises deployed sitemap', body.includes(`Sitemap: ${new URL('sitemap.xml', base).href}`));
      else check('Sitemap includes all configured static routes', Object.keys(config.routes).every(route => body.includes(`<loc>${new URL(route, base).href}</loc>`)));
    }
    evidence.expectedConfigurationErrors = evidence.errors.filter(error => error.route === '/donate' && /Expected publishable key/.test(error.message));
    evidence.unexpectedErrors = evidence.errors.filter(error => !evidence.expectedConfigurationErrors.includes(error));
    check('No unexpected browser errors', evidence.unexpectedErrors.length === 0);
    evidence.passed = true;
  } catch (error) {
    evidence.passed = false;
    evidence.failure = error.stack;
    process.exitCode = 1;
  } finally {
    if (browser) await browser.close();
    fs.writeFileSync(path.join(directory, 'browser-verification.json'), `${JSON.stringify(evidence, null, 2)}\n`);
    console.log(JSON.stringify({ passed: evidence.passed, routes: evidence.routes.length, checks: evidence.checks.length, errors: evidence.errors, failure: evidence.failure }));
  }
})();
