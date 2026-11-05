// Usage: node tests/performance/check-route-loading.cjs [base URL] [output JSON]
// Requires puppeteer-core (or PUPPETEER_CORE_PATH pointing to its installed package)
// and Chrome (optionally selected with CHROME_PATH). No payment is submitted.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const puppeteer = require(process.env.PUPPETEER_CORE_PATH || "puppeteer-core");

const baseUrl = process.argv[2] || "http://127.0.0.1:4173/";
const outputPath = process.argv[3] || "tests/performance/2026-11-05-fcp-local/browser-smoke.json";
const chromePath = process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const evidence = {
  measuredAtUtc: new Date().toISOString(),
  baseUrl,
  purpose: "Production route-loading smoke check; not a Lighthouse performance measurement",
  viewport: { width: 412, height: 823 },
  checks: [],
  pageErrors: [],
  paymentSubmitted: false,
};
let browser;

function check(name, details, condition) {
  evidence.checks.push({ name, passed: Boolean(condition), ...details });
  assert.ok(condition, name);
}

function isStripeUrl(value) {
  const hostname = new URL(value).hostname;
  return /(^|\.)stripe\.(com|network)$/.test(hostname);
}

async function waitForText(page, selector, text) {
  await page.waitForFunction((selector, text) =>
    document.querySelector(selector)?.textContent.includes(text), {}, selector, text);
}

(async () => {
  try {
    browser = await puppeteer.launch({
      executablePath: chromePath,
      headless: true,
      args: ["--no-first-run", "--no-default-browser-check", "--disable-extensions"],
    });
    evidence.browserVersion = await browser.version();
    const page = await browser.newPage();
    await page.setViewport(evidence.viewport);
    page.setDefaultTimeout(20000);
    page.on("pageerror", error => evidence.pageErrors.push(error.message));

    const requests = [];
    let holdFirstSecondaryChunk = false;
    let releaseRequest;
    let resolveIntercepted;
    const chunkIntercepted = new Promise(resolve => { resolveIntercepted = resolve; });
    await page.setRequestInterception(true);
    page.on("request", request => {
      requests.push(request.url());
      if (holdFirstSecondaryChunk && /\/static\/js\/[^/]+\.chunk\.js$/.test(new URL(request.url()).pathname)) {
        holdFirstSecondaryChunk = false;
        releaseRequest = request;
        resolveIntercepted(request.url());
        return;
      }
      request.continue().catch(() => {});
    });

    await page.goto(baseUrl, { waitUntil: "networkidle0" });
    await waitForText(page, "h1", "Technology Made Simple.");
    const homeStripeRequests = requests.filter(isStripeUrl);
    const homeSecondaryChunks = requests.filter(url => /\.chunk\.js$/.test(new URL(url).pathname));
    check("Home renders without a secondary route chunk", {
      heading: await page.$eval("h1", element => element.textContent.trim()),
      secondaryChunkRequests: homeSecondaryChunks,
    }, homeSecondaryChunks.length === 0);
    check("Home makes zero Stripe requests", { requestCount: homeStripeRequests.length }, homeStripeRequests.length === 0);

    holdFirstSecondaryChunk = true;
    // Direct entry mounts a new Suspense boundary. Client navigation can retain
    // the previous route during React Router's transition instead of showing it.
    await page.goto(new URL("/resources", baseUrl).href, { waitUntil: "domcontentloaded" });
    const delayedChunk = await Promise.race([
      chunkIntercepted,
      new Promise((_, reject) => {
        const timeout = setTimeout(() => reject(new Error("Secondary chunk was not requested")), 20000);
        timeout.unref();
      }),
    ]);
    await page.waitForSelector('[role="status"]', { visible: true });
    const loadingState = await page.evaluate(() => ({
      statusText: document.querySelector('[role="status"]')?.textContent.trim(),
      headerPresent: Boolean(document.querySelector("header")),
      mainPresent: Boolean(document.querySelector("main#main-content")),
      footerPresent: Boolean(document.querySelector("footer")),
      mobileNavigationPresent: Boolean(document.querySelector('nav[aria-label="Mobile quick navigation"]')),
    }));
    check("Delayed route chunk shows status and preserves layout", { delayedChunk, ...loadingState },
      /Loading page/.test(loadingState.statusText) && loadingState.headerPresent &&
      loadingState.mainPresent && loadingState.footerPresent && loadingState.mobileNavigationPresent);
    await releaseRequest.continue();
    await waitForText(page, "h1", "Technology Resources");
    check("Resources renders after the delayed chunk is released", { url: page.url() }, new URL(page.url()).pathname === "/resources");

    await page.goto(new URL("/need-help?zip=30301", baseUrl).href, { waitUntil: "networkidle0" });
    await waitForText(page, "h1", "I Need Technology Help");
    const zipValue = await page.$eval("#workshop-zip", element => element.value);
    check("Direct lazy route preserves ZIP query parameter", { url: page.url(), zipValue }, zipValue === "30301");

    await page.goto(new URL("/workshops/test-id", baseUrl).href, { waitUntil: "networkidle0" });
    await waitForText(page, "#main-content", "We could not find this workshop");
    check("Unknown workshop ID reaches existing not-found feedback", {
      url: page.url(),
      note: "Current workshop adapter uses static fixtures; no API interception is needed.",
    }, new URL(page.url()).pathname === "/workshops/test-id");

    await page.goto(new URL("/workshops/WS-1001", baseUrl).href, { waitUntil: "networkidle0" });
    await waitForText(page, "h1", "Smartphone Basics for Beginners");
    check("Direct lazy route preserves a valid workshop path parameter", {
      url: page.url(),
      heading: await page.$eval("h1", element => element.textContent.trim()),
    }, new URL(page.url()).pathname === "/workshops/WS-1001");

    const stripeBeforeDonate = requests.filter(isStripeUrl).length;
    check("Other tested routes do not initialize Stripe", { requestCount: stripeBeforeDonate }, stripeBeforeDonate === 0);
    await page.goto(new URL("/donate", baseUrl).href, { waitUntil: "domcontentloaded" });
    await waitForText(page, "h1", "Make a Donation");
    await page.waitForSelector('form input[name="firstName"]');
    await page.waitForFunction(() => [...document.scripts].some(script => script.src.startsWith("https://js.stripe.com/")));
    const donateStripeRequests = requests.filter(isStripeUrl);
    check("Donate renders the form and initiates Stripe", {
      url: page.url(),
      stripeRequestCount: donateStripeRequests.length,
      firstStripeScript: donateStripeRequests.find(url => new URL(url).hostname === "js.stripe.com"),
      limitation: "No local publishable key is configured; payment readiness or completion is not asserted.",
    }, donateStripeRequests.length > 0);

    evidence.passed = true;
  } catch (error) {
    evidence.passed = false;
    evidence.failure = error.message;
    process.exitCode = 1;
  } finally {
    if (browser) await browser.close();
    evidence.browserClosed = true;
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(evidence, null, 2) + "\n");
    console.log(JSON.stringify({ passed: evidence.passed, checks: evidence.checks.length, outputPath, failure: evidence.failure }));
  }
})();
