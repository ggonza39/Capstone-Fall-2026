# Performance and SEO measurements

## Latest correction: all five targets met in the local production build

The [build-rendered homepage correction](tbt-static-home-optimization.md) removes the initial React rendering work from Home while preserving its content, layout, ZIP validation, and mobile menu. Five new Lighthouse **12.8.2** audits of the local production build meet **every target in every run**. TBT is **0 ms median**, with a **0-90 ms range**, compared with **492.544 ms** in the paired local before set.

| Metric | Updated local median | Target | Status |
|---|---:|---:|---|
| FCP | **1.186 s** | <2.0 s | **Met, 5/5** |
| LCP | **1.223 s** | <2.5 s | **Met, 5/5** |
| TBT | **0 ms** | <200 ms | **Met, 5/5** |
| Speed Index | **2.227 s** | <3.4 s | **Met, 5/5** |
| Lighthouse SEO | **100/100** | 90-100/100 | **Met, 5/5** |

[Exact before/after summary](2026-11-10-tbt-rendering/summary.json). The build passed, along with 107 browser checks, zero visual differences, and 17 new unit tests. Six existing Advocate/Contact API-expectation tests still fail in the wider suite; details and retained reports are in the correction report. One after audit has a retained slow-CPU warning. FCP and Speed Index medians increased in this comparison but still meet their targets.

**Deployment and public confirmation are pending.** These new source changes have not been published by this task. The latest public measurement remains **457 ms TBT**, below. Deploy the new postbuild output and routing configuration, then rerun the collector with `-RequireStaticHome` in a new directory. Local success does not replace the public result.

## Latest measured public results: four of five targets met

Completed **November 10, 2026, 15:11?15:13 EST**, against the [live TSLS-Web homepage](https://capstone-fall-2026.vercel.app/) after the optimized changes were published. The requested Lighthouse **12.8.2** collector ran five sequential audits in a **new directory**, followed by the summarizer against that same directory.

**Public TBT is 457 ms median (326.5?542 ms), above the <200 ms target in all five runs.** The other four targets pass in every run. Deployment identity stayed unchanged throughout collection. All five audits completed with **zero runtime errors**; runs **3 and 4** contain retained slow-CPU warnings.

| Metric | Documented baseline | Final production median | Target | Status |
|---|---:|---:|---:|---|
| FCP | 5.7 s | **0.788 s** | <2.0 s | **Met, 5/5** |
| LCP | 21.8 s | **1.491 s** | <2.5 s | **Met, 5/5** |
| TBT | 700 ms | **457 ms** | <200 ms | **Not met, 0/5** |
| Speed Index | 8.7 s | **1.214 s** | <3.4 s | **Met, 5/5** |
| Lighthouse SEO | 40/100 | **100/100** | 90?100/100 | **Met, 5/5** |

[Final report: individual runs, baseline comparisons, conditions, and remaining limitations](final-performance-and-seo-results.md). [Exact summary and raw-audit references](2026-11-10-production-final-mobile/summary.json). [Deployment identity](2026-11-10-production-final-mobile/deployment.json).

The optimized entry script **main.ce2cc812.js** is deployed; its run-1 decoded size is **259,662 bytes**, compared with **450,658 bytes** in the earlier public build. This smaller delivery does not establish a passing TBT result. The earlier public **413 ms** and local **45 ms** measurements remain historical evidence in their original directories. The [local TBT follow-up](tbt-followup.md) documents the implementation and its separate 401 ? 45 ms experiment; that local result cannot replace the final production measurement.

**Deployment verification is complete; the TBT target remains unmet.** Final CPU benchmark indices were **734.5?1,096.5**, below the earlier public **1,881?2,150.5**, with two explicit slow-CPU warnings. These conditions limit timing comparisons and code attribution; they do not turn the measured failure into a pass. Settings and targets were unchanged, and no report was discarded or replaced.

Supplemental [production browser verification](2026-11-10-production-final-mobile/browser-verification.json) passed **60 checks across ten routes**, with zero uncaught browser errors. The eight static pages, including **Advocate**, have the expected rendered metadata and sitemap entries. Unknown-page HTTP status, workshop/API integration, client-rendering, field performance, and overall 50% criterion limitations remain in the final report.

## Earlier deployed measurements

Measured the [deployed TSLS-Web homepage](https://capstone-fall-2026.vercel.app/) on **November 5, 2026** , before PBI-14 final optimization. Five sequential Lighthouse navigation audits completed with no runtime errors or run warnings. The results below are the independent median of each metric across all five runs, using the numeric audit values rather than Lighthouse's rounded display strings.

This completes the **Initial Performance Measurement** criterion in [Milestone 3, PBI-14](../../documentation/milestones/Milestone-3.md#pbi-14-optimize-frontend-performance-and-technical-seo). Application code was not changed for this measurement. The subsequent **[final deployed results — November 10, 2026](final-performance-and-seo-results.md)** complete the final-results criterion, with five retained audits, baseline/target comparisons, and remaining limitations.

The subsequent [FCP optimization and local production verification](fcp-optimization.md) documents deferred secondary-page/payment loading and a separate five-run before/after experiment. The initial deployed results below remain the reference for the final hosted comparison.

[LCP optimization and local production verification](lcp-optimization.md) records the next startup-code reduction, a fresh local before/after audit set, and ZIP-field visual/functional checks.

[Earlier TBT analysis and optimization](tbt-optimization.md) records deferred mobile-menu loading and its November 5 measurements, which did not meet the target. The [November 10 follow-up](tbt-followup.md) reduces startup work and meets the target in its five local runs; the latest public measurement above does not meet TBT.

[Speed Index optimization](speed-index-optimization.md) records lossless logo delivery, image sizing, paired local audits, and preserved header/Menu appearance. Speed Index remains below target; no timing improvement is established by this set.

[Technical SEO optimization](technical-seo-optimization.md) records route metadata, canonicals, sitemap/robots, crawlable links, semantic fixes, and eight local SEO audits scoring 100. It also documents client-rendering and HTTP-status limits.

[Frontend asset optimization](frontend-asset-optimization.md) records responsive WebP photos/logos, a 93.7% image-body reduction on I Want to Help at tested DPR 1 widths, script/style/font review, Lighthouse diagnostics, and preserved layouts/navigation. Final deployed measurements remain separate.

## Historical initial and earlier public comparison

The documented project baseline and targets come from PBI-14. This historical table records the initial deployment and the earlier November 10 public snapshot before the TBT follow-up. Chrome updated from 156 to 157 between those sets. The latest production results at the top of this README supersede that earlier snapshot as the final public measurement; TBT remains unmet.

| Metric | Documented project baseline | Initial deployed median | Target | Initial target status | Earlier public, before TBT follow-up |
|---|---:|---:|---:|---|---|
| First Contentful Paint (FCP) | 5.7 s | **0.819 s** | <2.0 s | Met | **0.784 s — Met** |
| Largest Contentful Paint (LCP) | 21.8 s | **4.515 s** | <2.5 s | Above target | **1.707 s — Met** |
| Total Blocking Time (TBT) | 700 ms | **1,019 ms** | <200 ms | Above target | **413 ms — Not met** |
| Speed Index | 8.7 s | **1.111 s** | <3.4 s | Met | **0.981 s — Met** |
| Lighthouse SEO | 40/100 | **100/100** | 90–100/100 | Met | **100/100 — Met** |

For the November 5 initial measurement relative to the documented baseline, FCP is 85.6% lower, LCP is 79.3% lower, and Speed Index is 87.2% lower. TBT is **45.6% higher**. SEO increased by **60 points**. Timing changes use `(baseline - initial median) / baseline * 100`, calculated before rounding. SEO is reported as a score change because higher is better. The [final report](final-performance-and-seo-results.md#baseline-initial-implementation-and-final-comparison) contains the corresponding final percentages.

The original baseline's raw Lighthouse reports, URL, device, throttling, and tooling versions are not supplied in the repository. These historical comparisons are descriptive; equivalent baseline conditions cannot be verified. The initial deployed results establish a repeatable reference for the final audit. No conclusion is drawn about the separately documented, unresolved overall 50% improvement target.

## Initial individual runs and evidence

All times below come from the corresponding JSON report. Timing values are rounded only for this table.

| Run | Audit start (EST) | FCP (s) | LCP (s) | TBT (ms) | Speed Index (s) | SEO | Raw reports |
|---|---|---:|---:|---:|---:|---:|---|
| 1 | 00:06:13 | 0.785 | 4.515 | 1,019 | 1.111 | 100 | [HTML](2026-11-05-initial-mobile/run-1.report.html), [JSON](2026-11-05-initial-mobile/run-1.report.json) |
| 2 | 00:07:17 | 0.840 | 4.635 | 1,283 | 1.350 | 100 | [HTML](2026-11-05-initial-mobile/run-2.report.html), [JSON](2026-11-05-initial-mobile/run-2.report.json) |
| 3 | 00:07:38 | 0.815 | 4.639 | 1,226 | 1.204 | 100 | [HTML](2026-11-05-initial-mobile/run-3.report.html), [JSON](2026-11-05-initial-mobile/run-3.report.json) |
| 4 | 00:08:03 | 0.819 | 4.446 | 756 | 1.010 | 100 | [HTML](2026-11-05-initial-mobile/run-4.report.html), [JSON](2026-11-05-initial-mobile/run-4.report.json) |
| 5 | 00:08:24 | 0.820 | 2.100 | 876 | 1.089 | 100 | [HTML](2026-11-05-initial-mobile/run-5.report.html), [JSON](2026-11-05-initial-mobile/run-5.report.json) |
| **Median** | | **0.819** | **4.515** | **1,019** | **1.111** | **100** | [Machine-readable summary](2026-11-05-initial-mobile/summary.json) |

LCP ranged from 2.100 to 4.639 seconds; TBT ranged from 756 to 1,283 ms. All five runs are retained, including the faster fifth run. No run was discarded. Lighthouse's final screenshot for run 1 was visually checked and shows the expected TSLS-Web homepage.

## Initial recorded test conditions

| Setting | Value |
|---|---|
| URL and route | `https://capstone-fall-2026.vercel.app/`, Home (`/`) only |
| Build | Existing Vercel-hosted production build; no development server or local build |
| Runs and aggregation | Five sequential navigation audits; median separately for each metric |
| Lighthouse | CLI **12.8.2**, categories `performance,seo` |
| Browser | Headless Chrome **156.0.8078.80**, fresh browser launch for each CLI invocation |
| Runtime | Node.js **v20.11.1** |
| Machine | Windows 11 Home 64-bit, version 10.0.26200; Intel Core i5-1035G1, 4 cores / 8 logical processors |
| Device | Lighthouse default mobile profile, emulated Moto G Power; viewport **412 × 823 CSS px**, device scale factor **1.75** |
| Network | Lighthouse simulated throttling: **150 ms RTT**, **1,638.4 Kbps throughput** |
| CPU | Simulated **4× slowdown** |
| Other throttling settings | Request latency 562.5 ms; download throughput 1,474.56 Kbps; upload throughput 675 Kbps; retained in each report's `configSettings` |
| Browser state | Default Lighthouse storage reset enabled; fresh temporary browser profile; no extension or signed-in profile |
| Dataset and interaction | Homepage navigation only, no ZIP search, form submission, or workshop-result dataset |
| External dependencies | Live third-party requests, including Stripe, left enabled; no URL blocking |
| Audit outcome | Five valid reports, zero runtime errors, zero run warnings; identical configuration across runs |

The full settings, run times, exact numeric metrics, comparisons, and validation results are retained in [summary.json](2026-11-05-initial-mobile/summary.json). Browser benchmark indices vary between runs; medians and ranges preserve that variability. These are simulated mobile lab measurements, rather than field-user measurements or results for other routes/device profiles.

## Initial deployment identity

[deployment.json](2026-11-05-initial-mobile/deployment.json) records the public deployment headers and local environment:

- Entry script: `/static/js/main.178042f2.js`, present in the network requests of all five raw reports.
- HTML ETag: `"15242512c434c10244ef47b001068dbf"`.
- Last-Modified: November 5, 2026, 03:01:35 UTC.
- The HTML ETag and entry script were checked after run 1 and again after run 5 and remained unchanged. The preflight HTTP response before run 1 also returned the same values.
- Local reference commit: `af2b9f7762a286880d02ca0cb70e63cd1033628d`. The public deployment does not expose a verified source commit; this local hash is **not claimed as the deployed commit**. The asset identity above identifies the measured build.

## Repeat for final results

From the repository root in PowerShell, use a new output directory and the same URL, machine, browser, Lighthouse version, profile, and throttling settings:

```powershell
$outputDirectory = 'tests/performance/YYYY-MM-DD-final-mobile'
New-Item -ItemType Directory -Path $outputDirectory -Force | Out-Null
for ($runNumber = 1; $runNumber -le 5; $runNumber++) {
    npm exec --yes --package=lighthouse@12.8.2 -- lighthouse https://capstone-fall-2026.vercel.app/ --only-categories=performance,seo --form-factor=mobile --throttling-method=simulate --output=json --output=html --output-path="$outputDirectory/run-$runNumber" --chrome-flags="--headless=new --no-first-run --no-default-browser-check --disable-extensions" --quiet
    if ($LASTEXITCODE -ne 0) { throw "Lighthouse run $runNumber failed" }
}
```

Record the final deployment identity and environment again. Check each report for runtime errors, warnings, unexpected content, or a changed deployment during the measurement set. Extract `audits.first-contentful-paint.numericValue`, `audits.largest-contentful-paint.numericValue`, `audits.total-blocking-time.numericValue`, and `audits.speed-index.numericValue` (all in milliseconds), plus `categories.seo.score * 100`. Sort each set of five values numerically and use its third value as the median. Keep all five raw reports and add the final medians to the comparison table; do not overwrite this initial evidence.
