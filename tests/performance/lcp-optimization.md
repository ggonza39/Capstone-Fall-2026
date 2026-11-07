# LCP optimization and local production verification

Implemented on **November 5, 2026** for [Milestone 3, PBI-14](../../documentation/milestones/Milestone-3.md#pbi-14-optimize-frontend-performance-and-technical-seo). The documented project baseline is **21.8 seconds**, and the target is **less than 2.5 seconds**. The [initial deployed audit](README.md) measured a **4.515-second mobile LCP median**. Original baseline reports and conditions are unavailable, so those historical numbers are reference values rather than a controlled comparison with localhost.

This change reduces JavaScript on the path to rendering the homepage introduction. The new local five-run LCP median is **2.353 seconds**, compared with **2.387 seconds** for the preceding FCP-optimized source. Both local medians meet the target. The new build has not been deployed or audited on Vercel; final hosted results remain pending.

## Findings and implementation

The LCP element is the **homepage introduction paragraph**, beginning “TechSmart Learning for Seniors is a non-profit organization.” In initial deployed run 1, Lighthouse attributes **3,888 ms (86%)** of its modeled 4,515 ms LCP to render delay, with zero image load delay/time. In this experiment's before run 1, render delay is **1,799 ms (79%)** of the modeled 2,273 ms LCP. The remaining opportunity is JavaScript and rendering work. Image preloading would not address this text element, and the existing font/render-blocking-resource audits do not identify another blocking resource to fix.

[Home.js](../../capstonefall2026/src/pages/Home.js) previously used MUI `TextField` for one plain, outlined ZIP input. The installed `TextField` wrapper imports Select, FilledInput, and standard Input implementations even though this form uses none of those variants. The before Lighthouse report identifies unused entry JavaScript, including SelectInput and FilledInput.

The ZIP control now composes **FormControl, OutlinedInput, and FormHelperText** directly, following [MUI's component composition guidance](https://mui.com/material-ui/react-text-field/#components). Its change/submit logic, styling, helper messages, and full-width layout are preserved. Native input attributes now explicitly provide the ZIP accessible name, helper/error association, numeric keyboard hint, and five-character limit; this also corrects the old misspelled/ineffective input attribute configuration.

The hero, calls to action, remaining homepage sections, shared navigation, and fonts stay eager. No content is hidden, delayed, or reduced to change the LCP candidate. The [optimized bundle check](2026-11-05-lcp-local/after/bundle-check.json) confirms that TextField, FilledInput, standard Input, Select, and SelectInput **component implementations** are absent from the entry bundle. OutlinedInput still shares the small `Select/selectClasses.mjs` utility. Other routes load their existing form components when visited.

## Local production comparison

Five sequential Lighthouse audits were collected per phase, using fresh production builds and the same local static server, route, browser, tool version, mobile profile, and throttling settings. Medians are calculated from the unrounded numeric values, independently for each metric.

| Measurement | Local before | Local after |
|---|---:|---:|
| LCP median | **2.387 s** | **2.353 s** |
| LCP range | 2.224–2.575 s | 2.214–2.432 s |
| Runs below the 2.5 s LCP target | 3/5 | **5/5** |
| FCP median | 0.628 s | 0.625 s |
| Entry JavaScript, decoded bytes | 527,148 | 483,236 |
| Entry JavaScript, transferred bytes (median) | 163,362 | 151,409 |
| Lighthouse estimated unused JS bytes (median) | 74,166 | 62,972 |
| Homepage Stripe / secondary-route chunk requests | 0 / 0 | 0 / 0 |

The entry payload is **43,912 decoded bytes smaller (8.3%)**, with **7.3% less entry-script transfer** in this setup. The local LCP median is **34.627 ms lower (about 1.5%)**. That timing change is small, the run ranges overlap, and **all ten runs report Lighthouse's slow-CPU calibration warning**. The results do not establish a statistically significant improvement or prove that the source change alone caused the timing difference. The verified payload reduction and all five after runs below target support the implementation; hosted verification is still needed.

The earlier FCP experiment's local LCP median was 2.268 seconds. This fresh paired set starts from that committed implementation, rather than reusing an older measurement as the before result. CPU benchmark indices varied from **425–877 before** and **671–981.5 after**, reinforcing the limit on precise timing comparisons. No run was discarded or replaced.

| Run | Before LCP (s) | After LCP (s) | Raw reports |
|---|---:|---:|---|
| 1 | 2.273 | 2.214 | [Before JSON](2026-11-05-lcp-local/before/run-1.report.json), [After JSON](2026-11-05-lcp-local/after/run-1.report.json) |
| 2 | 2.558 | 2.353 | [Before JSON](2026-11-05-lcp-local/before/run-2.report.json), [After JSON](2026-11-05-lcp-local/after/run-2.report.json) |
| 3 | 2.224 | 2.281 | [Before JSON](2026-11-05-lcp-local/before/run-3.report.json), [After JSON](2026-11-05-lcp-local/after/run-3.report.json) |
| 4 | 2.575 | 2.371 | [Before JSON](2026-11-05-lcp-local/before/run-4.report.json), [After JSON](2026-11-05-lcp-local/after/run-4.report.json) |
| 5 | 2.387 | 2.432 | [Before JSON](2026-11-05-lcp-local/before/run-5.report.json), [After JSON](2026-11-05-lcp-local/after/run-5.report.json) |

[summary.json](2026-11-05-lcp-local/summary.json) retains exact timing values, medians, payload measurements, modeled LCP phase breakdowns, settings, CPU benchmark indices, and every warning. Its additional LCP-adjacent metrics are supporting local measurements and do not complete the remaining optimization or final deployed-result criteria.

## Conditions and build identity

- URL: `http://127.0.0.1:4173/`, homepage only. Production output from `npm run build`, served with **serve 14.2.4**; no development server.
- Lighthouse CLI **12.8.2**, categories `performance,seo`, simulated mobile profile: **412 × 823 CSS px**, device scale factor **1.75**, **150 ms RTT**, **1,638.4 Kbps throughput**, **4× CPU slowdown**. Full `configSettings` match across all ten reports.
- Node.js **20.11.1**, headless Chrome **156.0.8078.80**, Windows 11 Home 64-bit, Intel Core i5-1035G1 (4 cores / 8 logical processors). Every CLI run uses a fresh Chrome process/profile and default storage reset.
- Mocks and the Stripe publishable key are unset in both local builds. External requests were not blocked. No search, form submission, or browser interaction took place during Lighthouse collection. Builds, Jest tests, and browser geometry checks ran outside the audit sets.
- Before source: `7e400b4a3bcf408bf412f15d176bcf6df0703c2d`, entry `/static/js/main.71f543d3.js`. After: that source plus [lcp-optimization.patch](2026-11-05-lcp-local/lcp-optimization.patch), entry `/static/js/main.7cab76a2.js`.
- [Environment and source hash](2026-11-05-lcp-local/environment.json), [before manifest](2026-11-05-lcp-local/before/asset-manifest.json), [after manifest](2026-11-05-lcp-local/after/asset-manifest.json), and [bundle/source-map check](2026-11-05-lcp-local/after/bundle-check.json) identify the measured code and assets. Every report loaded its phase's expected entry script.

There are zero Lighthouse runtime errors. Every report identifies the **same hero paragraph, selector, and bounding rectangle** as LCP. Phase timings above come from the modeled `largest-contentful-paint-element` audit; they are not mixed with observed-trace timings from the separate LCP breakdown insight. The distinction between rendering work and resource load time follows [web.dev's LCP optimization guidance](https://web.dev/articles/optimize-lcp).

Localhost lab results are separate from the deployed initial evidence and the historical 21.8-second baseline. They are not field-user measurements or results for all routes/devices. Repeat the [deployed measurement procedure](README.md#repeat-for-final-results) after deployment and retain its deployment identity and new raw reports before completing final hosted verification.

## Functional and visual verification

- Production build passed.
- **Eleven relevant tests passed**: four new [Home ZIP tests](../../capstonefall2026/src/pages/Home.test.js) and seven existing App routing/payment-loading tests. They cover eager hero rendering, accessible input/help attributes, digit filtering, validation recovery, and leading-zero ZIP navigation.
- Full suite: **28 passed, 4 failed**. [Jest results](2026-11-05-lcp-local/test-results.json) retain the same four existing NeedHelp registration failures (old dialog expectations/missing registration export). NeedHelp, its tests, and the workshop service are unchanged from the reference commit.
- **Fifteen Chrome checks passed** at **412 × 823** and **1280 × 900**. [Before](2026-11-05-lcp-local/browser-before.json) and [after](2026-11-05-lcp-local/browser-after.json) evidence confirms identical visible page text, input/helper computed styles, and hero/form/input/button geometry within 0.51 CSS px. Existing hero button dimensions are preserved, including the pre-existing 2 px desktop variant-width difference. Native ZIP input attributes, filtering, associated error/alert, error clearing, five-digit limit, and Enter submission to `/need-help?zip=01234` work.

## Reproduction

Use the [local production build/server and Lighthouse commands](fcp-optimization.md#repeat-the-local-checks), with a new results directory for this experiment. Keep the machine, browser, device profile, route, server, throttling, and five-run median procedure fixed; stop the server before rebuilding on Windows. Retain warnings and all raw runs.

The [ZIP/browser helper](check-home-zip.cjs) requires an installed `puppeteer-core` package (or its directory in `PUPPETEER_CORE_PATH`) and Chrome (`CHROME_PATH` can select the executable). Run each phase against its corresponding served build, outside Lighthouse collection, and preserve separate outputs:

```powershell
node tests/performance/check-home-zip.cjs before http://127.0.0.1:4173/ tests/performance/YYYY-MM-DD-lcp-local/browser-before.json
node tests/performance/check-home-zip.cjs after http://127.0.0.1:4173/ tests/performance/YYYY-MM-DD-lcp-local/browser-after.json tests/performance/YYYY-MM-DD-lcp-local/browser-before.json
```
