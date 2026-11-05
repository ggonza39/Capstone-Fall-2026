# Speed Index optimization and local verification

Completed on **November 5, 2026** for [Milestone 3, PBI-14](../../documentation/milestones/Milestone-3.md#pbi-14-optimize-frontend-performance-and-technical-seo). The documented project baseline is **8.7 seconds**, and the target is **less than 3.4 seconds**. The [initial deployed audit](README.md) already measured a **1.111-second Speed Index median**. Original baseline reports and conditions are unavailable, so comparisons with the historical baseline are descriptive.

The new local production median is **1.520 seconds**, within the target in all five runs. The paired before median was **1.495 seconds**. The after median is **25.792 ms higher (about 1.7%)**, so this experiment does **not** establish a Speed Index timing improvement. Its verified benefit is a **45.1% smaller, pixel-identical logo** and explicit image dimensions. All ten runs retain slow-CPU warnings. Final deployed results remain pending.

## Findings and implementation

Speed Index measures visual progress during loading, rather than total page load time; see [Chrome's Lighthouse documentation](https://developer.chrome.com/docs/lighthouse/performance/speed-index). Earlier work already removed unnecessary payment, secondary-page, and closed-menu startup work. The remaining homepage image opportunity was the header logo:

- Original PNG: **500 × 250 pixels, 35,072 bytes**, displayed at 190/220/260 CSS px depending on viewport.
- Lighthouse flagged modern image format, responsive image sizing, and missing intrinsic dimensions. Font-display and render-blocking-resource audits identified no additional blocker to fix.
- [Header.js](../../capstonefall2026/src/components/Header.js) now imports [techsmartLogo.webp](../../capstonefall2026/src/assets/techsmartLogo.webp), a **lossless transcode of the existing pixels**, and sets `width={500}`, `height={250}`, `loading="eager"`, and `fetchPriority="high"`.

All **125,000 decoded RGBA pixels match exactly**, including alpha samples: zero differing bytes or pixels. The original PNG is preserved. The WebP omits a redundant opaque alpha channel, with no decoded-pixel change. [Encoding evidence](2026-11-05-speed-index-local/logo-encoding.json) records the input/output hashes, dimensions, codec versions, options, and comparison.

The existing responsive widths, logo canvas/colors, header layout, page content, and restored Menu styling are preserved. Chrome already assigned the logo **High** request priority before this change, so the new explicit hint is not reported as an observed priority improvement. No visible content was delayed or hidden to affect the measurement.

## Local production results

Five sequential mobile Lighthouse runs were collected per phase, using production builds, the same local server, and identical settings. Medians use unrounded numeric audit values.

| Measurement | Before | After |
|---|---:|---:|
| Speed Index median | **1.495 s** | **1.520 s** |
| Speed Index range | 1.257–2.711 s | 1.227–1.985 s |
| Runs below 3.4 s | 5/5 | **5/5** |
| Logo image file bytes | 35,072 | 19,254 |
| Logo transferred bytes (median) | 35,375 | 19,559 |
| Total transferred bytes (median) | 187,326 | 171,537 |
| CLS median | 0 | 0 |
| Homepage Stripe / initial chunk requests | 0 / 0 | 0 / 0 |

The logo saves **15,818 bytes (45.1%)**, and median total homepage transfer is **8.4% lower** in this setup. The modern-format and explicit-image-dimensions audits pass after the change. Lighthouse still flags a responsive-size opportunity of approximately **10,739 bytes**, reduced from **19,562 bytes**; image resampling/variants were not introduced in this pixel-preserving change. Other frontend asset work remains a separate criterion.

All five after runs have zero CLS. Two before runs recorded approximately 0.0168; the before median was already zero, so no median CLS improvement is claimed. The Speed Index ranges overlap, and every run contains a slow-CPU calibration warning. Benchmark indices ranged **377.5–731.5 before** and **532–911 after**. These measurements do not prove a timing benefit or regression caused by the asset change. No run was discarded, replaced, or reclassified.

| Run | Before Speed Index (s) | After Speed Index (s) | Raw reports |
|---|---:|---:|---|
| 1 | 2.711 | 1.227 | [Before JSON](2026-11-05-speed-index-local/before/run-1.report.json), [After JSON](2026-11-05-speed-index-local/after/run-1.report.json) |
| 2 | 1.495 | 1.417 | [Before JSON](2026-11-05-speed-index-local/before/run-2.report.json), [After JSON](2026-11-05-speed-index-local/after/run-2.report.json) |
| 3 | 1.346 | 1.985 | [Before JSON](2026-11-05-speed-index-local/before/run-3.report.json), [After JSON](2026-11-05-speed-index-local/after/run-3.report.json) |
| 4 | 1.751 | 1.650 | [Before JSON](2026-11-05-speed-index-local/before/run-4.report.json), [After JSON](2026-11-05-speed-index-local/after/run-4.report.json) |
| 5 | 1.257 | 1.520 | [Before JSON](2026-11-05-speed-index-local/before/run-5.report.json), [After JSON](2026-11-05-speed-index-local/after/run-5.report.json) |

[summary.json](2026-11-05-speed-index-local/summary.json) preserves exact numeric metrics, medians, image requests/priorities, asset bytes, audit scores, CPU indices, settings, and warnings. Reported Speed Index uses `audits.speed-index.numericValue` with simulated throttling. Observed filmstrip timing fields are recorded separately and are not substituted for the simulated metric. Other captured metrics do not complete remaining optimization criteria; the TBT target remains unmet.

## Conditions and build identity

- Production output from `npm run build`, served at `http://127.0.0.1:4173/` using **serve 14.2.4**; homepage only, five sequential runs per phase. Builds, tests, browser checks, and image encoding ran outside the audit sets.
- Lighthouse CLI **12.8.2**, `performance,seo`, mobile profile **412 × 823 CSS px**, device scale factor **1.75**, simulated **150 ms RTT**, **1,638.4 Kbps throughput**, **4× CPU slowdown**. Full `configSettings` match across all ten reports.
- Node.js **20.11.1**, Chrome **156.0.8078.80**, Windows 11 Home 64-bit, Intel Core i5-1035G1 (4 cores / 8 logical processors). Fresh Chrome process/profile and default storage reset for each run.
- Mocks and the Stripe publishable key are unset in both builds. No URL blocking, form submissions, or interactions during Lighthouse. Zero Lighthouse runtime errors; all ten CPU warnings retained.
- Before source: `732d84c83d79e6644a7dcb99689cea714127ac7a`, entry `/static/js/main.a622ae2e.js`. After entry: `/static/js/main.64238a2f.js`. [header-logo.patch](2026-11-05-speed-index-local/header-logo.patch) records the Header change; the new WebP is separately identified by its hash and reproducible encoding record.
- [Environment and source/asset hashes](2026-11-05-speed-index-local/environment.json), [before manifest](2026-11-05-speed-index-local/before/asset-manifest.json), and [after manifest](2026-11-05-speed-index-local/after/asset-manifest.json) identify the builds. Every audit loaded the expected entry script and logo format/byte count for its phase.

These are localhost lab measurements, separate from Vercel and field-user results. Repeat the [deployed measurement procedure](README.md#repeat-for-final-results) after deployment; do not replace the initial deployed evidence with these local values.

## Verification and reproduction

- Production build passed. Existing test suite: **35 passed, 4 failed**, including all **18 App/Home/Header tests passing**. [Jest results](2026-11-05-speed-index-local/test-results.json) retain the same four existing NeedHelp registration failures; those files and application dependencies were not changed.
- **Thirty-three Chrome checks passed**, with zero uncaught page errors. [Before](2026-11-05-speed-index-local/browser-before.json) and [after](2026-11-05-speed-index-local/browser-after.json) evidence confirms identical page text, styles, and geometry within 0.01 CSS px at 412/768/1280 px. Logo sizes remain 190×95, 220×110, and 260×130 px. Mobile/tablet Menu remains **111×51.5 px**, with working keyboard opening, Escape, and focus return.
- Lossless image verification compares every RGBA channel and a white-background composite. [optimize-logo.cjs](optimize-logo.cjs) reproduces the asset with **sharp 0.34.5**, **libvips 8.17.3**, **libwebp 1.6.0**, `lossless: true`, `effort: 6`, and no resizing. These are transient tooling dependencies, not application dependencies.

Use the [local Lighthouse procedure](fcp-optimization.md#repeat-the-local-checks) with a new results directory. To reproduce encoding, make sharp available outside application dependencies, then pass its package directory:

```powershell
npm exec --yes --package=sharp@0.34.5 -- node --version
node tests/performance/optimize-logo.cjs '<path-to-cached-node_modules/sharp>'
```

The [browser helper](check-header-logo.cjs) requires installed `puppeteer-core` (or `PUPPETEER_CORE_PATH`) and Chrome (`CHROME_PATH` can select it). Run each phase against its corresponding served production build outside Lighthouse collection:

```powershell
node tests/performance/check-header-logo.cjs before http://127.0.0.1:4173/ tests/performance/YYYY-MM-DD-speed-index-local/browser-before.json
node tests/performance/check-header-logo.cjs after http://127.0.0.1:4173/ tests/performance/YYYY-MM-DD-speed-index-local/browser-after.json tests/performance/YYYY-MM-DD-speed-index-local/browser-before.json
```
