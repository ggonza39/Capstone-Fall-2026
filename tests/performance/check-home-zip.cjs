// Run against a production static server, outside Lighthouse measurement runs.
// Usage: node check-home-zip.cjs before|after [base URL] [output JSON] [before JSON]
// Requires puppeteer-core, or PUPPETEER_CORE_PATH pointing to its package directory.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const puppeteer = require(process.env.PUPPETEER_CORE_PATH || "puppeteer-core");

const phase = process.argv[2];
assert.ok(["before", "after"].includes(phase), "Choose before or after");
const baseUrl = process.argv[3] || "http://127.0.0.1:4173/";
const evidenceDirectory = "tests/performance/2026-11-05-lcp-local";
const outputPath = process.argv[4] || `${evidenceDirectory}/browser-${phase}.json`;
const beforePath = process.argv[5] || `${evidenceDirectory}/browser-before.json`;
const evidence = { phase, baseUrl, capturedAtUtc: new Date().toISOString(), viewports: [], checks: [], pageErrors: [] };
let browser;

function check(name, condition, details = {}) {
  evidence.checks.push({ name, passed: Boolean(condition), ...details });
  assert.ok(condition, name);
}

async function capture(page) {
  return page.evaluate(() => {
    const hero = document.querySelector("main section");
    const form = document.querySelector("form");
    const input = document.querySelector("#home-zip-code");
    const outlined = input.closest(".MuiOutlinedInput-root");
    const helper = form.querySelector(".MuiFormHelperText-root");
    const rect = element => Object.fromEntries(["x", "y", "width", "height"].map(key => [key, Number(element.getBoundingClientRect()[key].toFixed(3))]));
    const styles = element => {
      const computed = getComputedStyle(element);
      return Object.fromEntries(["fontFamily", "fontSize", "fontWeight", "lineHeight", "color", "backgroundColor", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft", "borderTopWidth", "borderRadius", "boxSizing"].map(key => [key, computed[key]]));
    };
    return {
      mainText: document.querySelector("main").innerText,
      entryScript: [...document.scripts].map(script => script.src).find(url => /\/static\/js\/main\./.test(url)),
      geometry: {
        hero: rect(hero), heading: rect(hero.querySelector("h1")), paragraph: rect(hero.querySelector("p")),
        heroButtons: [...hero.querySelectorAll("button")].map(rect),
        form: rect(form), control: rect(input.closest(".MuiFormControl-root")), outlined: rect(outlined),
        input: rect(input), helper: rect(helper), submit: rect(form.querySelector('button[type="submit"]')),
      },
      styles: { input: styles(input), outlined: styles(outlined), helper: styles(helper) },
      inputAttributes: { ariaLabel: input.getAttribute("aria-label"), ariaDescribedby: input.getAttribute("aria-describedby"), inputMode: input.inputMode, maxLength: input.maxLength },
    };
  });
}

(async () => {
  try {
    browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true, args: ["--no-first-run", "--no-default-browser-check", "--disable-extensions"] });
    evidence.browserVersion = await browser.version();
    for (const viewport of [{ width: 412, height: 823 }, { width: 1280, height: 900 }]) {
      const page = await browser.newPage();
      page.on("pageerror", error => evidence.pageErrors.push(error.message));
      await page.setViewport(viewport);
      await page.goto(baseUrl, { waitUntil: "networkidle0" });
      await page.waitForSelector("#home-zip-code");
      evidence.viewports.push({ viewport, ...await capture(page) });
      await page.close();
    }
    if (phase === "after") {
      const before = JSON.parse(fs.readFileSync(beforePath, "utf8"));
      for (const [index, current] of evidence.viewports.entries()) {
        const previous = before.viewports[index];
        check(`Visible homepage content preserved at ${current.viewport.width}px`, current.mainText === previous.mainText);
        check(`Input and helper styles preserved at ${current.viewport.width}px`, JSON.stringify(current.styles) === JSON.stringify(previous.styles));
        const differences = [];
        function compareRect(name, a, b) { for (const key of Object.keys(a)) if (Math.abs(a[key] - b[key]) > 0.51) differences.push({ name, property: key, before: a[key], after: b[key] }); }
        for (const name of Object.keys(previous.geometry)) {
          if (name === "heroButtons") previous.geometry[name].forEach((rect, buttonIndex) => compareRect(`heroButton${buttonIndex + 1}`, rect, current.geometry[name][buttonIndex]));
          else compareRect(name, previous.geometry[name], current.geometry[name]);
        }
        check(`Hero and form geometry preserved at ${current.viewport.width}px`, differences.length === 0, { toleranceCssPx: 0.51, differences });
        const [first, second] = current.geometry.heroButtons;
        const [oldFirst, oldSecond] = previous.geometry.heroButtons;
        check(`Hero button sizing retained with matching heights at ${current.viewport.width}px`,
          Math.abs(first.width - oldFirst.width) < 0.51 && Math.abs(second.width - oldSecond.width) < 0.51 && Math.abs(first.height - second.height) < 0.51,
          { beforeWidthsCssPx: [oldFirst.width, oldSecond.width], afterWidthsCssPx: [first.width, second.width], note: "The original desktop variant widths differ by 2px; this check preserves that baseline rather than asserting exact equality." });
        check(`ZIP input attributes reach the native input at ${current.viewport.width}px`, current.inputAttributes.ariaLabel === "ZIP Code" && current.inputAttributes.ariaDescribedby === "home-zip-code-help" && current.inputAttributes.inputMode === "numeric" && current.inputAttributes.maxLength === 5);
      }
      const page = await browser.newPage();
      await page.setViewport({ width: 412, height: 823 });
      await page.goto(baseUrl, { waitUntil: "networkidle0" });
      await page.type("#home-zip-code", "12ab3");
      check("ZIP input filters nondigits", await page.$eval("#home-zip-code", input => input.value) === "123");
      await page.click('form button[type="submit"]');
      await page.waitForSelector('#home-zip-code-help[role="alert"]');
      check("Invalid submission exposes associated error", await page.$eval("#home-zip-code", input => input.getAttribute("aria-invalid") === "true" && document.getElementById(input.getAttribute("aria-describedby")).textContent === "Enter a valid 5-digit ZIP code."));
      await page.focus("#home-zip-code");
      await page.keyboard.down("Control"); await page.keyboard.press("KeyA"); await page.keyboard.up("Control");
      await page.keyboard.press("Backspace");
      await page.type("#home-zip-code", "012345");
      check("ZIP keeps leading zero and limits input to five digits", await page.$eval("#home-zip-code", input => input.value) === "01234");
      check("Editing clears validation error", await page.$eval("#home-zip-code", input => input.getAttribute("aria-invalid") === "false") && await page.$eval("#home-zip-code-help", helper => helper.textContent === "Example: 30301" && !helper.hasAttribute("role")));
      await page.keyboard.press("Enter");
      await page.waitForFunction(() => location.pathname === "/need-help" && location.search === "?zip=01234");
      await page.waitForSelector("#workshop-zip");
      check("Corrected Enter submission preserves leading-zero ZIP query", await page.$eval("#workshop-zip", input => input.value) === "01234", { finalUrl: page.url() });
      await page.close();
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
