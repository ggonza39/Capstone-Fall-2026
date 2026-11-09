# Tech Smart Learning for Seniors
## Shared API Integration Contract (v0.2 — Milestone 1)

### Purpose
This document defines the shared REST API contract between the Tech Smart Learning for Seniors website team and backend Team #30.

The purpose of this contract is to allow both teams to develop independently while maintaining a consistent public interface for website form submissions.

### Contract Status Legend
This contract uses three status tags throughout to reflect Milestone 1 confirmation state:

- **Sponsor-Confirmed** — Requirement and workflow confirmed by the sponsor (REQ-21 through REQ-29). Safe to build against.
- **Pending Frontend Field Confirmation** — The workflow is sponsor-confirmed, but exact fields are still being finalized by the frontend team building that form (currently Donor Interest/Inquiry; Volunteer Signup fields are now Figma-Confirmed — see below). Do not assume additional fields beyond what is documented here until confirmed.
- **Figma-Confirmed** — Field names and dropdown values have been directly observed in the current frontend design (Figma) for that workflow. Required/optional status beyond what is documented here and exact backend field-key naming may still require Backend Team #30 Confirmation.
- **Pending Backend Team #30 Confirmation** — Response/error schema details that Team #30 may still adjust once their API is available.

The public website team may integrate with mock endpoints that follow this same contract until the production backend API becomes available.

---

## Requirements Traceability (REQ-21 – REQ-29)
| Requirement | Description | Where addressed |
|---|---|---|
| REQ-21 | Technology Help Request form | API 1 — Assistance Request |
| REQ-22 | Volunteer Signup form | API 2 — Volunteer Inquiry (Figma-Confirmed) |
| REQ-23 | General Contact form | API 3 — General Contact Inquiry |
| REQ-24 | Donor Interest/Inquiry form, no payment processing | API 4 — Donor Interest/Inquiry |
| REQ-25 | Phase 1 public forms use Mock API/dummy JSON | Mock API Section; see also mocks/README.md |
| REQ-26 | Documented REST API contract (endpoints, schemas, types, validation, errors) | This entire document |
| REQ-27 | Frontend independently testable through Mock API (MSW or equivalent) | Mock API Section |
| REQ-28 | Frontend must not depend on Team #30 completing its CRM | Mock API Strategy; Backend Team Responsibilities |
| REQ-29 | No direct production Salesforce integration in Phase 1 | Salesforce Boundary section |

---

## Website Team Responsibilities
- Define the public website form requirements and user interactions.
- Create front-end request payloads that match the shared contract.
- Provide user-friendly validation and success/error feedback on the website.
- Use mock API endpoints during development when the backend is unavailable.
- Keep frontend integration aligned with the shared contract as requirements evolve.

## Backend Team Responsibilities
- Implement the backend API endpoints and validation logic.
- Manage production validation, error handling, and response behavior.
- Own duplicate detection, contact matching, merging, and contact-management business logic.
- Ensure the live API follows the agreed contract and security requirements.
- Coordinate with the website team before production release.

## Duplicate Handling Boundary
Duplicate detection, contact matching, merging, and related contact-management business logic are responsibilities of the backend system.

The website team will not implement duplicate handling logic in the frontend or public submission flows.

The public website will not retrieve or expose existing contact records as part of these submission endpoints.

---

## Salesforce Boundary (REQ-29)
Tech Smart Learning for Seniors' existing website currently submits information into Salesforce. This project replaces that dependency with calls to backend Team #30's contact-management API, using this shared contract and the Mock API layer during Phase 1.

- No direct production Salesforce integration will be implemented by the website team during Phase 1.
- The Mock API and this contract are the only integration points the frontend depends on.
- Any future Salesforce-related migration work belongs to backend Team #30, not this project.

---

## Security Requirements
The requirements below are Sponsor-Confirmed as the general security posture for Phase 1. Specific implementation details remain Pending Backend Team #30 Confirmation.

- Use HTTPS for production API communication.
- Validate input on both the frontend and the backend.
- Client-side validation is for user experience and is not a security boundary.
- Backend systems must independently validate incoming requests.
- Do not expose backend contact records through public submission endpoints.
- Do not return unnecessary personal information in responses.
- Do not expose stack traces, internal paths, credentials, or implementation details.
- Do not place credentials or API secrets in frontend source code.
- Apply reasonable request-size limits.
- Production abuse protection and rate limiting should be coordinated with Team #30 and the hosting environment.
- Log enough information for troubleshooting without unnecessarily logging sensitive form data.

---

## API Versioning
The routes in this contract use the /api/v1/ prefix.

This identifies the first public version of the shared contract and allows future breaking changes to be introduced under a new version without silently changing existing frontend integrations.

---

## Standard HTTP Responses (Sponsor-Confirmed)
The following HTTP responses apply to this public contract:

### 201 Created
The submission was successfully accepted or created.

### 400 Bad Request
The request contains invalid or missing information.

### 404 Not Found
The requested API resource does not exist.

### 405 Method Not Allowed
The endpoint exists but does not support the HTTP method used.

### 415 Unsupported Media Type
The request was not sent using the expected application/json content type.

### 500 Internal Server Error
An unexpected server-side error occurred.

Do not expose stack traces, database details, internal paths, credentials, or sensitive implementation information in error responses.

---

## Standard Error Format
A consistent JSON error format is proposed for validation and request failures.

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains invalid or missing information.",
    "fields": {
      "email": "Enter a valid email address."
    }
  }
}
```

This error schema shape is Sponsor-Confirmed for Phase 1 mock development. The exact final error codes/messages remain Pending Backend Team #30 Confirmation before production integration.

---

## Mock API Section
The mock API layer is a temporary integration boundary that allows the Next.js frontend to continue development without waiting for backend Team #30 delivery.

```text
Next.js Frontend
        |
        | HTTP + JSON
        v
Mock API
        |
        | follows shared API contract
        v
Simulated Response
```

Later:

```text
Next.js Frontend
        |
        | SAME contract
        v
Team #30 Real Backend API
```

The mock layer allows the website team to:
- continue frontend development;
- test form integration;
- test success-state behavior;
- test validation-error behavior;
- test failure-state behavior;
- test API contract consistency;
- avoid blocking frontend progress on backend scheduling.

This architecture allows the frontend to remain compatible with the future real backend without redesigning the website interface.

This satisfies REQ-25 (Mock API/dummy JSON for Phase 1 forms), REQ-27 (frontend independently testable through a Mock API layer), and REQ-28 (frontend independence from Team #30's CRM delivery timeline).

---

## Contract Status
- Status: Sponsor-Confirmed (REQ-21 through REQ-29)
- Website Team Approval: Confirmed for Milestone 1
- Sponsor Requirements Confirmation: Confirmed
- Backend Team #30 Confirmation: Pending
- Field sets for Assistance and Contact are Sponsor-Confirmed. Volunteer Signup fields are Figma-Confirmed (REQ-22). Donor Interest/Inquiry fields beyond the baseline remain Pending Frontend Field Confirmation.
- The mock endpoints are designed to follow the same contract as the future real backend so the website team can continue development while waiting for the final live API.

---

## Public API Operations
This contract includes the following Sponsor-Confirmed public submission endpoints:
- POST /api/v1/assistance-requests (REQ-21)
- POST /api/v1/volunteer-inquiries (REQ-22 — Figma-Confirmed fields; see the Milestone 3 Production Integration Boundary Update below — the public website currently links directly to the Hands On Atlanta production workflow instead of rendering this form)
- POST /api/v1/contact-inquiries (REQ-23)
- POST /api/v1/donor-inquiries (REQ-24 — no payment processing; Pending Frontend Field Confirmation)

Milestone 2 and Milestone 3 added two further sandbox-only endpoints that follow the same contract conventions (documented later in this file as API 5 and API 6): workshop search/details/registration (PBI-7/PBI-8/PBI-12) and the Advocate Interest Inquiry (PBI-13).

---

## In-Scope Public Forms (Milestone-3 — PBI-13)
This table identifies every public-facing form in the final project scope, the page that implements it, and whether its submission behavior uses this project's sandbox/mock layer, preserves an existing production workflow, or depends on the shared REST API contract above.

| Form | Page(s) | Integration Method | Notes |
|---|---|---|---|
| Technology Help Request | *(no standalone form in current UI)* | Sandbox REST API contract — `POST /api/v1/assistance-requests` (API 1) is implemented, validated, and tested but not currently called by any page. | REQ-21's "I Need Help" intent is represented by the workshop discovery and registration journey below instead of a separate generic request form. See Outstanding Issues in `tests/api-integration-test-plan.md`. |
| Workshop Registration | `NeedHelp.js` (search) → `WorkshopDetail.js` (registration) | Sandbox REST API contract — `GET /api/workshops`, `GET /api/workshops/:id`, `POST /api/workshops/:id/registrations` (API 5) | Sandbox demonstration only; response `message` explicitly states no production registration was submitted. |
| Volunteer Signup | `WantToHelp.js` | Existing external production workflow — direct link to Hands On Atlanta (`https://volunteer.handsonatlanta.org/`) | Sponsor-confirmed. The shared contract's `POST /api/v1/volunteer-inquiries` (API 2) mock endpoint remains implemented/tested but is not rendered as a form. |
| General Contact | `Contact.js` | Sandbox REST API contract — `POST /api/v1/contact-inquiries` (API 3) | |
| Donor Interest/Inquiry & Donation Checkout | `Donate.js` / `CheckoutForm.js` | Sandbox REST API contract — `POST /api/v1/donor-inquiries` (API 4) — combined with the real Stripe.js Elements UI in **test mode only** (see Stripe Integration Boundary below) | No PaymentIntent is created and no real charge is ever submitted; only non-payment donor details reach the sandbox endpoint. |
| Advocate Interest | `Advocate.js` | Sandbox REST API contract — `POST /api/v1/advocate-inquiries` (API 6) | Milestone-3 addition (PBI-13). Submitting this form does not establish the user as an official TSLS representative or advocate. |

No in-scope public form in the current UI depends on a Gravity Forms–driven workflow; Volunteer Signup is the only pathway that preserves an existing external/production workflow today.

---

# API 1 — Assistance Request (REQ-21)

## Endpoint
POST /api/v1/assistance-requests

## Purpose
Allow a visitor seeking technology assistance to submit a new assistance request.

## Content-Type
application/json

## Fields (Sponsor-Confirmed)

### Required fields
- firstName
- lastName
- at least one contact method: email or phone
- helpCategory
- description

### Optional fields
- email if phone is supplied
- phone if email is supplied
- preferredContactMethod
- accessibilityNeeds

### Field notes and data types
| Field | Type | Notes |
|---|---|---|
| firstName | string | Sponsor-Confirmed. Required, cannot be empty. |
| lastName | string | Sponsor-Confirmed. Required, cannot be empty. |
| email | string (email format) \| null | Sponsor-Confirmed. Required if phone is not supplied; optional otherwise. |
| phone | string \| null | Sponsor-Confirmed. Required if email is not supplied; optional otherwise. |
| helpCategory | string (enum) | Sponsor-Confirmed as required; exact approved category values are Pending Frontend Field Confirmation. |
| description | string | Sponsor-Confirmed. Required and must not be empty. |
| preferredContactMethod | string (enum: "email" \| "phone") \| null | Sponsor-Confirmed. When supplied, must match an available contact method. |
| accessibilityNeeds | string \| null | Sponsor-Confirmed. Optional, may be null or a string. |

## Example Request
```json
{
  "firstName": "Mary",
  "lastName": "Johnson",
  "email": "mary@example.com",
  "phone": "4045550100",
  "preferredContactMethod": "phone",
  "helpCategory": "smartphone",
  "description": "I need help learning how to make a video call.",
  "accessibilityNeeds": null
}
```

## Validation Rules
- firstName cannot be empty.
- lastName cannot be empty.
- At least one contact method must be provided: email or phone.
- email must have a valid format when supplied.
- phone must be valid when supplied if the project chooses to enforce formatting.
- helpCategory must use an approved category.
- description cannot be empty.
- preferredContactMethod must correspond to an available contact method when supplied.
- accessibilityNeeds, if provided, should be a string or null.

## Successful Response
HTTP 201 Created

```json
{
  "requestId": "TS-1001",
  "status": "received",
  "message": "Your assistance request has been received."
}
```

## Validation Error Response
HTTP 400 Bad Request

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains invalid or missing information.",
    "fields": {
      "email": "Enter a valid email address.",
      "description": "Description is required."
    }
  }
}
```

---

# API 2 — Volunteer Inquiry (REQ-22)

## Endpoint
POST /api/v1/volunteer-inquiries

## Purpose
Allow a visitor interested in volunteering with Tech Smart Learning for Seniors to submit an inquiry.

This endpoint represents the website inquiry contract only and does not replace or redesign any external volunteer onboarding process.

## Content-Type
application/json

## Fields (Figma-Confirmed — REQ-22)
These fields and dropdown values reflect the current Volunteer Contact Form design observed in Figma. Exact backend field-key naming and any nuances beyond what is documented here remain Pending Backend Team #30 Confirmation. Do not add availability, skills, background-check consent, or other fields not shown in the current design.

### Required fields
- firstName
- lastName
- email
- reasonForVolunteering

### Optional fields
- phone
- organizationName
- leadSource
- message

### Field notes and data types
| Field | Type | Notes |
|---|---|---|
| firstName | string | Figma-Confirmed. Required, cannot be empty. |
| lastName | string | Figma-Confirmed. Required, cannot be empty. |
| email | string (email format) | Figma-Confirmed. Required. |
| reasonForVolunteering | string (enum: "Classroom volunteer" \| "Committee volunteer" \| "Event volunteer") | Figma-Confirmed. Required; must match one of the confirmed dropdown values. |
| phone | string \| null | Figma-Confirmed. Optional. |
| organizationName | string \| null | Figma-Confirmed. Optional. |
| leadSource | string (enum: "Sponsor Referral" \| "Networking Event" \| "Drive-By/Physical Location" \| "Board Referral" \| "Word of mouth" \| "Trade Show" \| "Internet Search" \| "Student" \| "Friend" \| "Gift" \| "Google Ads" \| "Other") \| null | Figma-Confirmed. Optional; when supplied, must match one of the confirmed dropdown values. |
| message | string \| null | Figma-Confirmed. Optional. |

Additional fields (e.g., availability, skills, background-check consent) are **not part of the current confirmed design** and are intentionally not included.

## Example Request
```json
{
  "firstName": "David",
  "lastName": "Lee",
  "email": "david@example.com",
  "phone": "4045550135",
  "organizationName": "Local Senior Center",
  "reasonForVolunteering": "Classroom volunteer",
  "leadSource": "Word of mouth",
  "message": "I would like to help seniors learn how to use smartphones."
}
```

## Validation Rules
- firstName cannot be empty.
- lastName cannot be empty.
- email is required and must be in a valid email format.
- reasonForVolunteering is required and must match one of the confirmed values: Classroom volunteer, Committee volunteer, Event volunteer.
- phone is optional and should be valid if provided.
- organizationName is optional.
- leadSource is optional; when supplied, must match one of the confirmed values: Sponsor Referral, Networking Event, Drive-By/Physical Location, Board Referral, Word of mouth, Trade Show, Internet Search, Student, Friend, Gift, Google Ads, Other.
- message is optional and may be omitted or empty.

## Successful Response
HTTP 201 Created

```json
{
  "inquiryId": "VI-1001",
  "status": "received",
  "message": "Your volunteer inquiry has been received."
}
```

## Validation Error Response
HTTP 400 Bad Request

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains invalid or missing information.",
    "fields": {
      "email": "Enter a valid email address.",
      "reasonForVolunteering": "Reason for volunteering is required."
    }
  }
}
```

## Milestone 3 Production Integration Boundary Update (PBI-13)
The sponsor subsequently confirmed that the "I Want to Help → Volunteer" call to action directs visitors to the organization's existing external production volunteer workflow (Hands On Atlanta, `https://volunteer.handsonatlanta.org/`) instead of a TSLS-hosted inquiry form. The public website therefore does not currently render a volunteer inquiry form against this endpoint — `src/pages/WantToHelp.js`'s Volunteer button is a direct external link, which is the final production workflow for this pathway.

This mock endpoint, its validation rules, and its MSW/Express handlers remain implemented and unit tested (`src/mocks/validation-logic/volunteerInquiries.mjs`) so the contract stays available if a TSLS-hosted volunteer inquiry form is reintroduced in a future milestone. No sandbox implementation silently replaces the Hands On Atlanta production workflow.

---

# API 3 — General Contact Inquiry (REQ-23)

## Endpoint
POST /api/v1/contact-inquiries

## Purpose
Allow a visitor to submit a general inquiry that does not belong to the assistance, volunteer, or donor workflow.

## Content-Type
application/json

## Fields (Sponsor-Confirmed)

### Required fields
- firstName
- lastName
- email
- inquiryType

### Optional fields
- phone
- organization
- message

### Field notes and data types
| Field | Type | Notes |
|---|---|---|
| firstName | string | Sponsor-Confirmed. Required, cannot be empty. |
| lastName | string | Sponsor-Confirmed. Required, cannot be empty. |
| email | string (email format) | Sponsor-Confirmed. Required. |
| inquiryType | string (enum) | Sponsor-Confirmed as required; exact enum values Pending Frontend Field Confirmation. |
| phone | string \| null | Sponsor-Confirmed. Optional. |
| organization | string \| null | Sponsor-Confirmed. Optional. |
| message | string \| null | Sponsor-Confirmed. Optional. |

## Example Request
```json
{
  "firstName": "Alicia",
  "lastName": "Martin",
  "email": "alicia@example.com",
  "phone": "4045550172",
  "inquiryType": "partnership",
  "organization": "Community Center",
  "message": "We would like to learn more about partnership opportunities."
}
```

## Validation Rules
- firstName cannot be empty.
- lastName cannot be empty.
- email is required and must be in a valid email format.
- inquiryType is required and must match an approved inquiry type.
- phone is optional and should be valid if provided.
- organization is optional and may be omitted.
- message is optional and may be omitted or empty.

## Successful Response
HTTP 201 Created

```json
{
  "inquiryId": "CI-1001",
  "status": "received",
  "message": "Your contact inquiry has been received."
}
```

## Validation Error Response
HTTP 400 Bad Request

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains invalid or missing information.",
    "fields": {
      "inquiryType": "Please select a valid inquiry type.",
      "email": "Enter a valid email address."
    }
  }
}
```

---

# API 4 — Donor Interest/Inquiry (REQ-24)

## Endpoint
POST /api/v1/donor-inquiries

## Purpose
Allow a visitor interested in donating or supporting Tech Smart Learning for Seniors to submit an interest/inquiry. **This endpoint does NOT process payments and does not accept payment, card, or donation-amount information.** Payment processing is explicitly out of scope for Phase 1 (REQ-24, REQ-29).

## Content-Type
application/json

## Fields (Baseline Sponsor-Confirmed; additional fields Pending Frontend Field Confirmation)
The exact form fields for Donor Interest/Inquiry have not been finalized with the frontend team. The fields below are a conservative baseline modeled on the other confirmed inquiry workflows. Do not add donation-amount, payment-method, or billing fields — these are out of scope for Phase 1.

### Required fields
- firstName
- lastName
- at least one contact method: email or phone

### Optional fields
- email if phone is supplied
- phone if email is supplied
- message

### Field notes and data types
| Field | Type | Notes |
|---|---|---|
| firstName | string | Sponsor-Confirmed. Required, cannot be empty. |
| lastName | string | Sponsor-Confirmed. Required, cannot be empty. |
| email | string (email format) \| null | Sponsor-Confirmed. Required if phone is not supplied; optional otherwise. |
| phone | string \| null | Sponsor-Confirmed. Required if email is not supplied; optional otherwise. |
| message | string \| null | Sponsor-Confirmed. Optional free-text field for the visitor's donor interest. |

A donor-specific categorization field (e.g., area of interest such as one-time giving, recurring giving, in-kind, or partnership) is **Pending Frontend Field Confirmation** and is intentionally not included until confirmed.

## Example Request
```json
{
  "firstName": "Susan",
  "lastName": "Carter",
  "email": "susan@example.com",
  "phone": null,
  "message": "I'd like to learn more about supporting your programs."
}
```

## Validation Rules
- firstName cannot be empty.
- lastName cannot be empty.
- At least one contact method must be provided: email or phone.
- email must have a valid format when supplied.
- phone must be valid when supplied if the project chooses to enforce formatting.
- message is optional and may be omitted or empty.
- No payment, card, or donation-amount fields are accepted by this endpoint. Any such fields submitted must be ignored or rejected, not processed.

## Successful Response
HTTP 201 Created

```json
{
  "inquiryId": "DI-1001",
  "status": "received",
  "message": "Your donor interest inquiry has been received."
}
```

## Validation Error Response
HTTP 400 Bad Request

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains invalid or missing information.",
    "fields": {
      "email": "Enter a valid email address.",
      "firstName": "First name is required."
    }
  }
}
```

---

# API 5 — Workshop Search, Details & Registration (Milestone-2 — PBI-7 / PBI-8 / PBI-12)

## Status
**SANDBOX / MOCK ONLY.** Unlike APIs 1–4 above (which describe the shared contract with backend Team #30), this API exists only inside the frontend sandbox (src/mocks/handlers.js, served through MSW). It is not part of the REQ-21–REQ-29 contract with Team #30 and is not a production workshop-location or registration system. Representative workshop data is illustrative only; the sponsor-provided workshop-location source and final production registration workflow remain to be confirmed (see Milestone-2.md, PBI-7/PBI-8).

## Endpoint: GET /api/workshops
### Purpose
Search representative sandbox workshop data by ZIP code to demonstrate the "I Need Help" workshop-discovery journey (PBI-7) independently of the final production workshop-location source.

### Query Parameters
| Parameter | Type | Notes |
|---|---|---|
| zip | string | Required. Must be a valid 5-digit ZIP code. |
| eventType | string ("In-Person" \| "Virtual") | Optional filter. |

### Successful Response
HTTP 200 OK
```json
{ "workshops": [ { "id": "WS-1001", "title": "Smartphone Basics for Beginners", "date": "2026-10-04", "time": "10:00", "address": "123 Main St, Marietta, GA", "distanceMiles": 3.2, "eventType": "In-Person" } ] }
```
An empty `workshops` array is a valid, successful response representing no matching results.

### Validation Error Response
HTTP 400 Bad Request — returned when `zip` is missing or is not a valid 5-digit ZIP code, using the standard error format above.

## Endpoint: GET /api/workshops/:id
### Purpose
Retrieve representative sandbox workshop detail data so a user can move from search results into the workshop-detail and registration journey (PBI-8).

### Successful Response
HTTP 200 OK — returns a `workshop` object with id, title, dateTime, location, roomNumber, instructorName, accessibilityFeatures, and seatAvailability.

### Not Found Response
HTTP 404 Not Found
```json
{ "error": { "code": "NOT_FOUND", "message": "The requested workshop does not exist." } }
```

## Endpoint: POST /api/workshops/:id/registrations
### Purpose
Simulate the Phase 1 workshop-registration interaction (PBI-8) so the frontend registration journey can be demonstrated end-to-end. **This is a sandbox demonstration only and must never be presented to users as a completed production registration.**

### Fields
| Field | Type | Notes |
|---|---|---|
| firstName | string | Required. |
| lastName | string | Required. |
| email | string (email format) \| null | Required if phone is not supplied. |
| phone | string \| null | Required if email is not supplied. |

### Successful Response
HTTP 201 Created
```json
{
  "registrationId": "WR-1001",
  "status": "received",
  "message": "This is a sandbox registration demonstration for Milestone 2. No production workshop registration has been submitted.",
  "workshop": { "id": "WS-1001", "title": "Smartphone Basics for Beginners", "dateTime": "2026-10-04T10:00:00-04:00", "location": "Marietta Senior Center, 123 Main St, Marietta, GA" }
}
```

### Validation Error Response
HTTP 400 Bad Request — standard error format, returned when firstName/lastName are missing or neither email nor phone is supplied, or email is malformed.

### Workshop Not Found Response
HTTP 404 Not Found — standard error format with `code: "NOT_FOUND"`, returned when the `:id` does not match any sandbox workshop.

### Workshop Full / Unavailable Response
HTTP 409 Conflict
```json
{ "error": { "code": "WORKSHOP_FULL", "message": "This workshop is full. Please choose another workshop or check back later." } }
```
Returned when the sandbox workshop's `seatAvailability` is 0.

---

# API 6 — Advocate Interest Inquiry (Milestone 3 — PBI-13)

## Status
**SANDBOX / MOCK ONLY.** Like API 5 above, this endpoint is not part of the original REQ-21–REQ-29 contract with backend Team #30. It was added in Milestone 3 to support the "I Want to Help → Advocate" pathway (`src/pages/Advocate.js`). It follows the same shared-contract conventions (request/response shape, validation-error format, `/api/v1` versioning) as APIs 1–4 so it can be handed off to a production backend with no frontend redesign if the Advocate pathway is approved for production.

## Endpoint
POST /api/v1/advocate-inquiries

## Purpose
Allow a visitor interested in advocating for Tech Smart Learning for Seniors in their community to submit an interest request. Submitting this form does not automatically make the visitor an official TSLS representative or advocate.

## Content-Type
application/json

## Fields
### Required fields
- firstName
- lastName
- email
- interests (at least one)
- message

### Optional fields
- phone

### Field notes and data types
| Field | Type | Notes |
|---|---|---|
| firstName | string | Required, cannot be empty. |
| lastName | string | Required, cannot be empty. |
| email | string (email format) | Required. |
| phone | string \| null | Optional. |
| interests | array of string (enum: "sharePrograms" \| "promoteEvents" \| "connectOrganizations" \| "outreach" \| "other") | Required; at least one value, matching the checkbox values in `src/pages/Advocate.js`. |
| message | string | Required; describes the visitor's interest in supporting TSLS. |

## Example Request
```json
{
  "firstName": "Mary",
  "lastName": "Johnson",
  "email": "mary@example.com",
  "phone": null,
  "interests": ["sharePrograms", "outreach"],
  "message": "I would like to help spread the word about TechSmart in my neighborhood."
}
```

## Validation Rules
- firstName cannot be empty.
- lastName cannot be empty.
- email is required and must be in a valid email format.
- interests must include at least one value, matching one of the confirmed checkbox values.
- message cannot be empty.

## Successful Response
HTTP 201 Created

```json
{
  "inquiryId": "AI-1001",
  "status": "received",
  "message": "Your advocate interest request has been received."
}
```

## Validation Error Response
HTTP 400 Bad Request

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains invalid or missing information.",
    "fields": {
      "interests": "Select at least one advocacy interest."
    }
  }
}
```

---

## Field Status Summary
Fields across all four public submission endpoints are **Sponsor-Confirmed** for the baseline required/optional fields documented in this contract.

The following are **Figma-Confirmed** (REQ-22):
- Volunteer Signup fields firstName, lastName, email, phone, organizationName, reasonForVolunteering, leadSource, and message, including the reasonForVolunteering (3 values) and leadSource (12 values) dropdown options documented above.

The following remain **Pending Frontend Field Confirmation**:
- Any Donor Interest/Inquiry fields beyond firstName, lastName, email/phone, and message (e.g., a donor-interest category).
- Exact approved enumerated values for helpCategory and inquiryType.

The following remain **Pending Backend Team #30 Confirmation**:
- Final response field names (e.g., requestId/inquiryId formats) and final error code catalog.

---

## Final Contract Notes
Before production deployment, the website team and Team #30 must agree on:
- final field names for Donor Interest/Inquiry (Pending Frontend Field Confirmation); Volunteer Signup field names are Figma-Confirmed;
- final validation rules;
- approved enumerated values;
- error schema details (Pending Backend Team #30 Confirmation);
- security and rate-limit requirements;
- any backend-specific response details required by the live service.

Until then, this contract is Sponsor-Confirmed for Milestone 1 frontend development and Mock API integration, with the specific items above still open.

---

## Phase 1 Integration Boundary (Milestone-2 PBI-12; updated Milestone-3 PBI-13)
This section makes explicit which Phase 1 interactions are sandbox/mock, which preserve existing external/production workflows, and which depend on the shared REST API contract above, so the sandbox implementation is never mistaken for a completed production integration.

```text
Frontend (React pages: NeedHelp.js, Contact.js, WantToHelp.js, Advocate.js, Donate.js, etc.)
   |
Service / Adapter Layer (src/services/*.js, src/mocks/APIClient.ts)
   |
Sandbox / MSW during independent development (src/mocks/handlers.js)
   |
Shared REST API Contract (this document)
   |
Production Backend (Team #30) when available
```

### A. SANDBOX / MOCK (this repository's MSW layer only — never production)
- GET /api/workshops, GET /api/workshops/:id, POST /api/workshops/:id/registrations — workshop search, details, and registration (API 5 above). Representative data only; no production workshop-location source or registration system exists yet.
- POST /api/v1/assistance-requests, /api/v1/contact-inquiries, /api/v1/donor-inquiries, /api/v1/volunteer-inquiries, /api/v1/advocate-inquiries — simulate Team #30's future responses using this same contract (REQ-25, REQ-27).
- Donation checkout UI (`src/pages/Donate.js`, `src/pages/CheckoutForm.js`) — uses the real Stripe.js Elements UI in **Stripe test mode only** (a `pk_test_...` publishable key supplied via the `REACT_APP_STRIPE_PUBLISHABLE_KEY` environment variable; see Stripe Integration Boundary below). No PaymentIntent is created and no charge is ever submitted to Stripe; the donor's non-payment details are submitted to the sandbox `/api/v1/donor-inquiries` endpoint only.

### B. EXISTING EXTERNAL / PRODUCTION WORKFLOW (never replaced by this mock layer)
- Volunteer signup execution — the "I Want to Help → Volunteer" button on `src/pages/WantToHelp.js` links directly to the organization's established Hands On Atlanta signup process (`https://volunteer.handsonatlanta.org/`). This is the confirmed final production workflow for this pathway (see the Milestone 3 update in API 2 above). The Volunteer Inquiry mock endpoint (API 2) remains implemented and tested but is not currently rendered as a form on the public website.
- Any current Gravity Forms/Salesforce-driven production form this project has not yet been asked to replace.

### C. SHARED REST API CONTRACT / FUTURE BACKEND DEPENDENCY
- All `/api/v1/*` endpoints documented in this contract (APIs 1–4, and API 6 — Advocate Interest Inquiry) — once Team #30's backend is available, the website's service/adapter layer can point at the real backend using this same contract with no frontend redesign required (REQ-28).

### Independent Frontend Operation
The sandbox layer (column A) lets the "I Need Help" workshop search/detail/registration journey and the public form workflows be developed, tested, and demonstrated without waiting on Team #30's backend or CRM integration, and without modifying or depending on Team #30's pull requests.

---

## Stripe Integration Boundary (Milestone-3 — PBI-13)
- The Donate page (`src/pages/Donate.js`) uses Stripe's official `@stripe/react-stripe-js` / `@stripe/stripe-js` Elements components in **test mode only**. `loadStripe()` is initialized with `process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY`, which must always be a `pk_test_...` publishable test key for this project. Publishable keys are safe to expose in frontend code, but a Stripe **secret key must never** be added to source control, committed, or used anywhere in this frontend application.
- `CheckoutForm.js` never creates a PaymentIntent and never confirms a real payment; `elements.submit()` validates the payment form fields only, and the Apple Pay/Google Pay Express Checkout Element is explicitly configured to report `event.paymentFailed(...)` so no demo payment can be completed. Submitting the form sends only the donor's non-payment contact details (firstName, lastName, email) to the sandbox `/api/v1/donor-inquiries` endpoint.
- The sandbox donor-inquiries response includes additive `isSimulation: true` and `success: true` fields (not part of the Sponsor-Confirmed contract fields in API 4) that `CheckoutForm.js` uses to display "Demo successful! No actual payment was processed." This keeps the sandbox donation demonstration clearly separated from a real charge.
- No production Stripe account, live/secret keys, or real payment processing are implemented or configured anywhere in this project.

