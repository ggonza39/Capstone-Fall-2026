// Production browser verification. Run outside Lighthouse measurement sets.
// Usage: node check-header-logo.cjs before|after [base URL] [output JSON] [before JSON]
// Requires puppeteer-core or PUPPETEER_CORE_PATH; CHROME_PATH can select Chrome.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const puppeteer = require(process.env.PUPPETEER_CORE_PATH || "puppeteer-core");

const phase = process.argv[2];
assert.ok(["before", "after"].includes(phase), "Choose before or after");
const baseUrl = process.argv[3] || "http://127.0.0.1:4173/";
const evidenceDirectory = "tests/performance/2026-11-05-speed-index-local";
const outputPath = process.argv[4] || `${evidenceDirectory}/browser-${phase}.json`;
const beforePath = process.argv[5] || `${evidenceDirectory}/browser-before.json`;
const menuSelector = 'header button[aria-controls="mobile-navigation"]';
const navSelector = 'nav[aria-label="Mobile navigation"]';
const evidence = {
  phase, baseUrl, capturedAtUtc: new Date().toISOString(),
  viewports: [], checks: [], pageErrors: [],
};
let browser;

function check(name, condition, details = {}) {
  evidence.checks.push({ name, passed: Boolean(condition), ...details });
  assert.ok(condition, name);
}

function isChunk(url) {
  const parsed = new URL(url);
  return parsed.origin === new URL(baseUrl).origin && /\/static\/js\/[^/]+\.chunk\.js$/.test(parsed.pathname);
}

function rectDifferences(previous, current, prefix = "") {
  const differences = [];
  for (const [key, value] of Object.entries(previous)) {
    const name = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object") differences.push(...rectDifferences(value, current[key], name));
    else if (Math.abs(value - current[key]) > 0.01) differences.push({ property: name, before: value, after: current[key] });
  }
  return differences;
}

async function settle(page) {
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

async function capture(page) {
  await page.$eval("header img", image => image.decode());
  await settle(page);
  return page.evaluate(selector => {
    const rect = element => Object.fromEntries(["x", "y", "width", "height"].map(key => [key, Number(element.getBoundingClientRect()[key].toFixed(3))]));
    const styles = element => {
      const computed = getComputedStyle(element);
      return Object.fromEntries([
        "display", "width", "height", "minWidth", "minHeight", "maxWidth", "flexShrink", "objectFit",
        "fontFamily", "fontSize", "fontWeight", "lineHeight", "color", "backgroundColor",
        "paddingTop", "paddingRight", "paddingBottom", "paddingLeft", "borderTopWidth", "borderRadius", "boxSizing",
      ].map(key => [key, computed[key]]));
    };
    const header = document.querySelector("header");
    const image = header.querySelector("img");
    const link = image.closest("a");
    const hero = document.querySelector("main section");
    const menu = document.querySelector(selector);
    return {
      headerText: header.innerText,
      mainText: document.querySelector("main").innerText,
      entryScript: [...document.scripts].map(script => script.src).find(url => /\/static\/js\/main\./.test(url)),
      geometry: {
        header: rect(header), logoLink: rect(link), logo: rect(image), menu: rect(menu),
        hero: rect(hero), heading: rect(hero.querySelector("h1")), paragraph: rect(hero.querySelector("p")),
        heroButtons: [...hero.querySelectorAll("button")].map(rect),
      },
      styles: { header: styles(header), logoLink: styles(link), logo: styles(image), menu: styles(menu), hero: styles(hero) },
      logo: {
        currentSrc: image.currentSrc, alt: image.alt, linkHref: link.getAttribute("href"), linkLabel: link.getAttribute("aria-label"),
        naturalWidth: image.naturalWidth, naturalHeight: image.naturalHeight, complete: image.complete, decoded: true,
        widthAttribute: image.getAttribute("width"), heightAttribute: image.getAttribute("height"),
        loadingAttribute: image.getAttribute("loading"), fetchPriorityAttribute: image.getAttribute("fetchpriority"),
      },
      menu: { text: menu.textContent.trim(), uniformSize: menu.getAttribute("data-uniform-size"), expanded: menu.getAttribute("aria-expanded") },
      documentWidth: document.documentElement.scrollWidth,
    };
  }, menuSelector);
}

async function exerciseMenu(page, snapshot, requests) {
  await page.focus(menuSelector);
  await page.keyboard.press("Enter");
  await page.waitForSelector(navSelector, { visible: true });
  await page.waitForFunction(selector => {
    const paper = document.querySelector(selector)?.closest(".MuiDrawer-paper");
    return paper && Math.abs(paper.getBoundingClientRect().right - innerWidth) < 0.51;
  }, {}, navSelector);
  await page.waitForNetworkIdle({ idleTime: 200 });
  snapshot.menuInteraction = await page.evaluate(({ menuSelector, navSelector }) => {
    const button = document.querySelector(menuSelector);
    const nav = document.querySelector(navSelector);
    const paper = nav.closest(".MuiDrawer-paper");
    const r = button.getBoundingClientRect();
    return {
      openButtonSize: { width: Number(r.width.toFixed(3)), height: Number(r.height.toFixed(3)) },
      expandedWhenOpen: button.getAttribute("aria-expanded"),
      focusInsideDrawer: paper.contains(document.activeElement),
      links: [...nav.querySelectorAll("a")].map(link => ({ text: link.textContent.trim(), href: link.getAttribute("href") })),
    };
  }, { menuSelector, navSelector });
  snapshot.menuInteraction.requestsAfterActivation = requests.slice(snapshot.initialRequests.length);
  await page.keyboard.press("Escape");
  await page.waitForSelector(navSelector, { hidden: true });
  await settle(page);
  snapshot.menuInteraction.escape = await page.$eval(menuSelector, button => {
    const r = button.getBoundingClientRect();
    return {
      expanded: button.getAttribute("aria-expanded"), focusReturned: document.activeElement === button,
      buttonSize: { width: Number(r.width.toFixed(3)), height: Number(r.height.toFixed(3)) },
    };
  });
  const interaction = snapshot.menuInteraction;
  const expectedSize = { width: snapshot.geometry.menu.width, height: snapshot.geometry.menu.height };
  const sizeChanges = rectDifferences(expectedSize, interaction.openButtonSize).concat(rectDifferences(expectedSize, interaction.escape.buttonSize));
  check(`Menu opens and Escape restores focus at ${snapshot.viewport.width}px`, interaction.expandedWhenOpen === "true" && interaction.focusInsideDrawer && interaction.links.length === 6 && interaction.escape.expanded === "false" && interaction.escape.focusReturned);
  check(`Restored Menu size stays unchanged through interaction at ${snapshot.viewport.width}px`, sizeChanges.length === 0, { toleranceCssPx: 0.01, differences: sizeChanges });
  check(`Menu chunks load on activation at ${snapshot.viewport.width}px`, interaction.requestsAfterActivation.some(isChunk));
  check(`Menu activation does not load Stripe at ${snapshot.viewport.width}px`, !interaction.requestsAfterActivation.some(url => /stripe/i.test(url)));
}

(async () => {
  try {
    browser = await puppeteer.launch({
      executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe",
      headless: true, args: ["--no-first-run", "--no-default-browser-check", "--disable-extensions"],
    });
    evidence.browserVersion = await browser.version();
    const previousEvidence = phase === "after" ? JSON.parse(fs.readFileSync(beforePath, "utf8")) : undefined;
    for (const viewport of [{ width: 412, height: 823 }, { width: 768, height: 900 }, { width: 1280, height: 900 }]) {
      const context = await browser.createBrowserContext();
      const page = await context.newPage();
      page.setDefaultTimeout(20000);
      page.on("pageerror", error => evidence.pageErrors.push(error.message));
      await page.setViewport(viewport);
      await page.setCacheEnabled(false);
      const requests = [];
      page.on("request", request => requests.push(request.url()));
      await page.goto(baseUrl, { waitUntil: "networkidle0" });
      await page.waitForSelector("#home-zip-code");
      const snapshot = { viewport, ...await capture(page), initialRequests: [...requests] };
      evidence.viewports.push(snapshot);
      check(`Logo decodes at its original dimensions at ${viewport.width}px`, snapshot.logo.complete && snapshot.logo.decoded && snapshot.logo.naturalWidth === 500 && snapshot.logo.naturalHeight === 250);
      check(`Logo retains accessible home link at ${viewport.width}px`, snapshot.logo.alt === "TechSmart Learning for Seniors" && snapshot.logo.linkHref === "/" && snapshot.logo.linkLabel === "TechSmart Learning for Seniors home");
      check(`No lazy chunks or Stripe before interaction at ${viewport.width}px`, !snapshot.initialRequests.some(isChunk) && !snapshot.initialRequests.some(url => /stripe/i.test(url)));
      check(`Menu retains its theme styling exemption at ${viewport.width}px`, snapshot.menu.text === "Menu" && snapshot.menu.uniformSize === "false" && snapshot.menu.expanded === "false");
      if (phase === "after") {
        const previous = previousEvidence.viewports.find(item => item.viewport.width === viewport.width);
        check(`Visible Home and header text preserved at ${viewport.width}px`, snapshot.mainText === previous.mainText && snapshot.headerText === previous.headerText);
        const differences = rectDifferences(previous.geometry, snapshot.geometry);
        check(`Header, logo, hero and Menu geometry preserved at ${viewport.width}px`, differences.length === 0, { toleranceCssPx: 0.01, differences });
        check(`Header, logo, hero and Menu styles preserved at ${viewport.width}px`, JSON.stringify(snapshot.styles) === JSON.stringify(previous.styles));
        check(`Optimized logo URL and rendering hints reach the image at ${viewport.width}px`, /\.webp(?:$|\?)/i.test(snapshot.logo.currentSrc) && snapshot.logo.widthAttribute === "500" && snapshot.logo.heightAttribute === "250" && snapshot.logo.loadingAttribute === "eager" && snapshot.logo.fetchPriorityAttribute === "high");
      }
      if (viewport.width < 1200) await exerciseMenu(page, snapshot, requests);
      await context.close();
    }
    check("No uncaught browser errors", evidence.pageErrors.length === 0, { errors: evidence.pageErrors });
    evidence.passed = true;
  } catch (error) {
    evidence.passed = false; evidence.failure = error.message; process.exitCode = 1;
  } finally {
    if (browser) await browser.close();
    evidence.browserClosed = true;
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(evidence, null, 2) + "\n");
    console.log(JSON.stringify({ phase, passed: evidence.passed, checks: evidence.checks.length, outputPath, failure: evidence.failure }));
  }
})();
