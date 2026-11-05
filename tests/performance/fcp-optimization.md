# FCP optimization and local production verification

Implemented on **November 5, 2026** for the FCP acceptance criterion in [Milestone 3, PBI-14](../../documentation/milestones/Milestone-3.md#pbi-14-optimize-frontend-performance-and-technical-seo).

The [initial deployed mobile audit](README.md) already measured a **0.819-second FCP median**, below the **<2.0-second target** and the documented **5.7-second project baseline**. This change reduces avoidable startup work while preserving that target. The new measurements below are a separate local production comparison. The optimized build has not been deployed or measured on Vercel; the final deployed-results column remains pending.

## Identified issue and implementation

`App.js` eagerly imported every page. Importing `Donate.js` immediately called its module-level `loadStripe()`, starting payment scripts on the homepage before anyone visited Donate. The initial deployed reports show the main bundle and Stripe traffic on every homepage run. The render-blocking-resource and font-display audits did not identify additional FCP savings, so those assets were left unchanged.

- [App.js](../../capstonefall2026/src/App.js) now uses React `lazy()` for secondary pages, including Donate. Home and the shared layout remain eager, so opening the homepage adds no route-chunk request. Stripe initialization and the existing donation implementation run when Donate is visited.
- [MainLayout.js](../../capstonefall2026/src/layouts/MainLayout.js) wraps the route outlet in `Suspense` with an accessible loading status. Header, footer, mobile navigation, and the main-content focus target remain available while a directly opened page loads. React Router may retain the current page during a client-side navigation transition.

The existing sandbox/mock startup ordering, page content, button styling, and payment handling were preserved. The implementation follows [React's lazy-loading and Suspense API](https://react.dev/reference/react/lazy).

## Measured local results

Built both versions with `npm run build` and served each at `http://127.0.0.1:4173/` using `serve@14.2.4`. Each phase contains **five sequential Lighthouse 12.8.2 mobile navigation audits**, using the same machine, browser, simulated network/CPU settings, route, and median calculation. Tests and builds were completed outside the audit runs.

| Measurement | Local before | Local after |
|---|---:|---:|
| FCP median | **0.619 s** | **0.613 s** |
| FCP range | 0.615–0.633 s | 0.612–0.621 s |
| FCP runs below 2.0 s | 5/5 | 5/5 |
| Entry JavaScript, decoded bytes | 576,652 | 527,148 |
| Entry JavaScript, transferred bytes (median) | 175,758 | 163,362 |
| Homepage Stripe requests per run | 6 | **0** |
| Stripe transferred bytes (median) | 285,139 | **0** |
| Total transferred bytes (median) | 507,625 | 210,090 |

The entry script is **8.6% smaller decoded** and **7.1% smaller transferred**. Median total homepage transfer fell **58.6%** in this local setup. All five optimized audits made zero Stripe requests and zero secondary route-chunk requests. The optimized entry source map also contains no Stripe, Donate, or CheckoutForm modules.

The FCP difference is only **6.135 ms (about 1.0%)** and overlaps the run ranges; it should not be presented as a substantial or statistically established FCP improvement. Both versions already meet the target. The clear verified changes are less initial JavaScript and removal of payment startup requests from Home.

| Run | Before FCP (s) | After FCP (s) | Raw reports |
|---|---:|---:|---|
| 1 | 0.623 | 0.621 | [Before JSON](2026-11-05-fcp-local/before/run-1.report.json), [After JSON](2026-11-05-fcp-local/after/run-1.report.json) |
| 2 | 0.619 | 0.612 | [Before JSON](2026-11-05-fcp-local/before/run-2.report.json), [After JSON](2026-11-05-fcp-local/after/run-2.report.json) |
| 3 | 0.617 | 0.612 | [Before JSON](2026-11-05-fcp-local/before/run-3.report.json), [After JSON](2026-11-05-fcp-local/after/run-3.report.json) |
| 4 | 0.615 | 0.613 | [Before JSON](2026-11-05-fcp-local/before/run-4.report.json), [After JSON](2026-11-05-fcp-local/after/run-4.report.json) |
| 5 | 0.633 | 0.614 | [Before JSON](2026-11-05-fcp-local/before/run-5.report.json), [After JSON](2026-11-05-fcp-local/after/run-5.report.json) |

[summary.json](2026-11-05-fcp-local/summary.json) retains the exact values, independent medians, transfer measurements, settings, and warnings for both phases. It also records LCP, TBT, Speed Index, and SEO as supporting local data; these do not replace final deployed measurements or complete the other optimization criteria.

## Test conditions and build identity

- Node.js **20.11.1**, Chrome **156.0.8078.80**, Windows 11 Home 64-bit, Intel Core i5-1035G1 (4 cores / 8 logical processors).
- Lighthouse **12.8.2**, `performance,seo`, default mobile profile: **412 × 823 CSS px**, device scale factor **1.75**.
- Simulated **150 ms RTT**, **1,638.4 Kbps throughput**, **4× CPU slowdown**; all ten reports have identical `configSettings`. A fresh Chrome process/profile and the default storage reset were used for every run.
- Homepage only; no ZIP search or form submission during Lighthouse. Live third-party requests were allowed. Neither build enabled sandbox mocks or configured a Stripe publishable key; these local conditions differ from the deployed build. Payment readiness was not measured.
- All ten runs completed without a Lighthouse runtime error. **Before run 5** reports a slow-CPU calibration warning; all other runs have no run warnings. Every run is retained. The CPU warning and variation limit the precision of the small FCP difference.
- Before source: clean application source at `bb313b9a6f5dbe8734cfef6e922113477dad5d45`, entry script `/static/js/main.a1056268.js`.
- After source: that reference plus [fcp-optimization.patch](2026-11-05-fcp-local/fcp-optimization.patch), entry script `/static/js/main.71f543d3.js`. [environment.json](2026-11-05-fcp-local/environment.json) records SHA-256 hashes of the changed production source files. [Before](2026-11-05-fcp-local/before/asset-manifest.json) and [after](2026-11-05-fcp-local/after/asset-manifest.json) build manifests identify the assets; each run loaded its phase's expected entry script.

Localhost timings are not compared numerically with Vercel timings or the historical 5.7-second baseline as proof of an optimization effect. A hosted follow-up must use the existing [deployed audit procedure](README.md#repeat-for-final-results) and retain its own deployment identity and reports.

## Functional verification

- **Production build passed.**
- **Seven App regression tests passed**, including immediate Home rendering without Stripe initialization, direct loading of secondary pages, and navigation into Donate with deferred Stripe initialization.
- **Nine Chrome smoke checks passed**, including a deliberately delayed route chunk with visible loading status and shared navigation, preserved ZIP query/workshop path parameters, and a donation form that still requests Stripe. [Browser evidence](2026-11-05-fcp-local/browser-smoke.json) records the checks. The missing local publishable-key errors are retained; no payment was submitted or validated.
- Full suite (`npm test -- --watchAll=false --runInBand`): **24 passed, 4 failed**. The failures are existing workshop-registration tests in `NeedHelp.test.js` that expect the old registration dialog or a `registerForWorkshop` export. `NeedHelp.js`, its tests, and `workshopService.js` are unchanged from the reference commit. These failures are outside the routing/startup change.

## Repeat the local checks

Build from `capstonefall2026` with `npm run build`, then serve that production build in a separate terminal:

```powershell
npm exec --yes --package=serve@14.2.4 -- serve -s build -l tcp://127.0.0.1:4173 --no-clipboard
```

From the repository root, choose a new results directory and run:

```powershell
$outputDirectory = 'tests/performance/YYYY-MM-DD-fcp-local'
New-Item -ItemType Directory -Path $outputDirectory -Force | Out-Null
for ($runNumber = 1; $runNumber -le 5; $runNumber++) {
    npm exec --yes --package=lighthouse@12.8.2 -- lighthouse http://127.0.0.1:4173/ --only-categories=performance,seo --form-factor=mobile --throttling-method=simulate --output=json --output-path="$outputDirectory/run-$runNumber.report.json" --chrome-flags="--headless=new --no-first-run --no-default-browser-check --disable-extensions" --quiet
    if ($LASTEXITCODE -ne 0) { throw "Lighthouse run $runNumber failed" }
}
```

Retain every report and take the median of each metric's numeric values before rounding. Stop the static server before rebuilding on Windows, then restart it with the same settings. Keep builds, tests, and other browser checks outside the measurement runs.

The optional [browser smoke helper](check-route-loading.cjs) uses an installed `puppeteer-core` package (or its directory in `PUPPETEER_CORE_PATH`) and Chrome (`CHROME_PATH` can select the executable). Run it against the static server with a new evidence path:

```powershell
node tests/performance/check-route-loading.cjs http://127.0.0.1:4173/ tests/performance/YYYY-MM-DD-fcp-local/browser-smoke.json
```
