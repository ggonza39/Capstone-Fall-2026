# TBT follow-up: local experiment and production confirmation

**Later follow-up:** after the public 457 ms result below, the [static-homepage optimization](tbt-static-home-optimization.md) removed initial Home renderer work. Its fresh local audits measure **0 ms median TBT**, range **0–90 ms**, with all five metric targets met in **5/5 runs**. That new fix still needs deployment and a public audit; **457 ms remains the latest measured public median**. The experiment below remains historical evidence for the earlier styling change.

Completed **November 10, 2026** after the [earlier deployed audit recorded 413 ms TBT](final-performance-and-seo-results.md). The local production-build follow-up measured **45 ms median TBT**, with **every one of five local runs below 200 ms**. All five metric targets passed in every local run.

The experiment below contains **local production-build measurements**. A subsequent five-run production audit on **November 10, 2026**, using Lighthouse **12.8.2**, measured **457 ms median TBT**, range **326.5–542 ms**, with **0/5 runs below 200 ms**. Production confirmation of this styling change was completed, but the public TBT target remained unmet. FCP, LCP, Speed Index, and SEO met their targets in all five public runs. See the [final production report](final-performance-and-seo-results.md) and [raw summary](2026-11-10-production-final-mobile/summary.json).

The earlier **45 ms local** and **413 ms public** results are retained as separate historical evidence. Different CPU calibration and two slow-CPU warnings in the new public set limit comparisons; the local result did not establish public compliance.

## Results

The comparison uses five fresh audits before and five after the change, on the same localhost origin and with identical full Lighthouse settings. Each median uses all five unrounded numeric values; none was discarded.

| Metric | Documented baseline | Local before median | Local after median | Target | After status |
|---|---:|---:|---:|---:|---|
| FCP | 5.7 s | 0.611 s | **0.759 s** | <2.0 s | **Met, 5/5** |
| LCP | 21.8 s | 1.863 s | **1.709 s** | <2.5 s | **Met, 5/5** |
| TBT | 700 ms | 401 ms | **45 ms** | <200 ms | **Met, 5/5** |
| Speed Index | 8.7 s | 0.698 s | **0.759 s** | <3.4 s | **Met, 5/5** |
| Lighthouse SEO | 40/100 | 100/100 | **100/100** | 90–100/100 | **Met, 5/5** |

| Run | Before TBT (ms) | After TBT (ms) | After FCP (s) | After LCP (s) | After Speed Index (s) | After SEO | Reports |
|---|---:|---:|---:|---:|---:|---:|---|
| 1 | 401 | 67.24 | 0.765 | 1.715 | 0.765 | 100 | [Before JSON](2026-11-10-tbt-followup/before/run-1.report.json), [after JSON](2026-11-10-tbt-followup/after/run-1.report.json), [after HTML](2026-11-10-tbt-followup/after/run-1.report.html) |
| 2 | 557 | 50 | 0.758 | 1.662 | 0.758 | 100 | [Before JSON](2026-11-10-tbt-followup/before/run-2.report.json), [after JSON](2026-11-10-tbt-followup/after/run-2.report.json), [after HTML](2026-11-10-tbt-followup/after/run-2.report.html) |
| 3 | 406 | 42 | 0.758 | 1.709 | 0.758 | 100 | [Before JSON](2026-11-10-tbt-followup/before/run-3.report.json), [after JSON](2026-11-10-tbt-followup/after/run-3.report.json), [after HTML](2026-11-10-tbt-followup/after/run-3.report.html) |
| 4 | 294 | 42 | 0.759 | 1.664 | 0.759 | 100 | [Before JSON](2026-11-10-tbt-followup/before/run-4.report.json), [after JSON](2026-11-10-tbt-followup/after/run-4.report.json), [after HTML](2026-11-10-tbt-followup/after/run-4.report.html) |
| 5 | 374 | 45 | 0.761 | 1.710 | 0.761 | 100 | [Before JSON](2026-11-10-tbt-followup/before/run-5.report.json), [after JSON](2026-11-10-tbt-followup/after/run-5.report.json), [after HTML](2026-11-10-tbt-followup/after/run-5.report.html) |

TBT fell **88.8%** in this paired experiment, with non-overlapping ranges of **294–557 ms before** and **42–67.24 ms after**. FCP and Speed Index increased slightly, while remaining comfortably below their targets; this change is not presented as an improvement to every timing metric. All ten audits completed with zero runtime errors and zero run warnings; CLS was zero throughout. [summary.json](2026-11-10-tbt-followup/summary.json) retains exact values, settings, ranges, warnings, and per-run target counts.

Historical baseline conditions are unavailable, so the baseline column is descriptive. Local results cannot establish Vercel performance or isolate all machine variation: Lighthouse CPU benchmark indices were **1,942.5–2,194.5 before** and **2,281–2,390.5 after**. The consistent bundle/rendering reduction supports the optimization, but the entire timing change cannot be attributed to code alone.

## What changed and why

The earlier deployed audit attributed the longest tasks to the entry script. A fresh local build reproduced the remaining TBT problem at 401 ms median. Its homepage still initialized MUI, Emotion, and the theme to render static layout, navigation, typography, links, and buttons. Deferring the closed mobile drawer had left that work in the initial bundle.

- [Home.js](../../capstonefall2026/src/pages/Home.js) and [Home.css](../../capstonefall2026/src/pages/Home.css) now use semantic HTML, ordinary CSS, and the same SVG paths. All homepage content and navigation remain available immediately, including ZIP validation and the original uniform buttons.
- [Header.js](../../capstonefall2026/src/components/Header.js), [Footer.js](../../capstonefall2026/src/components/Footer.js), and [MobileBottomNav.js](../../capstonefall2026/src/components/MobileBottomNav.js) share static shell styles and SVG icons. The Menu button retains its original 111 × 51.5 px size and existing lazy-loading, cancellation, retry, keyboard, and focus behavior.
- [App.js](../../capstonefall2026/src/App.js) loads the existing theme alongside each secondary page. [PageTheme.js](../../capstonefall2026/src/theme/PageTheme.js) preserves MUI styling and accessibility overrides on those pages and the on-demand mobile drawer. [base.css](../../capstonefall2026/src/styles/base.css) supplies the shared baseline before those pages are visited.

The initial JavaScript shrank from **450,657 to 259,393 decoded bytes**, or **141,864 to 82,562 gzip bytes (41.8% less)**. The optimized entry source map contains **zero MUI/Emotion modules**, and the initial homepage mounts no MUI/Emotion styles. Those libraries remain available when their components are requested. Every Lighthouse run requested zero lazy-route/menu chunks; Stripe remains absent from initial Home loading. [Before](2026-11-10-tbt-followup/before/startup-bundle.json) and [after](2026-11-10-tbt-followup/after/startup-bundle.json) bundle records retain the evidence.

No timers or delayed visible content were added. Lighthouse thresholds, throttling, and audit categories were unchanged. This removes initialization and rendering work contributing to [Total Blocking Time](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-total-blocking-time), rather than shifting it past the audit.

## Verification

The production build and **all 55 automated tests across six suites passed** in the [final test run](2026-11-10-tbt-followup/test-results-final.json). These cover routing, Home ZIP behavior, mobile-menu lifecycle/focus, route metadata, workshop registration, and donor validation. Earlier retained reports include two cold-load timeouts during a concurrent build and an invocation with an incorrect metadata-test path; the final invocation uses the correct path and passes without a concurrent build. The route test now allows five seconds for Jest's cold transformation of the newly deferred theme instead of its former one-second element wait. Production loading behavior has no added delay. Existing MUI development-mode warnings on secondary routes remain outside this change.

[Browser verification](2026-11-10-tbt-followup/browser-after.json) passed **77 checks with zero visual differences** against the [before capture](2026-11-10-tbt-followup/browser-before.json). It compared initial, focused-ZIP, and invalid-ZIP states at **412, 768, 1280, and 853 CSS px**: text, links, SVG paths, geometry within 0.5 px, typography, colors, borders, spacing, and focus styling match. It also checked lazy route entry, return Home, keyboard menu operation, and preserved button sizes. The Lighthouse run-1 [before](2026-11-10-tbt-followup/before/run-1-final-screenshot.jpg) and [after](2026-11-10-tbt-followup/after/run-1-final-screenshot.jpg) screenshots were visually checked and show the same homepage. The 853 px viewport approximates a 1280 px display at 150% zoom; actual browser-chrome zoom was not automated.

The local donation route still reports its known missing Stripe publishable key; no payment or workshop registration was submitted. These checks do not establish backend/payment readiness, other routes' performance, field responsiveness, indexing, or server HTTP-status correctness. See the [final report](final-performance-and-seo-results.md) for the latest deployed measurements and separately identified limitations.

## Conditions, identity, and reproduction

- **Lighthouse 12.8.2**, Node **20.11.1**, Chrome **157.0.8103.39**; same Windows 11 / Intel Core i5-1035G1 machine in both phases.
- Local optimized CRA production builds served with **serve 14.2.4** at `http://127.0.0.1:4173/`; mobile navigation audits only, **412 × 823 CSS px**, DPR **1.75**, simulated **150 ms RTT**, **1,638.4 Kbps**, and **4× CPU slowdown**.
- Five sequential fresh-browser audits per phase, default storage reset, no URL blocking, mock worker, payment key, or form interaction. Builds, tests, and supplemental browser checks ran outside the audit sets.
- Before entry: `static/js/main.eec3178c.js`; after entry: `static/js/main.e71af680.js`, with `static/css/main.1083a7e6.css`. All audits verify their expected entry. Both manifests and raw HTML are retained under each phase directory.
- [environment.json](2026-11-10-tbt-followup/environment.json) records the source reference and optimized source hashes. That local record predates deployment and does not identify the deployed source commit.

Run `npm run build` from `capstonefall2026`, then serve its `build` directory with `serve@14.2.4` on port 4173. Repeat five times with Lighthouse 12.8.2, using a new output directory:

```powershell
node '<lighthouse/cli/index.js>' http://127.0.0.1:4173/ --only-categories=performance,seo --form-factor=mobile --throttling-method=simulate --output=json --output=html --output-path='<new-directory>/run-N' --chrome-path='<chrome.exe>' --chrome-flags="--headless=new --no-first-run --no-default-browser-check --disable-extensions" --quiet
```

[summarize-tbt-followup.cjs](summarize-tbt-followup.cjs) validates both five-run sets and calculates all target statuses. [check-tbt-followup.cjs](check-tbt-followup.cjs) repeats the separate browser checks using an externally installed Puppeteer Core. Preserve these reports when repeating measurements.

The team subsequently published the changes to production. Public confirmation used [run-final-lighthouse.ps1](run-final-lighthouse.ps1) and [summarize-final-lighthouse.cjs](summarize-final-lighthouse.cjs) with the separate [2026-11-10-production-final-mobile](2026-11-10-production-final-mobile/summary.json) evidence directory. All five audits loaded `/static/js/main.ce2cc812.js`, with stable HTML/ETag identity. The resulting **457 ms public median TBT** supersedes the earlier 413 ms public snapshot as the latest measurement; it does not replace this local experiment's 45 ms result. The subsequent [static-homepage fix](tbt-static-home-optimization.md) has separate local evidence and still needs production verification. No commit, push, merge, or deployment was performed by the audit run.
