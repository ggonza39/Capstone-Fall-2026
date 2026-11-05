# Testing & Quality Assurance (`tests`)

## Overview
This folder contains test suites, automated scripts, and manual testing documentation evaluating application accessibility, usability, and form workflows.

- `api-integration-test-plan.md` — contract-level and endpoint-level test cases for the shared public API contract and the Milestone-2 workshop sandbox endpoints.
- `usability-performance-evaluation-plan.md` — evaluation plan defining representative senior-user participants, usability test tasks, success measurement, and consistent performance-testing conditions (addresses professor/Gonzalez Testing Document feedback).
- [Initial deployed performance measurement](performance/README.md) — five-run mobile Lighthouse results, raw reports, baseline/target comparison, and conditions to repeat for final measurement (PBI-14).
- [FCP optimization](performance/fcp-optimization.md) — reduced homepage startup work, local production before/after audits, and routing/payment-loading regression verification.
- [LCP optimization](performance/lcp-optimization.md) — smaller homepage input dependencies, local LCP audit comparison, and ZIP-field visual/functional verification.
- [TBT analysis and optimization](performance/tbt-optimization.md) — on-demand mobile navigation, local blocking-time measurements, regression checks, and the remaining gap to the 200 ms target.
- [Speed Index optimization](performance/speed-index-optimization.md) — pixel-identical logo compression, explicit image dimensions, local Speed Index comparison, and header/Menu verification.
- [Technical SEO optimization](performance/technical-seo-optimization.md) — titles/descriptions, canonicals, generated crawl files, links/headings, route audits, and indexing limitations.
- [Frontend asset optimization](performance/frontend-asset-optimization.md) — responsive photo/logo delivery, script/style/font review, browser byte comparisons, Lighthouse diagnostics, and visual/functional verification.
