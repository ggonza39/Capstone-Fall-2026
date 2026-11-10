# TBT analysis, optimization, and local verification

**Historical November 5 experiment.** The [November 10 TBT follow-up](tbt-followup.md) subsequently fixed the remaining startup styling work: **45 ms local median TBT, 42–67.24 ms range**, with all five metric targets met in every run. Its deployment confirmation is pending; the original measurements below are retained unchanged.

Completed on **November 5, 2026** for [Milestone 3, PBI-14](../../documentation/milestones/Milestone-3.md#pbi-14-optimize-frontend-performance-and-technical-seo). The documented project TBT baseline is **700 ms**, and the target is **less than 200 ms**. The [initial deployed mobile audit](README.md) measured **1,019 ms**. Original baseline reports and conditions are unavailable, so the historical baseline is a reference, not a controlled comparison with localhost.

The optimized local production build measures a **1,228 ms TBT median**, compared with **1,568 ms before**. **The <200 ms target was not achieved.** Final deployed verification remains pending. All ten local runs contain slow-CPU warnings, which limit timing comparisons.

## Diagnosis and change

The remaining long tasks are attributed primarily to the application entry script and document rendering. Before run 3, Lighthouse reports main-bundle tasks of **657 ms** and **314 ms**, plus a **235 ms** document task. These are the Lighthouse-reported modeled task durations under simulated throttling. The same report's observed trace diagnostics record about **446 ms total task time** and three tasks over 50 ms; those observed values must not be mixed with the modeled values or treated as another TBT total.

Stripe and secondary pages were already deferred in the FCP work. The remaining eagerly imported mobile Drawer pulled in its Modal, Slide, Portal, Backdrop, list, and IconButton implementations even while the menu was closed. That code was unnecessary for initial homepage interaction.

- [Header.js](../../capstonefall2026/src/components/Header.js) now loads the mobile menu only on Menu activation. The eager header, desktop links, logo, mobile bottom navigation, and all homepage content remain available at startup.
- [MobileNavigation.js](../../capstonefall2026/src/components/MobileNavigation.js) contains the existing Drawer and its links/styles. The resolved component stays mounted after its first load, preserving subsequent openings, closing transitions, and focus restoration.
- [mobileNavigationLoader.js](../../capstonefall2026/src/components/mobileNavigationLoader.js) shares the in-flight/successful download and clears a failed promise so it can be retried.
- Loading keeps the visible Menu label stable, shows a named progress indicator, and exposes busy state. Repeat activation, Escape, route changes, and unmount cancel the pending open request. A late result cannot reopen a cancelled menu. Failure offers Retry and Dismiss; focus returns to the stable Menu trigger.

This defers genuinely unused UI code until requested. It does not use timers, postpone visible content, or change Lighthouse settings. The approach follows [web.dev's guidance on reducing long-task work](https://web.dev/articles/optimize-long-tasks). The Drawer retains its [MUI modal behavior](https://mui.com/material-ui/api/drawer/) after loading.

## Measured local results

| Measurement | Before | After |
|---|---:|---:|
| TBT median | **1,568 ms** | **1,228 ms** |
| TBT range | 989–2,319 ms | 1,141–1,895 ms |
| Runs below 200 ms | 0/5 | **0/5** |
| Entry JavaScript, decoded bytes | 483,236 | 444,110 |
| Entry JavaScript, transferred bytes (median) | 151,409 | 140,593 |
| Lighthouse main-thread work median | 2,490 ms | 1,996 ms |
| Lighthouse script bootup median | 1,478 ms | 1,161 ms |
| FCP median | 0.634 s | 0.624 s |
| LCP median | 2.384 s | 2.137 s |
| Homepage Stripe / initial chunk requests | 0 / 0 | 0 / 0 |

The entry bundle is **39,126 decoded bytes smaller (8.1%)**, with **7.1% less entry-script transfer**. [Before](2026-11-05-tbt-local/before/bundle-check.json) and [after](2026-11-05-tbt-local/after/bundle-check.json) source-map checks confirm that Drawer, Modal, Slide, Portal, Backdrop, List, ListItem, ListItemButton, ListItemText, and IconButton implementations moved out of the initial bundle. Home and Header remain eager. Every optimized Lighthouse run made zero menu/secondary chunk requests before interaction.

The measured median TBT is **340 ms lower (21.7%)**, but the ranges overlap and individual after runs are not uniformly faster. CPU benchmark indices ranged **485.5–852.5 before** and **672.5–872 after**. All ten runs report slow-CPU calibration warnings; this is not proof that the code change alone caused the timing difference. Every run is retained, without substitutions.

| Run | Before TBT (ms) | After TBT (ms) | Raw reports |
|---|---:|---:|---|
| 1 | 1,282 | 1,228 | [Before JSON](2026-11-05-tbt-local/before/run-1.report.json), [After JSON](2026-11-05-tbt-local/after/run-1.report.json) |
| 2 | 2,319 | 1,468 | [Before JSON](2026-11-05-tbt-local/before/run-2.report.json), [After JSON](2026-11-05-tbt-local/after/run-2.report.json) |
| 3 | 989 | 1,141 | [Before JSON](2026-11-05-tbt-local/before/run-3.report.json), [After JSON](2026-11-05-tbt-local/after/run-3.report.json) |
| 4 | 2,104 | 1,895 | [Before JSON](2026-11-05-tbt-local/before/run-4.report.json), [After JSON](2026-11-05-tbt-local/after/run-4.report.json) |
| 5 | 1,568 | 1,206 | [Before JSON](2026-11-05-tbt-local/before/run-5.report.json), [After JSON](2026-11-05-tbt-local/after/run-5.report.json) |

[summary.json](2026-11-05-tbt-local/summary.json) preserves exact values, medians, settings, Lighthouse-reported long tasks, observed trace diagnostics, benchmark indices, and warnings. TBT uses `audits.total-blocking-time.numericValue`; it is not calculated by summing every listed task.

## Remaining gap

The after median remains **1,028 ms above the 200 ms threshold**, and no run meets the target. The entry bundle's React/MUI initialization and rendering still produce long tasks. For example, after run 3 still reports modeled main-bundle tasks of **662 ms** and **376 ms**. Deferring the closed menu removes avoidable startup work but does not eliminate the initial renderer/theme/component cost.

Further TBT work needs stable-machine profiling and a hosted follow-up to separate application cost from the severe CPU calibration limitation before choosing larger rendering/component changes. These local results do not establish target compliance or complete the final deployed-results criterion. The original 700 ms baseline cannot be compared as an equivalent test without its original conditions.

## Conditions and build identity

- Five sequential navigation audits per phase, independent median per metric, homepage `http://127.0.0.1:4173/` only. Both builds use `npm run build`, served by **serve 14.2.4**. Builds, Jest tests, and browser checks ran outside the Lighthouse sets.
- Lighthouse CLI **12.8.2**, `performance,seo`; default mobile profile **412 × 823 CSS px**, device scale factor **1.75**, simulated **150 ms RTT**, **1,638.4 Kbps throughput**, **4× CPU slowdown**. All ten `configSettings` objects match.
- Node.js **20.11.1**, Chrome **156.0.8078.80**, Windows 11 Home 64-bit, Intel Core i5-1035G1 (4 cores / 8 logical processors). Each run used a fresh Chrome process/profile and default storage reset. Zero Lighthouse runtime errors; ten retained CPU warnings.
- Mocks and the Stripe publishable key are unset in both local builds. No URLs were blocked and no interactions/forms ran during Lighthouse collection. Local timings are separate from Vercel and field-user measurements.
- Before source: `9cd3d48` (full commit in [environment.json](2026-11-05-tbt-local/environment.json)), entry `/static/js/main.7cab76a2.js`. After: that source plus [tbt-optimization.patch](2026-11-05-tbt-local/tbt-optimization.patch), entry `/static/js/main.db9eb488.js`. The patch includes the new production files, and the environment record hashes all three changed production files.
- [Before manifest](2026-11-05-tbt-local/before/asset-manifest.json), [after manifest](2026-11-05-tbt-local/after/asset-manifest.json), and bundle checks identify the measured assets. Every audit loaded its phase's expected entry script.

## Verification and reproduction

Production build passed. **Eighteen relevant tests passed**: seven new [Header tests](../../capstonefall2026/src/components/Header.test.js), seven App tests, and four Home tests. Full suite: **35 passed, 4 failed**; [Jest results](2026-11-05-tbt-local/test-results.json) retain the same four existing NeedHelp registration failures. Those workshop files are unchanged.

**Twenty-seven Chrome checks passed**, with zero page errors. [Before](2026-11-05-tbt-local/browser-before.json) and [after](2026-11-05-tbt-local/browser-after.json) evidence confirms unchanged Home text/styles/geometry at 412 px and 1280 px, identical drawer dimensions/links, no pre-activation chunk requests, loading feedback, cancellation, stale-result handling, simulated 503 recovery through Retry/Dismiss, keyboard focus trapping/return, and Resources navigation. The existing ignored `PaperProps` width behavior was retained to avoid an unrelated visual change; the actual navigation element now has the `aria-controls` target ID.

Repeat the [local production Lighthouse procedure](fcp-optimization.md#repeat-the-local-checks) with a new results directory, the same fixed settings, and five runs. Use the [deployed procedure](README.md#repeat-for-final-results) after deployment, preserving these local and initial deployed records.

The optional [menu browser helper](check-mobile-menu.cjs) requires installed `puppeteer-core` (or `PUPPETEER_CORE_PATH`) and Chrome (`CHROME_PATH` can select it). Run each phase against its corresponding build outside Lighthouse collection:

```powershell
node tests/performance/check-mobile-menu.cjs before http://127.0.0.1:4173/ tests/performance/YYYY-MM-DD-tbt-local/browser-before.json
node tests/performance/check-mobile-menu.cjs after http://127.0.0.1:4173/ tests/performance/YYYY-MM-DD-tbt-local/browser-after.json tests/performance/YYYY-MM-DD-tbt-local/browser-before.json
```
