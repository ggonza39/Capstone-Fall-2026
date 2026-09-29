# Milestone 2 Backlog: Interactive Sandbox Prototype

**Target Completion Date:** October 28, 2026  
**Total Points:** 39 Story Points  
**Progress:** 0 of 7 PBIs Completed (0 / 39 Points)  

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
| **PBI 11** | Implement WCAG accessibility remediation | 8 | To Do |
| **PBI 12** | Implement Mock API / sandbox integration | 5 | To Do |

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
- [ ] **Filter Controls:** Include simple filter controls for event type (In-Person vs. Virtual) and date range using large touch targets (minimum 44x44px).
- [ ] **Empty and Error Feedback:** Provide clear, user-friendly feedback for invalid ZIP-code input, searches returning no matching workshops, and applicable search errors.
- [ ] **Sandbox Workshop Data Connection:** Connect the workshop search interface to representative mock workshop data using the agreed Mock API, local JSON, or equivalent sandbox mechanism so that ZIP-code search behavior can be demonstrated independently while the final sponsor-provided workshop-location source remains pending.
- [ ] **Workshop Journey Continuity:** Ensure each applicable workshop result provides a clear path to additional workshop information and the associated registration journey without unnecessary intermediate navigation.

---

### [PBI-8] Implement workshop details and registration journey

* **Status:** To Do
* **Story Points:** 5

#### Description
This PBI creates the individual workshop detail page (`/workshops/[id]`) and its associated registration flow. It presents comprehensive event details—such as venue location, schedule, prerequisites, and instructor details—and provides a simple form for seniors or caregivers to reserve a seat.

#### Acceptance Criteria
- [ ] **Workshop Detail Page View:** Render full event details including title, date/time, physical location, room number, instructor name, building accessibility features, and seat availability.
- [ ] **Registration Form Fields:** Build a simple registration form capturing Full Name, Email Address, Phone Number, and an optional text field for accommodation requests.
- [ ] **Inline Form Validation:** Provide immediate, high-contrast visual error messages directly below input fields when required data is missing or formatted incorrectly.
- [ ] **Registration Confirmation View:** Display a dedicated success confirmation screen upon submission showing the registration reference code, event summary, and a "Print Details" button.
- [ ] **Keyboard & Focus Management:** Ensure form submit moves keyboard focus automatically to the confirmation heading for screen reader users.

---

### [PBI-9] Implement "I Want to Help" Donate/Volunteer/Advocate journeys

* **Status:** To Do
* **Story Points:** 8

#### Description
This PBI constructs the community engagement section (`/get-involved`) covering support pathways for volunteers, donors, and advocates. It delivers three tailored views: a volunteer application form, a donation options interface, and downloadable advocacy resources.

#### Acceptance Criteria
- [ ] **Engagement Landing Hub:** Build the `/get-involved` landing layout presenting clear visual cards routing to Volunteer, Donate, and Advocate sub-sections.
- [ ] **Volunteer Application Form:** Construct a form capturing applicant contact info, preferred availability (weekdays/weekends), and skill selections (e.g., Tech Mentor, Event Support).
- [ ] **Donation Interface:** Build a donation view featuring pre-set contribution buttons ($25, $50, $100), a custom amount input, and a payment frequency toggle (One-time vs. Monthly).
- [ ] **Advocacy Resources Section:** Render a resource list containing direct file download links for printable PDF flyers, community presentations, and outreach toolkits.
- [ ] **Submission Feedback:** Implement toast alerts and summary state changes confirming successful volunteer application and donation form submissions.

---

### [PBI-10] Implement responsive frontend layout and 150% zoom support

* **Status:** To Do
* **Story Points:** 8

#### Description
This PBI optimizes all application page layouts to ensure full responsiveness across screen sizes and complete compatibility with browser text zooming. It guarantees that seniors using up to 150% (and 200%) text zoom can read all content and complete all user journeys without horizontal scrolling or overlapping UI elements.

#### Acceptance Criteria
- [ ] **Fluid Responsive Breakpoints:** Standardize page layouts across mobile (375px), tablet (768px), and desktop (1280px) viewports with zero horizontal overflow.
- [ ] **150% & 200% Zoom Verification:** Verify that zooming text up to 200% in browser settings preserves line height, prevents text truncation, and keeps interactive elements fully visible without horizontal scrollbars.
- [ ] **Touch & Click Target Sizing:** Enforce a strict minimum physical size of 44x44px for all buttons, form controls, navigation links, and clickable cards across all screen sizes.
- [ ] **Relative CSS Units:** Refactor layout spacing and font sizes to use relative units (`rem`, `em`, `vh`/`vw`) instead of fixed pixel dimensions.
- [ ] **Cross-Browser Display Audit:** Test and verify responsive layouts and zoom stability across Chrome, Firefox, Safari, and Edge browsers.

---

### [PBI-11] Implement WCAG accessibility remediation

* **Status:** To Do
* **Story Points:** 8

#### Description
This PBI conducts code-level accessibility remediation across all site components to guarantee compliance with WCAG 2.1 AA standards. It focuses on color contrast ratios, high-visibility keyboard focus indicators, semantic markup, and proper ARIA labels for assistive technologies.

#### Acceptance Criteria
- [ ] **Color Contrast Compliance:** Audit and update text and UI elements to ensure a minimum contrast ratio of 4.5:1 for body text and 3:1 for large text and interactive boundaries.
- [ ] **High-Visibility Focus Rings:** Implement custom CSS focus states (`outline: 3px solid #000` or equivalent) across all interactive elements that remain clearly visible against light and dark backgrounds.
- [ ] **Semantic HTML Hierarchy:** Structure all pages using correct structural landmarks (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`) and maintain strict heading order (`<h1>` through `<h3>`).
- [ ] **Accessible Form Labels & ARIA:** Assign explicit `<label>` tags with matching `for` attributes to all input fields, and add `aria-describedby` for inline validation messages.
- [ ] **Automated Audit Clearance:** Run Lighthouse and Axe DevTools accessibility audits across all pages, achieving a 100% score with zero critical or serious violations.

---

### [PBI-12] Implement Mock API / sandbox integration

* **Status:** To Do
* **Story Points:** 5

#### Description
This PBI integrates the frontend pages with local Next.js Route Handlers (`/api/*`) to deliver dynamic mock data for workshops, search queries, and form submissions. This validates client-side data fetching, state management, loading indicators, and error handling before production backend integration.

#### Acceptance Criteria
- [ ] **Workshop Search API Endpoint:** Connect `/workshops` search UI to `GET /api/workshops?zip={zip}` to fetch matching mock workshop JSON objects.
- [ ] **Workshop Details API Endpoint:** Connect `/workshops/[id]` to `GET /api/workshops/[id]` to display dynamic event parameters from mock data files.
- [ ] **Form Handler API Endpoints:** Wire registration, volunteer, and contact forms to `POST` route handlers that validate incoming payloads and return HTTP 200 success responses.
- [ ] **Loading & Skeleton States:** Display accessible loading skeletons or high-contrast spinners while data requests are pending.
- [ ] **Error Handling States:** Display fallback error components and retry buttons when API endpoints return 400 or 500 status codes or experience network delays.
