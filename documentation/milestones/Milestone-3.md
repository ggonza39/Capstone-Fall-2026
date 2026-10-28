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
- [ ] **Identify In-Scope Public Forms:** Review the implemented TSLS-Web application and document the public-facing forms that are included in the final project scope, including the Advocate interest/request form. For each form, identify whether its submission behavior uses the project sandbox/mock layer, preserves an existing Gravity Forms/Salesforce workflow, or depends on the shared REST API contract.
- [ ] **Form Labels and Required Fields:** Verify that every in-scope form control has a clear associated label and that required fields are identified to users before submission. Correct missing, unclear, or improperly associated labels and required-field indicators.
- [ ] **Accessible Validation and Error Feedback:** Verify that submitting missing or invalid required information produces a clear error message associated with the applicable field. Errors must not rely on color alone, and users must be able to identify and correct the affected fields using keyboard navigation and applicable assistive technology.
- [ ] **Submission Status Feedback:** Verify that each in-scope form provides clear feedback for applicable submission states, including successful sandbox submissions and submission errors. Sandbox behavior must not state or imply that information was submitted to a production system when no production submission occurred.
- [ ] **Production Integration Boundary Verification:** Verify that applicable Gravity Forms/Salesforce workflows remain identified as the production workflow and that sandbox/mock implementations do not silently replace them. Document the final integration method used or expected for each in-scope form.
- [ ] **End-to-End Form Testing:** Test each identified in-scope form from initial entry through validation and the applicable success or error response. Record unresolved defects and correct issues that prevent the intended frontend journey from being completed.
- [ ]  **Advocate Interest Form:** Refine the “I Want to Help” Advocate pathway to provide a clear engagement opportunity for users interested in supporting TSLS through community advocacy and outreach. Implement an accessible Advocate interest/request form collecting first name, last name, email address, optional phone number, advocacy interests, and a message describing the user's interest in supporting TSLS. Provide required-field validation, accessible submission feedback, and clearly identify the sandbox or approved production integration used for submission. The form must not imply that submission automatically establishes the user as an official TSLS representative or advocate.

---

### [PBI-14] Optimize frontend performance and technical SEO

* **Status:** To Do
* **Story Points:** 8

#### Description
This PBI performs final frontend performance and technical SEO optimization for the TSLS-Web application using the project's established baseline measurements and target values. The team will evaluate the implemented application using Lighthouse and applicable browser-development tools, identify significant performance and technical SEO issues, apply appropriate frontend optimizations, and document final results against the project's established targets. Performance targets will be treated as project goals to be measured and reported rather than guaranteed outcomes.

#### Acceptance Criteria
- [ ] **Initial Performance Measurement:** Run Lighthouse against the deployed TSLS-Web implementation before final optimization and record the measured FCP, LCP, TBT, Speed Index, and SEO score for comparison with the documented project baseline and final results.
- [ ] **First Contentful Paint (FCP) Optimization:** Identify and address frontend issues affecting FCP and work toward the established target of less than 2.0 seconds compared with the documented 5.7-second baseline.
- [ ] **Largest Contentful Paint (LCP) Optimization:** Identify and address frontend issues affecting LCP and work toward the established target of less than 2.5 seconds compared with the documented 21.8-second baseline.
- [ ] **Total Blocking Time (TBT) Optimization:** Identify and address applicable scripts, rendering work, or other frontend behavior contributing to blocking time and work toward the established target of less than 200 milliseconds compared with the documented 700-millisecond baseline.
- [ ] **Speed Index Optimization:** Address applicable frontend loading and rendering issues and work toward the established Speed Index target of less than 3.4 seconds compared with the documented 8.7-second baseline.
- [ ] **Technical SEO Optimization:** Review Lighthouse technical SEO findings and correct applicable frontend issues involving page titles and metadata, semantic page structure, crawlable content, links, and other team-controlled technical SEO factors. Work toward the established Lighthouse SEO target of 90–100 compared with the documented baseline score of 40.
- [ ] **Frontend Asset Optimization:** Review images, scripts, styles, fonts, and other frontend assets identified through Lighthouse or browser-development tools as contributing to performance issues. Optimize applicable team-controlled assets where doing so improves loading or rendering behavior without breaking existing functionality.
- [ ] **Final Performance and SEO Results:** Run Lighthouse again after optimization and record the final FCP, LCP, TBT, Speed Index, and SEO results. Compare the final measurements with the documented baseline and project targets and identify any targets not achieved or remaining limitations.

---

### [PBI-15] Implement and validate lightweight sandbox administration interface

* **Status:** To Do
* **Story Points:** 5

#### Description
This PBI implements the lightweight sandbox administration interface defined within the approved TSLS-Web project scope. The interface will provide a separate administrative view for managing the limited website content identified for the project demonstration, including applicable workshop information and selected informational or community-impact content. The implementation is intended to demonstrate administrative capabilities within the project sandbox and does not constitute a production content-management system, production authentication service, persistent production database, or full role-based access-control system.

#### Acceptance Criteria
- [ ] **Separate Administration View:** Implement a dedicated administration view that is visually and functionally separated from the public-facing TSLS-Web pages and provides access to the administrative functions included in the sandbox demonstration.
- [ ] **Sandbox Access Control:** Restrict direct access to the administration view using the sandbox access mechanism selected for the project demonstration. Clearly document that this mechanism is for sandbox/testing purposes and is not production authentication or role-based access control.
- [ ] **Workshop Listing:** Display the representative workshop records available to the sandbox administration interface so an administrator can identify and select an existing workshop for management.
- [ ] **Create Workshop:** Provide an administrative form that allows a user to create a new sandbox workshop record using the workshop information required by the implemented public workshop experience. Validate required information before accepting the sandbox operation.
- [ ] **Edit Workshop:** Allow an existing sandbox workshop record to be selected and its applicable information updated. After the operation succeeds, display the updated information in the administration interface.
- [ ] **Administrative Action Feedback:** Provide clear success and error feedback for applicable workshop administration actions so the administrator can determine whether the requested sandbox operation succeeded or failed.
- [ ] **Selected Informational Content:** If informational or community-impact content is included in the final approved administration scope, provide an administrative method for updating that identified content. Do not expand this criterion into general website content management.
- [ ] **Sandbox Data Boundary:** Perform administrative data operations using the project's sandbox, mock, local, or equivalent demonstration mechanism. The interface must not depend on a production database or imply that sandbox changes are being persisted to production systems.
- [ ] **Administrative Accessibility and Usability:** Ensure administrative forms and controls have clear labels, are keyboard operable, provide visible focus indicators, and provide understandable validation and action feedback.
- [ ] **Administration Scope Verification:** Verify that the completed interface remains a lightweight sandbox administration capability. Production CMS functionality, production authentication, persistent production storage, and full role-based access control remain outside the scope of this PBI.

---
