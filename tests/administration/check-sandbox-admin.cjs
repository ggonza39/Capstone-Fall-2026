// Run against a locally served production build, separately from Lighthouse.
// Set PUPPETEER_CORE_PATH to an existing puppeteer-core installation if needed.
// node tests/administration/check-sandbox-admin.cjs http://127.0.0.1:4174/
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const puppeteer = require(process.env.PUPPETEER_CORE_PATH || "puppeteer-core");

const base = process.argv[2] || "http://127.0.0.1:4174/";
const sessionKey = "tsls.sandbox.admin.session";
const failures = [];
let checks = 0;

function check(name, passed) {
    assert.ok(passed, name);
    checks += 1;
}

async function expectHeading(page, heading) {
    await page.waitForFunction((expected) => document.querySelector("h1")?.textContent === expected, {}, heading);
}

async function screenshot(page, filename) {
    if (process.env.ADMIN_SCREENSHOT_DIRECTORY) {
        fs.mkdirSync(process.env.ADMIN_SCREENSHOT_DIRECTORY, { recursive: true });
        await page.screenshot({ path: path.join(process.env.ADMIN_SCREENSHOT_DIRECTORY, filename), fullPage: true });
    }
}

(async () => {
    const browser = await puppeteer.launch({
        executablePath: process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        headless: true,
    });
    try {
        const page = await browser.newPage();
        page.on("pageerror", (error) => failures.push(error.message));
        const rawHome = await fetch(base).then((response) => response.text());
        check("production homepage retains static rendering", rawHome.includes('data-prerendered="home"'));
        check("Admin link exists in production HTML", /<a\b[^>]*href="\/admin"[^>]*>Admin<\/a>/.test(rawHome));

        await page.setViewport({ width: 1280, height: 900 });
        await page.goto(base, { waitUntil: "networkidle0" });
        check("desktop header fits the viewport", await page.evaluate(() => {
            const nav = document.querySelector('.site-desktop-navigation');
            return nav.getBoundingClientRect().right <= innerWidth && document.documentElement.scrollWidth <= innerWidth;
        }));
        await Promise.all([
            page.waitForNavigation({ waitUntil: "networkidle0" }),
            page.click('nav[aria-label="Main navigation"] a[href="/admin"]'),
        ]);
        await expectHeading(page, "Admin login");
        check("unauthenticated Admin link redirects to login", new URL(page.url()).pathname === "/admin/login");
        check("administration has a separate page shell", await page.evaluate(() => !document.querySelector('.site-header, .site-footer, .site-bottom-navigation')));
        check("login has noindex metadata", await page.$eval('meta[name="robots"]', (element) => element.content === "noindex,nofollow"));
        check("password is masked", await page.$eval('#admin-password', (element) => element.type === "password"));

        await page.type('#admin-username', "admin");
        await page.type('#admin-password', "incorrect");
        await page.click('form button[type="submit"]');
        await page.waitForSelector('[role="alert"]');
        check("incorrect credentials do not open the dashboard", new URL(page.url()).pathname === "/admin/login");
        check("incorrect credentials do not create a session", await page.evaluate((key) => sessionStorage.getItem(key) === null, sessionKey));

        await page.click('#admin-password');
        await page.keyboard.down("Control");
        await page.keyboard.press("A");
        await page.keyboard.up("Control");
        await page.type('#admin-password', "admin123");
        await page.click('form button[type="submit"]');
        await expectHeading(page, "Administration");
        check("correct credentials navigate to administration", new URL(page.url()).pathname === "/admin");
        check("dashboard has all four placeholder sections", await page.evaluate(() => {
            const titles = [...document.querySelectorAll('main section h2')].map((element) => element.textContent);
            return ["Workshop Listing", "Create a Workshop", "Edit a Workshop", "Selected Informational Content"].every((title) => titles.includes(title))
                && document.querySelectorAll('main .admin-placeholder-badge').length === 4;
        }));
        check("session contains a marker without the password", await page.evaluate((key) => sessionStorage.getItem(key) === "active" && !JSON.stringify(sessionStorage).includes("admin123"), sessionKey));
        check("dashboard identifies the sandbox access limitation", await page.$eval('.admin-sandbox-notice', (element) => element.textContent.includes("not production authentication or role-based access control")));

        for (const width of [320, 412, 768, 1280]) {
            await page.setViewport({ width, height: 900 });
            check(`dashboard has no horizontal overflow at ${width}px`, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
            if (width === 412 || width === 1280) await screenshot(page, `administration-${width}.png`);
        }

        await page.reload({ waitUntil: "networkidle0" });
        await expectHeading(page, "Administration");
        check("refresh retains the same-tab session", new URL(page.url()).pathname === "/admin");
        await page.click('.admin-button-logout');
        await expectHeading(page, "Admin login");
        check("logout clears the session", await page.evaluate((key) => sessionStorage.getItem(key) === null, sessionKey));

        for (const route of ["/admin", "/admin/workshops", "/admin/create-workshop"]) {
            await page.goto(new URL(route, base).href, { waitUntil: "networkidle0" });
            await expectHeading(page, "Admin login");
            check(`${route} is guarded after logout`, new URL(page.url()).pathname === "/admin/login");
        }

        await page.setViewport({ width: 412, height: 900 });
        await page.goto(base, { waitUntil: "networkidle0" });
        await page.click('.site-menu-button');
        await page.waitForSelector('nav[aria-label="Mobile navigation"] a[href="/admin"]', { visible: true });
        await page.click('nav[aria-label="Mobile navigation"] a[href="/admin"]');
        await expectHeading(page, "Admin login");
        check("production mobile menu opens the admin login", new URL(page.url()).pathname === "/admin/login");
        await screenshot(page, "admin-login-mobile.png");
        check("no uncaught browser errors", failures.length === 0);
        console.log(JSON.stringify({ passed: true, checks, browserErrors: failures, base }, null, 2));
    } finally {
        await browser.close();
    }
})().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
