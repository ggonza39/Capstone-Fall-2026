// Production browser check, run outside Lighthouse measurement sets.
// Usage: node check-mobile-menu.cjs before|after [base URL] [output JSON] [before JSON]
// Requires puppeteer-core or PUPPETEER_CORE_PATH; CHROME_PATH can select Chrome.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const puppeteer = require(process.env.PUPPETEER_CORE_PATH || "puppeteer-core");

const phase = process.argv[2];
assert.ok(["before", "after"].includes(phase), "Choose before or after");
const baseUrl = process.argv[3] || "http://127.0.0.1:4173/";
const evidenceDirectory = "tests/performance/2026-11-05-tbt-local";
const outputPath = process.argv[4] || `${evidenceDirectory}/browser-${phase}.json`;
const beforePath = process.argv[5] || `${evidenceDirectory}/browser-before.json`;
const menuButton = 'header button[aria-controls="mobile-navigation"]';
const mobileNav = 'nav[aria-label="Mobile navigation"]';
const evidence = { phase, baseUrl, capturedAtUtc: new Date().toISOString(), viewports: [], checks: [], scenarios: [], pageErrors: [] };
let browser;

function check(name, condition, details = {}) {
  evidence.checks.push({ name, passed: Boolean(condition), ...details });
  assert.ok(condition, name);
}

function isRouteChunk(url) {
  const parsed = new URL(url);
  return parsed.origin === new URL(baseUrl).origin && /\/static\/js\/[^/]+\.chunk\.js$/.test(parsed.pathname);
}

function deadline(promise, message) {
  let timer;
  return Promise.race([promise, new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(message)), 20000);
  })]).finally(() => clearTimeout(timer));
}

async function newPage(viewport = { width: 412, height: 823 }, context = browser) {
  const page = await context.newPage();
  page.setDefaultTimeout(20000);
  page.on("pageerror", error => evidence.pageErrors.push(error.message));
  await page.setViewport(viewport);
  await page.setCacheEnabled(false);
  return page;
}

async function captureHome(page) {
  return page.evaluate(() => {
    const rect = element => Object.fromEntries(["x", "y", "width", "height"].map(key => [key, Number(element.getBoundingClientRect()[key].toFixed(3))]));
    const styles = element => {
      const s = getComputedStyle(element);
      return Object.fromEntries(["fontFamily", "fontSize", "fontWeight", "lineHeight", "color", "backgroundColor", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft", "borderTopWidth", "borderRadius", "boxSizing"].map(key => [key, s[key]]));
    };
    const hero = document.querySelector("main section");
    const button = document.querySelector('header button[aria-controls="mobile-navigation"]');
    const input = document.querySelector("#home-zip-code");
    return {
      mainText: document.querySelector("main").innerText,
      entryScript: [...document.scripts].map(script => script.src).find(url => /\/static\/js\/main\./.test(url)),
      geometry: { header: rect(document.querySelector("header")), hero: rect(hero), paragraph: rect(hero.querySelector("p")), heroButtons: [...hero.querySelectorAll("button")].map(rect), form: rect(input.closest("form")), input: rect(input), menuButton: rect(button) },
      styles: { menuButton: styles(button), input: styles(input) },
    };
  });
}

async function waitForDrawer(page) {
  await page.waitForSelector(mobileNav, { visible: true });
  await page.waitForFunction(selector => {
    const paper = document.querySelector(selector)?.closest(".MuiDrawer-paper");
    return paper && Math.abs(paper.getBoundingClientRect().right - innerWidth) < 0.51;
  }, {}, mobileNav);
}

async function drawerSnapshot(page) {
  return page.evaluate(selector => {
    const nav = document.querySelector(selector);
    const paper = nav.closest(".MuiDrawer-paper");
    const r = paper.getBoundingClientRect();
    return {
      geometry: Object.fromEntries(["x", "y", "width", "height"].map(key => [key, Number(r[key].toFixed(3))])),
      links: [...nav.querySelectorAll("a")].map(link => ({ text: link.textContent.trim(), href: link.getAttribute("href"), current: link.getAttribute("aria-current") })),
      focusInside: paper.contains(document.activeElement),
      activeElement: document.activeElement?.outerHTML.slice(0, 200),
    };
  }, mobileNav);
}

async function escapeAndCaptureFocus(page) {
  await page.keyboard.press("Escape");
  await page.waitForSelector(mobileNav, { hidden: true });
  return page.$eval(menuButton, button => ({ restoredToMenuButton: document.activeElement === button, expanded: button.getAttribute("aria-expanded") }));
}

function rectDifferences(previous, current) {
  const differences = [];
  function compare(name, a, b) {
    if (Array.isArray(a)) return a.forEach((item, index) => compare(`${name}[${index}]`, item, b[index]));
    for (const key of Object.keys(a)) if (Math.abs(a[key] - b[key]) > 0.51) differences.push({ name, property: key, before: a[key], after: b[key] });
  }
  for (const name of Object.keys(previous)) compare(name, previous[name], current[name]);
  return differences;
}

async function captureViewports() {
  for (const viewport of [{ width: 412, height: 823 }, { width: 1280, height: 900 }]) {
    const page = await newPage(viewport);
    const requests = [];
    page.on("request", request => requests.push(request.url()));
    await page.goto(baseUrl, { waitUntil: "networkidle0" });
    await page.waitForSelector("#home-zip-code");
    const snapshot = { viewport, ...await captureHome(page), initialRequests: [...requests] };
    if (viewport.width === 412) {
      await page.focus(menuButton);
      await page.click(menuButton);
      await waitForDrawer(page);
      snapshot.drawer = await drawerSnapshot(page);
      snapshot.drawerRequests = requests.slice(snapshot.initialRequests.length);
      snapshot.escape = await escapeAndCaptureFocus(page);
    }
    evidence.viewports.push(snapshot);
    await page.close();
  }
}

async function delayAndCancel(method) {
  const context = await browser.createBrowserContext();
  try {
    const page = await newPage(undefined, context);
    let held;
    let resolveHeld;
    const intercepted = new Promise(resolve => { resolveHeld = resolve; });
    await page.setRequestInterception(true);
    page.on("request", request => {
      if (!held && isRouteChunk(request.url())) { held = request; resolveHeld(request.url()); return; }
      request.continue().catch(() => {});
    });
    await page.goto(baseUrl, { waitUntil: "networkidle0" });
    await page.click(menuButton);
    const chunkUrl = await deadline(intercepted, "Menu did not request a chunk");
    await page.waitForFunction(selector => document.querySelector(selector)?.getAttribute("aria-busy") === "true", {}, menuButton);
    const feedback = await page.$eval(menuButton, button => ({ text: button.textContent.trim(), busy: button.getAttribute("aria-busy"), spinnerName: button.querySelector('[role="progressbar"]')?.getAttribute("aria-label"), navPresent: Boolean(document.querySelector('nav[aria-label="Mobile navigation"]')) }));
    check(`Delayed menu gives stable loading feedback (${method})`, feedback.text === "Menu" && feedback.busy === "true" && feedback.spinnerName === "Loading navigation menu" && !feedback.navPresent, { chunkUrl, feedback });
    if (method === "Escape") await page.keyboard.press("Escape"); else await page.click(menuButton);
    await page.waitForFunction(selector => document.querySelector(selector)?.getAttribute("aria-busy") !== "true", {}, menuButton);
    check(`Pending menu can be cancelled (${method})`, await page.$eval(menuButton, button => button.getAttribute("aria-expanded") === "false"));
    const responseReady = page.waitForResponse(response => response.url() === chunkUrl);
    await held.continue();
    await (await responseReady).buffer();
    await page.waitForNetworkIdle({ idleTime: 200 });
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    check(`Cancelled menu does not open after chunk resolves (${method})`, await page.evaluate(selector => !document.querySelector('nav[aria-label="Mobile navigation"]') && document.querySelector(selector).getAttribute("aria-expanded") === "false", menuButton));
    await page.click(menuButton);
    await waitForDrawer(page);
    check(`Menu opens after cancellation (${method})`, (await drawerSnapshot(page)).links.length === 6);
    evidence.scenarios.push({ type: "delayed cancellation", method, chunkUrl });
  } finally { await context.close(); }
}

async function failureRecovery(action) {
  const context = await browser.createBrowserContext();
  try {
    const page = await newPage(undefined, context);
    let failedUrl;
    const requests = [];
    await page.setRequestInterception(true);
    page.on("request", request => {
      requests.push(request.url());
      if (!failedUrl && isRouteChunk(request.url())) { failedUrl = request.url(); request.respond({ status: 503, contentType: "application/javascript", body: "/* simulated menu chunk failure */" }).catch(() => {}); return; }
      request.continue().catch(() => {});
    });
    await page.goto(baseUrl, { waitUntil: "networkidle0" });
    await page.click(menuButton);
    await page.waitForSelector('[role="alert"]', { visible: true });
    check(`Failed menu load exposes recoverable alert (${action})`, Boolean(failedUrl) && await page.$eval(menuButton, button => button.getAttribute("aria-busy") !== "true"));
    await page.evaluate(action => {
      const alert = document.querySelector('[role="alert"]');
      const button = [...alert.querySelectorAll("button")].find(element => element.textContent.trim().toLowerCase().includes(action.toLowerCase()));
      if (!button) throw new Error(`Missing ${action} action`);
      button.click();
    }, action);
    if (action === "Dismiss") {
      await page.waitForSelector('[role="alert"]', { hidden: true });
      check("Dismiss keeps the homepage available", await page.$eval("h1", heading => heading.textContent === "Technology Made Simple."));
      await page.click(menuButton);
    }
    await waitForDrawer(page);
    check(`Menu recovers after failed chunk (${action})`, requests.filter(url => url === failedUrl).length >= 2 && (await drawerSnapshot(page)).links.length === 6, { failedUrl, attempts: requests.filter(url => url === failedUrl).length });
    evidence.scenarios.push({ type: "simulated chunk failure", action, failedUrl });
  } finally { await context.close(); }
}

async function loadedKeyboardAndNavigation() {
  const context = await browser.createBrowserContext();
  try {
    const page = await newPage(undefined, context);
    await page.goto(baseUrl, { waitUntil: "networkidle0" });
    await page.focus(menuButton);
    await page.keyboard.press("Enter");
    await waitForDrawer(page);
    check("Keyboard activation moves focus into the Drawer", (await drawerSnapshot(page)).focusInside);
    let trapped = true;
    for (let index = 0; index < 10; index++) {
      await page.keyboard.press("Tab");
      trapped = trapped && await page.evaluate(selector => document.querySelector(selector).closest(".MuiDrawer-paper").contains(document.activeElement), mobileNav);
    }
    await page.keyboard.down("Shift");
    await page.keyboard.press("Tab");
    await page.keyboard.up("Shift");
    trapped = trapped && await page.evaluate(selector => document.querySelector(selector).closest(".MuiDrawer-paper").contains(document.activeElement), mobileNav);
    check("Drawer traps forward and backward keyboard focus", trapped);
    const escaped = await escapeAndCaptureFocus(page);
    check("Escape closes Drawer and restores opener focus", escaped.restoredToMenuButton && escaped.expanded === "false", escaped);
    await page.click(menuButton);
    await waitForDrawer(page);
    await page.click(`${mobileNav} a[href="/resources"]`);
    await page.waitForFunction(() => location.pathname === "/resources" && document.querySelector("h1")?.textContent === "Technology Resources");
    await page.waitForSelector(mobileNav, { hidden: true });
    check("Drawer link navigates and closes the menu", await page.$eval(menuButton, button => button.getAttribute("aria-expanded") === "false"), { finalUrl: page.url() });
  } finally { await context.close(); }
}

(async () => {
  try {
    browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true, args: ["--no-first-run", "--no-default-browser-check", "--disable-extensions"] });
    evidence.browserVersion = await browser.version();
    await captureViewports();
    if (phase === "after") {
      const before = JSON.parse(fs.readFileSync(beforePath, "utf8"));
      for (const [index, current] of evidence.viewports.entries()) {
        const previous = before.viewports[index];
        check(`Homepage text preserved at ${current.viewport.width}px`, current.mainText === previous.mainText);
        check(`Homepage input and menu styles preserved at ${current.viewport.width}px`, JSON.stringify(current.styles) === JSON.stringify(previous.styles));
        const differences = rectDifferences(previous.geometry, current.geometry);
        check(`Homepage geometry preserved at ${current.viewport.width}px`, differences.length === 0, { toleranceCssPx: 0.51, differences });
        check(`No menu chunk requested before activation at ${current.viewport.width}px`, !current.initialRequests.some(isRouteChunk), { initialChunkRequests: current.initialRequests.filter(isRouteChunk) });
        if (current.drawer) {
          const drawerDifferences = rectDifferences({ drawer: previous.drawer.geometry }, { drawer: current.drawer.geometry });
          check("Drawer links and geometry preserved", JSON.stringify(current.drawer.links) === JSON.stringify(previous.drawer.links) && drawerDifferences.length === 0, { differences: drawerDifferences });
          check("Drawer code is requested on menu activation", current.drawerRequests.some(isRouteChunk), { chunkRequests: current.drawerRequests.filter(isRouteChunk) });
        }
      }
      await delayAndCancel("Escape");
      await delayAndCancel("repeat click");
      await failureRecovery("Retry");
      await failureRecovery("Dismiss");
      await loadedKeyboardAndNavigation();
    }
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
