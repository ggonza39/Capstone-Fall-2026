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
This PBI constructs the primary landing page and global header/footer navigation for the TSLS-Web platform. It creates two distinct, high-contrast entry pathways for the site's primary user groups: "I Need Help" (seniors and caregivers seeking digital literacy workshops) and "I Want to Help" (donors, volunteers, and advocates). This implementation establishes the foundational visual hierarchy, responsive layout, and client-side routing structure across all viewports.

#### Acceptance Criteria
- [ ] **Dual-Path Hero Section:** Construct a hero layout featuring two large, distinct CTA cards labeled "I Need Help" and "I Want to Help" with high-contrast buttons (minimum 4.5:1 contrast ratio) that route directly to `/workshops` and `/get-involved`.
- [ ] **Accessible Global Header:** Build a persistent header containing the site logo, primary navigation links (Home, Workshops, Get Involved, About, Contact), and an always-visible phone help button.
- [ ] **Global Accessible Footer:** Build a persistent footer containing contact details, organization address, direct links to privacy policy/terms, and secondary navigation links.
- [ ] **Skip Navigation Link:** Implement a hidden "Skip to main content" link at the top of the DOM that becomes visible on keyboard focus and moves focus directly to the `<main>` element.
- [ ] **Responsive Breakpoint Behavior:** Verify that top navigation converts smoothly to a simplified, full-screen mobile menu on screens under 768px without clipping text or dropping links.

---

### [PBI-7] Implement "I Need Help" workshop discovery and ZIP search

* **Status:** To Do
* **Story Points:** 5

#### Description
This PBI builds the workshop search and discovery page (`/workshops`), allowing seniors and caregivers to locate nearby digital literacy classes. It provides a clean, single-input ZIP code search bar, basic filtering options, and high-visibility result cards designed for low cognitive load and easy readability.

#### Acceptance Criteria
- [ ] **ZIP Code Search Input:** Implement a numerical input field that accepts a 5-digit ZIP code, includes explicit labels, and triggers a search on button click or Enter keypress.
- [ ] **Workshop Result Cards:** Render search results as distinct visual cards displaying workshop title, date, time, physical address, distance in miles, and a "View Details" button.
- [ ] **Filter Controls:** Include simple filter controls for event type (In-Person vs. Virtual) and date range using large touch targets (minimum 44x44px).
- [ ] **Empty and Error Feedback:** Display direct, user-friendly messages for invalid ZIP inputs (e.g., "Please enter a valid 5-digit ZIP code") and when zero workshops match the criteria.
- [ ] **Mock Data Connection:** Wire the search interface state to consume local JSON workshop payloads based on the entered ZIP code.

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
