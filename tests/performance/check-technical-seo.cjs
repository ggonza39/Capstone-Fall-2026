// Production browser checks run outside Lighthouse measurements; no payment is submitted.
// Usage: node check-technical-seo.cjs before|after [base URL] [output JSON] [before JSON]
// PUPPETEER_CORE_PATH and CHROME_PATH can select existing local installations.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const puppeteer = require(process.env.PUPPETEER_CORE_PATH || "puppeteer-core");

const phase = process.argv[2];
assert.ok(["before", "after"].includes(phase), "Choose before or after");
const baseUrl = process.argv[3] || "http://127.0.0.1:4173/";
const directory = "tests/performance/2026-11-05-technical-seo";
const outputPath = process.argv[4] || `${directory}/browser-${phase}.json`;
const beforePath = process.argv[5] || `${directory}/browser-before.json`;
const staticRoutes = [
  ["/", "Technology Made Simple."],
  ["/need-help", "I Need Technology Help"],
  ["/want-to-help", "I Want to Help"],
  ["/resources", "Technology Resources"],
  ["/about", "About TechSmart"],
  ["/contact", "Contact Us"],
];
if (phase === "after") staticRoutes.push(["/donate", "Make a Donation"]);
const evidence = {
  phase, baseUrl, capturedAtUtc: new Date().toISOString(),
  purpose: "Production technical SEO and navigation checks; not a Lighthouse performance measurement",
  checks: [], routes: [], menuViewports: [], navigation: [], workshopNavigation: [], pageErrors: [],
  paymentSubmitted: false,
  limitations: ["The static SPA server returns HTTP 200 for unknown paths; client noindex does not create a server HTTP 404.", phase === "after" ? "Route-specific metadata and content require JavaScript. Raw HTML has a shared branded fallback." : "Route-specific metadata and content are absent from raw HTML, which contains the generic Create React App fallback.", "No local Stripe publishable key is configured; donation payment readiness and submission are not tested."],
};
let browser;

function check(name, condition, details = {}) {
  evidence.checks.push({ name, passed: Boolean(condition), ...details });
  assert.ok(condition, name);
}

async function newPage(viewport = { width: 1280, height: 900 }) {
  const page = await browser.newPage();
  page.setDefaultTimeout(20000);
  await page.setViewport(viewport);
  page.on("pageerror", error => evidence.pageErrors.push({ url: page.url(), message: error.message, stack: error.stack }));
  return page;
}

async function snapshot(page) {
  return page.evaluate(() => ({
    url: location.href,
    lang: document.documentElement.lang,
    titles: [...document.querySelectorAll("head title")].map(element => element.textContent.trim()),
    descriptions: [...document.querySelectorAll('meta[name="description"]')].map(element => element.content),
    robots: [...document.querySelectorAll('meta[name="robots"]')].map(element => element.content),
    canonicals: [...document.querySelectorAll('link[rel="canonical"]')].map(element => element.href),
    mainCount: document.querySelectorAll('main,[role="main"]').length,
    h1: [...document.querySelectorAll("h1")].map(element => element.textContent.trim()),
    headings: [...document.querySelectorAll("main h1,main h2,main h3")].map(element => ({ level: element.tagName, text: element.textContent.trim() })),
    mainText: document.querySelector("#main-content")?.innerText || "",
    links: [...document.querySelectorAll("main a")].map(element => ({ text: element.textContent.trim(), href: element.getAttribute("href") })),
    buttons: [...document.querySelectorAll("main button")].map(element => ({ text: element.textContent.trim(), type: element.type })),
    formFieldNames: [...document.querySelectorAll("main form input[name]")].map(element => element.name),
  }));
}

async function visit(route, heading) {
  const page = await newPage();
  const response = await page.goto(new URL(route, baseUrl).href, { waitUntil: "networkidle0" });
  const crash = evidence.pageErrors.find(error => error.url === page.url() && new URL(error.url).pathname !== "/donate");
  if (crash) throw new Error(`Page failed on ${route}: ${crash.message}`);
  if (heading) await page.waitForFunction(text => document.querySelector("h1")?.textContent.trim().toLowerCase() === text.toLowerCase(), {}, heading);
  else if (route.startsWith("/workshops/")) await page.waitForFunction(() => document.querySelector("#main-content")?.innerText.includes("We could not find this workshop"));
  const result = { route, status: response.status(), ...await snapshot(page) };
  evidence.routes.push(result);
  await page.close();
  return result;
}

function validateHead(result, expected) {
  check(`One descriptive title and description on ${result.route}`,
    result.titles.length === 1 && result.titles[0] === expected.title &&
    result.descriptions.length === 1 && result.descriptions[0] === expected.description);
  check(`One indexable canonical on ${result.route}`,
    result.robots.length === 1 && result.robots[0] === "index,follow" &&
    result.canonicals.length === 1 && result.canonicals[0] === expected.canonical);
}

async function captureMenu() {
  for (const viewport of [{ width: 412, height: 823 }, { width: 768, height: 900 }]) {
    const page = await newPage(viewport);
    await page.goto(baseUrl, { waitUntil: "networkidle0" });
    const button = 'header button[aria-controls="mobile-navigation"]';
    const result = await page.$eval(button, element => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return {
        text: element.textContent.trim(), accessibleName: element.getAttribute("aria-label"),
        geometry: Object.fromEntries(["x", "y", "width", "height"].map(key => [key, Number(rect[key].toFixed(3))])),
        styles: Object.fromEntries(["fontSize", "fontWeight", "lineHeight", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft", "backgroundColor", "borderRadius"].map(key => [key, style[key]])),
      };
    });
    await page.click(button);
    await page.waitForSelector('nav[aria-label="Mobile navigation"]', { visible: true });
    result.drawerLinks = await page.$$eval('nav[aria-label="Mobile navigation"] a', elements => elements.map(element => ({ text: element.textContent.trim(), href: element.getAttribute("href") })));
    await page.keyboard.press("Escape");
    await page.waitForSelector('nav[aria-label="Mobile navigation"]', { hidden: true });
    result.escapeClosesMenu = await page.$eval(button, element => element.getAttribute("aria-expanded") === "false");
    evidence.menuViewports.push({ viewport, ...result });
    await page.close();
  }
}

async function rawDocuments() {
  evidence.rawDocuments = [];
  for (const route of ["/", "/resources", "/technical-seo-missing-page", "/robots.txt", "/sitemap.xml"]) {
    const response = await fetch(new URL(route, baseUrl));
    const body = await response.text();
    const html = route === "/" || route === "/resources" || route === "/technical-seo-missing-page";
    evidence.rawDocuments.push(html ? {
      route, status: response.status,
      title: body.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1],
      description: body.match(/<meta\s+name="description"\s+content="([^"]*)"/i)?.[1],
      canonicalCount: (body.match(/rel="canonical"/g) || []).length,
      rootHasRenderedContent: Boolean(body.match(/<div\s+id="root"\s*>([\s\S]*?)<\/div>/i)?.[1].trim()),
    } : { route, status: response.status, body });
  }
}

async function clientNavigation(config, origin) {
  const page = await newPage();
  await page.goto(baseUrl, { waitUntil: "networkidle0" });
  await page.evaluate(() => { window.__technicalSeoClientNavigation = "same document"; });
  await page.click('main a[href="/need-help"]');
  await page.waitForFunction(title => document.title === title && location.pathname === "/need-help", {}, config.routes["/need-help"].title);
  evidence.navigation.push({ action: "Home help link", ...await snapshot(page) });
  check("Help link uses client navigation and updates metadata", await page.evaluate(() => window.__technicalSeoClientNavigation === "same document"));
  await page.evaluate(() => history.back());
  await page.waitForFunction(title => document.title === title && location.pathname === "/", {}, config.routes["/"].title);
  evidence.navigation.push({ action: "Browser Back", ...await snapshot(page) });
  await page.type("#home-zip-code", "01234");
  await page.click('main form button[type="submit"]');
  await page.waitForFunction(title => document.title === title && location.pathname === "/need-help" && location.search === "?zip=01234", {}, config.routes["/need-help"].title);
  await page.waitForSelector("#workshop-zip");
  const result = await snapshot(page);
  evidence.navigation.push({ action: "ZIP form navigation", ...result });
  check("ZIP remains in navigation but is excluded from canonical", result.canonicals.length === 1 && result.canonicals[0] === `${origin}/need-help` && await page.$eval("#workshop-zip", element => element.value) === "01234");
  for (const result of evidence.navigation) check(`Head tags stay unique after ${result.action}`, result.titles.length === 1 && result.descriptions.length === 1 && result.robots.length === 1 && result.canonicals.length === 1);
  await page.close();
}

async function workshopNavigation(origin) {
  const page = await newPage();
  await page.goto(new URL("/workshops/WS-1001", baseUrl).href, { waitUntil: "networkidle0" });
  await page.evaluate(() => { window.__technicalSeoWorkshopNavigation = "same document"; });
  const scenarios = [
    { action: "Known workshop", route: "/workshops/WS-1001", heading: "Smartphone Basics for Beginners", title: "Smartphone Basics for Beginners | TechSmart", canonical: `${origin}/workshops/WS-1001`, robots: "index,follow" },
    { action: "Known to missing workshop", route: "/workshops/technical-seo-missing", heading: "Workshop Not Found", title: "Workshop Not Found | TechSmart", canonical: null, robots: "noindex,follow" },
    { action: "Missing to known workshop", route: "/workshops/WS-1001", heading: "Smartphone Basics for Beginners", title: "Smartphone Basics for Beginners | TechSmart", canonical: `${origin}/workshops/WS-1001`, robots: "index,follow" },
  ];
  for (const [index, scenario] of scenarios.entries()) {
    if (index > 0) {
      // Exercise BrowserRouter route-param updates without reloading or adding fake app links.
      await page.evaluate(route => {
        history.pushState({ ...history.state, idx: (history.state?.idx || 0) + 1 }, "", route);
        dispatchEvent(new PopStateEvent("popstate", { state: history.state }));
      }, scenario.route);
    }
    await page.waitForFunction(heading => document.querySelector("h1")?.textContent.trim() === heading, {}, scenario.heading);
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    const result = { action: scenario.action, ...await snapshot(page) };
    evidence.workshopNavigation.push(result);
    check(`${scenario.action} updates title and indexing metadata`, result.titles.length === 1 && result.titles[0] === scenario.title && result.robots.length === 1 && result.robots[0] === scenario.robots && result.canonicals.length === (scenario.canonical ? 1 : 0) && (!scenario.canonical || result.canonicals[0] === scenario.canonical), { title: result.titles, canonical: result.canonicals, robots: result.robots });
    check(`${scenario.action} preserves the document and semantic landmarks`, await page.evaluate(() => window.__technicalSeoWorkshopNavigation === "same document") && result.mainCount === 1 && result.h1.length === 1 && result.descriptions.length === 1);
  }
  await page.close();
}

(async () => {
  try {
    browser = await puppeteer.launch({
      executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe",
      headless: true, args: ["--no-first-run", "--no-default-browser-check", "--disable-extensions"],
    });
    evidence.browserVersion = await browser.version();
    for (const [route, heading] of staticRoutes) await visit(route, heading);
    await visit("/workshops/WS-1001", "Smartphone Basics for Beginners");
    await visit("/workshops/technical-seo-missing", phase === "after" ? "Workshop not found" : undefined);
    await visit("/technical-seo-missing-page", phase === "after" ? "Page not found" : undefined);
    if (phase === "after") await visit("/need-help/?zip=01234#workshops", "I Need Technology Help");
    if (phase === "after") await visit("/ABOUT/", "About TechSmart");
    await captureMenu();
    await rawDocuments();
    if (phase === "after") {
      const config = require("../../capstonefall2026/src/seo/config.json");
      const origin = process.env.SEO_EXPECTED_ORIGIN || config.siteOrigin;
      const before = JSON.parse(fs.readFileSync(beforePath, "utf8"));
      for (const [route] of staticRoutes) {
        const result = evidence.routes.find(item => item.route === route);
        validateHead(result, { ...config.routes[route], canonical: `${origin}${route === "/" ? "/" : route}` });
        check(`Rendered content has one main and H1 on ${route}`, result.mainCount === 1 && result.h1.length === 1 && result.lang === "en" && result.status === 200);
      }
      const publicResults = evidence.routes.filter(item => Object.hasOwn(config.routes, item.route));
      check("Public page titles and descriptions are unique", new Set(publicResults.map(item => item.titles[0])).size === 7 && new Set(publicResults.map(item => item.descriptions[0])).size === 7);
      const workshop = evidence.routes.find(item => item.route === "/workshops/WS-1001");
      check("Known workshop metadata describes its actual title", workshop.titles.length === 1 && workshop.titles[0].includes("Smartphone Basics for Beginners") && workshop.canonicals[0] === `${origin}/workshops/WS-1001` && workshop.robots[0] === "index,follow" && workshop.mainCount === 1 && workshop.h1.length === 1);
      for (const route of ["/workshops/technical-seo-missing", "/technical-seo-missing-page"]) {
        const result = evidence.routes.find(item => item.route === route);
        check(`Missing content has one heading and noindex without canonical on ${route}`, result.mainCount === 1 && result.h1.length === 1 && result.robots.length === 1 && result.robots[0] === "noindex,follow" && result.canonicals.length === 0 && result.links.length > 0);
      }
      const query = evidence.routes.find(item => item.route.includes("?zip="));
      validateHead(query, { ...config.routes["/need-help"], canonical: `${origin}/need-help` });
      const uppercase = evidence.routes.find(item => item.route === "/ABOUT/");
      validateHead(uppercase, { ...config.routes["/about"], canonical: `${origin}/about` });
      const home = evidence.routes.find(item => item.route === "/");
      for (const [text, href] of [["I Need Technology Help", "/need-help"], ["I Want to Help", "/want-to-help"], ["Find Workshops", "/need-help"], ["View Resources", "/resources"], ["Get Help", "/need-help"], ["Donate", "/want-to-help#donate"], ["Volunteer", "/want-to-help#volunteer"], ["Advocate", "/want-to-help#advocate"]]) check(`Home ${text} is a crawlable navigation anchor`, home.links.some(link => link.text === text && link.href === href));
      const help = evidence.routes.find(item => item.route === "/want-to-help");
      check("Want to Help donation navigation has a real href", help.links.some(link => link.text === "Donate" && link.href === "/donate"));
      const donate = evidence.routes.find(item => item.route === "/donate");
      check("Donate renders its form without submitting a payment", ["firstName", "lastName", "email"].every(name => donate.formFieldNames.includes(name)) && evidence.paymentSubmitted === false);
      for (const current of evidence.menuViewports) {
        const previous = before.menuViewports.find(item => item.viewport.width === current.viewport.width);
        const differences = Object.keys(previous.geometry).filter(key => Math.abs(previous.geometry[key] - current.geometry[key]) > 0.51);
        check(`Menu button size and style are preserved at ${current.viewport.width}px`, differences.length === 0 && JSON.stringify(current.styles) === JSON.stringify(previous.styles) && current.text === previous.text && current.escapeClosesMenu, { differences, before: previous.geometry, after: current.geometry });
      }
      for (const document of evidence.rawDocuments.filter(item => Object.hasOwn(item, "title"))) check(`Raw HTML fallback is branded on ${document.route}`, document.title === config.fallback.title && document.description === config.fallback.description && document.canonicalCount === 0 && !document.rootHasRenderedContent);
      const sitemap = evidence.rawDocuments.find(item => item.route === "/sitemap.xml");
      const robots = evidence.rawDocuments.find(item => item.route === "/robots.txt");
      const locations = [...sitemap.body.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
      const expectedLocations = Object.keys(config.routes).map(route => `${origin}${route === "/" ? "/" : route}`);
      check("Served sitemap contains exactly the seven public routes", sitemap.status === 200 && JSON.stringify(locations.sort()) === JSON.stringify(expectedLocations.sort()) && !sitemap.body.includes("/workshops/"), { locations });
      check("Served robots allows crawling and references the sitemap", robots.status === 200 && /^User-agent:\s*\*/mi.test(robots.body) && new RegExp(`^Sitemap: ${origin.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/sitemap\\.xml$`, "mi").test(robots.body) && !/^Disallow:\s*\/\s*$/mi.test(robots.body));
      await clientNavigation(config, origin);
      await workshopNavigation(origin);
      const unexpectedErrors = evidence.pageErrors.filter(error => !(new URL(error.url).pathname === "/donate" && /Expected publishable key to be of type string|apiKey should be a string/i.test(error.message)));
      check("No unexpected production JavaScript errors", unexpectedErrors.length === 0, { unexpectedErrors });
    }
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
    console.log(JSON.stringify({ phase, passed: evidence.passed, checks: evidence.checks.length, routes: evidence.routes.length, outputPath, failure: evidence.failure }));
  }
})();
