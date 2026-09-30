# Milestone 2 Backlog: Interactive Sandbox Prototype

**Target Completion Date:** October 28, 2026  
**Total Points:** 47 Story Points  
**Progress:** 0 of 7 PBIs Completed (0 / 47 Points)  

---

## Milestone Summary

Develop an interactive, functional web prototype that implements the primary dual-path user journeys and core site capabilities for TSLS-Web. This milestone focuses on building the responsive landing and navigation framework, location-based workshop discovery and ZIP-code search, workshop detail and registration flows, community engagement pathways (donate, volunteer, advocate), WCAG 2.1 AA accessibility remediation, 150% zoom compatibility, and local Mock API integrations to validate frontend state management prior to production handover.

| PBI # | Title | Points | Status |
| :--- | :--- | :---: | :---: |
| **PBI 6** | Implement dual-path landing and navigation | 8 | To Do |
| **PBI 7** | Implement "I Need Help" workshop discovery and ZIP search | 5 | To Do |
| **PBI 8** | Implement workshop details and registration journey | 5 | To Do |
| **PBI 9** | Implement "I Want to Help" Donate/Volunteer/Advocate journeys | 8 | To Do |
| **PBI 10** | Implement responsive frontend layout and 150% zoom support | 8 | To Do |
| **PBI 11** | Implement targeted Phase 1 accessibility remediation | 8 | To Do |
| **PBI 12** | Implement Mock API / sandbox integration and documented integration boundaries | 5 | To Do |

---

## Detailed Product Backlog Items

### [PBI-6] Implement dual-path landing and navigation

* **Status:** To Do
* **Story Points:** 8

#### Description
This PBI constructs the primary landing page and global header/footer navigation for the TSLS-Web platform. It creates two distinct, accessible entry pathways for the site's primary user groups: “I Need Help” for senior adults and other users seeking technology assistance and local workshops, and “I Want to Help” for volunteers, donors, advocates, and community partners. This implementation establishes the foundational visual hierarchy, responsive layout, and client-side navigation structure while providing clear and direct access to the site's primary resources and user journeys.

#### Acceptance Criteria
- [ ] **Dual-Path Hero Section:** Construct a hero layout featuring two large, distinct calls to action labeled “I Need Help” and “I Want to Help,” using accessible, high-contrast controls that provide direct entry into their respective user journeys.
- [ ] **Accessible Global Header:** Build a consistent header containing the site logo and clear primary navigation to the site's major resources and user pathways. Navigation controls must be keyboard accessible, visibly focusable, and usable across the planned responsive layouts.
- [ ] **Global Accessible Footer:** Build a consistent footer containing applicable organization contact information and secondary navigation links that provide direct access to important site resources.
- [ ] **Skip Navigation Link:** Implement a hidden "Skip to main content" link at the top of the DOM that becomes visible on keyboard focus and moves focus directly to the `<main>` element.
- [ ] **Responsive Breakpoint Behavior:** Verify that the header and primary navigation adapt appropriately across desktop, tablet, and mobile layouts, including viewports at 980px and below, without text clipping, overlapping elements, inaccessible controls, or missing navigation links.

---

### [PBI-7] Implement "I Need Help" workshop discovery and ZIP search

* **Status:** To Do
* **Story Points:** 5

#### Description
This PBI builds the workshop search and discovery experience for the “I Need Help” journey, allowing senior adults and other users seeking technology assistance to locate relevant local workshops using a ZIP-code search. The interface will provide a clearly labeled ZIP-code input, readable workshop results, accessible feedback for invalid or unsuccessful searches, and direct access to available workshop details and registration. During Phase 1, representative mock workshop data may be used until the sponsor-provided workshop-location source and final workshop dataset are available.

#### Acceptance Criteria
- [ ] **ZIP Code Search Input:** Implement a clearly labeled input that accepts a valid 5-digit ZIP code and allows the user to initiate the search using the search control or keyboard.
- [ ] **Workshop Result Cards:** Render matching workshops as clear, readable result cards displaying available workshop information such as title, date/time, location, and a clearly identified control for viewing additional workshop details and registration information.
- [ ] **Empty and Error Feedback:** Provide clear, user-friendly feedback for invalid ZIP-code input, searches returning no matching workshops, and applicable search errors.
- [ ] **Sandbox Workshop Data Connection:** Connect the workshop search interface to representative mock workshop data using the agreed Mock API, local JSON, or equivalent sandbox mechanism so that ZIP-code search behavior can be demonstrated independently while the final sponsor-provided workshop-location source remains pending.
- [ ] **Workshop Journey Continuity:** Ensure each applicable workshop result provides a clear path to additional workshop information and the associated registration journey without unnecessary intermediate navigation.

---

### [PBI-8] Implement workshop details and registration journey

* **Status:** To Do
* **Story Points:** 5

#### Description
This PBI creates the workshop detail and registration experience within the “I Need Help” journey. Users who select a workshop from the discovery results will be able to view the available workshop information and proceed through an accessible registration pathway. During Phase 1, representative mock workshop and registration data may be used to demonstrate the complete frontend journey while the sponsor-provided workshop-location source and final production registration behavior are confirmed.

#### Acceptance Criteria
- [ ] **Workshop Detail Page View:** Display the available information for the selected workshop, including applicable details such as workshop title, date/time, location, description, and other information provided by the workshop data source. The page must provide a clear path to registration.
- [ ] **Accessible Registration Interface:** Provide the applicable workshop registration fields required for the Phase 1 sandbox demonstration, using clear labels, accessible controls, and identification of required versus optional information. Final production registration fields will align with the approved workshop-registration workflow when confirmed.
- [ ] **Accessible Form Validation:** Provide clear, accessible validation and user-friendly error feedback when required information is missing or incorrectly formatted. Error messages must be programmatically associated with the applicable form controls and must not rely on color alone.
- [ ] **Registration Submission Feedback:** For the Phase 1 sandbox registration flow, provide clear confirmation when a simulated registration submission succeeds, including the applicable workshop summary and appropriate next-step information. The interface must not imply that a production registration has occurred when the submission is using mock or sandbox behavior.
- [ ] **Keyboard & Focus Management:** Ensure the registration journey is fully keyboard operable and that focus is appropriately managed following validation errors and successful sandbox submission so that status or confirmation information is communicated to keyboard and screen-reader users.
- [ ] **Journey Continuity:** Maintain a clear connection between the workshop selected from the discovery results, the workshop detail view, and the corresponding registration pathway so users can complete the journey without unnecessary navigation or re-entering workshop information.

---

### [PBI-9] Implement "I Want to Help" Donate/Volunteer/Advocate journeys

* **Status:** To Do
* **Story Points:** 8

#### Description
This PBI constructs the “I Want to Help” community-engagement journey for donors, volunteers, advocates, and community partners. The journey provides three clearly separated pathways—Donate, Volunteer, and Advocate—each with a distinct purpose and direct call to action. The Donate pathway provides access to the organization’s existing Stripe-enabled donation workflow, the Volunteer pathway directs users to the established Hands On Atlanta signup process, and the Advocate pathway presents sponsor-approved community-impact information and an appropriate path to learn more or engage when applicable content is available.

#### Acceptance Criteria
- [ ] **Engagement Landing Hub:** Build the “I Want to Help” landing experience with three clearly identified pathways—Donate, Volunteer, and Advocate—each providing a distinct purpose, clear call to action, and direct route to its applicable destination without unnecessary intermediate navigation.
- [ ] **Volunteer Pathway:** Provide a clearly identified Volunteer pathway that directs users to the organization's established Hands On Atlanta volunteer signup process. The TSLS-Web frontend shall not implement a separate volunteer application form unless a different workflow is later approved.
- [ ] **Donate Pathway:** Provide a clearly identified Donate pathway and call to action that directs users to the organization's existing Stripe-enabled donation experience. Phase 1 shall preserve the existing Stripe workflow and shall not implement a separate custom payment-processing interface.
- [ ] **Advocate Pathway:** Provide an Advocate section presenting sponsor-approved community-impact information and an appropriate call to action for users to learn more or engage when applicable sponsor-approved content or resources are available.
- [ ] **External Pathway Clarity:** Clearly identify when a Donate or Volunteer action directs the user to an established external workflow or service, using understandable link or button text so the destination and purpose are clear before activation.
- [ ] **Accessible Engagement Navigation:** Ensure the Donate, Volunteer, and Advocate pathway controls are keyboard accessible, visibly focusable, clearly labeled, and presented using understandable headings and calls to action.

---

### [PBI-10] Implement responsive frontend layout and 150% zoom support

* **Status:** To Do
* **Story Points:** 8

#### Description
This PBI implements and refines responsive frontend layouts across the TSLS-Web application to support desktop, tablet, and mobile use while addressing the responsive-design issues identified in the baseline audit. The implementation will prioritize stable content reflow and navigation behavior at smaller viewports and maintain usability through 150% browser zoom without overlapping logos, text crowding, broken navigation, or other major layout failures.

#### Acceptance Criteria
- [ ] **Responsive Layout Behavior:** Implement responsive layouts across the planned desktop, tablet, and mobile viewport ranges, including verification at 980px and below. Content and navigation must reflow without major overlap, clipping, or unusable interface elements.
- [ ] **150% Zoom Verification:** Verify that the interface remains usable through 150% browser zoom without overlapping logos, text crowding, broken navigation, truncated essential content, or inaccessible interactive controls.
- [ ] **Usable Interactive Controls:** Ensure buttons, form controls, navigation controls, and other interactive elements provide clear and usable activation targets appropriate for the senior-focused interface across supported screen sizes.
- [ ] **Scalable Layout Implementation:** Use responsive CSS techniques and appropriate relative/scalable units for typography, spacing, and layout where needed to support content reflow, responsive behavior, and 150% zoom stability.
- [ ] **Cross-Browser Responsive Verification:** Test the implemented responsive layouts and applicable zoom behavior across the project's supported modern browsers, including Chrome, Firefox, Safari, and Edge where available.
- [ ] **Baseline Responsive Defect Verification:** Verify that the previously documented responsive issues—including logo/navigation overlap and text/layout crowding associated with smaller viewports and 150% zoom—are addressed in the implemented frontend.

---

### [PBI-11] Implement targeted Phase 1 accessibility remediation

* **Status:** To Do
* **Story Points:** 8

#### Description
This PBI implements targeted accessibility remediation for the documented Phase 1 findings identified during the baseline accessibility audit. The work focuses on correcting applicable issues involving keyboard navigation, visible focus, media controls, alternative text, semantic heading structure, color contrast, and related identified defects. Remediated findings will be evaluated against the applicable WCAG 2.1 Level AA success criteria using a combination of automated accessibility tools and manual keyboard and screen-reader testing.

#### Acceptance Criteria
- [ ] **Keyboard Navigation and Visible Focus:** Remediate applicable A-001 and A-006 findings so interactive elements can be reached and operated by keyboard and provide a clearly visible focus indicator.
- [ ] **Text Color Contrast:** Remediate the documented A-013 contrast issue so applicable normal text meets a minimum contrast ratio of 4.5:1 against its background, replacing combinations that fail the established requirement.
- [ ] **Alternative Text:** Remediate applicable A-010 findings by providing meaningful alternative text for informative images and appropriate treatment for decorative images. Alternative text must communicate the relevant purpose or information of the image without unnecessary or confusing detail.
- [ ] **Semantic Heading Structure:** Remediate applicable A-012 findings by implementing logical semantic heading structures that communicate page organization appropriately to visual and assistive-technology users.
- [ ] **Accessible Media Controls:** Remediate applicable A-002 and A-003 findings so media controls required within the Phase 1 implementation can be reached, identified, and operated using a keyboard and appropriate assistive technologies.
- [ ] **Automated Accessibility Verification:** Run the project's approved automated accessibility tools, such as WAVE, axe DevTools, and/or Lighthouse, against the implemented Phase 1 pages. Review identified issues relevant to the targeted findings and document unresolved accessibility defects requiring additional remediation.
- [ ] **Manual Accessibility Verification:** Perform manual keyboard testing and applicable screen-reader testing using the project's planned tools, such as NVDA or VoiceOver, to verify behavior that cannot be reliably validated through automated tools alone.
- [ ] **Finding-Level Results:** Record the verification status of the targeted accessibility findings addressed during Phase 1, identifying whether each applicable finding was remediated, remains unresolved, or requires additional follow-up.

---

### [PBI-12] Implement Mock API / sandbox integration and documented integration boundaries

* **Status:** To Do
* **Story Points:** 5

#### Description
This PBI implements the sandbox integration layer required for independent frontend development and demonstration of the TSLS-Web user journeys. The team will use the agreed Mock API, Next.js Route Handlers, local/dummy JSON, MSW, or an equivalent sandbox mechanism where simulation is required. The implementation will support applicable workshop discovery, workshop details, registration behavior, loading states, and error handling while maintaining documented boundaries with existing production integrations such as Gravity Forms/Salesforce, Stripe, Hands On Atlanta, and the backend REST API contract.

#### Acceptance Criteria
- [ ] **Workshop Search Simulation:** Provide representative sandbox workshop data and applicable mock/API behavior needed to demonstrate ZIP-code workshop discovery independently of the final production workshop-location source.
- [ ] **Workshop Detail Simulation:** Provide representative workshop detail data through the agreed sandbox mechanism so users can move from workshop search results into the applicable workshop-detail and registration journey.
- [ ] **Registration Simulation:** Support the applicable Phase 1 workshop-registration interaction through the agreed sandbox mechanism, including representative submission handling and success/error responses needed to demonstrate the frontend registration journey. Mock submission behavior must be clearly separated from the final production registration workflow.
- [ ] **Applicable Form Integration Boundary:** Preserve the documented Gravity Forms/Salesforce workflow for applicable production contact forms. Where independent sandbox testing requires simulated behavior, use the agreed mock/adapter approach without redefining or replacing the production integration.
- [ ] **Loading and Error States:** Implement appropriate loading, empty, success, and error states for applicable sandbox-driven interactions so users receive understandable feedback while data is being retrieved or submitted.
- [ ] **Integration Boundary Documentation:** Document which Phase 1 interactions use sandbox/mock behavior, which preserve existing external or production workflows, and which depend on the shared REST API contract so that the frontend implementation does not silently replace an approved integration.
- [ ] **Independent Frontend Operation:** Verify that the applicable Phase 1 frontend journeys can be developed, tested, and demonstrated in the sandbox without requiring completion of Team #30's production backend or CRM integration.
