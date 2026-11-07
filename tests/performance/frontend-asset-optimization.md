# Frontend asset optimization and verification

Completed on **November 5, 2026** for [Milestone 3, PBI-14](../../documentation/milestones/Milestone-3.md#pbi-14-optimize-frontend-performance-and-technical-seo). Images, production scripts, styles, fonts, and public assets were reviewed using Lighthouse, the production bundle, and Chrome network/DOM inspection.

The verified improvement is smaller image delivery: the fully scrolled **I Want to Help** page downloads **126,334 image-body bytes instead of 2,019,962 bytes at the tested DPR 1 viewports, a 93.7% reduction**. At 412px/DPR 2, image delivery falls to **279,512 bytes, an 86.2% reduction**. Content, display dimensions, control geometry, links, and navigation behavior are preserved. These are local asset measurements; final deployed performance results remain pending.

## Findings and changes

| Asset category | Evidence and action |
|---|---|
| Community photos | Four JFIFs totaled **1,847,857 bytes**, including a **4,128 × 2,752**, **1,203,110-byte** smartphone photo. Lighthouse flagged oversized/older-format images on `/want-to-help`. Added WebP variants at **480, 800, and 1200px**, quality 82, with `srcSet` and layout-specific `sizes`. |
| Partner logos | Five JFIFs totaled **152,851 bytes**, displayed inside 210 × 95px boxes. Added **210/420px** WebP candidates using lossless encoding after resizing. Full-resolution lossless conversion would increase these files, so it was rejected. |
| Header logo | The existing 500 × 250 lossless WebP still had a **10,739-byte** Lighthouse sizing opportunity. Added **260/380px** derivatives and responsive sources; retained the existing **500px** source for high-density displays. The logo remains eager with high fetch priority. |
| Scripts | Main entry was **450,127 uncompressed bytes / 141,701 gzip bytes**. Lighthouse reported roughly **54–56 KB** of unused transferred JavaScript, principally React, Router, and MUI support. Existing route, Stripe, and mobile-menu splitting is preserved; no safe small deletion of those shared framework dependencies was identified. |
| Styles | No emitted CSS files or stylesheet requests: styles are supplied by MUI/Emotion. Lighthouse minification, unused-CSS, and render-blocking-resource checks pass. No stylesheet rewrite or new styling dependency was needed. |
| Fonts | No `@font-face`, downloaded font files, or font requests. The existing Bilo/Arial and Rockwell/Georgia stacks use available local fonts. No additional font request, preload, or display workaround was introduced. |
| Other assets | Public icons/manifest remain intact. Unused `logo.svg` and `reportWebVitals` are absent from startup requests; deleting their source would not improve delivery. The emitted MSW chunk is not requested on mocks-disabled Home and is not counted as startup payload. |

Changes are in [Header.js](../../capstonefall2026/src/components/Header.js), [ImpactSection.js](../../capstonefall2026/src/components/ImpactSection.js), and [PartnersSection.js](../../capstonefall2026/src/components/PartnersSection.js). Below-fold photos and partner logos retain native lazy loading and now use asynchronous decoding and explicit dimensions. CSS display sizes and `objectFit` behavior remain the same.

`srcSet`/`sizes` let browsers choose a suitable source for the display slot and device density, following [responsive image guidance](https://web.dev/learn/images/responsive-images). Native lazy loading may fetch images before they enter the viewport; the change preserves the browser's [distance-based loading behavior](https://web.dev/articles/browser-level-image-lazy-loading), rather than hiding content to affect a score.

## Image quality and reproducibility

All ten encoding inputs and the original header PNG are retained. Generated variants are in [src/assets/optimized](../../capstonefall2026/src/assets/optimized). Width-only Lanczos3 resizing preserves the source aspect ratio, subject to integer-pixel height rounding; no source image is enlarged or newly cropped. Photo `sizes` also accounts for the extra source pixels needed by fixed-height `objectFit: cover` crops, including on narrow desktop layouts with DPR 2.

- Photos use **lossy WebP quality 82**, with RGB PSNR **35.60–39.76 dB** against same-size resized references. They are not pixel-identical to the originals.
- All **12 lossless logo derivatives** exactly match the decoded RGBA pixels of their resized references. Resizing itself changes the original raster; this is not a claim of full-resolution pixel identity.
- Desktop before/after and mobile screenshots were visually inspected for recognizable photo detail, readable logos, preserved framing, and layout. PSNR supplements this inspection; it is not treated as proof of perceived quality.
- [image-encoding.json](2026-11-05-assets-local/image-encoding.json) records original/output bytes, dimensions, SHA-256 hashes, codec settings, and pixel comparisons. Every derivative is smaller than its source, and source hashes were rechecked after encoding.

| Image group | Original bytes | Smaller candidates | Larger candidates |
|---|---:|---:|---:|
| Four photos | 1,847,857 | 79,202 at 480px; 159,966 at 800px | 287,394 at 1200px |
| Five partner logos | 152,851 | 38,830 at 210px | 106,552 at 420px |
| Header WebP | 19,254 | 8,302 at 260px | 12,994 at 380px; existing 500px retained |

Totals within each candidate group are file sizes, not cumulative page downloads. The browser selects one candidate per image in the fresh navigation checks. All **24 new WebPs are emitted separately**; installed CRA 5 handles WebP through `asset/resource`, so its PNG/JPEG inline threshold does not embed these images in JavaScript. No application dependencies or build configuration were added. Main gzip size increases only **approximately 125 bytes** for responsive markup/URLs.

Reproduce the files with [optimize-frontend-assets.cjs](optimize-frontend-assets.cjs), using transient tooling outside application dependencies:

```powershell
npm exec --yes --package=sharp@0.34.5 -- node --version
node tests/performance/optimize-frontend-assets.cjs '<cached-node_modules/sharp-directory>'
```

The recorded encoder is **sharp 0.34.5**, **libvips 8.17.3**, **libwebp 1.6.0**, effort 6. The script verifies generated dimensions, savings, original hashes, and comparisons before writing outputs.

## Browser delivery results

Fresh cache-disabled Chrome contexts captured `/` and `/want-to-help` at 412/768/1280px with DPR 1, plus 412/1280px with DPR 2. Each lazy image was scrolled into view and decoded. The table sums `PerformanceResourceTiming.encodedBodySize` for the selected images, excluding HTTP headers, scripts, and other resource types.

| Route / viewport | Before image bytes | After image bytes | Reduction |
|---|---:|---:|---:|
| Home, 412/768/1280px DPR 1 | 19,254 | 8,302 | 56.9% |
| Home, 412px DPR 2 | 19,254 | 12,994 | 32.5% |
| Home, 1280px DPR 2 | 19,254 | 19,254 | 0%; original retained |
| I Want to Help, 412/768/1280px DPR 1 | 2,019,962 | 126,334 | **93.7%** |
| I Want to Help, 412px DPR 2 | 2,019,962 | 279,512 | **86.2%** |
| I Want to Help, 1280px DPR 2 | 2,019,962 | 316,492 | **84.3%** |

[Before](2026-11-05-assets-local/browser-before.json) and [after](2026-11-05-assets-local/browser-after.json) evidence retains requests, byte counts, selected sources, image attributes, DOM geometry, and screenshot paths. **38 before and 90 after browser checks passed**, with ten matched captures per phase and zero uncaught page errors. The additional after checks compare both phases and verify high-density crops:

- Identical page text, titles, and links; image display styles and layout/control geometry match within **0.1 CSS px**.
- All ten images on I Want to Help decode; photos and partner logos remain lazy. No font or Stripe requests on either measured route; Home makes no initial lazy-route or menu chunk request.
- Mobile/tablet Menu remains **111 × 51.5 CSS px**, opens by keyboard, closes with Escape, and returns focus. Existing action-button sizing is preserved.
- Twelve additional photo checks at **599/900/1280px, DPR 2** verify that both source dimensions provide at least two pixels per displayed CSS pixel with cover cropping. All pass; the minimum available density is **2.116**. The 1200px candidates are exercised on the wider mobile/high-density layout.

## Lighthouse diagnostics and limits

One mobile navigation diagnostic was retained per route and phase, using **Lighthouse 12.8.2**, Chrome **156.0.8078.80**, Node **20.11.1**, and production builds served by **serve 14.2.4** at localhost. Settings match across all four reports: 412 × 823 CSS px, DPR 1.75, simulated 150ms RTT / 1,638.4 Kbps / 4× CPU slowdown. Storage reset and fresh Chrome profiles were used. Mocks and the Stripe key are unset. Browser checks, builds, encoding, and Jest ran outside Lighthouse collection. No runtime errors or run warnings occurred.

| Diagnostic | Home before → after | I Want to Help before → after |
|---|---:|---:|
| Oversized-image potential savings | 10,739 → **0 bytes** | 1,762,406 → **47,666 bytes** |
| Modern-image-format audit | Pass → Pass | Failing → **Pass** |
| Total transferred bytes | 173,300 → 167,167 | 2,025,954 → **332,626** |
| FCP | 0.611 → 0.609 s | 0.615 → 0.615 s |
| LCP | 1.969 → 1.852 s | 3.251 → 2.767 s |
| TBT | 297 → 366 ms | 137.5 → 131 ms |
| Speed Index | 0.675 → 0.653 s | 0.901 → 0.857 s |
| CLS | 0 → 0 | 0.352 → 0.352 |
| SEO | 100 → 100 | 100 → 100 |

These are **single diagnostic observations, not medians or a controlled timing experiment**. The byte reductions and audit changes are verified; no causal FCP/LCP/TBT/Speed Index improvement is claimed. Home TBT is higher in the final diagnostic and remains above the project's <200ms target; I Want to Help LCP remains above 2.5s. Its pre-existing direct-navigation CLS also remains. The residual 47,666-byte responsive-image opportunity is recorded rather than claiming all image opportunities are eliminated.

Raw evidence: [before Home](2026-11-05-assets-local/before/home.report.json), [after Home](2026-11-05-assets-local/after/home.report.json), [before I Want to Help](2026-11-05-assets-local/before/want-to-help.report.json), [after I Want to Help](2026-11-05-assets-local/after/want-to-help.report.json); corresponding HTML reports are alongside them. [summary.json](2026-11-05-assets-local/summary.json) preserves exact metrics, settings, audit details, and browser byte comparisons. [environment.json](2026-11-05-assets-local/environment.json), both asset manifests, and [frontend-assets.patch](2026-11-05-assets-local/frontend-assets.patch) identify the measured builds: before commit `961895a4998578c4c0c2df50a23fe7387a1214de`, main `b25e5a92`; final after main `c8c5464b` plus recorded source hashes and new assets. Two earlier after diagnostics from the width-only sizing implementation are retained separately in [intermediate-width-only](2026-11-05-assets-local/intermediate-width-only/README.txt); the final reports include the subsequent cover-density refinement. No intermediate timings are used in the final comparison.

## Functional verification and repeat checks

Production build passed. Selected existing Home/Header/CheckoutForm tests passed **19/19**; the initial App run passed **6/7**, with the lazy I Want to Help import exceeding the test's default one-second heading wait during a concurrent build. The App suite then passed **7/7** in isolation without source changes. Both the [initial results](2026-11-05-assets-local/test-results.json) and [App rerun](2026-11-05-assets-local/test-results-app-retry.json) are retained. Existing development-only React DOM-prop warnings remain; production browser checks have no uncaught errors. No unrelated registration tests or payment submissions were performed.

From the repository root, point the browser helper at the corresponding production build, with `PUPPETEER_CORE_PATH` set if tooling is outside application dependencies:

```powershell
node tests/performance/check-frontend-assets.cjs before http://127.0.0.1:4173/ tests/performance/NEW-RUN/browser-before.json
node tests/performance/check-frontend-assets.cjs after http://127.0.0.1:4173/ tests/performance/NEW-RUN/browser-after.json tests/performance/NEW-RUN/browser-before.json
```

Use the [local Lighthouse command](fcp-optimization.md#repeat-the-local-checks) against both routes and retain separate phase directories. [summarize-frontend-assets.cjs](summarize-frontend-assets.cjs) regenerates the summary from the four report JSONs, browser captures, and phase manifests. These local findings do not replace the [initial deployed homepage measurement](README.md); the separate five-run final deployed comparison remains pending.
