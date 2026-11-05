// Asset delivery and UI regression checks. Run outside Lighthouse measurement sets.
// node check-frontend-assets.cjs before|after [base URL] [output JSON] [before JSON]
// Set PUPPETEER_CORE_PATH and, optionally, CHROME_PATH for tools outside app dependencies.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const puppeteer = require(process.env.PUPPETEER_CORE_PATH || 'puppeteer-core');

const phase = process.argv[2];
assert.ok(['before', 'after'].includes(phase), 'Choose before or after');
const baseUrl = process.argv[3] || 'http://127.0.0.1:4173/';
const directory = 'tests/performance/2026-11-05-assets-local';
const outputPath = process.argv[4] || `${directory}/browser-${phase}.json`;
const beforePath = process.argv[5] || `${directory}/browser-before.json`;
const screenshotDirectory = path.dirname(outputPath);
const menuSelector = 'header button[aria-controls="mobile-navigation"]';
const navSelector = 'nav[aria-label="Mobile navigation"]';
const viewports = [
  { width: 412, height: 823, deviceScaleFactor: 1 },
  { width: 768, height: 900, deviceScaleFactor: 1 },
  { width: 1280, height: 900, deviceScaleFactor: 1 },
  { width: 412, height: 823, deviceScaleFactor: 2 },
  { width: 1280, height: 900, deviceScaleFactor: 2 },
];
const evidence = { phase, baseUrl, capturedAtUtc: new Date().toISOString(), routes: [], checks: [], pageErrors: [] };
let browser;

function check(name, condition, detail = {}) {
  evidence.checks.push({ name, passed: Boolean(condition), ...detail });
  assert.ok(condition, name);
}

function geometryDifferences(before, after, prefix = '') {
  const differences = [];
  for (const [key, value] of Object.entries(before)) {
    const property = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object') differences.push(...geometryDifferences(value, after[key], property));
    else if (Math.abs(value - after[key]) > 0.1) differences.push({ property, before: value, after: after[key] });
  }
  return differences;
}

async function settle(page) {
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

async function capture(page) {
  return page.evaluate(menuSelector => {
    const rect = element => {
      const r = element.getBoundingClientRect();
      return { x: Number((r.x + scrollX).toFixed(3)), y: Number((r.y + scrollY).toFixed(3)), width: Number(r.width.toFixed(3)), height: Number(r.height.toFixed(3)) };
    };
    const styles = element => {
      const computed = getComputedStyle(element);
      return Object.fromEntries(['width', 'height', 'objectFit', 'borderRadius', 'fontFamily', 'fontSize', 'fontWeight', 'lineHeight'].map(name => [name, computed[name]]));
    };
    const images = [...document.images];
    const main = document.querySelector('main');
    const menu = document.querySelector(menuSelector);
    return {
      title: document.title,
      mainText: main.innerText,
      headerText: document.querySelector('header').innerText,
      links: [...main.querySelectorAll('a')].map(link => ({ text: link.textContent.trim(), href: link.getAttribute('href') })),
      images: images.map(image => ({
        alt: image.alt, src: image.getAttribute('src'), currentSrc: image.currentSrc,
        srcSet: image.getAttribute('srcset'), sizes: image.getAttribute('sizes'),
        naturalWidth: image.naturalWidth, naturalHeight: image.naturalHeight,
        widthAttribute: image.getAttribute('width'), heightAttribute: image.getAttribute('height'),
        loading: image.loading, fetchPriority: image.fetchPriority, decoding: image.decoding,
        complete: image.complete, geometry: rect(image), styles: styles(image),
      })),
      geometry: {
        header: rect(document.querySelector('header')), main: rect(main),
        headings: [...main.querySelectorAll('h1,h2,h3')].map(rect),
        images: images.map(rect),
        actions: [...main.querySelectorAll('a,button,input')].map(rect),
        menu: rect(menu),
      },
      menu: { text: menu.textContent.trim(), geometry: rect(menu), visible: getComputedStyle(menu).display !== 'none' },
      documentWidth: document.documentElement.scrollWidth,
      resourceTimings: performance.getEntriesByType('resource').map(r => ({ name: r.name, initiatorType: r.initiatorType, transferSize: r.transferSize, encodedBodySize: r.encodedBodySize, decodedBodySize: r.decodedBodySize })),
    };
  }, menuSelector);
}

async function exerciseMenu(page, snapshot, label) {
  await page.focus(menuSelector);
  await page.keyboard.press('Enter');
  await page.waitForSelector(navSelector, { visible: true });
  await page.waitForFunction(selector => document.querySelector(selector)?.closest('.MuiDrawer-paper')?.contains(document.activeElement), {}, navSelector);
  await page.keyboard.press('Escape');
  await page.waitForSelector(navSelector, { hidden: true });
  await settle(page);
  snapshot.menuInteraction = await page.$eval(menuSelector, button => ({ expanded: button.getAttribute('aria-expanded'), focusReturned: document.activeElement === button }));
  check(`Menu opens and Escape returns focus ${label}`, snapshot.menuInteraction.expanded === 'false' && snapshot.menuInteraction.focusReturned);
}

(async () => {
  try {
    fs.mkdirSync(screenshotDirectory, { recursive: true });
    browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--no-first-run', '--no-default-browser-check', '--disable-extensions'] });
    evidence.browserVersion = await browser.version();
    const previousEvidence = phase === 'after' ? JSON.parse(fs.readFileSync(beforePath, 'utf8')) : null;
    for (const viewport of viewports) {
      for (const route of ['/', '/want-to-help']) {
        const label = `${route} at ${viewport.width}px DPR${viewport.deviceScaleFactor}`;
        const context = await browser.createBrowserContext();
        const page = await context.newPage();
        page.setDefaultTimeout(25000);
        await page.setViewport(viewport);
        await page.setCacheEnabled(false);
        const requests = new Map();
        const cdp = await page.createCDPSession();
        await cdp.send('Network.enable');
        cdp.on('Network.requestWillBeSent', event => requests.set(event.requestId, { url: event.request.url, type: event.type }));
        cdp.on('Network.responseReceived', event => Object.assign(requests.get(event.requestId) || {}, { status: event.response.status, mimeType: event.response.mimeType }));
        cdp.on('Network.loadingFinished', event => Object.assign(requests.get(event.requestId) || {}, { encodedDataLength: event.encodedDataLength }));
        page.on('pageerror', error => evidence.pageErrors.push({ label, message: error.message }));
        await page.goto(new URL(route, baseUrl).href, { waitUntil: 'networkidle0' });
        await page.waitForSelector('main h1');
        const initialRequests = [...requests.values()].map(r => ({ ...r }));
        const imageCount = await page.$$eval('img', images => images.length);
        for (let index = 0; index < imageCount; index++) {
          await page.evaluate(async index => {
            const image = document.images[index];
            image.scrollIntoView({ behavior: 'instant', block: 'center' });
            await image.decode();
          }, index);
        }
        await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
        await page.waitForNetworkIdle({ idleTime: 100 });
        await settle(page);
        const snapshot = { route, viewport, ...await capture(page), initialRequests, fullyLoadedRequests: [...requests.values()].map(r => ({ ...r })) };
        evidence.routes.push(snapshot);
        check(`All images decode ${label}`, snapshot.images.length === (route === '/' ? 1 : 10) && snapshot.images.every(image => image.complete && image.naturalWidth > 0));
        check(`No Stripe or font requests ${label}`, !snapshot.fullyLoadedRequests.some(r => /stripe/i.test(r.url) || r.type === 'Font'));
        if (route === '/') check(`Home has no initial lazy route/menu chunks ${label}`, !initialRequests.some(r => /\/static\/js\/[^/]+\.chunk\.js$/.test(r.url)));
        if (snapshot.menu.visible) {
          check(`Menu retains original size ${label}`, snapshot.menu.geometry.width === 111 && snapshot.menu.geometry.height === 51.5);
          await exerciseMenu(page, snapshot, label);
        }
        if (viewport.deviceScaleFactor === 1 && [412, 1280].includes(viewport.width)) {
          snapshot.screenshot = `${screenshotDirectory}/${phase}-${route === '/' ? 'home' : 'want-to-help'}-${viewport.width}.png`;
          await page.screenshot({ path: snapshot.screenshot, fullPage: true });
        }
        if (phase === 'after') {
          const before = previousEvidence.routes.find(r => r.route === route && r.viewport.width === viewport.width && r.viewport.deviceScaleFactor === viewport.deviceScaleFactor);
          check(`Page content and links preserved ${label}`, snapshot.title === before.title && snapshot.mainText === before.mainText && snapshot.headerText === before.headerText && JSON.stringify(snapshot.links) === JSON.stringify(before.links));
          const differences = geometryDifferences(before.geometry, snapshot.geometry);
          check(`Page and control geometry preserved ${label}`, differences.length === 0, { toleranceCssPx: 0.1, differences });
          check(`Image alt text and display styles preserved ${label}`, snapshot.images.every((image, index) => image.alt === before.images[index].alt && JSON.stringify(image.styles) === JSON.stringify(before.images[index].styles)));
          check(`Below-fold images remain lazy ${label}`, snapshot.images.slice(1).every(image => image.loading === 'lazy'));
        }
        await context.close();
      }
    }
    if (phase === 'after') {
      const encodings = JSON.parse(fs.readFileSync(`${directory}/image-encoding.json`, 'utf8'));
      const candidates = encodings.images.filter(image => image.kind === 'photo').flatMap(image => image.outputs);
      evidence.coverDensityChecks = [];
      for (const width of [599, 900, 1280]) {
        const context = await browser.createBrowserContext();
        const page = await context.newPage();
        await page.setViewport({ width, height: 900, deviceScaleFactor: 2 });
        await page.setCacheEnabled(false);
        await page.goto(new URL('/want-to-help', baseUrl).href, { waitUntil: 'networkidle0' });
        await page.waitForSelector('#community-impact img');
        const photos = await page.$$('#community-impact img');
        for (const photo of photos) {
          await photo.evaluate(async image => {
            image.scrollIntoView({ behavior: 'instant', block: 'center' });
            await image.decode();
          });
          const displayed = await photo.evaluate(image => ({
            alt: image.alt, currentSrc: image.currentSrc,
            width: image.getBoundingClientRect().width, height: image.getBoundingClientRect().height,
          }));
          const candidate = candidates.find(item => new URL(displayed.currentSrc).pathname.split('/').pop().startsWith(`${path.parse(item.path).name}.`));
          assert.ok(candidate, 'Selected photo must be a recorded responsive variant');
          const density = Math.min(candidate.width / displayed.width, candidate.height / displayed.height);
          const detail = { viewportWidth: width, dpr: 2, ...displayed, sourceWidth: candidate.width, sourceHeight: candidate.height, availableCoverDensity: density };
          evidence.coverDensityChecks.push(detail);
          check(`Photo preserves DPR2 density with cover cropping at ${width}px: ${displayed.alt}`, density >= 2, detail);
        }
        await context.close();
      }
    }
    check('No uncaught browser errors', evidence.pageErrors.length === 0, { errors: evidence.pageErrors });
    evidence.passed = true;
  } catch (error) {
    evidence.passed = false;
    evidence.failure = error.stack;
    process.exitCode = 1;
  } finally {
    if (browser) await browser.close();
    evidence.browserClosed = true;
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, `${JSON.stringify(evidence, null, 2)}\n`);
    console.log(JSON.stringify({ phase, passed: evidence.passed, routes: evidence.routes.length, checks: evidence.checks.length, outputPath, failure: evidence.failure }));
  }
})();
