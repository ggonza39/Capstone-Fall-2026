# Tech Smart Learning for Seniors
## Shared API Integration Contract (Draft v0.1)

### Purpose
This document defines the draft shared REST API contract between the Tech Smart Learning for Seniors website team and backend Team #30.

The purpose of this contract is to allow both teams to develop independently while maintaining a consistent public interface for website form submissions.

This contract remains Draft - Pending UI, Sponsor, and Backend Team Confirmation.

The public website team may integrate with mock endpoints that follow this same contract until the production backend API becomes available.

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

## Security Requirements
The requirements below are proposed and should be treated as Draft - Pending UI, Sponsor, and Backend Team Confirmation.

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

## Standard HTTP Responses
The following HTTP responses are proposed for this public contract:

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

This is a Draft - Pending UI, Sponsor, and Backend Team Confirmation structure. The exact error schema must be agreed with Team #30 before production integration.

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

---

## Contract Status
- Status: Draft
- Website Team Approval: Pending
- Sponsor Requirements Confirmation: Pending
- Backend Team #30 Confirmation: Pending
- Fields and validation rules in this contract are proposed and subject to approval.
- The mock endpoints are designed to follow the same contract as the future real backend so the website team can continue development while waiting for the final live API.

---

## Public API Operations
The draft contract includes the following proposed public submission endpoints:
- POST /api/v1/assistance-requests
- POST /api/v1/volunteer-inquiries
- POST /api/v1/contact-inquiries

---

# API 1 — Assistance Request

## Endpoint
POST /api/v1/assistance-requests

## Purpose
Allow a visitor seeking technology assistance to submit a new assistance request.

## Content-Type
application/json

## Proposed Fields
Draft - Pending UI, Sponsor, and Backend Team Confirmation.

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

### Field notes
- firstName: Draft – proposed and pending confirmation.
- lastName: Draft – proposed and pending confirmation.
- email: Draft – required if phone is not supplied; optional otherwise.
- phone: Draft – required if email is not supplied; optional otherwise.
- helpCategory: Draft – must match an approved list of categories.
- description: Draft – required and must not be empty.
- preferredContactMethod: Draft – when supplied, it must match an available contact method.
- accessibilityNeeds: Draft – optional, may be null or a string.

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

# API 2 — Volunteer Inquiry

## Endpoint
POST /api/v1/volunteer-inquiries

## Purpose
Allow a visitor interested in volunteering with Tech Smart Learning for Seniors to submit an inquiry.

This endpoint represents the website inquiry contract only and does not replace or redesign any external volunteer onboarding process.

## Content-Type
application/json

## Proposed Fields
Draft - Pending UI, Sponsor, and Backend Team Confirmation.

### Required fields
- firstName
- lastName
- email
- volunteerInterest

### Optional fields
- phone
- message

## Example Request
```json
{
  "firstName": "David",
  "lastName": "Lee",
  "email": "david@example.com",
  "phone": "4045550135",
  "volunteerInterest": "technology-help",
  "message": "I would like to help seniors learn how to use smartphones."
}
```

## Validation Rules
- firstName cannot be empty.
- lastName cannot be empty.
- email is required and must be in a valid email format.
- volunteerInterest is required and must match an approved value.
- phone is optional and should be valid if provided.
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
      "volunteerInterest": "Volunteer interest is required."
    }
  }
}
```

---

# API 3 — General Contact Inquiry

## Endpoint
POST /api/v1/contact-inquiries

## Purpose
Allow a visitor to submit a general inquiry that does not belong to the assistance or volunteer workflow.

## Content-Type
application/json

## Proposed Fields
Draft - Pending UI, Sponsor, and Backend Team Confirmation.

### Required fields
- firstName
- lastName
- email
- inquiryType

### Optional fields
- phone
- organization
- message

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

## Proposed Field Status Summary
All fields in the three public submission endpoints are Draft - Pending UI, Sponsor, and Backend Team Confirmation.

This includes required and optional field names, validation rules, and accepted enumerated values such as helpCategory, volunteerInterest, and inquiryType.

---

## Final Contract Notes
Before production deployment, the website team and Team #30 must agree on:
- final field names;
- final validation rules;
- approved enumerated values;
- error schema details;
- security and rate-limit requirements;
- any backend-specific response details required by the live service.

Until then, this document remains a draft contract for frontend development and mock integration.
