# Final production performance and SEO results

## Latest implementation follow-up: all five targets pass locally

The new [build-rendered homepage TBT correction](tbt-static-home-optimization.md) meets **all five targets in every one of five local production audits** using Lighthouse **12.8.2**. Its medians are **FCP 1.186 s, LCP 1.223 s, TBT 0 ms, Speed Index 2.227 s, and SEO 100/100**. TBT ranges **0-90 ms**, with every run below **200 ms**. The paired local before median was **492.544 ms**.

The homepage now arrives as complete HTML and uses a small native controller; React loads on secondary pages immediately and for the mobile drawer when requested. Production build, 107 browser checks with zero visual differences, and 17 new unit tests pass. Six existing Advocate/Contact API-expectation failures remain in the broader suite. The [new report](tbt-static-home-optimization.md) records implementation details, unchanged thresholds/settings, CPU warnings, tradeoffs, regression evidence, and deployment instructions; [summary.json](2026-11-10-tbt-rendering/summary.json) retains exact local results.

**These changes have not been deployed by this follow-up. The latest public TBT measurement is still 457 ms.** The published results below remain the measured production record until a new deployment is confirmed with a separate five-run hosted audit. Use the collector's `-RequireStaticHome` flag to reject the old deployment before collecting that confirmation.

## Latest measured public deployment

Completed **November 10, 2026, 15:11?15:13 EST (UTC?5)** against the live [TSLS-Web homepage](https://capstone-fall-2026.vercel.app/) after the optimized changes were published. The requested Lighthouse collector and summarizer ran against a **new evidence directory**, preserving the earlier hosted and local reports.

**Four of five targets are met. Public Total Blocking Time is 457 ms median, above the <200 ms target in all five runs.** FCP is **0.788 s**, LCP **1.491 s**, Speed Index **1.214 s**, and SEO **100/100**. There were **zero runtime errors and two slow-CPU warnings**. Deployment HTML, ETag, and entry script remained unchanged across all five audits.

The earlier **45 ms local TBT** result does not establish public compliance. This report uses the measured production results. The smaller startup bundle is deployed, but this hosted set does not reproduce the earlier local TBT result.

## Baseline, initial implementation, and final comparison

Each result is the independent median of all five unrounded numeric values. A metric's median may come from a different run than another metric. Display values are rounded only after calculation.

| Metric | Documented baseline | Initial deployed, Nov 5 | Earlier public, Nov 10 before TBT follow-up | Final production, Nov 10 after deployment | Target | Final status |
|---|---:|---:|---:|---:|---:|---|
| FCP | 5.7 s | 0.819 s | 0.784 s | **0.788 s** | <2.0 s | **Met, 5/5** |
| LCP | 21.8 s | 4.515 s | 1.707 s | **1.491 s** | <2.5 s | **Met, 5/5** |
| TBT | 700 ms | 1,019 ms | 413 ms | **457 ms** | <200 ms | **Not met, 0/5** |
| Speed Index | 8.7 s | 1.111 s | 0.981 s | **1.214 s** | <3.4 s | **Met, 5/5** |
| Lighthouse SEO | 40/100 | 100/100 | 100/100 | **100/100** | 90?100/100 | **Met, 5/5** |

| Metric | Change vs documented baseline | Change vs initial deployed median |
|---|---:|---:|
| FCP | 86.2% lower | 3.8% lower |
| LCP | 93.2% lower | 67.0% lower |
| TBT | 34.7% lower | 55.2% lower |
| Speed Index | 86.1% lower | **9.2% higher** |
| SEO | **+60 points** | **0 points** |

Timing reductions use (reference ? final median) / reference ? 100 before rounding; SEO uses score-point changes. Initial deployed SEO was already 100, so the historical 60-point difference is not attributed to this optimization.

The [historical baseline's raw reports and conditions are unavailable](../usability-performance-evaluation-plan.md#5-the-50-improvement-target-and-its-relationship-to-individual-thresholds), so those comparisons are descriptive. The initial and final hosted sets share the same URL, machine, Node/Lighthouse versions, full audit settings, and aggregation procedure; **Chrome changed from 156.0.8078.80 to 157.0.8103.39**. CPU calibration was also lower in this final set, and intervening deployments include other changes. The results do not establish that frontend code alone caused each timing difference.

## Individual runs and retained evidence

| Run | Start, EST | FCP (s) | LCP (s) | TBT (ms) | Speed Index (s) | SEO | Warnings | Reports |
|---|---|---:|---:|---:|---:|---:|---|---|
| 1 | 15:11:08 | 0.820 | 1.509 | 487 | 1.283 | 100 | None | [JSON](2026-11-10-production-final-mobile/run-1.report.json), [HTML](2026-11-10-production-final-mobile/run-1.report.html) |
| 2 | 15:11:31 | 0.788 | 1.491 | 440.5 | 1.099 | 100 | None | [JSON](2026-11-10-production-final-mobile/run-2.report.json), [HTML](2026-11-10-production-final-mobile/run-2.report.html) |
| 3 | 15:11:53 | 0.787 | 1.483 | 457 | 1.214 | 100 | Slow CPU | [JSON](2026-11-10-production-final-mobile/run-3.report.json), [HTML](2026-11-10-production-final-mobile/run-3.report.html) |
| 4 | 15:12:15 | 0.801 | 1.514 | 542 | 1.397 | 100 | Slow CPU | [JSON](2026-11-10-production-final-mobile/run-4.report.json), [HTML](2026-11-10-production-final-mobile/run-4.report.html) |
| 5 | 15:12:36 | 0.781 | 1.441 | 326.5 | 1.110 | 100 | None | [JSON](2026-11-10-production-final-mobile/run-5.report.json), [HTML](2026-11-10-production-final-mobile/run-5.report.html) |
| **Median** | | **0.788** | **1.491** | **457** | **1.214** | **100** | **2 total** | [Exact summary](2026-11-10-production-final-mobile/summary.json) |

FCP ranged **0.781?0.820 s**, LCP **1.441?1.514 s**, TBT **326.5?542 ms**, and Speed Index **1.099?1.397 s**. SEO was 100 and CLS zero in all five runs. All five reports are retained, including the two with warnings; none was discarded, substituted, or selected for a better result. The [run-1 Lighthouse screenshot](2026-11-10-production-final-mobile/run-1-final-screenshot.jpg) was visually checked and shows the expected homepage.

## Conditions and deployment identity

| Setting | Recorded value |
|---|---|
| URL/build | Live Vercel production Home at https://capstone-fall-2026.vercel.app/ |
| Tools | Lighthouse CLI **12.8.2**, Node **20.11.1**, Chrome **157.0.8103.39** |
| Device | Mobile Moto G Power emulation, **412 ? 823 CSS px**, DPR **1.75** |
| Throttling | Simulated **150 ms RTT**, **1,638.4 Kbps**, **4? CPU slowdown**; full settings match all initial reports |
| Machine | Windows 11 Home 64-bit **10.0.26200**, Intel Core i5-1035G1, 4 cores / 8 logical processors |
| Browser state | Five sequential navigation audits; fresh Chrome process/profile and default storage reset per run |
| Interactions | No ZIP search, registration, payment, form submission, injected mock dataset, or URL blocking |
| Collection | No builds, tests, or other browser audits during the Lighthouse set; supplemental browser checks followed collection |
| CPU calibration | **734.5?1,096.5** benchmark index; slow-CPU warnings in runs **3 and 4** |
| Entry script | **/static/js/main.ce2cc812.js**, verified in every audit |
| Stylesheet | /static/css/main.1083a7e6.css |
| HTML ETag | **"6d7b014329383f43f52624d523351c67"**, stable at preflight and after every run |
| Last-Modified | **November 10, 2026, 20:04:27 UTC** |
| HTML SHA-256 | c682740b87122600cc3f7a26e9049a25e3ba8ffcbddd7c40ead1ceca19fca86f |

[deployment.json](2026-11-10-production-final-mobile/deployment.json) retains the environment and all six deployment snapshots. The [asset manifest](2026-11-10-production-final-mobile/asset-manifest.json) and [HTML](2026-11-10-production-final-mobile/index.html) identify the measured build; the manifest includes all **24 optimized image variants**. Local reference commit **b33e2e12b92994b21e4620140d6c2f2d15b8024e** is recorded only as a reference: public artifacts do not expose a verified deployed source commit.

## TBT target and comparison limits

**TBT remains 257 ms above the 200 ms threshold at the median.** No final hosted run meets the strict <200 ms target. The final median is higher than the earlier public 413 ms snapshot, despite the smaller entry script.

The initial homepage script now has **259,662 decoded bytes and 84,732 transferred bytes** in run 1, compared with **450,658 decoded bytes and 145,578 transferred bytes** in the earlier public run 1. The final homepage makes **one initial script request, with no Stripe or lazy-route/menu chunks**. These network observations confirm reduced startup delivery; they do not by themselves establish reduced blocking time.

Run 1 attributes modeled long tasks of approximately **244, 173, and 72 ms** to the entry script, **193 ms** to the document, and **85 ms** to unattributed work. These are Lighthouse's modeled task durations under simulated throttling, not directly observed trace durations; summing complete task durations is not the TBT formula. The raw diagnostics are retained for subsequent main-thread analysis.

CPU calibration is an important limitation: the final benchmark index range **734.5?1,096.5** is below the earlier hosted **1,881?2,150.5** and the local follow-up's after range **2,281?2,390.5**. Lighthouse explicitly warned about a slower-than-expected CPU in two final runs. This limits timing comparisons and attribution, but does not convert the measured TBT failure into a pass or prove that CPU variation explains the entire difference. The configured 4? multiplier was retained for comparison; no threshold or setting was relaxed to obtain a passing result.

The [local TBT experiment](tbt-followup.md) remains useful implementation evidence: it measured 401 ? 45 ms before/after on localhost and preserved appearance and behavior. Its 45 ms result remains separate from the **457 ms production result**. Further TBT diagnosis should profile the remaining script, style/layout, and rendering tasks under consistent machine conditions and retain any subsequent measurement sets separately.

## Supplemental deployed SEO checks

[Browser verification](2026-11-10-production-final-mobile/browser-verification.json) passed **60 checks across ten rendered route captures**, with **zero uncaught browser errors**. The eight configured static routes have the expected title/description, one main and h1, correct canonical, and indexable rendered metadata. **Advocate now displays ?Become a TechSmart Advocate | TechSmart,? renders its interest form page, and is included in the sitemap.** Two error paths verify noindex and canonical removal.

Deployed [robots.txt](2026-11-10-production-final-mobile/robots.txt) and [sitemap.xml](2026-11-10-production-final-mobile/sitemap.xml) return HTTP 200 and advertise the expected production origin and all eight configured static routes. These checks ran after the Lighthouse set and assign no additional Lighthouse scores or timing measurements.

## Remaining limitations

- **TBT is the one unmet metric target.** Four metrics pass in every run; the report does not claim that all performance standards have been met.
- **Homepage mobile lab scope.** Results do not establish field performance, desktop or other routes' timings, interaction responsiveness, form/API readiness, or production payment behavior. Earlier local I Want to Help CLS/image observations are not resolved by a passing homepage result.
- **SEO 100 is a Lighthouse result.** It does not establish indexing, rankings, rich results, or equivalent behavior for JavaScript-disabled crawlers. Raw HTML still provides a shared fallback; route-specific content and metadata depend on JavaScript.
- **Unknown pages return HTTP 200.** The deployed missing page correctly renders noindex with no canonical, but client metadata does not produce a server 404.
- **Successful workshop-detail content remains unverified.** The representative WS-1001 page renders Workshop Not Found with noindex/no canonical. A fresh [read-only API probe](2026-11-10-production-final-mobile/workshop-api-probe.json) returned **HTTP 200, text/html**, rather than workshop JSON. Backend/deployment integration needs separate verification. No mock worker, registration, or payment was submitted to bypass this limitation.
- **The overall 50% improvement interpretation remains unresolved.** The evaluation plan distinguishes an aggregate target from a per-metric floor. This report evaluates the five explicit metrics and does not declare that undefined overall criterion achieved. TBT's descriptive reduction from the historical 700 ms baseline is **34.7%**.

## Earlier evidence and reproduction

The [initial November 5 summary](2026-11-05-initial-mobile/summary.json), [earlier November 10 public summary](2026-11-10-final-mobile/summary.json), and [local TBT summary](2026-11-10-tbt-followup/summary.json) remain unchanged. Their raw reports are retained in their original directories. Current results are in **2026-11-10-production-final-mobile**, not the earlier final-mobile directory.

The requested [collector](run-final-lighthouse.ps1) was run with Lighthouse **12.8.2**, followed by the [summarizer](summarize-final-lighthouse.cjs) against the same new directory. The summarizer validates full settings, numeric values, the five-run set, and deployment identity against the initial measurement. It was rerun after screenshot review and supplemental browser verification to include those outcomes.

~~~powershell
./tests/performance/run-final-lighthouse.ps1 -LighthouseCli '<cached-node_modules/lighthouse/cli/index.js>' -OutputDirectory 'tests/performance/2026-11-10-production-final-mobile'
node tests/performance/summarize-final-lighthouse.cjs tests/performance/2026-11-10-production-final-mobile
~~~

Those are the completed commands; the collector refuses to overwrite that directory. For another run, choose a new evidence directory and retain Lighthouse 12.8.2, the documented flags/settings, and the actual browser/environment record. Run [check-final-deployment.cjs](check-final-deployment.cjs), with PUPPETEER_CORE_PATH set for external tooling, separately from Lighthouse collection for supplemental rendered checks.

**This final verification changed documentation and added evidence only. No application source, commit, push, merge, or deployment was performed during this measurement task.**
