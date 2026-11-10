# Final performance and SEO results

## Latest TBT fix: all five local targets met

The **November 10 TBT follow-up** removes the homepage/shared navigation styling runtime from initial loading while preserving the existing appearance and behavior. Five fresh local production audits now measure **45 ms median TBT (42–67.24 ms)**, below **200 ms in every run**. **All five metric targets pass in all five runs.**

| Metric | Optimized local median | Target | Status |
|---|---:|---:|---|
| FCP | **0.759 s** | <2.0 s | **Met, 5/5** |
| LCP | **1.709 s** | <2.5 s | **Met, 5/5** |
| TBT | **45 ms** | <200 ms | **Met, 5/5** |
| Speed Index | **0.759 s** | <3.4 s | **Met, 5/5** |
| Lighthouse SEO | **100/100** | 90–100/100 | **Met, 5/5** |

The paired local TBT median fell from **401 to 45 ms (88.8%)**; compressed startup JavaScript is **41.8% smaller**. The [follow-up report](tbt-followup.md) records the implementation, baseline/target comparisons, visual and functional checks, and all ten raw audits. [Exact summary](2026-11-10-tbt-followup/summary.json).

**Deployment confirmation is pending.** This tested build has not been pushed or deployed. The public 413 ms measurement below identifies the earlier hosted build and remains historical evidence. After the normal `main` deployment, repeat the hosted five-run procedure before reporting the public site as meeting all five targets. The existing SEO/API/hosting limitations below also remain separate from homepage metric compliance.

## Earlier deployed measurement, before the TBT follow-up

Completed **November 10, 2026** for [Milestone 3, PBI-14](../../documentation/milestones/Milestone-3.md#pbi-14-optimize-frontend-performance-and-technical-seo). Five sequential Lighthouse audits measured the deployed [TSLS-Web homepage](https://capstone-fall-2026.vercel.app/) after optimization. All five completed with **zero runtime errors and zero warnings**, and the deployed HTML/entry-script identity stayed unchanged throughout the set.

**This earlier public snapshot met four of five targets: TBT was 413ms median against <200ms.** Its other medians were **FCP 0.784s, LCP 1.707s, Speed Index 0.981s, and SEO 100/100**. Application code and deployment were not changed during that measurement. The follow-up above subsequently changed and tested the local source.

## Baseline, initial implementation, and final comparison

Each final result is the independent median of the five unrounded numeric audit values. The median of one metric may come from a different run than another metric. Timing values below are rounded for display.

| Metric | Documented project baseline | Initial deployed median, Nov 5 | Final deployed median, Nov 10 | Target | Final status |
|---|---:|---:|---:|---:|---|
| First Contentful Paint | 5.7s | 0.819s | **0.784s** | <2.0s | **Met, 5/5 runs** |
| Largest Contentful Paint | 21.8s | 4.515s | **1.707s** | <2.5s | **Met, 5/5 runs** |
| Total Blocking Time | 700ms | 1,019ms | **413ms** | <200ms | **Not met, 0/5 runs** |
| Speed Index | 8.7s | 1.111s | **0.981s** | <3.4s | **Met, 5/5 runs** |
| Lighthouse SEO | 40/100 | 100/100 | **100/100** | 90–100/100 | **Met, 5/5 runs** |

| Metric | Timing reduction vs documented baseline | Timing reduction vs initial deployed median |
|---|---:|---:|
| FCP | 86.2% | 4.3% |
| LCP | 92.2% | 62.2% |
| TBT | 41.0% | 59.5% |
| Speed Index | 88.7% | 11.8% |
| SEO | **+60 points** | **0 points** |

Timing changes use `(reference - final median) / reference × 100`, calculated before rounding. SEO uses score-point changes. Initial deployed SEO was already 100, so the 60-point historical difference is not attributed to this optimization work.

The [documented baseline's raw reports and conditions are unavailable](../usability-performance-evaluation-plan.md#5-the-50-improvement-target-and-its-relationship-to-individual-thresholds); comparisons with it are descriptive. The initial and final deployed sets use the same URL, machine, Node/Lighthouse versions, emulation, throttling, and aggregation procedure. **Installed Chrome updated from 156.0.8078.80 to 157.0.8103.39**, and the intervening deployed build includes other application changes. These observations do not establish that code optimizations alone caused each timing change. Local optimization experiments remain separate from this hosted comparison.

## Individual runs and retained evidence

| Run | Start, EST (UTC−5) | FCP (s) | LCP (s) | TBT (ms) | Speed Index (s) | SEO | Raw reports |
|---|---|---:|---:|---:|---:|---:|---|
| 1 | 00:08:03 | 0.832 | 1.707 | 413 | 1.174 | 100 | [JSON](2026-11-10-final-mobile/run-1.report.json), [HTML](2026-11-10-final-mobile/run-1.report.html) |
| 2 | 00:08:18 | 0.781 | 1.685 | 439 | 0.928 | 100 | [JSON](2026-11-10-final-mobile/run-2.report.json), [HTML](2026-11-10-final-mobile/run-2.report.html) |
| 3 | 00:08:33 | 0.784 | 1.740 | 366 | 0.987 | 100 | [JSON](2026-11-10-final-mobile/run-3.report.json), [HTML](2026-11-10-final-mobile/run-3.report.html) |
| 4 | 00:08:47 | 0.782 | 1.724 | 413 | 0.981 | 100 | [JSON](2026-11-10-final-mobile/run-4.report.json), [HTML](2026-11-10-final-mobile/run-4.report.html) |
| 5 | 00:09:02 | 0.784 | 1.677 | 361 | 0.896 | 100 | [JSON](2026-11-10-final-mobile/run-5.report.json), [HTML](2026-11-10-final-mobile/run-5.report.html) |
| **Median** | | **0.784** | **1.707** | **413** | **0.981** | **100** | [Exact summary](2026-11-10-final-mobile/summary.json) |

FCP ranged **0.781–0.832s**, LCP **1.677–1.740s**, TBT **361–439ms**, and Speed Index **0.896–1.174s**. SEO was 100 in every run. All runs are retained; none was discarded, replaced, or selected for a better result. Lighthouse's [run-1 final screenshot](2026-11-10-final-mobile/run-1-final-screenshot.jpg) was visually checked against the expected homepage. CLS was zero in all five homepage runs.

## Conditions and deployment identity

| Setting | Recorded value |
|---|---|
| Route/build | `https://capstone-fall-2026.vercel.app/`, live Vercel production Home; no local build/dev server |
| Tooling | Lighthouse CLI **12.8.2**, Node **20.11.1**, Chrome **157.0.8103.39** |
| Device | Mobile Moto G Power emulation, **412 × 823 CSS px**, DPR **1.75** |
| Throttling | Simulated **150ms RTT**, **1,638.4 Kbps**, **4× CPU slowdown**; complete settings match all initial reports |
| Machine | Windows 11 Home 64-bit, **10.0.26200**, Intel Core i5-1035G1, 4 cores / 8 logical processors |
| Runs/browser state | Five sequential navigation audits; fresh Chrome process/profile and default storage reset per run; no extension/signed-in profile |
| Dataset/interactions | Homepage navigation only; no ZIP search, workshop registration, form submission, payment, or injected mock dataset |
| External dependencies | Live requests left enabled; no URL blocking; no builds/tests/other browser audits during collection |
| CPU calibration | Lighthouse benchmark index **1,881–2,150.5**; initial range **1,254.5–2,205.5**; variability retained |
| Entry script | `/static/js/main.25dae39a.js`, verified in every audit's network records |
| HTML ETag | `"4395876b2448fbb9fb9784b7db8b42e2"`, stable at preflight and after every run |
| Last-Modified | November 10, 2026, **05:06:04 UTC** |

[deployment.json](2026-11-10-final-mobile/deployment.json) records the environment and six deployment snapshots. The served [asset manifest](2026-11-10-final-mobile/asset-manifest.json) includes all **24 optimized image variants**; the raw [HTML](2026-11-10-final-mobile/index.html) and its SHA-256 fingerprint are retained. The local reference commit is `714ae3df202181affa95f638c1636085a72e91c6`; public artifacts do not expose a verified deployed source commit, so this is not claimed as the deployed commit.

## Targets not achieved and remaining limitations

- **TBT was unmet in every earlier public run.** The 413ms median was 213ms above the 200ms threshold, despite a 59.5% reduction from the initial deployed median. Run 1 identifies five long tasks; the entry script accounts for the longest two, approximately **281ms and 132ms**. Lighthouse reports about **40 KiB** of potentially unused entry JavaScript. The [subsequent fix](tbt-followup.md) addresses the remaining startup styling/rendering work and passes all five local targets; its hosted confirmation remains pending. Home makes no initial Stripe or lazy-route/menu chunk request in either set.
- **Scope is homepage mobile lab measurement.** It does not establish field-user performance, desktop results, other routes' performance, interaction responsiveness, form/API readiness, or production payment behavior. The earlier local I Want to Help CLS and image opportunities are not reclassified as resolved by a passing homepage result.
- **SEO 100 is a Lighthouse result.** It does not establish indexing, rankings, rich results, or equivalent behavior for JavaScript-disabled crawlers. Deployed raw HTML still provides a shared fallback; route-specific content and metadata depend on JavaScript.
- **Unknown pages return HTTP 200.** The deployed missing-page probe correctly renders noindex with no canonical, but client metadata does not produce a server 404.
- **A successful workshop-detail page could not be verified.** `/workshops/WS-1001` renders Workshop Not Found with appropriate noindex/no-canonical metadata. A read-only [API probe](2026-11-10-final-mobile/workshop-api-probe.json) to `/api/workshops/WS-1001` returned **HTTP 200, `text/html`**, rather than workshop JSON. Backend/deployment integration for that pathway needs separate verification. No mock worker was enabled and no submission was attempted to bypass this limit.
- **The overall 50% improvement interpretation remains unresolved.** The evaluation plan distinguishes an aggregate target from a per-metric floor. This report evaluates the five explicit metric targets and does not declare the undefined overall target achieved. TBT's descriptive reduction from the historical baseline is 41%, below a hypothetical 50% per-metric floor.

## Supplemental deployed SEO checks

[browser-verification.json](2026-11-10-final-mobile/browser-verification.json) records **54 passing checks across nine rendered route captures**, with zero uncaught browser errors. The seven configured static routes have the expected title/description, one main and h1, correct canonical, and indexable metadata. The two error-path captures verify noindex/canonical removal. Deployed [robots.txt](2026-11-10-final-mobile/robots.txt) and [sitemap.xml](2026-11-10-final-mobile/sitemap.xml) return HTTP 200 and advertise the expected origin/static routes. The browser check runs outside Lighthouse collection and assigns no additional Lighthouse SEO scores.

The first supplemental check assumed the historical WS-1001 fixture would load in production. Its [failed assumption record](2026-11-10-final-mobile/browser-verification-initial-workshop-assumption.json) is retained. The final check explicitly records the unavailable detail page as a limitation and verifies its error metadata; it does not claim successful workshop content.

## Reproduce and validate

[run-final-lighthouse.ps1](run-final-lighthouse.ps1) runs the fixed five-run procedure, records environment/deployment identity, checks for deployment changes, and refuses to overwrite an evidence directory. Make Lighthouse 12.8.2 available outside application dependencies and pass its CLI path:

```powershell
npm exec --yes --package=lighthouse@12.8.2 -- lighthouse --version
./tests/performance/run-final-lighthouse.ps1 -LighthouseCli '<cached-node_modules/lighthouse/cli/index.js>' -OutputDirectory 'tests/performance/NEW-DATE-final-mobile'
node tests/performance/summarize-final-lighthouse.cjs tests/performance/NEW-DATE-final-mobile
```

Record the actual browser version on each repetition; do not silently treat a different version as identical. The [summary helper](summarize-final-lighthouse.cjs) validates full settings against the initial reports, deployed entry identity, finite metric values, and the five-run set before calculating medians and comparisons. [check-final-deployment.cjs](check-final-deployment.cjs), with `PUPPETEER_CORE_PATH` set for external tooling, repeats the supplemental rendered checks without submitting forms. The earlier hosted reporting measurement changed no application code or deployment. The subsequent local TBT implementation and its pending hosted confirmation are documented at the top of this report.
