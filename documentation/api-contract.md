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
- POST /api/v1/volunteer-inquiries (REQ-22 — Figma-Confirmed fields)
- POST /api/v1/contact-inquiries (REQ-23)
- POST /api/v1/donor-inquiries (REQ-24 — no payment processing; Pending Frontend Field Confirmation)

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
