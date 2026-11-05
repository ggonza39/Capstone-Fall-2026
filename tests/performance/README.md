# Initial deployed performance measurement

Measured the [deployed TSLS-Web homepage](https://capstone-fall-2026.vercel.app/) on **November 5, 2026** , before PBI-14 final optimization. Five sequential Lighthouse navigation audits completed with no runtime errors or run warnings. The results below are the independent median of each metric across all five runs, using the numeric audit values rather than Lighthouse's rounded display strings.

This completes the **Initial Performance Measurement** criterion in [Milestone 3, PBI-14](../../documentation/milestones/Milestone-3.md#pbi-14-optimize-frontend-performance-and-technical-seo). Application code was not changed for this measurement. Final optimization and final measurements remain pending.

The subsequent [FCP optimization and local production verification](fcp-optimization.md) documents deferred secondary-page/payment loading and a separate five-run before/after experiment. The initial deployed results below remain the reference for the final hosted comparison.

[LCP optimization and local production verification](lcp-optimization.md) records the next startup-code reduction, a fresh local before/after audit set, and ZIP-field visual/functional checks.

## Baseline, initial results, and final comparison

The documented project baseline and targets come from PBI-14. Final results will be recorded after optimization using the same route and test conditions.

| Metric | Documented project baseline | Initial deployed median | Final target | Initial target status | Final after optimization |
|---|---:|---:|---:|---|---|
| First Contentful Paint (FCP) | 5.7 s | **0.819 s** | <2.0 s | Met | Pending |
| Largest Contentful Paint (LCP) | 21.8 s | **4.515 s** | <2.5 s | Above target | Pending |
| Total Blocking Time (TBT) | 700 ms | **1,019 ms** | <200 ms | Above target | Pending |
| Speed Index | 8.7 s | **1.111 s** | <3.4 s | Met | Pending |
| Lighthouse SEO | 40/100 | **100/100** | 90–100/100 | Met | Pending |

Relative to the documented baseline, FCP is 85.6% lower, LCP is 79.3% lower, and Speed Index is 87.2% lower. TBT is **45.6% higher**. SEO increased by **60 points**. Timing changes use `(baseline - initial median) / baseline * 100`, calculated before rounding. SEO is reported as a score change because higher is better.

The original baseline's raw Lighthouse reports, URL, device, throttling, and tooling versions are not supplied in the repository. These historical comparisons are descriptive; equivalent baseline conditions cannot be verified. The initial deployed results establish a repeatable reference for the final audit. No conclusion is drawn about the separately documented, unresolved overall 50% improvement target.

## Individual runs and evidence

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

## Recorded test conditions

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

## Deployment identity

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
