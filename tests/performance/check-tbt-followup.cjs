// Production-browser regression checks, run separately from Lighthouse measurements.
// Usage: node tests/performance/check-tbt-followup.cjs before|after [base URL] [output JSON]
// Set PUPPETEER_CORE_PATH / CHROME_PATH for an existing local installation.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const puppeteer = require(process.env.PUPPETEER_CORE_PATH || "puppeteer-core");

const phase = process.argv[2];
assert.ok(["before", "after"].includes(phase), "Choose before or after");
const baseUrl = process.argv[3] || "http://127.0.0.1:4173/";
const directory = "tests/performance/2026-11-10-tbt-followup";
const outputPath = process.argv[4] || `${directory}/browser-${phase}.json`;
const evidence = {
  phase, baseUrl, capturedAtUtc: new Date().toISOString(),
  purpose: "Visual, keyboard, routing, and asset regression checks; not a Lighthouse measurement",
  checks: [], viewports: [], routes: [], pageErrors: [], requestsFailed: [], visualDifferences: [],
  paymentSubmitted: false,
  limitations: ["853 CSS pixels approximates 1280px at 150% browser zoom; Chromium headless does not provide the browser chrome zoom control.", "No payment or workshop registration is submitted; donation Stripe readiness is outside these layout checks."],
};
let browser;
function check(name, condition, details = {}) {
  evidence.checks.push({ name, passed: Boolean(condition), ...details });
  assert.ok(condition, name);
}
async function settle(page) {
  await page.waitForFunction(() => document.querySelector("h1")?.textContent.includes("Technology Made Simple."));
  await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(image => image.complete ? Promise.resolve() : new Promise(resolve => { image.onload = resolve; image.onerror = resolve; }))); });
}
async function snapshot(page) {
  return page.evaluate(() => {
    const round = value => Number(value.toFixed(3));
    const properties = ["display", "position", "fontFamily", "fontSize", "fontWeight", "lineHeight", "textAlign", "textDecorationLine", "color", "backgroundColor", "borderTopWidth", "borderRightWidth", "borderBottomWidth", "borderLeftWidth", "borderTopColor", "borderRadius", "boxShadow", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft", "marginTop", "marginRight", "marginBottom", "marginLeft", "gap", "rowGap", "columnGap", "alignItems", "justifyContent", "flexDirection", "outlineWidth", "outlineStyle", "outlineColor", "outlineOffset"];
    const entries = [];
    function add(key, element) {
      if (!element) return;
      const rect = element.getBoundingClientRect(), style = getComputedStyle(element);
      entries.push({ key, tag: element.tagName, text: element.textContent.trim().replace(/\s+/g, " "), href: element.getAttribute("href"), rect: Object.fromEntries(["x", "y", "width", "height"].map(property => [property, round(rect[property])])), styles: Object.fromEntries(properties.map(property => [property, style[property]])), svgPaths: [...element.querySelectorAll("svg path")].map(element => element.getAttribute("d")) });
    }
    add("header", document.querySelector("header"));
    add("logoLink", document.querySelector('header a[aria-label="TechSmart Learning for Seniors home"]'));
    const logo = document.querySelector("header img");
    add("logo", logo);
    add("menuButton", document.querySelector('header button[aria-controls="mobile-navigation"]'));
    add("desktopNavigation", document.querySelector('header nav[aria-label="Main navigation"]'));
    [...document.querySelectorAll('header nav[aria-label="Main navigation"] a')].forEach((element, i) => add(`desktopLink${i}`, element));
    add("main", document.querySelector("main"));
    [...document.querySelectorAll("main > section")].forEach((section, i) => {
      add(`section${i}`, section);
      add(`section${i}Container`, section.firstElementChild);
      [...section.querySelectorAll("h1,h2,h3,p,a,button,input")].forEach((element, j) => add(`section${i}Content${j}`, element));
      [...section.querySelectorAll("h3")].forEach((heading, j) => {
        add(`section${i}Card${j}`, heading.closest("article") || heading.parentElement.parentElement);
        const icon = heading.parentElement.querySelector("svg");
        add(`section${i}Card${j}Icon`, icon);
      });
    });
    add("zipForm", document.querySelector("main form"));
    add("zipInput", document.querySelector("#home-zip-code"));
    add("zipHelper", document.querySelector("#home-zip-code-help"));
    add("footer", document.querySelector("footer"));
    [...document.querySelectorAll("footer p,footer nav,footer a")].forEach((element, i) => add(`footerContent${i}`, element));
    add("bottomNavigation", document.querySelector('nav[aria-label="Mobile quick navigation"]'));
    [...document.querySelectorAll('nav[aria-label="Mobile quick navigation"] a')].forEach((element, i) => add(`bottomLink${i}`, element));
    return {
      entries,
      muiDomCount: document.querySelectorAll('[class*="Mui"]').length,
      emotionStyleCount: document.querySelectorAll('style[data-emotion]').length,
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: innerWidth,
      documentHeight: document.documentElement.scrollHeight,
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.content,
      logo: { currentSrc: logo.currentSrc, width: logo.width, height: logo.height, naturalWidth: logo.naturalWidth, naturalHeight: logo.naturalHeight },
      bottomNavigationDetails: [...document.querySelectorAll('nav[aria-label="Mobile quick navigation"] a')].map(element => ({ text: element.textContent.trim(), iconFontSize: getComputedStyle(element.querySelector("svg")).fontSize, labelFontSize: getComputedStyle(element.querySelector("span")).fontSize })),
      activeElement: { tag: document.activeElement?.tagName, id: document.activeElement?.id, text: document.activeElement?.textContent.trim() },
      links: [...document.querySelectorAll("a")].map(element => ({ text: element.textContent.trim(), href: element.getAttribute("href") })),
      assets: performance.getEntriesByType("resource").filter(entry => ["script", "link", "css", "img"].includes(entry.initiatorType)).map(entry => ({ url: entry.name, type: entry.initiatorType, transferSize: entry.transferSize, encodedBodySize: entry.encodedBodySize })),
      zip: { value: document.querySelector("#home-zip-code")?.value, describedBy: document.querySelector("#home-zip-code")?.getAttribute("aria-describedby"), invalid: document.querySelector("#home-zip-code")?.getAttribute("aria-invalid"), inputMode: document.querySelector("#home-zip-code")?.inputMode, maxLength: document.querySelector("#home-zip-code")?.maxLength, helperText: document.querySelector("#home-zip-code-help")?.textContent, helperRole: document.querySelector("#home-zip-code-help")?.getAttribute("role") },
    };
  });
}
function compare(before, after, prefix) {
  const beforeEntries = new Map(before.entries.map(entry => [entry.key, entry]));
  for (const entry of after.entries) {
    const original = beforeEntries.get(entry.key);
    if (!original) { evidence.visualDifferences.push({ viewport: prefix, key: entry.key, field: "presence", before: false, after: true }); continue; }
    for (const field of ["text", "href", "svgPaths"]) {
      const normalize = value => typeof value === "string" ? value.replace(/[\u200b\ufeff]/g, "") : value;
      if (JSON.stringify(normalize(original[field])) !== JSON.stringify(normalize(entry[field]))) evidence.visualDifferences.push({ viewport: prefix, key: entry.key, field, before: original[field], after: entry[field] });
    }
    for (const field of ["x", "y", "width", "height"]) {
      if (Math.abs(original.rect[field] - entry.rect[field]) > 0.5) evidence.visualDifferences.push({ viewport: prefix, key: entry.key, field: `rect.${field}`, before: original.rect[field], after: entry.rect[field] });
    }
    const materialStyles = ["fontFamily", "fontSize", "fontWeight", "lineHeight", "textAlign", "textDecorationLine", "color", "backgroundColor", "borderTopWidth", "borderRightWidth", "borderBottomWidth", "borderLeftWidth", "borderRadius", "boxShadow", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft"];
    for (const field of materialStyles) {
      if (original.styles[field] !== entry.styles[field]) evidence.visualDifferences.push({ viewport: prefix, key: entry.key, field: `styles.${field}`, before: original.styles[field], after: entry.styles[field] });
    }
  }
}
async function homeChecks(width, height, label) {
  const page = await browser.newPage();
  page.setDefaultTimeout(20000);
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  page.on("pageerror", error => evidence.pageErrors.push({ viewport: label, url: page.url(), message: error.message }));
  page.on("requestfailed", request => evidence.requestsFailed.push({ viewport: label, url: request.url(), message: request.failure()?.errorText }));
  await page.goto(baseUrl, { waitUntil: "networkidle0" });
  await settle(page);
  const initial = await snapshot(page);
  check(`Home has one h1 at ${label}`, await page.$$eval("h1", elements => elements.length === 1));
  check(`Home has four semantic sections at ${label}`, await page.$$eval("main > section", elements => elements.length === 4));
  check(`Home has no horizontal overflow at ${label}`, initial.documentWidth <= width);
  check(`Home initial assets exclude Stripe at ${label}`, !initial.assets.some(asset => /stripe/i.test(asset.url)));
  if (phase === "after") {
    check(`Initial Home does not mount MUI or Emotion at ${label}`, initial.muiDomCount === 0 && initial.emotionStyleCount === 0);
    check(`Bottom navigation preserves icon and label sizes at ${label}`, initial.bottomNavigationDetails.every((entry, index) => Math.abs(parseFloat(entry.iconFontSize) - 30.8571) < .01 && Math.abs(parseFloat(entry.labelFontSize) - (index === 0 ? 18 : 15.4286)) < .01));
    check(`Home action links preserve 72px heights at ${label}`, await page.$$eval("main a", elements => elements.every(element => Math.abs(element.getBoundingClientRect().height - 72) < .5)));
    if (width < 1200) {
      const menu = initial.entries.find(entry => entry.key === "menuButton");
      check(`Menu preserves original 111 by 51.5px size at ${label}`, Math.abs(menu.rect.width - 111) < .5 && Math.abs(menu.rect.height - 51.5) < .5);
    }
  }
  check(`ZIP input retains numeric limits and helper association at ${label}`, initial.zip.inputMode === "numeric" && initial.zip.maxLength === 5 && initial.zip.describedBy === "home-zip-code-help" && initial.zip.helperText === "Example: 30301");
  const result = { label, width, height, initial };
  await page.focus("#home-zip-code");
  result.zipFocused = await snapshot(page);
  await page.type("#home-zip-code", "a12x3");
  check(`ZIP sanitizes non-digits at ${label}`, await page.$eval("#home-zip-code", element => element.value === "123"));
  await page.keyboard.press("Enter");
  await page.waitForFunction(() => document.querySelector("#home-zip-code-help")?.textContent.includes("Enter a valid 5-digit ZIP code."));
  result.zipInvalid = await snapshot(page);
  check(`Invalid ZIP stays on Home and exposes alert at ${label}`, new URL(page.url()).pathname === "/" && result.zipInvalid.zip.helperRole === "alert");
  await page.type("#home-zip-code", "45");
  check(`ZIP helper clears while editing at ${label}`, await page.$eval("#home-zip-code-help", element => element.textContent === "Example: 30301"));
  if (width < 1200) {
    const menuSelector = 'header button[aria-controls="mobile-navigation"]';
    await page.focus(menuSelector);
    await page.keyboard.press("Enter");
    await page.waitForSelector('#mobile-navigation a[href="/"]', { visible: true });
    result.menuOpen = await page.evaluate(() => ({
      expanded: document.querySelector('header button[aria-controls="mobile-navigation"]')?.getAttribute("aria-expanded"),
      activeText: document.activeElement.textContent.trim(),
      links: [...document.querySelectorAll("#mobile-navigation a")].map(element => ({ text: element.textContent.trim(), href: element.getAttribute("href"), current: element.getAttribute("aria-current") })),
      rect: (() => { const rect = document.querySelector("#mobile-navigation").getBoundingClientRect(); return { x: rect.x, y: rect.y, width: rect.width, height: rect.height }; })(),
    }));
    check(`Menu opens by keyboard with six links at ${label}`, result.menuOpen.expanded === "true" && result.menuOpen.links.length === 6);
    await page.keyboard.press("Escape");
    await page.waitForFunction(() => document.querySelector('header button[aria-controls="mobile-navigation"]')?.getAttribute("aria-expanded") === "false");
    await new Promise(resolve => setTimeout(resolve, 350));
    result.menuClosedFocus = await page.evaluate(() => document.activeElement.matches('header button[aria-controls="mobile-navigation"]'));
    check(`Escape closes menu and returns focus at ${label}`, result.menuClosedFocus);
  }
  evidence.viewports.push(result);
  if (process.env.TBT_SCREENSHOTS === "1") {
    await page.goto(baseUrl, { waitUntil: "networkidle0" });
    await settle(page);
    await page.screenshot({ path: path.join(path.dirname(outputPath), `${phase}-${label}.png`), fullPage: true });
  }
  await page.close();
}
async function secondaryRoutes() {
  const routes = ["/need-help", "/want-to-help", "/advocate", "/resources", "/about", "/contact", "/workshops/WS-1001", "/donate"];
  for (const route of routes) {
    const page = await browser.newPage();
    page.setDefaultTimeout(25000);
    await page.setViewport({ width: 1280, height: 900 });
    page.on("pageerror", error => evidence.pageErrors.push({ route, url: page.url(), message: error.message }));
    await page.goto(new URL(route, baseUrl).href, { waitUntil: "networkidle0" });
    await page.waitForSelector("h1");
    const result = await page.evaluate(() => {
      const heading = document.querySelector("h1"), button = document.querySelector("main .MuiButton-root"), body = getComputedStyle(document.body);
      const style = getComputedStyle(heading);
      return { path: location.pathname, title: document.title, heading: heading.textContent.trim(), mainCount: document.querySelectorAll("main").length, headingStyle: { fontFamily: style.fontFamily, fontSize: style.fontSize, fontWeight: style.fontWeight, lineHeight: style.lineHeight, color: style.color }, bodyStyle: { fontFamily: body.fontFamily, fontSize: body.fontSize, margin: body.margin }, button: button && { text: button.textContent.trim(), fontSize: getComputedStyle(button).fontSize, height: button.getBoundingClientRect().height }, links: [...document.querySelectorAll("main a")].map(element => ({ text: element.textContent.trim(), href: element.getAttribute("href") })) };
    });
    check(`Secondary route renders semantic content ${route}`, result.mainCount === 1 && result.heading.length > 0);
    check(`Secondary route receives heading theme ${route}`, result.headingStyle.fontFamily === 'Rockwell, Georgia, serif' && result.headingStyle.fontWeight === "700");
    await page.click('header a[aria-label="TechSmart Learning for Seniors home"]');
    await settle(page);
    check(`Secondary route returns to Home ${route}`, new URL(page.url()).pathname === "/");
    result.homeAfterReturn = await page.$eval("h1", element => ({ text: element.textContent.trim(), fontFamily: getComputedStyle(element).fontFamily, fontSize: getComputedStyle(element).fontSize }));
    evidence.routes.push(result);
    await page.close();
  }
}
(async () => {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  try {
    browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
    evidence.browserVersion = await browser.version();
    for (const [width, height, label] of [[412, 823, "mobile-412"], [768, 900, "tablet-768"], [1280, 900, "desktop-1280"], [853, 900, "zoom-reflow-853"]]) await homeChecks(width, height, label);
    if (phase === "after") {
      await secondaryRoutes();
      const beforePath = `${directory}/browser-before.json`;
      if (fs.existsSync(beforePath)) {
        const before = JSON.parse(fs.readFileSync(beforePath, "utf8"));
        for (const viewport of evidence.viewports) {
          const original = before.viewports.find(item => item.label === viewport.label);
          if (original) for (const state of ["initial", "zipFocused", "zipInvalid"]) compare(original[state], viewport[state], `${viewport.label}/${state}`);
        }
      }
    }
    evidence.passed = evidence.checks.every(check => check.passed);
  } catch (error) {
    evidence.error = { message: error.message, stack: error.stack };
    evidence.passed = false;
    process.exitCode = 1;
  } finally {
    if (browser) await browser.close();
    fs.writeFileSync(outputPath, JSON.stringify(evidence, null, 2) + "\n");
    console.log(JSON.stringify({ phase, passed: evidence.passed, checks: evidence.checks.length, visualDifferences: evidence.visualDifferences.length, pageErrors: evidence.pageErrors, error: evidence.error?.message, outputPath }, null, 2));
  }
})();
