# Usability & Performance Evaluation Plan

## Status and Purpose
This document addresses professor/Gonzalez feedback on the project's Testing Document:

> "Make the evaluation plan more specific. Describe how representative senior users will participate in usability testing, which tasks they will perform, and how success will be measured. Also define consistent conditions for performance testing and explain how the 50% improvement target relates to the individual performance thresholds."

**Note on source document:** No pre-existing Testing Document or evaluation plan containing a numeric "50% improvement target" or individual performance thresholds was found anywhere in this repository (`documentation/`, `tests/`, `design/`, or `mocks/`) at the time this plan was written. If that content exists in a separate sponsor/professor-facing document (e.g., a Google Doc not committed to this repository), this plan should be merged with it rather than treated as a replacement. Where a specific number is not available from approved project documentation, this plan defines the **procedure** to produce and apply it rather than inventing a figure.

This plan only references participants, tasks, and requirements that are already documented elsewhere in this repository (see Sources below), per the Milestone-1/Milestone-2 scope and the `documentation/29-Project Description` requirements document.

### Sources used
- `design/README.md` — approved user personas (Cindy, Thomas, John, Alex, Patricia) and user journeys.
- `documentation/29-Project Description` — Milestone 2/3 deliverables requiring "initial usability testing" and "usability testing"; accessibility requirements (WCAG-aligned, keyboard, screen-reader, color contrast, scalable text).
- `documentation/milestones/Milestone-2.md` — PBI-6 (navigation), PBI-7 (ZIP search), PBI-8 (workshop details/registration), PBI-10 (150% zoom), PBI-11 (accessibility remediation), PBI-12 (sandbox integration).
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

A 50% overall improvement target is referenced in professor/Gonzalez feedback, but no approved project document currently on file in this repository states the specific baseline numbers, the specific metrics in scope, or specific individual performance thresholds. **This plan does not fabricate those numbers.** Instead, it defines the baseline-measurement procedure and the formula to apply once the authoritative source (the sponsor-approved Testing Document, wherever it is maintained) confirms the individual metrics and thresholds.

### Baseline-measurement procedure
1. Identify the individual metrics in scope (e.g., page load time / Largest Contentful Paint for Home and "I Need Help", time to first workshop search result, time to complete the sandbox registration journey).
2. Measure each metric against the **original/legacy Tech Smart Learning for Seniors website** (or, if that is unavailable for testing, the earliest measurable prototype build) using the fixed conditions in Section 4. This is the **baseline**.
3. Record each baseline value and the exact conditions (build, environment, tooling) used to produce it, so later comparisons are apples-to-apples.

### Improvement formula
For each individual metric:

$$\text{Improvement \%} = \frac{\text{baseline} - \text{current}}{\text{baseline}} \times 100$$

### Relating individual thresholds to the overall 50% target
Once the sponsor/professor-approved individual performance thresholds are available, each metric should be evaluated against its own threshold using the formula above. The overall 50% target should then be treated as the **aggregate (e.g., mean) improvement percentage across all defined individual metrics**, not a number each metric must independently hit in isolation — unless the authoritative Testing Document instead specifies that every individual metric must independently meet 50%. This plan flags that distinction explicitly because the feedback indicates it was previously ambiguous:

- If the overall 50% is an **aggregate/average** target: an individual metric may fall short of 50% as long as the mean across all defined metrics reaches 50%, and this should be stated plainly in the final Testing Document.
- If the overall 50% is a **floor** that every metric must meet: every individual threshold must itself be set at (or the formula must demonstrate) at least 50% improvement, and any metric below that is a reportable gap, not an average smoothed over.

This plan recommends confirming which interpretation the sponsor/professor intends and recording that decision explicitly in the Testing Document once confirmed, since the two interpretations produce different pass/fail outcomes for the same raw data.

---

## 6. Open Items
- Confirm the location/existence of the authoritative Testing Document referenced in the professor's feedback, and merge this plan into it if it exists outside this repository.
- Confirm specific numeric baseline values and individual performance thresholds with the sponsor/professor; this plan intentionally does not invent them.
- Confirm whether the 50% target is an aggregate or per-metric floor (Section 5).
