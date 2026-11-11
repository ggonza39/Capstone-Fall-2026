# TBT correction: build-rendered homepage

The updated **local production build meets all five metric targets in all five Lighthouse runs**. Median TBT is **0 ms**, with a **0-90 ms range**, against the strict **<200 ms** target. The homepage now arrives as complete HTML and uses a small JavaScript controller for ZIP validation and menu loading. Its appearance and content remain unchanged.

**This source has not been deployed by this follow-up.** The latest measured public deployment remains **457 ms median TBT**. Publish the new build and collect a separate five-run public confirmation before claiming that the live site meets every target. The [public final report](final-performance-and-seo-results.md) and its original evidence remain intact.

## Measurements

Five sequential audits were collected before and after the change using Lighthouse **12.8.2**, Chrome **157.0.8103.39**, Node **20.11.1**, mobile **412 x 823**, DPR **1.75**, simulated **150 ms RTT**, **1,638.4 Kbps**, and **4x CPU slowdown**. Both phases used frozen production artifacts at `http://127.0.0.1:4173/`, fresh browser profiles, default storage reset, and unchanged performance/SEO categories. No builds, tests, other browser checks, URL blocking, mock worker, or form submissions ran during the audit sets.

Values below are independent medians of the five unrounded numeric audit values. The historical baseline has no supplied raw reports or equivalent test conditions, so its comparison remains descriptive.

| Metric | Documented baseline | Before, local | Updated build, local | Target | Updated status |
|---|---:|---:|---:|---:|---|
| FCP | 5.7 s | 0.769 s | **1.186 s** | <2.0 s | **Met, 5/5** |
| LCP | 21.8 s | 1.790 s | **1.223 s** | <2.5 s | **Met, 5/5** |
| TBT | 700 ms | 492.544 ms | **0 ms** | <200 ms | **Met, 5/5** |
| Speed Index | 8.7 s | 1.045 s | **2.227 s** | <3.4 s | **Met, 5/5** |
| Lighthouse SEO | 40/100 | 100/100 | **100/100** | 90-100/100 | **Met, 5/5** |

FCP and Speed Index medians increased in this experiment while remaining below their targets. LCP and TBT improved. This is not a claim that every metric became faster.

| Updated run | FCP (s) | LCP (s) | TBT (ms) | Speed Index (s) | SEO | Warnings | Reports |
|---|---:|---:|---:|---:|---:|---|---|
| 1 | 1.215 | 1.232 | 0 | 2.228 | 100 | None | [JSON](2026-11-10-tbt-rendering/after/run-1.report.json), [HTML](2026-11-10-tbt-rendering/after/run-1.report.html) |
| 2 | 1.217 | 1.225 | 0 | 2.227 | 100 | None | [JSON](2026-11-10-tbt-rendering/after/run-2.report.json), [HTML](2026-11-10-tbt-rendering/after/run-2.report.html) |
| 3 | 1.186 | 1.223 | 0 | 2.253 | 100 | None | [JSON](2026-11-10-tbt-rendering/after/run-3.report.json), [HTML](2026-11-10-tbt-rendering/after/run-3.report.html) |
| 4 | 0.853 | 1.223 | 90 | 2.127 | 100 | Slow CPU | [JSON](2026-11-10-tbt-rendering/after/run-4.report.json), [HTML](2026-11-10-tbt-rendering/after/run-4.report.html) |
| 5 | 0.766 | 1.216 | 0 | 0.766 | 100 | None | [JSON](2026-11-10-tbt-rendering/after/run-5.report.json), [HTML](2026-11-10-tbt-rendering/after/run-5.report.html) |

The [summary](2026-11-10-tbt-rendering/summary.json) retains all ten reports, exact values, ranges, full settings, warning text, byte counts, and target checks. All audits completed without runtime errors. CPU benchmark indices ranged **516-1,127 before** and **929-1,395 after**; three before runs and one after run contain slow-CPU warnings. All reports are retained. Machine variation limits how much of the timing difference can be attributed to code alone. A 0 ms median does not mean JavaScript executes without cost; run 4 measured 90 ms.

## Diagnosis and implementation

The public build had already reduced its initial script to approximately 260 KB decoded, but still loaded React, React DOM, and routing to construct a mostly static homepage. A separate [production diagnostic trace](2026-11-10-tbt-rendering/profile/production-diagnostic-0.trace.json) showed script execution, React rendering, and layout work. That diagnostic audit is separate from the five-run comparison. Its observed trace durations and Lighthouse's simulated long-task estimates are different measurements; complete task durations must not be summed as TBT. See [Chrome's TBT definition](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-total-blocking-time).

- [prerender-home.cjs](../../capstonefall2026/scripts/prerender-home.cjs) runs automatically after `npm run build`. It renders the existing Home and MainLayout components into `build/index.html`, including the shared header/footer, links, images, ZIP form, and route metadata. Assets resolve through the production manifest. It preserves CRA's original empty document as `build/app.html` and fails the build if expected markup or assets are absent.
- [index.js](../../capstonefall2026/src/index.js) enhances the rendered homepage without mounting React. Its startup entry is **7,750 bytes raw / 3,574 bytes gzip**, down from **259,633 / 82,615 bytes** in the local before build: **95.7% less gzip startup JavaScript**. It contains no React, router, MUI, or Emotion modules. Initial browser checks confirm no framework chunks are requested.
- [enhanceStaticHome.js](../../capstonefall2026/src/home/enhanceStaticHome.js) preserves ZIP sanitization, leading zeros, accessible inline helper errors, and navigation. The raw HTML also provides required/pattern validation and a native GET action when JavaScript is unavailable. The skip link remains visible on keyboard focus without JavaScript.
- The existing mobile drawer loads only when Menu is requested, with loading feedback, retry, cancellation, focus handling, and Escape support. Homepage links use full-document navigation, including drawer links, so the destination renders correctly. The React application starts immediately on secondary pages; there is no idle hydration, timeout, delayed essential content, or altered Lighthouse setting.
- [ScrollToTop.js](../../capstonefall2026/src/components/ScrollToTop.js) preserves initial browser focus/scroll restoration and only applies its focus/scroll behavior to subsequent pathname changes.
- [vercel.json](../../capstonefall2026/vercel.json) builds with `npm run build`, preserves the homepage at `/`, redirects `/index.html` to `/`, and sends secondary paths to `app.html`. API, static assets, and `.well-known` paths are excluded from that fallback. This routing configuration must be deployed with the new output.

This uses [React's static rendering API](https://react.dev/reference/react-dom/server/renderToStaticMarkup) at build time. Static output is deliberately enhanced through native event handlers; it is not subsequently hydrated. Secondary routes retain the existing React implementation. Vercel configuration follows its [project configuration reference](https://vercel.com/docs/project-configuration/vercel-json); the remote project's Root Directory setting has not been independently inspected.

## Verification and limits

- The production build and static generation passed. Running the generator again produced identical HTML, without nested content or duplicated preloads.
- [Browser verification](2026-11-10-tbt-rendering/browser-after.json) passed **107 checks**, with **zero differences** in compared layout, text, SVG paths, fonts, colors, borders, or spacing. Widths were 412, 768, 1,280, and 853 CSS pixels; 853 tests reflow comparable to a narrower zoomed viewport, not browser-chrome zoom. [Mobile](2026-11-10-tbt-rendering/after-mobile-412.png) and [desktop](2026-11-10-tbt-rendering/after-desktop-1280.png) screenshots are retained.
- Checks cover initial/focused/invalid ZIP appearance, leading-zero navigation, Back, menu loading and drawer navigation, primary links, eight secondary-route refreshes, unknown-page noindex behavior, and raw/no-JavaScript homepage content. [No-JavaScript skip-link verification](2026-11-10-tbt-rendering/no-js-skip-link.json) also passed.
- [Eleven HTTP delivery checks](2026-11-10-tbt-rendering/route-delivery.json) passed for homepage/secondary/unknown HTML, actual assets, robots/sitemap, the index redirect, and excluded missing API/static paths. This is local routing verification, not a production API-readiness claim.
- All **17 new native-controller and focus tests passed**. The [full suite](2026-11-10-tbt-rendering/test-results.json) had **136 passed / 6 failed**. The unchanged Advocate and Contact tests expect API submission behavior while those unchanged components currently provide demo feedback. The initial Contact failures timed out at five seconds; a [20-second retry](2026-11-10-tbt-rendering/test-results-retry.json) exposed the existing success-message mismatches instead, with 20 passed / 2 failed in that selected set. The complete suite is not claimed green.
- Local Donate captures retain the existing unset Stripe publishable-key error. No registration, donation, payment, or API mutation was submitted. Homepage lab scores do not establish field performance, other-route timings, backend readiness, or the undefined aggregate 50% criterion.

[Environment and source hashes](2026-11-10-tbt-rendering/environment.json) identify the measured files. This is a local working-tree build based on reference commit `b33e2e12b92994b21e4620140d6c2f2d15b8024e`, not a verified deployed commit.

## Reproduction and public confirmation

Build and serve from `capstonefall2026`:

~~~powershell
npm run build
npm exec --yes --package=serve@14.2.4 -- serve build -c ../serve.json -l tcp://127.0.0.1:4173 --no-clipboard --no-request-logging
~~~

Use the supplied `serve.json` for local delivery. A generic `serve -s build` would serve the homepage document as the fallback for secondary routes and does not reproduce this deployment design.

The existing [deployment workflow](../../.github/workflows/deploy.yml) deploys production on pushes to `main`. Ensure the Vercel project's Root Directory is `capstonefall2026`, where the new configuration and package scripts live, and that build logs include the postbuild static-generation message. No commit, push, merge, or deployment was performed for this correction.

After deployment, run the collector from the repository root with Lighthouse **12.8.2** and a new evidence directory. Set `$lighthouseCli` to that version's installed `lighthouse/cli/index.js` path:

~~~powershell
$evidenceDirectory = 'tests/performance/YYYY-MM-DD-static-home-production-mobile'
./tests/performance/run-final-lighthouse.ps1 -LighthouseCli $lighthouseCli -OutputDirectory $evidenceDirectory -RequireStaticHome
node tests/performance/summarize-final-lighthouse.cjs $evidenceDirectory
~~~

`-RequireStaticHome` rejects the old client-rendered deployment before auditing. Verify the public homepage contains `data-prerendered="home"`, the entry/manifest identity stays stable, secondary pages refresh correctly, and all five raw audits meet the targets. Record public results separately; preserve the 457 ms evidence and this local comparison.
