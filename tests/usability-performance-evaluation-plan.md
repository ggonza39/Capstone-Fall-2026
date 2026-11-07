# Usability & Performance Evaluation Plan

## Status and Purpose
This document addresses professor/Gonzalez feedback on the project's Testing Document:

> "Make the evaluation plan more specific. Describe how representative senior users will participate in usability testing, which tasks they will perform, and how success will be measured. Also define consistent conditions for performance testing and explain how the 50% improvement target relates to the individual performance thresholds."

**Note on source document:** [Milestone 3, PBI-14](../documentation/milestones/Milestone-3.md#pbi-14-optimize-frontend-performance-and-technical-seo) now documents the performance baseline values and final targets listed in Section 5. The original baseline Lighthouse reports and measurement conditions, and the authoritative Testing Document explaining the "50% improvement target," are not supplied in this repository. If that Testing Document exists separately (e.g., a Google Doc), this plan should be merged with it rather than treated as a replacement. The [initial deployed performance measurement](performance/README.md) records the implemented site's results separately from the documented project baseline and future final results.

This plan only references participants, tasks, and requirements that are already documented elsewhere in this repository (see Sources below), per the Milestone-1/Milestone-2 scope and the `documentation/29-Project Description` requirements document.

### Sources used
- `design/README.md` — approved user personas (Cindy, Thomas, John, Alex, Patricia) and user journeys.
- `documentation/29-Project Description` — Milestone 2/3 deliverables requiring "initial usability testing" and "usability testing"; accessibility requirements (WCAG-aligned, keyboard, screen-reader, color contrast, scalable text).
- `documentation/milestones/Milestone-2.md` — PBI-6 (navigation), PBI-7 (ZIP search), PBI-8 (workshop details/registration), PBI-10 (150% zoom), PBI-11 (accessibility remediation), PBI-12 (sandbox integration).
- [Milestone 3, PBI-14](../documentation/milestones/Milestone-3.md#pbi-14-optimize-frontend-performance-and-technical-seo) — documented performance baseline values, final targets, and initial/final Lighthouse measurement requirements.
- `tests/api-integration-test-plan.md` — existing contract-level test cases (not duplicated here).

---

## 1. Representative Senior Users

### Who qualifies as a representative participant
The project's approved personas (`design/README.md`) are the only sponsor-reviewed description of this audience currently in the repository. Representative usability-testing participants should be recruited to resemble these personas as closely as practical:

- **Age 65+**, consistent with Cindy (78) and Thomas (84).
- **Varying technology comfort levels** — at least one participant who is a relatively confident technology user (comparable to Cindy) and at least one participant who has an identified accessibility need (comparable to Thomas, who has vision limitations).
- **Not current project team members or developers**, to avoid familiarity bias.

No additional sponsor-approved demographic quotas (e.g., specific income level, exact session count, or specific geographic requirement) exist in current project documentation, so none are asserted here. If the sponsor specifies additional recruitment criteria, this section should be updated to match — do not substitute invented demographics.

### Participant count
A minimum of **3–5 participants** per round is recommended, consistent with common usability-testing guidance that this range surfaces the majority of usability issues; this is a testing-methodology recommendation, not a sponsor-approved requirement, and should be adjusted to the team's available recruitment capacity.

---

## 2. Usability Test Tasks

Tasks are limited to journeys already implemented or in progress per the Milestone-2 backlog (PBI-6/7/8/9/11). Each task below cites the PBI it validates.

| # | Task | Validates |
|---|---|---|
| 1 | Starting from the home page, find and select the "I Need Help" pathway. | PBI-6 |
| 2 | Enter a ZIP code and search for a nearby workshop. | PBI-7 |
| 3 | Review the workshop search results and identify one workshop's date, time, and location. | PBI-7 |
| 4 | Open a workshop's details and registration option from the search results. | PBI-8, PBI-12 |
| 5 | Proceed through the workshop registration demonstration and reach a confirmation message. | PBI-8, PBI-12 |
| 6 | Starting from the home page, find and select the "I Want to Help" pathway, then locate the Volunteer and Donate options. | PBI-9 |
| 7 | Use the "Skip to main content" link and keyboard-only navigation (Tab/Shift+Tab/Enter) to reach primary navigation and a form control without using a mouse. | PBI-6, PBI-11 |
| 8 | Locate a way to contact the organization or request help from any page. | PBI-6 (footer/header), Contact page |

Tasks intentionally exclude donation/payment completion (Stripe) and the external Hands On Atlanta signup flow, since those are existing external/production workflows outside this project's mock replacement boundary (see `documentation/api-contract.md`, "Phase 1 Integration Boundary").

---

## 3. Success Measurement

For each task above, record:

- **Task completion:** completed / completed with difficulty / not completed.
- **Completion without assistance:** whether the participant required a facilitator hint to proceed.
- **Errors encountered:** count and description of incorrect actions (e.g., invalid ZIP submitted, missed control) before successful completion.
- **Time-on-task:** elapsed time from task start to completion or abandonment.
- **Navigation difficulty notes:** facilitator's qualitative notes on hesitation, confusion, or re-reading of labels.
- **Participant feedback:** a short post-task rating (e.g., "How easy was that task?" on a 1–5 scale) and any verbal comments.

No specific numeric pass/fail thresholds for these measures (e.g., "90% completion rate") currently exist in approved project documentation. Until the sponsor/professor confirms specific thresholds, results should be reported as measured data (completion rate, average time-on-task, error counts) rather than evaluated against an invented pass/fail bar.

---

## 4. Performance Test Conditions

To ensure performance results are comparable across test runs and across before/after comparisons, every performance test run must hold the following constant:

- **Same build/version:** record the exact git commit hash (`git rev-parse HEAD`) and whether the build is a production build (`npm run build`) or development build. Production builds should be used for performance measurement, not `npm start` dev-server builds.
- **Same test environment:** same machine or hosting environment for all runs in a comparison set (do not mix local and hosted results).
- **Same browser/device profile:** a fixed browser (e.g., latest stable Chrome) and a fixed viewport/device emulation profile (e.g., Desktop 1920×1080 and one mobile profile), consistent with the responsive breakpoints already defined for PBI-10.
- **Same network conditions:** either no throttling applied consistently, or a fixed throttling profile (e.g., a specific Lighthouse "Slow 4G" preset) applied identically to every run.
- **Same dataset:** the existing sandbox dataset (`capstonefall2026/src/mocks/data/workshops.js`), not a dataset that grows or changes between runs.
- **Same routes/pages:** a fixed list of pages measured every time (e.g., Home, "I Need Help" search results, workshop registration dialog).
- **Same number of runs:** take a fixed number of runs per page (e.g., 5) and report the median, not a single run, to reduce run-to-run noise.
- **Same measurement tooling and version:** a fixed tool (e.g., Lighthouse CLI/Chrome DevTools) and a recorded tool version, since scoring methodology can change between tool versions.

---

## 5. The 50% Improvement Target and Its Relationship to Individual Thresholds

A 50% overall improvement target is referenced in professor/Gonzalez feedback. [Milestone 3, PBI-14](../documentation/milestones/Milestone-3.md#pbi-14-optimize-frontend-performance-and-technical-seo) supplies the following documented baseline values and final targets; these targets are project goals to measure and report, rather than guaranteed outcomes.

| Metric | Documented project baseline | Final target |
|---|---:|---:|
| First Contentful Paint (FCP) | 5.7 seconds | <2.0 seconds |
| Largest Contentful Paint (LCP) | 21.8 seconds | <2.5 seconds |
| Total Blocking Time (TBT) | 700 milliseconds | <200 milliseconds |
| Speed Index | 8.7 seconds | <3.4 seconds |
| Lighthouse SEO score | 40/100 | 90–100/100 |

The original baseline reports and their tool, device, network, route, and build conditions are not supplied, so equivalent conditions cannot be verified. Comparisons with these values must identify them as the **documented project baseline**. Keep the [initial deployed implementation measurements](performance/README.md) separate from that baseline and from the final post-optimization measurements. The intended interpretation of the overall 50% target remains unconfirmed.

### Baseline-measurement procedure
1. Use FCP, LCP, TBT, Speed Index, and Lighthouse SEO for PBI-14, with the documented project baseline and targets above.
2. Measure the deployed implementation before final optimization using the fixed conditions in Section 4, and retain the raw reports. Repeat the same procedure after optimization for the final results.
3. Record the route, build/version, environment, tooling, device, network conditions, run count, and median results for each measurement set. If original/legacy baseline reports become available, record their conditions and assess comparability; do not replace the documented baseline silently with a new measurement.

### Improvement formula
For each timing metric (FCP, LCP, TBT, and Speed Index):

$$\text{Improvement \%} = \frac{\text{baseline} - \text{current}}{\text{baseline}} \times 100$$

Report Lighthouse SEO as a score out of 100 and its point change from the baseline; a higher score is better, so the timing improvement formula does not apply.

### Relating individual thresholds to the overall 50% target
Evaluate each PBI-14 metric against its own target above. The authoritative Testing Document must clarify whether the overall 50% target is an **aggregate (e.g., mean) improvement percentage across defined timing metrics** or a minimum every timing metric must independently meet. Do not claim that the overall target is satisfied until that interpretation and the included metrics are confirmed:

- If the overall 50% is an **aggregate/average** target: an individual metric may fall short of 50% as long as the mean across all defined metrics reaches 50%, and this should be stated plainly in the final Testing Document.
- If the overall 50% is a **floor** that every metric must meet: every individual threshold must itself be set at (or the formula must demonstrate) at least 50% improvement, and any metric below that is a reportable gap, not an average smoothed over.

This plan recommends confirming which interpretation the sponsor/professor intends and recording that decision explicitly in the Testing Document once confirmed, since the two interpretations produce different pass/fail outcomes for the same raw data.

---

## 6. Open Items
- Confirm the location/existence of the authoritative Testing Document referenced in the professor's feedback, and merge this plan into it if it exists outside this repository.
- Obtain the original Lighthouse reports and measurement conditions supporting the PBI-14 documented project baseline, if available, so comparison limits can be assessed.
- Confirm whether the 50% target is an aggregate or per-metric floor (Section 5).
