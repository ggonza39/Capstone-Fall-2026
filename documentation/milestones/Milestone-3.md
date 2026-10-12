# Milestone 3 Backlog: Production Release & Handover

**Target Completion Date:** December 4, 2026  
**Total Points:** 21 Story Points  
**Progress:** 0 of 3 PBIs Completed (0 / 21 Points)  

---

## Milestone Summary

Prepare the TSLS-Web application for final release and project handover by building on the interactive sandbox prototype completed during Milestone 2. This milestone focuses on refining applicable public forms and validating production integration boundaries, optimizing frontend performance and technical SEO against the project's established targets, and implementing the approved lightweight sandbox administration interface. Final implementation and verification activities will preserve established external workflows and maintain the accessibility, responsive-design, and integration principles established during the earlier milestones.

| PBI # | Title | Points | Status |
| :--- | :--- | :---: | :---: |
| **PBI 13** | Refine public forms and validate production integration boundaries | 8 | To Do |
| **PBI 14** | Optimize frontend performance and technical SEO | 8 | To Do |
| **PBI 15** | Implement and validate lightweight sandbox administration interface | 5 | To Do |

---

## Detailed Product Backlog Items

### [PBI-13] Refine public forms and validate production integration boundaries

* **Status:** To Do
* **Story Points:** 8

#### Description
This PBI refines the applicable TSLS-Web public form experiences developed or represented during the interactive prototype and validates their relationship with the project's approved production integration boundaries. The work will ensure that applicable forms provide clear labels, accessible validation, understandable success and error feedback, and appropriate submission behavior while preserving established production workflows such as Gravity Forms/Salesforce where applicable. Sandbox or mock behavior may continue to be used where production services are unavailable for independent testing, but simulated behavior must remain clearly separated from the final production integration.

#### Acceptance Criteria
- [ ] **Applicable Public Form Review:** Review the public-facing forms included within the final TSLS-Web scope and refine their frontend behavior, labels, required-field identification, instructions, and user feedback where necessary.
- [ ] **Accessible Form Validation:** Verify that applicable forms provide clear and accessible validation, including understandable error messages that are programmatically associated with the applicable controls and do not rely on color alone.
- [ ] **Submission Feedback:** Ensure applicable form interactions provide understandable success, error, and submission-status feedback appropriate to whether the interaction uses production or sandbox behavior.
- [ ] **Production Integration Boundary Validation:** Validate and document which applicable forms preserve established Gravity Forms/Salesforce workflows, which interactions use sandbox or mock behavior, and which depend on the shared REST API contract.
- [ ] **Existing Workflow Preservation:** Ensure that approved production workflows are not silently replaced by custom frontend behavior. Any transition from sandbox behavior to a production integration must follow the documented project integration boundary.
- [ ] **End-to-End Form Verification:** Test applicable public form journeys from user entry through validation and submission feedback to verify that the frontend behavior remains usable, accessible, and consistent with the approved integration approach.

---

### [PBI-14] Optimize frontend performance and technical SEO

* **Status:** To Do
* **Story Points:** 8

#### Description
This PBI performs final frontend performance and technical SEO optimization for the TSLS-Web application using the project's established baseline measurements and target values. The team will evaluate the implemented application using Lighthouse and applicable browser-development tools, identify significant performance and technical SEO issues, apply appropriate frontend optimizations, and document final results against the project's established targets. Performance targets will be treated as project goals to be measured and reported rather than guaranteed outcomes.

#### Acceptance Criteria
- [ ] **Performance Baseline Comparison:** Measure the final implementation against the project's documented performance baseline and record the resulting performance metrics for comparison.
- [ ] **First Contentful Paint (FCP):** Optimize applicable frontend resources and rendering behavior toward the established target of less than 2.0 seconds compared with the documented 5.7-second baseline.
- [ ] **Largest Contentful Paint (LCP):** Optimize applicable page content and loading behavior toward the established target of less than 2.5 seconds compared with the documented 21.8-second baseline.
- [ ] **Total Blocking Time (TBT):** Reduce applicable frontend blocking behavior toward the established target of less than 200 milliseconds compared with the documented 700-millisecond baseline.
- [ ] **Speed Index:** Optimize applicable frontend loading and rendering behavior toward the established Speed Index target of less than 3.4 seconds compared with the documented 8.7-second baseline.
- [ ] **Technical SEO Optimization:** Address applicable technical SEO issues involving page metadata, semantic structure, crawlable content, links, and frontend asset behavior to work toward the project's established Lighthouse SEO target of 90–100 compared with the baseline score of 40.
- [ ] **Frontend Asset Optimization:** Review and optimize applicable images, scripts, styles, fonts, and other frontend assets where they materially affect loading performance or technical SEO.
- [ ] **Final Performance & SEO Verification:** Run final Lighthouse and applicable browser-based measurements and document achieved results, targets met or not met, and any remaining performance or SEO limitations before project handover.

---

### [PBI-15] Implement and validate lightweight sandbox administration interface

* **Status:** To Do
* **Story Points:** 5

#### Description
This PBI implements the lightweight sandbox administration interface defined within the approved TSLS-Web project scope. The interface will provide a separate administrative view for managing the limited website content identified for the project demonstration, including applicable workshop information and selected informational or community-impact content. The implementation is intended to demonstrate administrative capabilities within the project sandbox and does not constitute a production content-management system, production authentication service, persistent production database, or full role-based access-control system.

#### Acceptance Criteria
- [ ] **Separate Administration View:** Implement a clearly separated administrative interface that is distinct from the public-facing TSLS-Web user experience.
- [ ] **Authorized Sandbox Access:** Provide an appropriate sandbox mechanism for restricting access to the administration interface for demonstration and testing purposes without representing the implementation as production authentication or authorization infrastructure.
- [ ] **Workshop Content Administration:** Provide the ability to create, view, update, or otherwise manage the workshop information required by the approved sandbox demonstration using representative project data.
- [ ] **Selected Site Content Administration:** Provide the ability to manage applicable informational or community-impact content identified for the sandbox administration scope where such content is included in the final implementation.
- [ ] **Sandbox Data Handling:** Use the project's approved sandbox, mock, local, or equivalent data mechanism for administrative operations where production persistence is outside the project scope.
- [ ] **Administrative Interface Usability:** Ensure administrative controls are clearly labeled, logically organized, keyboard operable, and provide understandable feedback for applicable administrative actions.
- [ ] **Scope Boundary Verification:** Verify and document that the lightweight administration interface remains within the approved sandbox scope and does not imply delivery of a production CMS, production authentication system, persistent production storage, or full role-based access-control implementation.

---
