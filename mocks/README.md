# Mock API Layer

## Purpose
This mock API layer exists so the Tech Smart Learning for Seniors website team can continue frontend development without waiting for backend Team #30 to complete the live API. This satisfies REQ-25 (Mock API/dummy JSON for Phase 1 forms), REQ-27 (frontend independently testable through a Mock API layer), and REQ-28 (frontend independence from Team #30's CRM delivery).

This layer is intentionally limited to frontend enablement and contract verification. It does not create a database, does not claim to be a production backend, and does not implement production business logic.

## Current Status
- Documentation-driven mock layer describing request/response behavior for all four confirmed Milestone 1 workflows.
- **Implementation tool (REQ-27):** MSW (Mock Service Worker) is the tool being planned/considered to implement these mocks as intercepted network requests during frontend development. MSW has not yet been installed or adopted in this repository — no dependency changes or handler files exist yet. An equivalent dummy-JSON approach may be used instead if the team decides MSW is not the right fit.
- The mock endpoints follow the same shared API contract used by the public-facing website integration.

## Mock API Strategy

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

The mock layer supports:
- frontend development;
- form integration;
- success-state testing;
- validation-error testing;
- failure-state testing;
- API contract verification.

## Planned Mock Endpoints (Requirement Traceability)
1. POST /api/v1/assistance-requests — REQ-21
2. POST /api/v1/volunteer-inquiries — REQ-22 (Figma-Confirmed fields)
3. POST /api/v1/contact-inquiries — REQ-23
4. POST /api/v1/donor-inquiries — REQ-24 (no payment processing; Pending Frontend Field Confirmation)

---

## Endpoint 1: POST /api/v1/assistance-requests

### Purpose
Allow the frontend to simulate a visitor submitting a technology assistance request.

### Expected Request
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

### Simulated 201 Success Response
```json
{
  "requestId": "TS-1001",
  "status": "received",
  "message": "Your assistance request has been received."
}
```

### Simulated 400 Validation Failure
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains invalid or missing information.",
    "fields": {
      "description": "Description is required.",
      "email": "Enter a valid email address."
    }
  }
}
```

### Simulated 500 Server Failure
```json
{
  "error": {
    "code": "SERVER_ERROR",
    "message": "The request could not be processed at this time."
  }
}
```

### HTTP Status Codes
- 201 Created for valid request acceptance
- 400 Bad Request for missing or invalid fields
- 500 Internal Server Error for mock server failure simulation

---

## Endpoint 2: POST /api/v1/volunteer-inquiries

### Purpose
Allow the frontend to simulate a volunteer inquiry. Fields are Figma-Confirmed (REQ-22) based on the current Volunteer Contact Form design.

### Expected Request
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

### Simulated 201 Success Response
```json
{
  "inquiryId": "VI-1001",
  "status": "received",
  "message": "Your volunteer inquiry has been received."
}
```

### Simulated 400 Validation Failure
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

### Simulated 500 Server Failure
```json
{
  "error": {
    "code": "SERVER_ERROR",
    "message": "The request could not be processed at this time."
  }
}
```

### HTTP Status Codes
- 201 Created for valid request acceptance
- 400 Bad Request for missing or invalid fields
- 500 Internal Server Error for mock server failure simulation

### Fields Note
`reasonForVolunteering` must be one of: Classroom volunteer, Committee volunteer, Event volunteer. `leadSource`, when supplied, must be one of: Sponsor Referral, Networking Event, Drive-By/Physical Location, Board Referral, Word of mouth, Trade Show, Internet Search, Student, Friend, Gift, Google Ads, Other. `organizationName` and `leadSource` are optional.

---

## Endpoint 3: POST /api/v1/contact-inquiries

### Purpose
Allow the frontend to simulate a general contact inquiry that does not belong to the assistance or volunteer workflow.

### Expected Request
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

### Simulated 201 Success Response
```json
{
  "inquiryId": "CI-1001",
  "status": "received",
  "message": "Your contact inquiry has been received."
}
```

### Simulated 400 Validation Failure
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

### Simulated 500 Server Failure
```json
{
  "error": {
    "code": "SERVER_ERROR",
    "message": "The request could not be processed at this time."
  }
}
```

### HTTP Status Codes
- 201 Created for valid request acceptance
- 400 Bad Request for missing or invalid fields
- 500 Internal Server Error for mock server failure simulation

---

## Endpoint 4: POST /api/v1/donor-inquiries

### Purpose
Allow the frontend to simulate a visitor submitting a donor interest/inquiry. **This mock does not simulate payment processing** and does not accept payment, card, or donation-amount fields (REQ-24, REQ-29).

### Expected Request
```json
{
  "firstName": "Susan",
  "lastName": "Carter",
  "email": "susan@example.com",
  "phone": null,
  "message": "I'd like to learn more about supporting your programs."
}
```

### Simulated 201 Success Response
```json
{
  "inquiryId": "DI-1001",
  "status": "received",
  "message": "Your donor interest inquiry has been received."
}
```

### Simulated 400 Validation Failure
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

### Simulated 500 Server Failure
```json
{
  "error": {
    "code": "SERVER_ERROR",
    "message": "The request could not be processed at this time."
  }
}
```

### HTTP Status Codes
- 201 Created for valid request acceptance
- 400 Bad Request for missing or invalid fields
- 500 Internal Server Error for mock server failure simulation

### Fields Note
Baseline fields (firstName, lastName, email/phone, message) are Sponsor-Confirmed. Any donor-category or additional fields are Pending Frontend Field Confirmation and are not simulated here.

---

## Mock Scope Boundaries
The mock API layer is for:
- frontend development;
- form integration;
- success-state testing;
- validation-error testing;
- failure-state testing;
- API contract verification.

The mock API layer does not implement:
- a database;
- production business logic;
- duplicate detection;
- CRM processing;
- persistent contact storage;
- payment processing (REQ-24);
- Salesforce integration (REQ-29).

The mock API must not be treated as a production backend.

