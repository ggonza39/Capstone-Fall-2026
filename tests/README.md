# Testing & Quality Assurance (`tests`)

## Overview
This folder contains test suites, automated scripts, and manual testing documentation evaluating application accessibility, usability, and form workflows.

- `api-integration-test-plan.md` — contract-level and endpoint-level test cases for the shared public API contract and the Milestone-2 workshop sandbox endpoints.
- `usability-performance-evaluation-plan.md` — evaluation plan defining representative senior-user participants, usability test tasks, success measurement, and consistent performance-testing conditions (addresses professor/Gonzalez Testing Document feedback).
- [Initial deployed performance measurement](performance/README.md) — five-run mobile Lighthouse results, raw reports, baseline/target comparison, and conditions to repeat for final measurement (PBI-14).
- [Final performance and SEO results](performance/final-performance-and-seo-results.md) — latest local results meeting all five targets, earlier deployed measurements, baseline comparisons, and deployment/SEO/integration limits (November 10, 2026).
- [TBT follow-up: all five local targets met](performance/tbt-followup.md) — remaining startup styling work removed; TBT **45 ms median**, all five targets met in **5/5** Lighthouse runs, 77 browser checks, and public deployment verification still pending.
- [FCP optimization](performance/fcp-optimization.md) — reduced homepage startup work, local production before/after audits, and routing/payment-loading regression verification.
- [LCP optimization](performance/lcp-optimization.md) — smaller homepage input dependencies, local LCP audit comparison, and ZIP-field visual/functional verification.
- [Earlier TBT analysis and optimization](performance/tbt-optimization.md) — historical November 5 mobile-menu optimization and measurements; superseded locally by the passing November 10 follow-up above.
- [Speed Index optimization](performance/speed-index-optimization.md) — pixel-identical logo compression, explicit image dimensions, local Speed Index comparison, and header/Menu verification.
- [Technical SEO optimization](performance/technical-seo-optimization.md) — titles/descriptions, canonicals, generated crawl files, links/headings, route audits, and indexing limitations.
- [Frontend asset optimization](performance/frontend-asset-optimization.md) — responsive photo/logo delivery, script/style/font review, browser byte comparisons, Lighthouse diagnostics, and visual/functional verification.
